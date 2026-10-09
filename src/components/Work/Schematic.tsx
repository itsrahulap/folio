import React, { useId } from 'react';
import type { Pipeline } from '../../data/pipelines';

type Cell = { c: number; r: number };
type Box = { x: number; y: number; label: string; kind?: 'core' | 'store' };

const BH = 46;
const PAD_X = 30;
const PAD_TOP = 36;

/** Serpentine placement so long pipelines wrap without crossing lines. */
const serp = (i: number, cols: number, r0 = 0): Cell => {
  const r = Math.floor(i / cols);
  const k = i % cols;
  return { c: r % 2 === 0 ? k : cols - 1 - k, r: r + r0 };
};

const layout = ({ nodes, motif }: Pipeline, cols: number) => {
  const chain = (from: number, to: number) =>
    Array.from({ length: to - from }, (_, k) => [from + k, from + k + 1] as [number, number]);
  let cells: Cell[];
  let edges: [number, number][];
  if (motif === 'hub') {
    const wide = cols >= 3;
    const core: Cell = wide ? { c: 1, r: 0.5 } : { c: 0.5, r: 1 };
    // clockwise from top-left
    const spokes: Cell[] = wide
      ? [{ c: 0, r: 0 }, { c: 2, r: 0 }, { c: 2, r: 1 }, { c: 0, r: 1 }]
      : [{ c: 0, r: 0 }, { c: 1, r: 0 }, { c: 1, r: 2 }, { c: 0, r: 2 }];
    cells = [core, ...spokes.slice(0, nodes.length - 1)];
    edges = cells.slice(1).map((_, k) => [0, k + 1]);
  } else if (motif === 'branch') {
    const main = nodes.slice(1).map((_, k) => serp(k, cols, 1));
    cells = [{ c: main[1].c, r: 0 }, ...main];
    edges = [[0, 2], ...chain(1, nodes.length - 1)];
  } else {
    cells = nodes.map((_, i) => serp(i, cols));
    edges = chain(0, nodes.length - 1);
  }
  return { cells, edges };
};

/** Wrap a label onto at most two lines of ~max chars. */
const wrap = (s: string, max: number): string[] => {
  if (s.length <= max) return [s];
  const words = s.split(' ');
  let a = '';
  while (words.length && (a + ' ' + words[0]).trim().length <= max) a = (a + ' ' + words.shift()).trim();
  return a ? [a, words.join(' ')] : [s];
};

interface Props {
  pipeline: Pipeline;
  /** 3 columns on the wide desktop stage, 2 on narrow plates. */
  cols?: 2 | 3;
}

