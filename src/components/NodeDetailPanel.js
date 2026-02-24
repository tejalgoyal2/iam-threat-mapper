import React from 'react';

const statusConfig = {
  entry: {
    label: 'ENTRY POINT',
    color: 'text-terminal-cyan',
    borderColor: 'border-terminal-cyan/40',
    bgColor: 'bg-terminal-cyan/5',
    glowClass: 'text-glow-cyan',
  },
  exploited: {
    label: 'EXPLOITED',
    color: 'text-terminal-red',
    borderColor: 'border-terminal-red/40',
    bgColor: 'bg-terminal-red/5',
    glowClass: 'text-glow-red',
  },
  blocked: {
    label: 'BLOCKED',
    color: 'text-terminal-green',
    borderColor: 'border-terminal-green/40',
    bgColor: 'bg-terminal-green/5',
    glowClass: 'text-glow',
  },
  partial: {
    label: 'PARTIAL MITIGATION',
    color: 'text-terminal-amber',
    borderColor: 'border-terminal-amber/40',
    bgColor: 'bg-terminal-amber/5',
    glowClass: 'text-glow-amber',
  },
};

function NodeDetailPanel({ node, onClose }) {
  if (!node) return null;

  const config = statusConfig[node.status] || statusConfig.exploited;

  return (
    <div className={`border ${config.borderColor} ${config.bgColor} bg-terminal-dark/90 backdrop-blur-sm overflow-hidden`}>
      {/* Header */}
      <div className={`border-b ${config.borderColor} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] tracking-widest uppercase ${config.color} ${config.glowClass}`}>
            {config.label}
          </span>
          <span className="text-terminal-gray/30">|</span>
          <span className="text-[10px] tracking-wider text-terminal-gray">
            {node.id.toUpperCase()}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-terminal-gray hover:text-terminal-green text-xs font-mono transition-colors"
        >
          [X]
        </button>
      </div>

      {/* Node title */}
      <div className="px-4 py-3 border-b border-terminal-border/30">
        <h3 className={`font-display text-sm tracking-wider ${config.color}`}>
          {node.label.replace(/\n/g, ' ')}
        </h3>
      </div>

      {/* Details */}
      <div className="px-4 py-3 space-y-4">
        {/* What happened */}
        <div>
          <div className="text-[10px] tracking-widest text-terminal-gray/60 uppercase mb-1.5">
            {'>'} what happened
          </div>
          <p className="text-xs text-terminal-gray-light leading-relaxed">
            {node.details.what}
          </p>
        </div>

        {/* Missing control */}
        <div>
          <div className="text-[10px] tracking-widest text-terminal-red/60 uppercase mb-1.5">
            {'>'} missing control
          </div>
          <p className="text-xs text-terminal-red/80 leading-relaxed">
            {node.details.missing}
          </p>
        </div>

        {/* What would block it */}
        <div>
          <div className="text-[10px] tracking-widest text-terminal-green/60 uppercase mb-1.5">
            {'>'} blocked by
          </div>
          <p className="text-xs text-terminal-green-dim leading-relaxed">
            {node.details.blockedBy}
          </p>
        </div>

        {/* MITRE ATT&CK reference */}
        <div className="pt-2 border-t border-terminal-border/20">
          <div className="text-[10px] tracking-widest text-terminal-gray/60 uppercase mb-1.5">
            {'>'} mitre att&ck
          </div>
          <span className="inline-block text-[10px] px-2 py-0.5 border border-terminal-cyan/30 text-terminal-cyan tracking-wider">
            {node.details.mitre}
          </span>
        </div>
      </div>
    </div>
  );
}

export default NodeDetailPanel;
