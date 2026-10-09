import React, { useEffect, useState, useCallback } from 'react';
import './styles/global.scss'; // first, so component styles can override the shared primitives
import { ThemeProvider } from './context/ThemeContext';
import Field from './components/Field/Field';
import Nav from './components/Nav/Nav';
import Hero from './components/Hero/Hero';
import Work from './components/Work/Work';
import System from './components/System/System';
import Journey from './components/Journey/Journey';
import Finale from './components/Finale/Finale';
import Console from './components/Console/Console';

const isTyping = (el: EventTarget | null) =>
    el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

const App: React.FC = () => {
    const [consoleOpen, setConsoleOpen] = useState(false);
    const openConsole = useCallback(() => setConsoleOpen(true), []);
    const closeConsole = useCallback(() => setConsoleOpen(false), []);

    // `~` or ` toggles the console from anywhere outside a text field.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.key === '`' || e.key === '~') && !isTyping(e.target)) {
                e.preventDefault();
                setConsoleOpen(o => !o);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // One observer reveals every `.reveal` element as it scrolls in.
    useEffect(() => {
        document.documentElement.classList.add('js');
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in');
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });
        document.querySelectorAll('.reveal').forEach(el => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <ThemeProvider>
            <a className="skip-link" href="#main">Skip to content</a>
            <Field />
            <Nav onOpenConsole={openConsole} />
            <main id="main">
                <Hero onOpenConsole={openConsole} />
                <Work />
                <System />
                <Journey />
                <Finale />
            </main>
            <Console open={consoleOpen} onClose={closeConsole} />
        </ThemeProvider>
    );
};

export default App;
