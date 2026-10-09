import React, { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Terminal from './components/Terminal/Terminal';
import PortfolioView from './components/PortfolioView/PortfolioView';
import ModeSwitch, { ViewMode } from './components/ModeSwitch/ModeSwitch';
import './styles/global.scss';

const BOOTED_KEY = 'booted';

// Show the boot screen only on the first visit of a session, and never for reduced motion.
const shouldShowLoader = () => {
    try {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
        return !sessionStorage.getItem(BOOTED_KEY);
    } catch {
        return true;
    }
};

const App: React.FC = () => {
    const [loading, setLoading] = useState(shouldShowLoader);
    const [view, setView] = useState<ViewMode>('terminal');
    const handleComplete = useCallback(() => {
        try { sessionStorage.setItem(BOOTED_KEY, '1'); } catch { /* storage blocked */ }
        setLoading(false);
    }, []);

    return (
        <ThemeProvider>
            {loading ? (
                <LoadingScreen onComplete={handleComplete} />
            ) : (
                <>
                    <ModeSwitch mode={view} onChange={setView} />
                    <div id="panel-terminal" role="tabpanel" aria-labelledby="tab-terminal" style={{ display: view === 'terminal' ? 'contents' : 'none' }}>
                        <Terminal onSwitchToGui={() => setView('gui')} />
                    </div>
                    <div id="panel-gui" role="tabpanel" aria-labelledby="tab-gui" style={{ display: view === 'gui' ? 'contents' : 'none' }}>
                        <PortfolioView />
                    </div>
                </>
            )}
        </ThemeProvider>
    );
};

export default App;
