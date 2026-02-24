import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import attackScenarios from '../data/attackScenarios';
import AttackGraph from '../components/AttackGraph';
import NodeDetailPanel from '../components/NodeDetailPanel';
import ScenarioSelector from '../components/ScenarioSelector';
import CaseStudyPanel from '../components/CaseStudyPanel';

function AttackPaths() {
  const [searchParams] = useSearchParams();
  const scenarioParam = searchParams.get('scenario');
  const initialScenario = scenarioParam && attackScenarios.find(s => s.id === scenarioParam)
    ? scenarioParam
    : attackScenarios[0].id;

  const [activeScenarioId, setActiveScenarioId] = useState(initialScenario);
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedFromAssessment, setHighlightedFromAssessment] = useState(!!scenarioParam);

  const activeScenario = attackScenarios.find((s) => s.id === activeScenarioId);

  const handleScenarioChange = (id) => {
    setActiveScenarioId(id);
    setSelectedNode(null);
    setHighlightedFromAssessment(false);
  };

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handleNodeDeselect = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Keyboard navigation for Attack Paths
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!activeScenario) return;

      const nodes = activeScenario.nodes;

      // Esc — deselect node
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedNode(null);
        return;
      }

      // Left/Right arrows — navigate nodes
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIdx = selectedNode
          ? nodes.findIndex((n) => n.id === selectedNode.id)
          : -1;

        if (e.key === 'ArrowRight') {
          const nextIdx = currentIdx < nodes.length - 1 ? currentIdx + 1 : 0;
          setSelectedNode(nodes[nextIdx]);
        } else {
          const prevIdx = currentIdx > 0 ? currentIdx - 1 : nodes.length - 1;
          setSelectedNode(nodes[prevIdx]);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScenario, selectedNode]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="text-[10px] tracking-widest text-terminal-gray uppercase mb-2">
          module::01 // attack surface visualization
        </div>
        <h1 className="font-display text-2xl text-terminal-green text-glow tracking-wider mb-2">
          ATTACK PATH VISUALIZER
        </h1>
        <p className="text-terminal-gray-light text-xs max-w-2xl">
          Select an attack scenario to visualize how identity-based threats
          chain together. Click any node to inspect the attack step, missing
          controls, and recommended defenses.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="mb-6">
        <div className="text-[10px] tracking-widest text-terminal-gray/50 uppercase mb-3">
          {'>'} select attack scenario
        </div>
        <ScenarioSelector
          scenarios={attackScenarios}
          activeScenarioId={activeScenarioId}
          onSelect={handleScenarioChange}
        />
      </div>

      {/* Active scenario info bar */}
      {activeScenario && (
        <div className="mb-4 border border-terminal-border bg-terminal-dark/60 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-terminal-green font-display text-sm tracking-wider text-glow">
              {activeScenario.title.toUpperCase()}
            </span>
            <p className="text-[10px] text-terminal-gray tracking-wider mt-1">
              {activeScenario.description}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {activeScenario.mitre_tactics.map((tactic) => (
              <span
                key={tactic}
                className="text-[9px] px-1.5 py-0.5 border border-terminal-cyan/20 text-terminal-cyan/60 tracking-wider whitespace-nowrap"
              >
                {tactic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Assessment referral banner */}
      {highlightedFromAssessment && (
        <div className="mb-4 border border-terminal-amber/30 bg-terminal-amber/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-widest text-terminal-amber uppercase">
              from assessment
            </span>
            <span className="text-terminal-gray/30">|</span>
            <span className="text-xs text-terminal-gray-light">
              Your assessment results identified this scenario as a vulnerability. Explore the attack chain to understand your exposure.
            </span>
          </div>
          <button
            onClick={() => setHighlightedFromAssessment(false)}
            className="text-terminal-amber/40 text-xs font-mono hover:text-terminal-amber transition-colors flex-shrink-0 ml-2"
          >
            [X]
          </button>
        </div>
      )}

      {/* GRAPH — Full width, fixed height */}
      <div className="mb-4 border border-terminal-border bg-terminal-dark/30 relative" style={{ height: '320px' }}>
        {/* Legend */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-3 text-[9px] tracking-wider uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-[#00d4ff] bg-[#0a2a3a]"></span>
            <span className="text-terminal-gray">Entry</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-[#ff3333] bg-[#2a0a0a]"></span>
            <span className="text-terminal-gray">Exploited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-[#ffb000] bg-[#2a1f0a]"></span>
            <span className="text-terminal-gray">Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-[#00ff41] bg-[#0a2a0e]"></span>
            <span className="text-terminal-gray">Blocked</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-3 left-3 z-10 text-[9px] text-terminal-gray/40 tracking-wider">
          click node for details // scroll to zoom // drag to pan // ←→ keyboard nav
        </div>

        {/* Step indicator */}
        {selectedNode && activeScenario && (
          <div className="absolute top-3 right-3 z-10 text-[10px] tracking-widest text-terminal-green/60 uppercase">
            step {activeScenario.nodes.findIndex(n => n.id === selectedNode.id) + 1} of {activeScenario.nodes.length}
          </div>
        )}

        {/* Cytoscape */}
        {activeScenario && (
          <AttackGraph
            key={activeScenario.id}
            scenario={activeScenario}
            onNodeSelect={handleNodeSelect}
            onBackgroundClick={handleNodeDeselect}
            selectedNodeId={selectedNode?.id}
          />
        )}
      </div>

      {/* DETAILS — Full width, multi-column below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Node Detail Panel */}
        <div className="lg:col-span-1">
          {selectedNode ? (
            <NodeDetailPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          ) : (
            <div className="border border-terminal-border/50 bg-terminal-dark/20 h-full min-h-[200px] flex flex-col items-center justify-center gap-3 p-6">
              <div className="text-terminal-gray/30 text-xs tracking-widest uppercase text-center">
                [ select a node ]
              </div>
              <div className="w-12 h-px bg-terminal-border/50"></div>
              <p className="text-[10px] text-terminal-gray/30 text-center leading-relaxed max-w-[200px]">
                Click any node in the attack graph above to view details about 
                the attack step, missing controls, and recommended defenses.
              </p>
            </div>
          )}
        </div>

        {/* Column 2: Attack Chain Summary */}
        {activeScenario && (
          <div className="lg:col-span-1">
            <div className="border border-terminal-border/50 bg-terminal-dark/20 p-4 h-full">
              <div className="text-[10px] tracking-widest text-terminal-gray/50 uppercase mb-3">
                {'>'} attack chain ({activeScenario.nodes.length} steps)
              </div>
              <div className="space-y-1">
                {activeScenario.nodes.map((node, index) => {
                  const isSelected = selectedNode?.id === node.id;
                  const nodeStatusColors = {
                    entry: 'text-terminal-cyan',
                    exploited: 'text-terminal-red',
                    blocked: 'text-terminal-green',
                    partial: 'text-terminal-amber',
                  };
                  const color = nodeStatusColors[node.status] || 'text-terminal-gray';

                  return (
                    <button
                      key={node.id}
                      onClick={() => handleNodeSelect(node)}
                      className={`
                        w-full text-left flex items-start gap-2 py-1.5 px-2 text-[10px] tracking-wider
                        transition-all rounded-sm
                        ${isSelected
                          ? 'bg-terminal-green/10 border-l-2 border-terminal-green'
                          : 'hover:bg-terminal-panel/40 border-l-2 border-transparent'
                        }
                      `}
                    >
                      <span className="text-terminal-gray/30 flex-shrink-0 w-4">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`${isSelected ? 'text-terminal-green' : color}`}>
                        {node.label.replace(/\n/g, ' ')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick legend */}
              <div className="mt-4 pt-3 border-t border-terminal-border/20 flex flex-wrap gap-x-4 gap-y-1 text-[9px] tracking-wider">
                <span className="text-terminal-cyan">entry point</span>
                <span className="text-terminal-gray/30">{'>'}</span>
                <span className="text-terminal-red">exploited</span>
                <span className="text-terminal-gray/30">{'>'}</span>
                <span className="text-terminal-amber">partial</span>
                <span className="text-terminal-gray/30">{'>'}</span>
                <span className="text-terminal-green">blocked</span>
              </div>
            </div>
          </div>
        )}

        {/* Column 3: Case Study — completely independent state */}
        {activeScenario?.caseStudy && (
          <div className="lg:col-span-1">
            <CaseStudyPanel
              key={`case-${activeScenario.id}`}
              caseStudy={activeScenario.caseStudy} 
              defaultExpanded={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AttackPaths;
