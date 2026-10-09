import React from 'react';
import './ModeSwitch.scss';

export type ViewMode = 'terminal' | 'gui';

interface ModeSwitchProps {
    mode: ViewMode;
    onChange: (mode: ViewMode) => void;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, onChange }) => {
    // Two tabs: arrow/Home/End keys move selection and focus (WAI-ARIA tabs pattern).
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const next: Record<string, ViewMode | undefined> = {
            ArrowLeft: mode === 'gui' ? 'terminal' : 'gui',
            ArrowRight: mode === 'gui' ? 'terminal' : 'gui',
            Home: 'gui',
            End: 'terminal',
        };
        const target = next[e.key];
        if (!target) return;
        e.preventDefault();
        onChange(target);
        document.getElementById(`tab-${target}`)?.focus();
    };

    return (
        <div className="mode-switch" role="tablist" aria-label="View mode" onKeyDown={onKeyDown}>
            <button
                type="button"
                role="tab"
                id="tab-gui"
                aria-controls="panel-gui"
                aria-selected={mode === 'gui'}
                tabIndex={mode === 'gui' ? 0 : -1}
                className={`mode-switch-option ${mode === 'gui' ? 'is-active' : ''}`}
                onClick={() => onChange('gui')}
            >
                Website
            </button>
            <button
                type="button"
                role="tab"
                id="tab-terminal"
                aria-controls="panel-terminal"
                aria-selected={mode === 'terminal'}
                tabIndex={mode === 'terminal' ? 0 : -1}
                className={`mode-switch-option ${mode === 'terminal' ? 'is-active' : ''}`}
                onClick={() => onChange('terminal')}
            >
                Terminal
            </button>
            <div className={`mode-switch-thumb ${mode === 'terminal' ? 'is-right' : 'is-left'}`} aria-hidden="true" />
        </div>
    );
};

export default ModeSwitch;
