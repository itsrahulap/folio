import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Terminal from './components/Terminal/Terminal';
import './styles/global.scss';

const App: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const handleComplete = useCallback(() => setLoading(false), []);

    return (
        <ThemeProvider>
            <div className="scanline" aria-hidden="true" />

            <AnimatePresence>
                {loading && (
                    <LoadingScreen key="loader" onComplete={handleComplete} />
                )}
            </AnimatePresence>

            {!loading && <Terminal />}
        </ThemeProvider>
    );
};

export default App;
