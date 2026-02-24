import React, { useRef, useEffect, useCallback } from 'react';
import cytoscape from 'cytoscape';

const statusColors = {
  entry: { bg: '#0a2a3a', border: '#00d4ff', text: '#00d4ff' },
  exploited: { bg: '#2a0a0a', border: '#ff3333', text: '#ff3333' },
  blocked: { bg: '#0a2a0e', border: '#00ff41', text: '#00ff41' },
  partial: { bg: '#2a1f0a', border: '#ffb000', text: '#ffb000' },
};

function AttackGraph({ scenario, onNodeSelect, onBackgroundClick, selectedNodeId }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  const handleNodeTap = useCallback(
    (evt) => {
      const nodeId = evt.target.id();
      const nodeData = scenario.nodes.find((n) => n.id === nodeId);
      if (nodeData) {
        onNodeSelect(nodeData);
      }
    },
    [scenario, onNodeSelect]
  );

  useEffect(() => {
    if (!containerRef.current || !scenario) return;

    const elements = [];

    scenario.nodes.forEach((node, index) => {
      elements.push({
        data: {
          id: node.id,
          label: node.label,
          status: node.status,
          index: index + 1,
        },
      });
    });

    scenario.edges.forEach((edge, index) => {
      elements.push({
        data: {
          id: `edge-${index}`,
          source: edge.source,
          target: edge.target,
        },
      });
    });

    // Determine if graph has branching (non-linear)
    const hasBranching = scenario.edges.some((edge) => {
      const sourceEdgeCount = scenario.edges.filter((e) => e.source === edge.source).length;
      return sourceEdgeCount > 1;
    });

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      minZoom: 0.4,
      maxZoom: 2.5,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': '160px',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-family': '"IBM Plex Mono", monospace',
            'font-size': '10px',
            'font-weight': '500',
            color: '#c9d1d9',
            'background-color': '#111820',
            'border-width': 2,
            'border-color': '#1a2332',
            width: 180,
            height: 80,
            shape: 'round-rectangle',
            'corner-radius': 4,
            'overlay-padding': '6px',
            'transition-property': 'border-color, border-width, background-color, opacity',
            'transition-duration': '0.25s',
          },
        },
        {
          selector: 'node[status="entry"]',
          style: {
            'background-color': statusColors.entry.bg,
            'border-color': statusColors.entry.border,
            color: statusColors.entry.text,
            'border-width': 2.5,
          },
        },
        {
          selector: 'node[status="exploited"]',
          style: {
            'background-color': statusColors.exploited.bg,
            'border-color': statusColors.exploited.border,
            color: statusColors.exploited.text,
            'border-width': 2,
          },
        },
        {
          selector: 'node[status="blocked"]',
          style: {
            'background-color': statusColors.blocked.bg,
            'border-color': statusColors.blocked.border,
            color: statusColors.blocked.text,
            'border-width': 2,
          },
        },
        {
          selector: 'node[status="partial"]',
          style: {
            'background-color': statusColors.partial.bg,
            'border-color': statusColors.partial.border,
            color: statusColors.partial.text,
            'border-width': 2,
          },
        },
        {
          selector: 'node:active, node:selected',
          style: {
            'border-width': 3.5,
            'overlay-color': '#00ff41',
            'overlay-opacity': 0.08,
          },
        },
        {
          selector: 'node:hover',
          style: {
            'border-width': 3,
            cursor: 'pointer',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2.5,
            'line-color': '#1a2332',
            'target-arrow-color': '#ff333360',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1.3,
            'curve-style': 'bezier',
            'line-style': 'solid',
            opacity: 0.6,
            'transition-property': 'line-color, opacity, width',
            'transition-duration': '0.25s',
          },
        },
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 50,
        spacingFactor: hasBranching ? 1.3 : 1.2,
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true,
        // Horizontal layout — roots on left, flows right
        circle: false,
        grid: false,
        // This makes it horizontal
        transform: (node, position) => {
          return { x: position.y, y: position.x };
        },
      },
    });

    // Color edges based on source node status
    cy.edges().forEach((edge) => {
      const sourceNode = edge.source();
      const sourceStatus = sourceNode.data('status');
      const colors = statusColors[sourceStatus] || statusColors.exploited;
      edge.style({
        'line-color': colors.border + '30',
        'target-arrow-color': colors.border + '70',
      });
    });

    cy.on('tap', 'node', handleNodeTap);

    cy.on('tap', function (evt) {
      if (evt.target === cy) {
        if (onBackgroundClick) onBackgroundClick();
      }
    });

    cyRef.current = cy;

    // Fit with padding, then ensure minimum readable zoom
    cy.fit(undefined, 40);
    const currentZoom = cy.zoom();
    if (currentZoom < 0.65) {
      cy.zoom({ level: 0.65, position: cy.nodes().first().position() });
      cy.center();
    }

    return () => {
      cy.destroy();
    };
  }, [scenario, handleNodeTap, onBackgroundClick]);

  // Highlight selected node and auto-center
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    // Reset all
    cy.nodes().style('opacity', 1);
    cy.edges().style('opacity', 0.6);
    cy.nodes().forEach((node) => {
      const status = node.data('status');
      const colors = statusColors[status] || statusColors.exploited;
      node.style('border-width', status === 'entry' ? 2.5 : 2);
      node.style('border-color', colors.border);
    });

    if (selectedNodeId) {
      const selected = cy.getElementById(selectedNodeId);
      if (selected.length) {
        selected.style('border-width', 4);

        // Dim non-connected nodes
        const connected = selected.neighborhood().nodes().union(selected);
        cy.nodes().not(connected).style('opacity', 0.25);
        connected.style('opacity', 1);

        cy.edges().style('opacity', 0.1);
        selected.connectedEdges().style('opacity', 0.9);
        selected.connectedEdges().style('width', 3.5);

        // Animate to center on selected node
        cy.animate({
          center: { eles: selected },
          duration: 300,
          easing: 'ease-out',
        });
      }
    } else {
      // Reset zoom to fit all
      cy.animate({
        fit: { eles: cy.nodes(), padding: 40 },
        duration: 300,
        easing: 'ease-out',
      });
    }
  }, [selectedNodeId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px]"
      style={{ background: 'transparent' }}
    />
  );
}

export default AttackGraph;
