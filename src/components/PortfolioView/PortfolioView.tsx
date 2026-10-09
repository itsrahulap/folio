import React, { useCallback } from 'react';
import { resumeData } from '../../data/resume';
import { useTheme, THEME_ORDER } from '../../context/ThemeContext';
import './PortfolioView.scss';

const SKILL_LABELS: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    state: 'State Management',
    ai_tools: 'AI Tools',
    ai: 'AI',
    tools: 'Tools',
    realtime: 'Realtime',
    design: 'Design',
};

const PortfolioView: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const cycleTheme = useCallback(() => {
        const next = THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length];
        setTheme(next);
    }, [theme, setTheme]);

    const [current] = resumeData.experience;
    const pad = (n: number) => String(n + 1).padStart(2, '0');

    return (
        <div className="portfolio">
            <button
                type="button"
                className="portfolio-theme-toggle"
                onClick={cycleTheme}
                aria-label={`Theme: ${theme}. Switch theme`}
            >
                {theme}
            </button>

            <main className="portfolio-scroll">
                <header className="portfolio-hero">
                    <p className="portfolio-eyebrow">
                        <span className="portfolio-status" aria-hidden="true" />
                        {current.role} at {current.company}
                    </p>
                    <h1>{resumeData.name}<span className="portfolio-cursor" aria-hidden="true">_</span></h1>
                    <p className="portfolio-bio">{resumeData.hero.bio}</p>
                    <dl className="portfolio-meta">
                        <div><dt>Role</dt><dd>{resumeData.hero.role1}<br />{resumeData.hero.role2}</dd></div>
                        <div><dt>Shipped</dt><dd>{resumeData.projects.length} projects</dd></div>
                        <div>
                            <dt>Reach</dt>
                            <dd><a href={`mailto:${resumeData.contact.email}`}>{resumeData.contact.email}</a></dd>
                        </div>
                    </dl>
                </header>

                <section className="portfolio-section" aria-labelledby="projects-h">
                    <h2 id="projects-h">Selected work</h2>
                    <ol className="portfolio-projects">
                        {resumeData.projects.map((p, i) => (
                            <li key={p.title}>
                                <a className="portfolio-project" href={p.link ?? p.github} target="_blank" rel="noopener noreferrer">
                                    <span className="portfolio-index" aria-hidden="true">{pad(i)}</span>
                                    <span className="portfolio-project-body">
                                        <span className="portfolio-project-title">
                                            {p.title}{"\u00A0"}
                                            <span className="portfolio-arrow" aria-hidden="true">↗</span>
                                        </span>
                                        <span className="portfolio-subtitle">{p.subtitle}</span>
                                        <span className="portfolio-summary">{p.summary}</span>
                                        <span className="portfolio-stack">{p.tech.join(' / ')}</span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="portfolio-section" aria-labelledby="exp-h">
                    <h2 id="exp-h">Experience</h2>
                    {resumeData.experience.map(exp => (
                        <article className="portfolio-row" key={exp.company}>
                            <span className="portfolio-when">{exp.year}</span>
                            <div>
                                <h3>{exp.role}, <span className="portfolio-muted">{exp.company}</span></h3>
                                <ul>
                                    {exp.description.map(line => (
                                        <li key={line}>{line}</li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                    {resumeData.education.map(edu => (
                        <article className="portfolio-row" key={edu.institution}>
                            <span className="portfolio-when">{edu.year}</span>
                            <div>
                                <h3>{edu.degree}, <span className="portfolio-muted">{edu.institution}</span></h3>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="portfolio-section" aria-labelledby="skills-h">
                    <h2 id="skills-h">Toolkit</h2>
                    <dl className="portfolio-skills">
                        {Object.entries(resumeData.skills).map(([category, items]) => (
                            <div className="portfolio-row" key={category}>
                                <dt className="portfolio-when">{SKILL_LABELS[category] ?? category.replace(/_/g, ' ')}</dt>
                                <dd>{(items as string[]).join(', ')}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <footer className="portfolio-contact">
                    <p className="portfolio-eyebrow">Open to interesting problems</p>
                    <a className="portfolio-email" href={`mailto:${resumeData.contact.email}`}>{resumeData.contact.email}</a>
                    <p className="portfolio-links">
                        <a href={resumeData.contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                        <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href={resumeData.contact.cv} target="_blank" rel="noopener noreferrer">Résumé</a>
                        <a href={`tel:${resumeData.contact.phone}`}>{resumeData.contact.phone}</a>
                    </p>
                </footer>
            </main>
        </div>
    );
};

export default PortfolioView;
