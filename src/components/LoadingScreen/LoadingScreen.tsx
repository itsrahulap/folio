import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './LoadingScreen.scss';

interface Props {
    onComplete: () => void;
}

const BOOT_LINES = [
    { ts: '0.0001', msg: 'Initializing RahulOS...' },
    { ts: '0.0042', msg: 'Loading kernel...' },
    { ts: '0.0125', msg: 'Loading React...' },
    { ts: '0.0210', msg: 'Loading portfolio...' },
    { ts: '0.0340', msg: 'Connecting to GitHub...' },
    { ts: '0.0480', msg: 'Loading projects...' },
    { ts: '0.0610', msg: 'Loading experience...' },
    { ts: '0.0700', msg: 'System Ready.' },
];

const BAR_BLOCKS = 20;
const BOOT_DURATION = 2200;

const LoadingScreen: React.FC<Props> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [lineCount, setLineCount] = useState(0);
    const [skipped, setSkipped] = useState(false);

    const skip = React.useCallback(() => {
        if (skipped) return;
        setSkipped(true);
        setProgress(100);
        setLineCount(BOOT_LINES.length);
        onComplete();
    }, [skipped, onComplete]);

    useEffect(() => {
        const tickMs = 60;
        const step = 100 / (BOOT_DURATION / tickMs);
        const progressTimer = setInterval(() => {
            setProgress(p => {
                const next = p + step;
                if (next >= 100) {
                    clearInterval(progressTimer);
                    setTimeout(onComplete, 350);
                    return 100;
                }
                return next;
            });
        }, tickMs);

        const lineTimers = BOOT_LINES.map((_, i) =>
            setTimeout(() => setLineCount(i + 1), (BOOT_DURATION / BOOT_LINES.length) * i)
        );

        window.addEventListener('keydown', skip);
        window.addEventListener('click', skip);

        return () => {
            clearInterval(progressTimer);
            lineTimers.forEach(clearTimeout);
            window.removeEventListener('keydown', skip);
            window.removeEventListener('click', skip);
        };
    }, [onComplete, skip]);

    const filled = Math.round((progress / 100) * BAR_BLOCKS);
    const empty  = BAR_BLOCKS - filled;

    return (
        <motion.div
            className="loading-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
            <div className="ls-content">
                <div className="ls-brand">
                    RAHUL_OS_V2.0
                    <span className="ls-cursor">▋</span>
                </div>

                <div className="ls-lines">
                    {BOOT_LINES.slice(0, lineCount).map((line, i) => (
                        <motion.p
                            key={i}
                            className="ls-line"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.25 }}
                        >
                            <span className="ls-ts">[{line.ts}]</span>
                            <span className="ls-msg"> {line.msg}</span>
                        </motion.p>
                    ))}
                </div>

                <div className="ls-progress-row">
                    <span className="ls-bar">
                        {'█'.repeat(filled)}
                        <span className="ls-empty">{'░'.repeat(empty)}</span>
                    </span>
                    <span className="ls-pct">{Math.round(progress)}%</span>
                </div>

                <p className="ls-status">
                    {progress < 100 ? 'BOOTING...' : 'READY'}
                </p>

                <p className="ls-skip">press any key to skip</p>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
