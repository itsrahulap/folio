import React from 'react';
import './ModeSwitch.scss';

export type ViewMode = 'terminal' | 'gui';

interface ModeSwitchProps {
    mode: ViewMode;
    onChange: (mode: ViewMode) => void;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, onChange }) => {
    return (
        <div className="mode-switch" role="tablist" aria-label="View mode">
            <button
                type="button"
                role="tab"
                aria-selected={mode === 'gui'}
                className={`mode-switch-option ${mode === 'gui' ? 'is-active' : ''}`}
                onClick={() => onChange('gui')}
            >
                Website
            </button>
            <button
                type="button"
                role="tab"
                aria-selected={mode === 'terminal'}
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
