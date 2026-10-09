import React from 'react';
import { resumeData } from '../../data/resume';
import './System.scss';

const { skills, hero } = resumeData;

const layers = [
    { code: 'L1', name: 'Interface', key: 'frontend', items: skills.frontend },
    { code: 'L2', name: 'State', key: 'state', items: skills.state },
    { code: 'L3', name: 'Services', key: 'backend', items: skills.backend },
    { code: 'L4', name: 'Intelligence', key: 'ai', items: skills.ai },
];

const rails = [
    { code: 'R1', name: 'Realtime', side: 'left', items: skills.realtime },
    { code: 'R2', name: 'Ops / Tooling', side: 'right', items: skills.tools },
];

// Bio split: first sentence is the statement, the rest ("Based in …") becomes a mono caption.
const [statement, ...restOfBio] = hero.bio.split(/(?<=\.)\s+/);
const EMPHASIS = /(interfaces|intelligent systems)/;

const System: React.FC = () => (
    <section id="system" className="sys" aria-labelledby="system-title" data-field="0.12">
        <div className="frame">
            <header className="section-head">
                <h2 id="system-title" className="label">§ 02 — System</h2>
                <span className="label" aria-hidden="true">Fig. 2 · Stack, drawn as layers</span>
            </header>

            <p className="sys__statement display reveal">
                {statement.split(EMPHASIS).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}
            </p>
            {restOfBio.length > 0 && <p className="sys__caption label reveal">{restOfBio.join(' ')}</p>}

            <div className="sys__diagram reveal">
                <ol className="sys__stack" aria-label="Stack layers, top to bottom">
                    {layers.map((l, i) => (
                        <li
                            key={l.code}
                            className="sys__layer"
                            tabIndex={0}
                            aria-labelledby={`sys-${l.key}`}
                            style={{ '--i': i } as React.CSSProperties}
                        >
                            <span className="sys__bus sys__bus--l" aria-hidden="true" />
                            <span className="sys__bus sys__bus--r" aria-hidden="true" />
                            <h3 id={`sys-${l.key}`} className="sys__layer-head">
                                <span className="sys__code">{l.code}</span>
                                <span className="sys__name">{l.name}</span>
                            </h3>
                            <ul className="sys__items">
                                {l.items.map(t => <li key={t}>{t}</li>)}
                            </ul>
                        </li>
                    ))}
                </ol>

                {rails.map(r => (
                    <div key={r.code} className={`sys__rail sys__rail--${r.side}`} tabIndex={0} aria-labelledby={`sys-${r.code}`}>
                        <h3 id={`sys-${r.code}`} className="sys__layer-head">
                            <span className="sys__code">{r.code}</span>
                            <span className="sys__name">{r.name}</span>
                        </h3>
                        <ul className="sys__rail-items">
                            {r.items.map(t => <li key={t}>{t}</li>)}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="sys__workbench reveal">
                <h3 className="label">* Workbench</h3>
                <ul>
                    {[...skills.ai_tools, ...skills.design].map(t => <li key={t}>{t}</li>)}
                </ul>
            </div>
        </div>
    </section>
);

export default System;
