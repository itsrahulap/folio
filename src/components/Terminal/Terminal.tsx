import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme, THEME_ORDER } from '../../context/ThemeContext';
import { runCommand, COMMAND_NAMES, OPEN_TARGETS, CommandOutput } from './commands';
import './Terminal.scss';

interface LineEntry {
    id: number;
    command: string;
    output: CommandOutput;
}

const PROMPT = 'guest@rahulap:~$';

let idCounter = 0;

type CompletionContext = { kind: 'command' | 'open-arg'; prefix: string; options: string[] };

const getCompletionContext = (value: string): CompletionContext | null => {
    const trailingSpace = /\s$/.test(value);
    const parts = value.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return null;

    const first = parts[0].toLowerCase();
    if (first === 'open' && (parts.length > 1 || trailingSpace)) {
        return { kind: 'open-arg', prefix: parts.length > 1 ? parts[1].toLowerCase() : '', options: OPEN_TARGETS };
    }
    if (parts.length > 1) return null;
    return { kind: 'command', prefix: first, options: COMMAND_NAMES };
};

const formatLastLogin = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
        month: 'short', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false,
        timeZone: 'Asia/Kolkata',
    }).formatToParts(new Date());
    const get = (type: string) => parts.find(p => p.type === type)?.value;
    return `${get('month')} ${get('day')} ${get('year')} ${get('hour')}:${get('minute')} IST`;
};

interface TerminalProps {
    onSwitchToGui: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onSwitchToGui }) => {
    const { theme, setTheme } = useTheme();
    const [lines, setLines] = useState<LineEntry[]>([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [matrixActive, setMatrixActive] = useState(false);

    const [lastLogin] = useState(formatLastLogin);
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
                switchToGui: onSwitchToGui,
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
            const ctx = getCompletionContext(input);
            if (!ctx) return;
            const matches = ctx.options.filter(o => o.startsWith(ctx.prefix));
            if (matches.length === 1) {
                setInput(ctx.kind === 'open-arg' ? `open ${matches[0]} ` : `${matches[0]} `);
            }
        }
    };

    const completionCtx = getCompletionContext(input);
    const suggestions = completionCtx
        ? completionCtx.options.filter(o => o.startsWith(completionCtx.prefix) && o !== completionCtx.prefix)
        : [];

    return (
        <div className="terminal" onClick={focusInput}>
            {matrixActive && <div className="terminal-matrix" aria-hidden="true" />}

            <div className="terminal-scroll">
                <div className="terminal-welcome">
                    <p className="out-title">Rahul AP v2.1</p>
                    <div className="welcome-login">
                        <p className="out-muted">Last login:</p>
                        <p className="out-muted">{lastLogin}</p>
                    </div>
                    <p className="out-muted">Type &quot;help&quot; to begin.</p>
                </div>

                {lines.map(line => (
                    <div className="terminal-block" key={line.id}>
                        <div className="terminal-line">
                            <span className="terminal-prompt">{PROMPT}</span>
                            <span className="terminal-command">{line.command}</span>
                        </div>
                        {line.output && <div className="terminal-output">{line.output}</div>}
                    </div>
                ))}

                <div className="terminal-line terminal-line--active">
                    <span className="terminal-prompt">{PROMPT}</span>
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
