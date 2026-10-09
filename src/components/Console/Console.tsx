import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { runCommand, COMMAND_NAMES, ARG_OPTIONS, CommandOutput } from './commands';
import './Console.scss';

interface ConsoleProps {
    open: boolean;
    onClose: () => void;
}

interface LineEntry {
    id: number;
    command: string;
    output: CommandOutput;
}

const PROMPT = '›';
const CLOSE_MS = 320; // matches --t-med
const FOCUSABLE = 'button, input, a[href], [tabindex]:not([tabindex="-1"])';

let idCounter = 0;

type Completion = { cmd?: string; prefix: string; options: string[] };

const getCompletion = (value: string): Completion | null => {
    const parts = value.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return null;
    const first = parts[0].toLowerCase();
    const args = ARG_OPTIONS[first];
    if (args && (parts.length > 1 || /\s$/.test(value))) {
        return parts.length > 2 ? null : { cmd: first, prefix: (parts[1] ?? '').toLowerCase(), options: args };
    }
    return parts.length > 1 ? null : { prefix: first, options: COMMAND_NAMES };
};

const Console: React.FC<ConsoleProps> = ({ open, onClose }) => {
    const { theme, setTheme } = useTheme();
    const [lines, setLines] = useState<LineEntry[]>([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [shown, setShown] = useState(false);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const returnTo = useRef<HTMLElement | null>(null);

    // showModal() makes the rest of the page inert and puts the drawer in the top layer;
    // close() (after the slide-out) removes it from the tab order and accessibility tree.
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open) {
            if (!dialog.open) {
                returnTo.current = document.activeElement as HTMLElement | null;
                dialog.showModal();
            }
            inputRef.current?.focus();
            const raf = requestAnimationFrame(() => setShown(true));
            return () => cancelAnimationFrame(raf);
        }
        setShown(false);
        if (!dialog.open) return;
        const timer = setTimeout(() => {
            dialog.close();
            returnTo.current?.focus({ preventScroll: true });
        }, CLOSE_MS);
        return () => clearTimeout(timer);
    }, [open]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: 'end' });
    }, [lines]);

    const goto = (id: string) => {
        const target = document.getElementById(id);
        if (target) {
            if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
            returnTo.current = target; // keyboard focus follows the jump
            target.scrollIntoView({ block: 'start' });
        }
        onClose();
    };

    const submit = () => {
        const command = input.trim();
        setInput('');
        setHistoryIndex(null);
        if (!command) return;
        setHistory(h => [...h, command]);
        if (command.toLowerCase() === 'clear') {
            setLines([]);
            return;
        }
        const output = runCommand(command, { theme, setTheme, close: onClose, goto });
        setLines(ls => [...ls, { id: idCounter++, command, output }]);
    };

    const completion = getCompletion(input);
    const suggestions = completion
        ? completion.options.filter(o => o.startsWith(completion.prefix) && o !== completion.prefix)
        : [];

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            submit();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (history.length === 0) return;
            const up = e.key === 'ArrowUp';
            if (!up && historyIndex === null) return;
            const next = up
                ? (historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1))
                : historyIndex! + 1;
            const done = next >= history.length;
            setHistoryIndex(done ? null : next);
            setInput(done ? '' : history[next]);
        } else if (e.key === 'Tab' && !e.shiftKey && completion) {
            // Tab completes while there is text; on an empty line it moves focus like normal.
            e.preventDefault();
            e.stopPropagation();
            const matches = completion.options.filter(o => o.startsWith(completion.prefix));
            if (matches.length === 1) setInput(completion.cmd ? `${completion.cmd} ${matches[0]} ` : `${matches[0]} `);
        }
    };

    const onDialogKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
        if (e.key !== 'Tab') return;
        const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className={`console${shown ? ' is-shown' : ''}`}
            aria-labelledby="console-title"
            onKeyDown={onDialogKeyDown}
            onClose={() => { if (open) onClose(); }} // browser force-closed it (e.g. repeated Esc)
            onCancel={e => { e.preventDefault(); onClose(); }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="console-panel">
                <header className="console-head">
                    <h2 id="console-title" className="console-title">console — rahulap</h2>
                    <span className="console-hint" aria-hidden="true">esc to close</span>
                    <button type="button" className="console-close" onClick={onClose}>Close</button>
                </header>

                <div className="console-scroll" onClick={() => inputRef.current?.focus()}>
                    <p className="out-muted">
                        Console — type <code>help</code>, <code>goto work</code>, or <code>exit</code>.
                    </p>

                    <div role="log" aria-live="polite">
                        {lines.map(line => (
                            <div className="console-block" key={line.id}>
                                <p className="console-line">
                                    <span className="console-prompt" aria-hidden="true">{PROMPT}</span>
                                    {line.command}
                                </p>
                                {line.output && <div className="console-output">{line.output}</div>}
                            </div>
                        ))}
                    </div>

                    <div className="console-line console-line--active">
                        <span className="console-prompt" aria-hidden="true">{PROMPT}</span>
                        <input
                            ref={inputRef}
                            className="console-input"
                            value={input}
                            onChange={e => { setInput(e.target.value); setHistoryIndex(null); }}
                            onKeyDown={onInputKeyDown}
                            spellCheck={false}
                            autoComplete="off"
                            autoCapitalize="off"
                            enterKeyHint="send"
                            aria-label="Console command"
                        />
                    </div>

                    {suggestions.length > 0 && (
                        <p className="console-suggestions" aria-hidden="true">
                            {suggestions.slice(0, 12).map(s => <span key={s}>{s}</span>)}
                        </p>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>
        </dialog>
    );
};

export default Console;
