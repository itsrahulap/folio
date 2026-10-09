import React from 'react';
import { resumeData } from '../../data/resume';
import './Finale.scss';

const { contact, location } = resumeData;

const links = [
    { label: 'GitHub', href: contact.github, external: true },
    { label: 'LinkedIn', href: contact.linkedin, external: true },
    { label: 'Résumé', href: contact.cv, external: true },
    { label: contact.phone, href: `tel:+91${contact.phone}`, external: false },
];

const Finale: React.FC = () => (
    <section id="contact" className="fin" aria-labelledby="contact-title" data-field="1">
        <div className="frame fin__frame">
            <header className="section-head">
                <h2 id="contact-title" className="label">§ 04 — Contact</h2>
                <span className="label" aria-hidden="true">End of survey</span>
            </header>

            <div className="fin__body">
                <p className="fin__line display reveal">
                    Let’s build something <em>that works</em>.
                </p>

                <a className="fin__email display reveal" href={`mailto:${contact.email}`}>
                    {contact.email}
                </a>

                <ul className="fin__links reveal" aria-label="Elsewhere">
                    {links.map(l => (
                        <li key={l.label}>
                            <a
                                href={l.href}
                                {...(l.external && { target: '_blank', rel: 'noopener noreferrer' })}
                            >
                                {l.label}
                                {l.external && <span aria-hidden="true"> ↗</span>}
                                {l.external && <span className="sr-only"> (opens in a new tab)</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <footer className="fin__colophon">
                <svg className="fin__mark" viewBox="0 0 20 20" aria-hidden="true">
                    <circle cx="10" cy="10" r="5.5" />
                    <path d="M10 0v7M10 13v7M0 10h7M13 10h7" />
                </svg>
                <p>
                    <span>10.85° N, 76.27° E</span>
                    <span>{location}</span>
                    <span>© {new Date().getFullYear()}</span>
                    <span>Set in Instrument Serif, Inter &amp; JetBrains Mono</span>
                </p>
            </footer>
        </div>
    </section>
);

export default Finale;
