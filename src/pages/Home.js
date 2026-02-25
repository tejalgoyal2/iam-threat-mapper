import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Generate random hex string
const randHex = (len) =>
  Array.from({ length: len }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

// Boot sequence lines — trimmed to fit without internal scroll
const bootSequence = [
  { type: 'system', text: `BIOS POST... OK`, delay: 0 },
  { type: 'memory', text: `MEM 0x${randHex(8)}...0x${randHex(8)} — ALLOC ${Math.floor(Math.random() * 512) + 256}MB`, delay: 200 },
  { type: 'divider', delay: 150 },
  { type: 'init', text: 'INITIALIZING IAM THREAT MAPPER v1.0.0', delay: 200 },
  { type: 'divider', delay: 300 },
  { type: 'load', text: 'Loading identity attack surface database', delay: 350, progress: true },
  { type: 'load', text: 'Loading MITRE ATT&CK technique mappings', delay: 550, progress: true },
  { type: 'error', text: `ERR: Connection timeout at 0x${randHex(4)} — retrying...`, delay: 750 },
  { type: 'retry', text: 'Reconnected. Resuming module load.', delay: 950 },
  { type: 'load', text: 'Calibrating maturity assessment engine', delay: 1050, progress: true },
  { type: 'load', text: 'Mapping IAM control frameworks (NIST/CIS)', delay: 1250, progress: true },
  { type: 'divider', delay: 1400 },
  { type: 'success', text: '[OK] 5 scenarios // 32 nodes // 18 MITRE techniques', delay: 1450 },
  { type: 'success', text: '[OK] All modules operational', delay: 1550 },
  { type: 'divider', delay: 1650 },
  { type: 'access', text: 'ACCESS GRANTED', delay: 1700 },
];

// Simulated progress bar component
function ProgressBar({ duration = 180 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = 12;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setProgress(current);
      if (current >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [duration]);

  const filled = '█'.repeat(progress);
  const empty = '░'.repeat(12 - progress);
  const pct = Math.round((progress / 12) * 100);

  return (
    <span className="text-terminal-green-dim ml-2">
      [{filled}{empty}] {pct}%
    </span>
  );
}

function Home() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem('iam-tm-booted');
    if (hasBooted) {
      setVisibleLines(bootSequence);
      setBootComplete(true);
      setShowContent(true);
      return;
    }

    const timers = [];

    bootSequence.forEach((line, i) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, { ...line, index: i }]);

        if (i === bootSequence.length - 1) {
          const completeTimer = setTimeout(() => {
            setBootComplete(true);
            sessionStorage.setItem('iam-tm-booted', 'true');
            const contentTimer = setTimeout(() => setShowContent(true), 200);
            timers.push(contentTimer);
          }, 350);
          timers.push(completeTimer);
        }
      }, line.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const renderLine = (line, i) => {
    // Count only non-divider lines for line numbers
    const lineNum = String(i + 1).padStart(2, '0');

    switch (line.type) {
      case 'system':
        return (
          <div key={i} className="flex">
            <span className="text-terminal-gray/30 mr-3 select-none w-5">{lineNum}</span>
            <span className="text-terminal-gray">{line.text}</span>
          </div>
        );

      case 'memory':
        return (
          <div key={i} className="flex">
            <span className="text-terminal-gray/30 mr-3 select-none w-5">{lineNum}</span>
            <span className="text-terminal-cyan/50">{line.text}</span>
          </div>
        );

      case 'init':
        return (
          <div key={i} className="flex">
            <span className="text-terminal-gray/30 mr-3 select-none w-5">{lineNum}</span>
            <span className="text-terminal-green font-bold text-glow">{line.text}</span>
          </div>
        );

      case 'load':
        return (
          <div key={i} className="flex">
            <span className="text-terminal-gray/30 mr-3 select-none w-5">{lineNum}</span>
            <span className="text-terminal-gray-light">{line.text}...</span>
            {line.progress && <ProgressBar duration={160} />}
          </div>
        );

      case 'error':
        return (
          <div key={i} className="flex">
            <span className="text-terminal-gray/30 mr-3 select-none w-5">{lineNum}</span>
            <span className="text-terminal-red text-glow-red">{line.text}</span>
          </div>
        );

      case 'retry':
        return (
          <div key={i} className="flex">
            <span className="text-terminal-gray/30 mr-3 select-none w-5">{lineNum}</span>
            <span className="text-terminal-amber">{line.text}</span>
          </div>
        );

      case 'success':
        return (
          <div key={i} className="flex">
            <span className="text-terminal-gray/30 mr-3 select-none w-5">{lineNum}</span>
            <span className="text-terminal-green">{line.text}</span>
          </div>
        );

      case 'access':
        return (
          <div key={i} className="flex items-center mt-1">
            <span className="text-terminal-gray/30 mr-3 select-none w-5">{lineNum}</span>
            <span className="inline-block px-3 py-0.5 border border-terminal-green text-terminal-green font-bold text-glow tracking-widest animate-glow-pulse">
              {line.text}
            </span>
          </div>
        );

      case 'divider':
        return (
          <div key={i} className="h-1"></div>
        );

      default:
        return (
          <div key={i} className="flex">
            <span className="text-terminal-gray/30 mr-3 select-none w-5">{lineNum}</span>
            <span className="text-terminal-gray">{line.text}</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Boot sequence — no internal scroll */}
      <div className="mb-8 border border-terminal-border bg-terminal-dark/60 rounded-sm overflow-hidden">
        {/* Terminal header bar */}
        <div className="border-b border-terminal-border/50 px-4 py-1.5 flex items-center justify-between bg-terminal-panel/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terminal-red/60"></span>
            <span className="w-2 h-2 rounded-full bg-terminal-amber/60"></span>
            <span className="w-2 h-2 rounded-full bg-terminal-green/60"></span>
          </div>
          <span className="text-[9px] text-terminal-gray/40 tracking-widest">
            iam-threat-mapper — boot sequence
          </span>
          <span className="text-[9px] text-terminal-gray/40">
            {bootComplete ? 'COMPLETE' : 'RUNNING...'}
          </span>
        </div>

        {/* Boot log — no max-height, no overflow, everything visible */}
        <div className="p-4 font-mono text-xs leading-relaxed">
          {visibleLines.map((line, i) => renderLine(line, i))}
          {!bootComplete && (
            <div className="flex mt-1">
              <span className="text-terminal-green animate-cursor-blink">█</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content - appears after boot */}
      {showContent && (
        <div className="animate-fade-up">
          {/* Hero */}
          <div className="mb-12">
            <h1 className="font-display text-3xl sm:text-4xl text-terminal-green text-glow tracking-wider mb-4">
              IAM THREAT MAPPER
            </h1>
            <p className="text-terminal-gray-light text-sm leading-relaxed max-w-2xl">
              Visualize identity-based attack chains and assess your IAM security
              maturity. Understand how attackers exploit identity infrastructure —
              and where your defenses break down.
            </p>
          </div>

          {/* Two main modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {/* Attack Path Card */}
            <Link
              to="/attack-paths"
              className="group block border border-terminal-border bg-terminal-panel/40 p-6 
                         hover:border-terminal-green/40 transition-all box-glow-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-[10px] tracking-widest text-terminal-gray uppercase">
                  module::01
                </div>
                <div className="text-terminal-green/40 group-hover:text-terminal-green text-xs transition-colors">
                  {'>>'}
                </div>
              </div>
              <h2 className="font-display text-lg text-terminal-green tracking-wider mb-2 group-hover:text-glow transition-all">
                ATTACK PATH VISUALIZER
              </h2>
              <p className="text-terminal-gray text-xs leading-relaxed mb-4">
                Interactive node graphs showing how identity attacks chain together.
                See how compromised credentials escalate through your environment.
              </p>
              <div className="flex flex-wrap gap-2">
                {['credential theft', 'privilege escalation', 'lateral movement', 'MFA bypass'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 border border-terminal-border text-terminal-gray-light 
                               tracking-wider uppercase group-hover:border-terminal-green/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>

            {/* Assessment Card */}
            <Link
              to="/assessment"
              className="group block border border-terminal-border bg-terminal-panel/40 p-6 
                         hover:border-terminal-amber/40 transition-all 
                         hover:shadow-[0_0_4px_#ffb00030,inset_0_0_2px_#ffb00020]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-[10px] tracking-widest text-terminal-gray uppercase">
                  module::02
                </div>
                <div className="text-terminal-amber/40 group-hover:text-terminal-amber text-xs transition-colors">
                  {'>>'}
                </div>
              </div>
              <h2 className="font-display text-lg text-terminal-amber tracking-wider mb-2 group-hover:text-glow-amber transition-all">
                IAM MATURITY ASSESSMENT
              </h2>
              <p className="text-terminal-gray text-xs leading-relaxed mb-4">
                Evaluate your identity security posture against industry frameworks.
                Get a maturity score mapped to real attack vulnerabilities.
              </p>
              <div className="flex flex-wrap gap-2">
                {['MFA coverage', 'access reviews', 'breakglass', 'device trust'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 border border-terminal-border text-terminal-gray-light 
                               tracking-wider uppercase group-hover:border-terminal-amber/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="border border-terminal-border bg-terminal-dark/40 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'ATTACK SCENARIOS', value: '5', color: 'text-terminal-red' },
              { label: 'ATTACK NODES', value: '32', color: 'text-terminal-green' },
              { label: 'MITRE TECHNIQUES', value: '18', color: 'text-terminal-cyan' },
              { label: 'ASSESSMENT Qs', value: '20', color: 'text-terminal-amber' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`font-display text-2xl ${stat.color} tracking-wider`}>
                  {stat.value}
                </div>
                <div className="text-[9px] text-terminal-gray tracking-widest uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-[10px] text-terminal-gray/50 tracking-wider text-center uppercase">
            // educational tool for defensive security — does not provide real-time threat intelligence
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