const Schematic: React.FC<Props> = ({ pipeline, cols = 3 }) => {
  const uid = useId().replace(/:/g, '');
  const W = cols === 3 ? 600 : 360;
  const GAP_X = cols === 3 ? 44 : 36;
  const GAP_Y = cols === 3 ? 28 : 38;
  // room under the last row for the loop's return path
  const PAD_BOTTOM = pipeline.motif === 'loop' ? 30 : 14;
  const BW = (W - 2 * PAD_X - (cols - 1) * GAP_X) / cols;
  const maxChars = cols === 3 ? 17 : 15;

  const { cells, edges } = layout(pipeline, cols);
  const rows = Math.ceil(Math.max(...cells.map(c => c.r)) + 1);
  const H = PAD_TOP + rows * BH + (rows - 1) * GAP_Y + PAD_BOTTOM;

  const boxes: Box[] = cells.map(({ c, r }, i) => ({
    x: PAD_X + c * (BW + GAP_X),
    y: PAD_TOP + r * (BH + GAP_Y),
    label: pipeline.nodes[i],
    kind: pipeline.motif === 'hub' && i === 0 ? 'core' : pipeline.motif === 'branch' && i === 0 ? 'store' : undefined,
  }));

  // Orthogonal connector between two boxes, leaving/entering on the facing sides.
  const connect = (a: Box, b: Box) => {
    const [acx, acy, bcx, bcy] = [a.x + BW / 2, a.y + BH / 2, b.x + BW / 2, b.y + BH / 2];
    const dx = bcx - acx;
    const dy = bcy - acy;
    if (Math.abs(dx) > Math.abs(dy)) {
      const sx = dx > 0 ? a.x + BW : a.x;
      const ex = dx > 0 ? b.x : b.x + BW;
      const mx = (sx + ex) / 2;
      return Math.abs(dy) < 1 ? `M${sx} ${acy}H${ex}` : `M${sx} ${acy}H${mx}V${bcy}H${ex}`;
    }
    const sy = dy > 0 ? a.y + BH : a.y;
    const ey = dy > 0 ? b.y : b.y + BH;
    const my = (sy + ey) / 2;
    return Math.abs(dx) < 1 ? `M${acx} ${sy}V${ey}` : `M${acx} ${sy}V${my}H${bcx}V${ey}`;
  };

  const paths = edges.map(([a, b]) => connect(boxes[a], boxes[b]));
  if (pipeline.motif === 'loop') {
    // Return path: out under the last node, around the left margin, back into the first.
    const last = boxes[boxes.length - 1];
    const first = boxes[0];
    const yb = H - PAD_BOTTOM / 2;
    paths.push(`M${last.x + BW / 2} ${last.y + BH}V${yb}H${PAD_X / 2}V${first.y + BH / 2}H${first.x}`);
  }

  const letters = 'ABC'.slice(0, cols).split('');
  const ticks = Array.from({ length: Math.floor((W - 2 * PAD_X) / 10) + 1 }, (_, i) => PAD_X + i * 10);
  const label = `${pipeline.motif === 'hub' ? `${pipeline.nodes[0]} connected to` : 'Pipeline:'} ${
    pipeline.motif === 'hub' ? pipeline.nodes.slice(1).join(', ') : pipeline.nodes.join(' → ')
  }`;

  return (
    <svg className="sch" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <defs>
        <marker id={`${uid}-a`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1 1L7 4L1 7" className="sch__arrow" />
        </marker>
      </defs>

      {/* survey furniture: ruler ticks, column letters, row numbers */}
      <g className="sch__grid" aria-hidden="true">
        {ticks.map((x, i) => (
          <line key={x} x1={x} x2={x} y1={0} y2={i % 5 === 0 ? 8 : 4} />
        ))}
        {letters.map((l, c) => (
          <text key={l} x={PAD_X + c * (BW + GAP_X) + BW / 2} y={24} textAnchor="middle">
            {l}
          </text>
        ))}
        {Array.from({ length: rows }, (_, r) => (
          <text key={r} x={4} y={PAD_TOP + r * (BH + GAP_Y) + BH / 2 + 3}>
            {r + 1}
          </text>
        ))}
        <path d={`M0 ${H - 1}h10M0 ${H - 1}v-10M${W} ${H - 1}h-10M${W} ${H - 1}v-10`} />
      </g>

      {paths.map((d, i) => (
        <path key={`e${i}`} d={d} pathLength={1} className="sch__edge" markerEnd={`url(#${uid}-a)`} style={{ '--i': i } as React.CSSProperties} />
      ))}
      {paths.map((d, i) => (
        <path key={`s${i}`} d={d} className="sch__signal" />
      ))}

      {boxes.map((b, i) => {
        const lines = wrap(b.label, maxChars);
        return (
          <g key={i} className={`sch__node${b.kind ? ` is-${b.kind}` : ''}`} style={{ '--i': i } as React.CSSProperties}>
            <rect x={b.x} y={b.y} width={BW} height={BH} />
            <text x={b.x + BW / 2} y={b.y + BH / 2 + 4 - (lines.length - 1) * 8} textAnchor="middle">
              {lines.map((t, k) => (
                <tspan key={k} x={b.x + BW / 2} dy={k ? 16 : 0}>
                  {t}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default Schematic;
