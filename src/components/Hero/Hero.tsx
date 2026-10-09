import React from 'react';
import { resumeData } from '../../data/resume';
import './Hero.scss';

interface HeroProps {
    onOpenConsole: () => void;
}

const [current] = resumeData.experience;
// The bio ends with the location, which the coordinates line already states.
const statement = resumeData.hero.bio.replace(/\s*Based in .*$/, '');

const Hero: React.FC<HeroProps> = ({ onOpenConsole }) => (
    <section id="top" className="hero" aria-labelledby="hero-name" data-field="1">
        <div className="frame hero-frame">
            <p className="label hero-coords">
                <span>N 10.85° · E 76.27°</span>
                <span>{resumeData.location}</span>
            </p>

            <h1 id="hero-name" className="display hero-name">
                <span className="hero-line"><span>Rahul</span></span>
                <span className="hero-line"><span><em>AP</em></span></span>
            </h1>

            {/* The field's main summit is drawn under this marker. */}
            <div className="hero-summit" data-summit aria-hidden="true">
                <span className="hero-summit-cross" />
                <span className="hero-summit-note label">
                    <b>▲ {current.year}</b>
                    {current.role}, {current.company}
                </span>
            </div>

            <div className="hero-foot">
                <p className="hero-statement">
                    {resumeData.hero.role1} & {resumeData.hero.role2}. {statement}
                </p>

                <div className="hero-actions">
                    <a className="hero-cta" href="#work">
                        Explore the work <span aria-hidden="true">↓</span>
                    </a>
                    <button type="button" className="hero-link" onClick={onOpenConsole}>
                        Open console <kbd>~</kbd>
                    </button>
                    <a className="hero-link" href={resumeData.contact.cv} target="_blank" rel="noopener noreferrer">
                        Résumé <span aria-hidden="true">↗</span>
                    </a>
                </div>

                <dl className="hero-legend label" aria-label="Map legend">
                    <div><dt><i className="lg-major" /></dt><dd>Index contour</dd></div>
                    <div><dt><i className="lg-minor" /></dt><dd>Contour</dd></div>
                    <div><dt><i className="lg-signal" /></dt><dd>Your cursor</dd></div>
                </dl>
            </div>
        </div>
    </section>
);

export default Hero;
