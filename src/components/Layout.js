import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'HOME', shortcut: '01' },
  { path: '/attack-paths', label: 'ATTACK_PATHS', shortcut: '02' },
  { path: '/assessment', label: 'ASSESSMENT', shortcut: '03' },
  { path: '/about', label: 'ABOUT', shortcut: '04' },
];

function Layout({ children, onHelpToggle }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* TOP BAR */}
      <header className="border-b border-terminal-border bg-terminal-dark/90 backdrop-blur-sm sticky top-0 z-50">
        {/* System status bar */}
        <div className="border-b border-terminal-border/50 px-4 py-1 flex justify-between items-center text-[10px] tracking-widest uppercase text-terminal-gray">
          <span>sys::iam-threat-mapper v1.0.0</span>
          <div className="flex items-center gap-4">
            {/* Keyboard hint */}
            <button
              onClick={onHelpToggle}
              className="hidden sm:flex items-center gap-1.5 text-terminal-gray/40 hover:text-terminal-green/60 transition-colors"
            >
              <span className="px-1 py-0 border border-terminal-gray/20 text-[9px]">?</span>
              <span className="text-[9px]">shortcuts</span>
            </button>
            <span className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-terminal-green animate-glow-pulse"></span>
              <span className="text-terminal-green-dim">online</span>
            </span>
          </div>
        </div>

        {/* Main nav */}
        <nav className="px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 border border-terminal-green/60 flex items-center justify-center text-terminal-green font-bold text-sm box-glow group-hover:border-terminal-green transition-all">
              TM
            </div>
            <div className="hidden sm:block">
              <div className="text-terminal-green font-display text-sm tracking-wider text-glow">
                IAM THREAT MAPPER
              </div>
              <div className="text-[9px] text-terminal-gray tracking-[0.3em]">
                IDENTITY ATTACK SURFACE ANALYSIS
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    px-3 py-1.5 text-xs tracking-wider font-mono transition-all relative
                    ${isActive
                      ? 'text-terminal-green text-glow'
                      : 'text-terminal-gray hover:text-terminal-green-dim'
                    }
                  `}
                >
                  <span className="text-terminal-gray/40 mr-1.5">[{item.shortcut}]</span>
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-terminal-green shadow-[0_0_4px_#00ff41]"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-terminal-green text-sm font-mono"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            [{mobileMenuOpen ? 'CLOSE' : 'MENU'}]
          </button>
        </nav>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-terminal-border px-4 py-2 bg-terminal-dark">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    block py-2 text-xs tracking-wider font-mono
                    ${isActive
                      ? 'text-terminal-green text-glow'
                      : 'text-terminal-gray hover:text-terminal-green-dim'
                    }
                  `}
                >
                  <span className="text-terminal-gray/40 mr-2">{'>>'}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-terminal-grid">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-terminal-border bg-terminal-dark/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] tracking-wider uppercase text-terminal-gray">
          <span>
            <span className="text-terminal-green-dim">root@threat-mapper</span>
            <span className="text-terminal-gray/40">:</span>
            <span className="text-terminal-cyan">~</span>
            <span className="text-terminal-gray/40">$ </span>
            <span className="animate-cursor-blink">_</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-terminal-gray/30 hidden sm:inline">
              press <span className="text-terminal-green/40">?</span> for keyboard shortcuts
            </span>
            <span>
              Built for defensive security analysis // Not affiliated with any vendor
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
