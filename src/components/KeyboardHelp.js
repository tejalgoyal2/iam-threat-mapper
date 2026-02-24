import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function KeyboardHelp({ isOpen, onClose }) {
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAssessment = location.pathname === '/assessment';
  const isAttackPaths = location.pathname === '/attack-paths';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-terminal-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="border border-terminal-green/30 bg-terminal-dark/95 p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-terminal-green font-display text-sm tracking-wider text-glow">
              KEYBOARD SHORTCUTS
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-terminal-gray hover:text-terminal-green text-xs font-mono transition-colors"
          >
            [ESC]
          </button>
        </div>

        {/* Global shortcuts */}
        <div className="mb-4">
          <div className="text-[10px] tracking-widest text-terminal-gray/50 uppercase mb-2">
            {'>'} global
          </div>
          <div className="space-y-1.5">
            <ShortcutRow keys="?" desc="Toggle this help panel" />
            <ShortcutRow keys="1" desc="Navigate to Home" />
            <ShortcutRow keys="2" desc="Navigate to Attack Paths" />
            <ShortcutRow keys="3" desc="Navigate to Assessment" />
            <ShortcutRow keys="4" desc="Navigate to About" />
            <ShortcutRow keys="Esc" desc="Close panels / overlays" />
          </div>
        </div>

        {/* Attack Paths shortcuts */}
        {isAttackPaths && (
          <div className="mb-4">
            <div className="text-[10px] tracking-widest text-terminal-cyan/50 uppercase mb-2">
              {'>'} attack paths
            </div>
            <div className="space-y-1.5">
              <ShortcutRow keys="← →" desc="Navigate between nodes" />
              <ShortcutRow keys="Esc" desc="Deselect current node" />
            </div>
          </div>
        )}

        {/* Assessment shortcuts */}
        {isAssessment && (
          <div className="mb-4">
            <div className="text-[10px] tracking-widest text-terminal-amber/50 uppercase mb-2">
              {'>'} assessment
            </div>
            <div className="space-y-1.5">
              <ShortcutRow keys="1-4" desc="Select answer option" />
              <ShortcutRow keys="Enter / →" desc="Next question" />
              <ShortcutRow keys="←" desc="Previous question" />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-terminal-border/30 text-[9px] text-terminal-gray/30 tracking-wider text-center">
          terminal-native navigation // press ? to toggle
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({ keys, desc }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-terminal-gray tracking-wider">{desc}</span>
      <div className="flex gap-1">
        {keys.split(' ').map((k, i) => (
          <span
            key={i}
            className="text-[10px] px-1.5 py-0.5 border border-terminal-green/20 bg-terminal-green/5 text-terminal-green tracking-wider font-mono min-w-[24px] text-center"
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

export default KeyboardHelp;
