import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="font-display text-6xl text-terminal-red text-glow-red tracking-wider mb-4">
        404
      </div>
      <div className="text-[10px] tracking-widest text-terminal-gray uppercase mb-6">
        err: path not found in filesystem
      </div>
      <div className="border border-terminal-border bg-terminal-dark/40 p-5 mb-8 inline-block text-left">
        <div className="text-xs font-mono text-terminal-gray-light">
          <span className="text-terminal-green-dim">root@threat-mapper</span>
          <span className="text-terminal-gray/40">:</span>
          <span className="text-terminal-cyan">~</span>
          <span className="text-terminal-gray/40">$ </span>
          <span className="text-terminal-red">cd {window.location.pathname}</span>
        </div>
        <div className="text-xs font-mono text-terminal-red mt-1">
          bash: cd: {window.location.pathname}: No such file or directory
        </div>
      </div>
      <div>
        <Link
          to="/"
          className="px-6 py-2 border border-terminal-green/50 text-terminal-green text-xs tracking-widest 
                     uppercase font-display hover:bg-terminal-green/10 transition-all"
        >
          {'>'} return to home {'<'}
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
