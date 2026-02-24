import React from 'react';

const severityConfig = {
  CRITICAL: { color: 'text-terminal-red', glow: 'text-glow-red' },
  HIGH: { color: 'text-terminal-amber', glow: 'text-glow-amber' },
  MEDIUM: { color: 'text-terminal-cyan', glow: 'text-glow-cyan' },
};

function ScenarioSelector({ scenarios, activeScenarioId, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {scenarios.map((scenario, index) => {
        const isActive = scenario.id === activeScenarioId;
        const sevConfig = severityConfig[scenario.severity] || severityConfig.HIGH;

        return (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario.id)}
            className={`
              text-left border p-4 transition-all relative overflow-hidden
              ${isActive
                ? 'border-terminal-green/50 bg-terminal-green/5 box-glow'
                : 'border-terminal-border bg-terminal-dark/40 hover:border-terminal-green/20 box-glow-hover'
              }
            `}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute top-0 left-0 w-full h-0.5 bg-terminal-green shadow-[0_0_8px_#00ff41]"></div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-terminal-gray/50 tracking-widest">
                SCENARIO {String(index + 1).padStart(2, '0')}
              </span>
              <span className={`text-[9px] tracking-widest font-bold ${sevConfig.color}`}>
                {scenario.severity}
              </span>
            </div>

            {/* Title */}
            <div className={`text-xs tracking-wider font-display mb-1.5 ${isActive ? 'text-terminal-green text-glow' : 'text-terminal-white'}`}>
              {scenario.title.toUpperCase()}
            </div>

            {/* Subtitle */}
            <p className="text-[10px] text-terminal-gray leading-relaxed">
              {scenario.subtitle}
            </p>

            {/* Node count */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[9px] text-terminal-gray/40 tracking-wider">
                {scenario.nodes.length} NODES
              </span>
              <span className="text-terminal-gray/20">|</span>
              <span className="text-[9px] text-terminal-gray/40 tracking-wider">
                {scenario.mitre_tactics.length} TACTICS
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ScenarioSelector;
