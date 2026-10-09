import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Field.scss';

/*
 * The contour field: a topographic map rendered in one fragment shader, fixed behind the page.
 * - Summits sit under [data-summit] elements (hero) and the #contact section, so the terrain
 *   scrolls with the content.
 * - The pointer raises a small hill and tints nearby contours with the signal colour.
 * - Strength follows the [data-field] value of the section at the viewport centre.
 */

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 u_res;
uniform float u_time, u_scroll, u_amp;
uniform vec2 u_ptr, u_s1, u_s2;
uniform vec3 u_bg, u_line, u_sig;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}
float bump(vec2 p, vec2 c, float k) { vec2 d = p - c; return exp(-dot(d, d) * k); }

void main() {
  float s = u_res.y;
  vec2 p = gl_FragCoord.xy / s;
  vec2 world = p + vec2(0.0, u_scroll);

  float h = fbm(world * 1.4 + vec2(u_time * 0.012, -u_time * 0.008)) * 0.6;
  h += 1.15 * bump(p, u_s1 / s, 5.5);
  h += 1.3 * bump(p, u_s2 / s, 3.2);
  float near = bump(p, u_ptr / s, 26.0);
  h += 0.32 * near;

  float lv = h * 15.0;
  float f = fract(lv);
  float w = fwidth(lv);
  float line = 1.0 - smoothstep(0.0, w * 1.15, min(f, 1.0 - f));
  float major = step(mod(floor(lv + 0.5), 5.0), 0.5);

  vec2 g = abs(fract(world * 4.0 + 0.5) - 0.5) / fwidth(world * 4.0);
  float grid = 1.0 - min(min(g.x, g.y), 1.0);

  float a = line * (0.14 + 0.24 * major) * u_amp + grid * 0.035;
  vec3 col = mix(u_line, u_sig, clamp(near * 1.6, 0.0, 1.0));
  gl_FragColor = vec4(mix(u_bg, col, a), 1.0);
}
`;

const readColor = (name: string): [number, number, number] => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
    return v.length === 3 && v.every(n => !Number.isNaN(n)) ? [v[0], v[1], v[2]] : [0, 0, 0];
};

const Field: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const colorsDirty = useRef(true);

    useEffect(() => { colorsDirty.current = true; }, [theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
        if (!canvas || !gl || !gl.getExtension('OES_standard_derivatives')) return; // page keeps its plain background

        const compile = (type: number, src: string) => {
            const sh = gl.createShader(type)!;
            gl.shaderSource(sh, src);
            gl.compileShader(sh);
            return sh;
        };
        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
        gl.useProgram(prog);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        const u = (n: string) => gl.getUniformLocation(prog, n);
        const U = {
            res: u('u_res'), time: u('u_time'), scroll: u('u_scroll'), amp: u('u_amp'),
            ptr: u('u_ptr'), s1: u('u_s1'), s2: u('u_s2'), bg: u('u_bg'), line: u('u_line'), sig: u('u_sig'),
        };

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const coarse = window.matchMedia('(pointer: coarse)').matches;
        const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);
        const FAR = -1e5;
        const ptr = { x: FAR, y: FAR, tx: FAR, ty: FAR };
        let amp = 0;
        let raf = 0;
        let last = 0;
        let dirty = true;

        const resize = () => {
            canvas.width = Math.round(window.innerWidth * dpr);
            canvas.height = Math.round(window.innerHeight * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
            dirty = true;
        };

        // Viewport centre of an element, in GL pixels (origin bottom-left).
        const centre = (el: Element | null): [number, number] => {
            if (!el) return [FAR, FAR];
            const r = el.getBoundingClientRect();
            return [(r.left + r.width / 2) * dpr, (window.innerHeight - (r.top + r.height / 2)) * dpr];
        };

        const targetAmp = () => {
            const mid = window.innerHeight / 2;
            for (const el of document.querySelectorAll<HTMLElement>('[data-field]')) {
                const r = el.getBoundingClientRect();
                if (r.top <= mid && r.bottom >= mid) return Number(el.dataset.field) || 0;
            }
            return 0.15;
        };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return;
            ptr.tx = e.clientX * dpr;
            ptr.ty = (window.innerHeight - e.clientY) * dpr;
            if (ptr.x === FAR) { ptr.x = ptr.tx; ptr.y = ptr.ty; }
        };
        const onLeave = () => { ptr.tx = ptr.ty = FAR; ptr.x = ptr.y = FAR; };
        const wake = () => { dirty = true; };

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame);
            if (document.hidden || now - last < 33) return; // ~30fps is plenty for slow drift
            last = now;

            const goal = targetAmp();
            const settling = Math.abs(goal - amp) > 0.002;
            amp = reduced ? goal : amp + (goal - amp) * 0.08;
            if (ptr.tx !== FAR) {
                ptr.x += (ptr.tx - ptr.x) * 0.12;
                ptr.y += (ptr.ty - ptr.y) * 0.12;
            }
            // Reduced motion: no drift, redraw only when something actually changed.
            if (reduced && !dirty && !settling) return;
            dirty = false;

            if (colorsDirty.current) {
                gl.uniform3fv(U.bg, readColor('--field-bg'));
                gl.uniform3fv(U.line, readColor('--field-line'));
                gl.uniform3fv(U.sig, readColor('--field-signal'));
                colorsDirty.current = false;
            }
            gl.uniform2f(U.res, canvas.width, canvas.height);
            gl.uniform1f(U.time, reduced ? 0 : now / 1000);
            gl.uniform1f(U.scroll, window.scrollY / window.innerHeight);
            gl.uniform1f(U.amp, amp);
            gl.uniform2f(U.ptr, ptr.x, ptr.y);
            gl.uniform2fv(U.s1, centre(document.querySelector('[data-summit]')));
            gl.uniform2fv(U.s2, centre(document.getElementById('contact')));
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            canvas.classList.add('is-live');
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('scroll', wake, { passive: true });
        window.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
        canvas.addEventListener('webglcontextlost', () => cancelAnimationFrame(raf));
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', wake);
            window.removeEventListener('pointermove', onMove);
            document.documentElement.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="field" aria-hidden="true" />;
};

export default Field;
