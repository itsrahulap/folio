import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Nav.scss';

const LINKS = [
    { id: 'work', label: 'Work' },
    { id: 'system', label: 'System' },
    { id: 'journey', label: 'Journey' },
    { id: 'contact', label: 'Contact' },
];

interface NavProps {
    onOpenConsole: () => void;
}

const Nav: React.FC<NavProps> = ({ onOpenConsole }) => {
    const { theme, setTheme } = useTheme();
    const [active, setActive] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 8);
            const mid = window.innerHeight * 0.4;
            const hit = LINKS.find(({ id }) => {
                const r = document.getElementById(id)?.getBoundingClientRect();
                return r && r.top <= mid && r.bottom >= mid;
            });
            setActive(hit?.id ?? '');
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
            <div className="frame nav-inner">
                <a className="nav-mark" href="#top" aria-label="Rahul AP — back to top">
                    <span aria-hidden="true">▲</span> Rahul AP
                </a>

                <nav className="nav-links" aria-label="Sections">
                    {LINKS.map(({ id, label }, i) => (
                        <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>
                            <span aria-hidden="true">0{i + 1}</span>{label}
                        </a>
                    ))}
                </nav>

                <div className="nav-tools">
                    <button type="button" onClick={onOpenConsole} aria-keyshortcuts="`">
                        <kbd aria-hidden="true">~</kbd> Console
                    </button>
                    <button
                        type="button"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label={`Switch to ${theme === 'dark' ? 'paper (light)' : 'ink (dark)'} theme`}
                    >
                        {theme === 'dark' ? 'Ink' : 'Paper'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Nav;
