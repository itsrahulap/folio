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

    return (
        <div className="portfolio">
            <button type="button" className="portfolio-theme-toggle" onClick={cycleTheme}>
                {theme}
            </button>

            <div className="portfolio-scroll">
                <header className="portfolio-hero">
                    <h1>{resumeData.name}</h1>
                    <p className="portfolio-role">{resumeData.hero.role1} · {resumeData.hero.role2}</p>
                    <p className="portfolio-bio">{resumeData.hero.bio}</p>
                    <p className="portfolio-muted">{resumeData.location}</p>
                </header>

                <section className="portfolio-section">
                    <h2>Skills</h2>
                    <div className="portfolio-skills">
                        {Object.entries(resumeData.skills).map(([category, items]) => (
                            <div className="portfolio-skill-group" key={category}>
                                <h3>{SKILL_LABELS[category] ?? category.replace(/_/g, ' ')}</h3>
                                <div className="portfolio-tags">
                                    {(items as string[]).map(item => (
                                        <span className="portfolio-tag" key={item}>{item}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="portfolio-section">
                    <h2>Experience</h2>
                    {resumeData.experience.map(exp => (
                        <div className="portfolio-card" key={exp.company}>
                            <div className="portfolio-card-header">
                                <h3>{exp.role} · {exp.company}</h3>
                                <span className="portfolio-muted">{exp.year}</span>
                            </div>
                            <ul>
                                {exp.description.map(line => (
                                    <li key={line}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>

                <section className="portfolio-section">
                    <h2>Projects</h2>
                    <div className="portfolio-projects">
                        {resumeData.projects.map(p => (
                            <div className="portfolio-card" key={p.title}>
                                <div className="portfolio-card-header">
                                    <h3>{p.title}</h3>
                                    <a href={p.link ?? p.github} target="_blank" rel="noopener noreferrer">View →</a>
                                </div>
                                <p className="portfolio-subtitle">{p.subtitle}</p>
                                <p className="portfolio-card-summary">{p.summary}</p>
                                <div className="portfolio-tags">
                                    {p.tech.map(t => (
                                        <span className="portfolio-tag" key={t}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="portfolio-section">
                    <h2>Education</h2>
                    {resumeData.education.map(edu => (
                        <div className="portfolio-card" key={edu.institution}>
                            <div className="portfolio-card-header">
                                <h3>{edu.degree}</h3>
                                <span className="portfolio-muted">{edu.year}</span>
                            </div>
                            <p className="portfolio-muted">{edu.institution}</p>
                        </div>
                    ))}
                </section>

                <section className="portfolio-section portfolio-contact-section">
                    <h2>Contact</h2>
                    <div className="portfolio-contact-grid">
                        <div className="portfolio-contact-item">
                            <span className="portfolio-contact-label">Email</span>
                            <a href={`mailto:${resumeData.contact.email}`}>{resumeData.contact.email}</a>
                        </div>
                        <div className="portfolio-contact-item">
                            <span className="portfolio-contact-label">Phone</span>
                            <span>{resumeData.contact.phone}</span>
                        </div>
                        <div className="portfolio-contact-item">
                            <span className="portfolio-contact-label">Social</span>
                            <div className="portfolio-social-links">
                                <a href={resumeData.contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                                <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                <a href={resumeData.contact.cv} target="_blank" rel="noopener noreferrer">Resume</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PortfolioView;
