import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AttackPaths from './pages/AttackPaths';
import Assessment from './pages/Assessment';
import About from './pages/About';
import NotFound from './pages/NotFound';
import KeyboardHelp from './components/KeyboardHelp';
import useGlobalKeyboard from './hooks/useGlobalKeyboard';
import usePageTitle from './hooks/usePageTitle';

function AppContent() {
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = useCallback(() => {
    setShowHelp((prev) => !prev);
  }, []);

  useGlobalKeyboard({ onToggleHelp: toggleHelp });
  usePageTitle();

  return (
    <div className="scanline-overlay noise-overlay min-h-screen bg-terminal-black">
      <Layout onHelpToggle={toggleHelp}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/attack-paths" element={<AttackPaths />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <KeyboardHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
