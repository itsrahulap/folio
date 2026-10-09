import React, { useRef, useState } from 'react';
import { resumeData } from '../../data/resume';
import { pipelines } from '../../data/pipelines';
import Schematic from './Schematic';
import './Work.scss';

type Project = (typeof resumeData.projects)[number] & { github?: string; link?: string };

const projects = resumeData.projects as Project[];
const N = projects.length;
const pad = (n: number) => String(n).padStart(2, '0');

const trim = (s: string, max = 84) => (s.length <= max ? s : s.slice(0, s.lastIndexOf(' ', max)) + '…');

// The first "Built a …" bullet restates the summary, so skip it.
const points = (p: Project) => p.description.filter(d => !/^Built /.test(d)).slice(0, 4).map(d => trim(d));

const Links: React.FC<{ p: Project }> = ({ p }) => (
  <p className="work__links">
    {p.github && (
      <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} source code (opens in new tab)`}>
        Source <span aria-hidden="true">↗</span>
      </a>
    )}
    {p.link && (
      <a href={p.link} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} ${/kaggle/.test(p.link) ? 'notebook' : 'live site'} (opens in new tab)`}>
        {/kaggle/.test(p.link) ? 'Notebook' : 'Live'} <span aria-hidden="true">↗</span>
      </a>
    )}
  </p>
);

const Work: React.FC = () => {
  const [active, setActive] = useState(0);
  const [current, setCurrent] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent) => {
    const next = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: N - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const i = (next + N) % N;
    setActive(i);
    tabs.current[i]?.focus();
  };

  const onTrackScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const plates = el.children as HTMLCollectionOf<HTMLElement>;
    const step = plates[1].offsetLeft - plates[0].offsetLeft;
    // the last plate can't snap to start, so treat "scrolled to the end" as last
    setCurrent(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2 ? N - 1 : Math.round(el.scrollLeft / step));
  };

  const p = projects[active];

  return (
    <section id="work" className="work" aria-labelledby="work-title" data-field="0.18">
      <div className="frame">
        <header className="section-head reveal">
          <h2 id="work-title" className="label">§ 01 — Selected work</h2>
          <span className="label">{pad(N)} plates</span>
        </header>

        {/* ≥1024px: index + sticky stage */}
        <div className="work__explorer reveal">
          <div className="work__index" role="tablist" aria-label="Projects" aria-orientation="vertical" onKeyDown={onKey}>
            {projects.map((proj, i) => (
              <button
                key={proj.title}
                ref={el => (tabs.current[i] = el)}
                id={`work-tab-${i}`}
                role="tab"
                aria-selected={i === active}
                aria-controls="work-stage"
                tabIndex={i === active ? 0 : -1}
                className="work__tab"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="work__tab-n" aria-hidden="true">{pad(i + 1)}</span>
                <span className="work__tab-t display">{proj.title}</span>
              </button>
            ))}
            <p className="label work__hint" aria-hidden="true">↑ ↓ to browse</p>
          </div>

          <div className="work__stage" id="work-stage" role="tabpanel" aria-labelledby={`work-tab-${active}`}>
            <article key={active} className="work__plate">
              <p className="work__no">
                <span className="signal-n">{pad(active + 1)}</span>/{pad(N)}
                <span className="work__motif">{pipelines[p.title]?.motif}</span>
              </p>
              <h3 className="work__title display">{p.title}</h3>
              <p className="work__sub">{p.subtitle}</p>
              {pipelines[p.title] && (
                <figure className="work__fig">
                  <Schematic pipeline={pipelines[p.title]} cols={3} />
                </figure>
              )}
              <p className="work__summary">{p.summary}</p>
              <h4 className="label work__h">What it does</h4>
              <ul className="work__points">
                {points(p).map(d => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="work__stack">{p.tech.join(' · ')}</p>
              <Links p={p} />
            </article>
          </div>
        </div>

        {/* <1024px: horizontal plate track */}
        <div className="work__mobile reveal">
          <p className="work__counter label" aria-hidden="true">
            <span className="signal-n">{pad(current + 1)}</span> / {pad(N)} <span className="work__swipe">swipe →</span>
          </p>
          <div className="work__track" tabIndex={0} role="region" aria-label="Projects, scroll horizontally" onScroll={onTrackScroll}>
            {projects.map((proj, i) => (
              <article key={proj.title} className="work__card" aria-label={`${i + 1} of ${N}: ${proj.title}`}>
                <p className="work__no">
                  <span className="signal-n">{pad(i + 1)}</span>/{pad(N)}
                </p>
                {pipelines[proj.title] && (
                  <figure className="work__fig">
                    <Schematic pipeline={pipelines[proj.title]} cols={2} />
                  </figure>
                )}
                <h3 className="work__title display">{proj.title}</h3>
                <p className="work__sub">{proj.subtitle}</p>
                <p className="work__summary">{proj.summary}</p>
                <p className="work__stack">{proj.tech.join(' · ')}</p>
                <Links p={proj} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
