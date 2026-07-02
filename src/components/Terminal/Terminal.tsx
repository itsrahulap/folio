import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme, Theme } from '../../context/ThemeContext';
import { runCommand, COMMAND_NAMES, CommandOutput } from './commands';
import './Terminal.scss';

interface LineEntry {
    id: number;
    command: string;
    output: CommandOutput;
}

const THEME_ORDER: Theme[] = ['dark', 'neon', 'pastel', 'light'];
const WELCOME = 'Type "help" to begin.';

let idCounter = 0;

const Terminal: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [lines, setLines] = useState<LineEntry[]>([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [matrixActive, setMatrixActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: 'end' });
    }, [lines]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const cycleTheme = useCallback(() => {
        const next = THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length];
        setTheme(next);
    }, [theme, setTheme]);

    const triggerMatrix = useCallback(() => {
        setMatrixActive(true);
        setTimeout(() => setMatrixActive(false), 3000);
    }, []);

    const focusInput = () => inputRef.current?.focus();

    const submit = (raw: string) => {
        const command = raw.trim();
        if (!command) return;

        if (command.toLowerCase() === 'clear') {
            setLines([]);
        } else {
            const output = runCommand(command, {
                theme,
                cycleTheme,
                clear: () => setLines([]),
                triggerMatrix,
            });
            setLines(ls => [...ls, { id: idCounter++, command, output }]);
        }

        setHistory(h => [...h, command]);
        setHistoryIndex(null);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            submit(input);
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(nextIndex);
            setInput(history[nextIndex]);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex === null) return;
            const nextIndex = historyIndex + 1;
            if (nextIndex >= history.length) {
                setHistoryIndex(null);
                setInput('');
            } else {
                setHistoryIndex(nextIndex);
                setInput(history[nextIndex]);
            }
            return;
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            const [prefix] = input.split(/\s+/);
            if (!prefix) return;
            const matches = COMMAND_NAMES.filter(c => c.startsWith(prefix.toLowerCase()));
            if (matches.length === 1) {
                setInput(matches[0] + ' ');
            }
        }
    };

    const suggestions = input.trim()
        ? COMMAND_NAMES.filter(c => c.startsWith(input.trim().toLowerCase()) && c !== input.trim().toLowerCase())
        : [];

    return (
        <div className="terminal" onClick={focusInput}>
            {matrixActive && <div className="terminal-matrix" aria-hidden="true" />}

            <div className="terminal-scroll">
                <div className="terminal-welcome">
                    <p>RahulOS v2.0 — interactive portfolio</p>
                    <p className="out-muted">{WELCOME}</p>
                </div>

                {lines.map(line => (
                    <div className="terminal-block" key={line.id}>
                        <div className="terminal-line">
                            <span className="terminal-prompt">visitor@rahul:~$</span>
                            <span className="terminal-command">{line.command}</span>
                        </div>
                        {line.output && <div className="terminal-output">{line.output}</div>}
                    </div>
                ))}

                <div className="terminal-line terminal-line--active">
                    <span className="terminal-prompt">visitor@rahul:~$</span>
                    <input
                        ref={inputRef}
                        className="terminal-input"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        autoComplete="off"
                        autoCapitalize="off"
                        aria-label="Terminal input"
                    />
                </div>

                {suggestions.length > 0 && (
                    <div className="terminal-suggestions">
                        {suggestions.map(s => (
                            <span className="terminal-suggestion" key={s}>{s}</span>
                        ))}
                    </div>
                )}

                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default Terminal;
