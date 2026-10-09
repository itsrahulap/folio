import React from 'react';
import { resumeData } from '../../data/resume';
import './Journey.scss';

const START = 2021;
const today = new Date();
const thisYear = today.getFullYear();
const nowPos = thisYear + today.getMonth() / 12;
const END = nowPos + 0.35; // a little air after "now"

const pct = (y: number) => `${((y - START) / (END - START)) * 100}%`;
const parseYears = (s: string) => {
    const [a, b] = s.split(/[–-]/).map(x => x.trim());
    return { from: Number(a), to: /present/i.test(b) ? nowPos : Number(b), current: /present/i.test(b) };
};

type Entry = {
    title: string;
    org: string;
    year: string;
    points: string[];
    from: number;
    to: number;
    current: boolean;
};

const entries: Entry[] = [
    ...resumeData.experience.map(e => ({ title: e.role, org: e.company, year: e.year, points: e.description })),
    ...resumeData.education.map(e => ({ title: e.degree, org: e.institution, year: e.year, points: [] as string[] })),
]
    .map(e => ({ ...e, ...parseYears(e.year) }))
    .sort((a, b) => a.from - b.from || a.to - b.to);

const code = (i: number) => String.fromCharCode(65 + i);
const years = Array.from({ length: thisYear - START + 1 }, (_, i) => START + i);
const displayYear = (s: string) => s.replace(/present/i, 'Now');

const Journey: React.FC = () => (
    <section id="journey" className="jr" aria-labelledby="journey-title" data-field="0.12">
        <div className="frame">
            <header className="section-head">
                <h2 id="journey-title" className="label">§ 03 — Journey</h2>
                <span className="label" aria-hidden="true">{START} — {thisYear}</span>
            </header>

            {/* Visual survey axis; the ordered list below carries the same facts for assistive tech. */}
            <div className="jr__chart reveal" aria-hidden="true">
                <div className="jr__plot">
                    {years.map(y => (
                        <span key={y} className="jr__tick" style={{ left: pct(y) }}>
                            <span className="jr__tick-label">{y}</span>
                        </span>
                    ))}
                    <span className="jr__now" style={{ left: pct(nowPos) }}>
                        <span className="jr__now-label">Now</span>
                    </span>
                </div>
                {entries.map((e, i) => (
                    <div key={e.year + e.org} className={`jr__lane${e.current ? ' is-current' : ''}`}>
                        <span className="jr__lane-label">
                            <span className="jr__code">{code(i)}</span>
                            {e.org}
                        </span>
                        <span className="jr__track">
                            <span className="jr__bar" style={{ left: pct(e.from), right: `calc(100% - ${pct(e.to)})` }} />
                            <span className="jr__bar-years" style={{ left: pct(e.from) }}>{displayYear(e.year)}</span>
                        </span>
                    </div>
                ))}
            </div>

            <ol className="jr__list">
                {entries.map((e, i) => (
                    <li key={e.year + e.org} className={`jr__entry reveal${e.current ? ' is-current' : ''}`}>
                        <span className="jr__node" aria-hidden="true" />
                        <p className="jr__meta label">
                            <span className="jr__code" aria-hidden="true">{code(i)}</span>
                            <span>{e.year.replace('–', ' – ')}</span>
                            {e.current && <span className="jr__live">Current</span>}
                        </p>
                        <h3 className="jr__title display">{e.title}</h3>
                        <p className="jr__org">{e.org}</p>
                        {e.points.length > 0 && (
                            <ul className="jr__points">
                                {e.points.map(p => <li key={p}>{p}</li>)}
                            </ul>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    </section>
);

export default Journey;
