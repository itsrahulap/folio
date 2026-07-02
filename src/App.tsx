import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Terminal from './components/Terminal/Terminal';
import PortfolioView from './components/PortfolioView/PortfolioView';
import ModeSwitch, { ViewMode } from './components/ModeSwitch/ModeSwitch';
import './styles/global.scss';

const App: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<ViewMode>('terminal');
    const handleComplete = useCallback(() => setLoading(false), []);

    return (
        <ThemeProvider>
            <div className="scanline" aria-hidden="true" />

            <AnimatePresence>
                {loading && (
                    <LoadingScreen key="loader" onComplete={handleComplete} />
                )}
            </AnimatePresence>

            {!loading && (
                <>
                    <ModeSwitch mode={view} onChange={setView} />
                    <div style={{ display: view === 'terminal' ? 'contents' : 'none' }}>
                        <Terminal onSwitchToGui={() => setView('gui')} />
                    </div>
                    <div style={{ display: view === 'gui' ? 'contents' : 'none' }}>
                        <PortfolioView />
                    </div>
                </>
            )}
        </ThemeProvider>
    );
};

export default App;
