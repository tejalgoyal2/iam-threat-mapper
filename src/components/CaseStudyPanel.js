import React, { useState, useRef } from 'react';

function CaseStudyPanel({ caseStudy, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  // Track that user has manually toggled — after that, ignore defaultExpanded
  const userToggled = useRef(false);

  if (!caseStudy) return null;

  const handleToggle = (e) => {
    // Prevent any event bubbling
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    userToggled.current = true;
    setIsExpanded(prev => !prev);
  };

  return (
    <div 
      className="border border-terminal-red/20 bg-terminal-dark/60 overflow-hidden h-full flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header — always visible, clickable */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggle(e); }}
        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-terminal-red/5 transition-colors flex-shrink-0 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[10px] tracking-widest uppercase text-terminal-red/60 flex-shrink-0">
            real-world breach
          </span>
          <span className="text-terminal-gray/30 flex-shrink-0">|</span>
          <span className="text-xs text-terminal-gray-light tracking-wider truncate">
            {caseStudy.title}
          </span>
        </div>
        <span className="text-terminal-red/40 text-xs font-mono flex-shrink-0 ml-2">
          [{isExpanded ? '−' : '+'}]
        </span>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-terminal-red/10 flex-1 overflow-y-auto">
          {/* Quick facts bar */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 py-3 text-[10px] tracking-wider">
            <div>
              <span className="text-terminal-gray/50">DATE: </span>
              <span className="text-terminal-gray-light">{caseStudy.date}</span>
            </div>
            <div>
              <span className="text-terminal-gray/50">VICTIM: </span>
              <span className="text-terminal-gray-light">{caseStudy.victim}</span>
            </div>
            <div>
              <span className="text-terminal-gray/50">THREAT ACTOR: </span>
              <span className="text-terminal-red">{caseStudy.attackGroup}</span>
            </div>
          </div>

          {/* What happened */}
          <div className="mb-3">
            <div className="text-[10px] tracking-widest text-terminal-gray/50 uppercase mb-1.5">
              {'>'} what happened
            </div>
            <p className="text-xs text-terminal-gray-light leading-relaxed">
              {caseStudy.summary}
            </p>
          </div>

          {/* Impact */}
          <div className="mb-3">
            <div className="text-[10px] tracking-widest text-terminal-red/50 uppercase mb-1.5">
              {'>'} impact
            </div>
            <p className="text-xs text-terminal-red/70 leading-relaxed">
              {caseStudy.impact}
            </p>
          </div>

          {/* Key lesson */}
          <div className="mb-3 border-l-2 border-terminal-green/30 pl-3">
            <div className="text-[10px] tracking-widest text-terminal-green/50 uppercase mb-1.5">
              {'>'} key takeaway
            </div>
            <p className="text-xs text-terminal-green-dim leading-relaxed">
              {caseStudy.keyLesson}
            </p>
          </div>

          {/* Sources */}
          <div>
            <div className="text-[10px] tracking-widest text-terminal-gray/40 uppercase mb-1.5">
              {'>'} sources
            </div>
            <div className="space-y-0.5">
              {caseStudy.sources.map((source, i) => (
                <div key={i} className="text-[10px] text-terminal-cyan/50 tracking-wider">
                  <span className="text-terminal-gray/30 mr-1.5">[{i + 1}]</span>
                  {source}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseStudyPanel;
