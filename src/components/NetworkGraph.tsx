import { useEffect, useRef, useCallback } from 'react';
import cytoscape, { type Core, type StylesheetStyle } from 'cytoscape';
import { Maximize2, RotateCcw } from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import { getChannelColor, CHANNEL_DEFINITIONS } from '../types';

const NODE_SIZE = 60;

function getNodeColor(
  nodeId: string,
  assignments: Record<string, string>,
  currentVertex: string | null,
  conflictVertex: string | null,
  status: string,
  solutionFound: boolean | null
): { bg: string; border: string; textColor: string } {
  // Final state
  if ((status === 'SUCCESS' || solutionFound === true) && assignments[nodeId]) {
    return {
      bg: getChannelColor(assignments[nodeId]),
      border: getChannelColor(assignments[nodeId]),
      textColor: '#fff',
    };
  }

  // Conflict
  if (nodeId === conflictVertex) {
    return { bg: '#FEE2E2', border: '#EF4444', textColor: '#991B1B' };
  }

  // Current vertex being processed
  if (nodeId === currentVertex) {
    return { bg: '#DBEAFE', border: '#2563EB', textColor: '#1E3A5F' };
  }

  // Assigned
  if (assignments[nodeId]) {
    return {
      bg: getChannelColor(assignments[nodeId]) + '30',
      border: getChannelColor(assignments[nodeId]),
      textColor: '#1E293B',
    };
  }

  // Unassigned
  return { bg: '#F1F5F9', border: '#CBD5E1', textColor: '#475569' };
}

export default function NetworkGraph() {
  const cyRef = useRef<Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const network = useSimulationStore((s) => s.network);
  const assignments = useSimulationStore((s) => s.assignments);
  const currentVertex = useSimulationStore((s) => s.currentVertex);
  const conflictVertex = useSimulationStore((s) => s.conflictVertex);
  const conflictEdge = useSimulationStore((s) => s.conflictEdge);
  const currentEvent = useSimulationStore((s) => s.currentEvent);
  const status = useSimulationStore((s) => s.status);
  const solutionFound = useSimulationStore((s) => s.solutionFound);
  const channels = useSimulationStore((s) => s.channels);

  // Build cytoscape elements
  const buildElements = useCallback(() => {
    const nodes = network.nodes.map((n) => ({
      data: {
        id: n.id,
        label: n.label,
      },
    }));
    const edges = network.edges.map((e, i) => ({
      data: {
        id: `e${i}-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
      },
    }));
    return [...nodes, ...edges];
  }, [network]);

  // Initialize cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    const style: StylesheetStyle[] = [
      {
        selector: 'node',
        style: {
          width: NODE_SIZE,
          height: NODE_SIZE,
          'background-color': '#F1F5F9',
          'border-width': 3,
          'border-color': '#CBD5E1',
          label: 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '13px',
          'font-weight': 600,
          'font-family': '"Inter", sans-serif',
          color: '#475569',
          'text-wrap': 'wrap',
          'text-max-width': '80px',
        },
      },
      {
        selector: 'edge',
        style: {
          width: 2,
          'line-color': '#CBD5E1',
          'curve-style': 'bezier',
          'line-style': 'solid',
        },
      },
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements: buildElements(),
      style,
      layout: { name: 'cose', animate: true, animationDuration: 600, padding: 40 },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: false,
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  // Update node styles when algorithm state changes
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.nodes().forEach((node) => {
      const nodeId = node.id();
      const colors = getNodeColor(nodeId, assignments, currentVertex, conflictVertex, status, solutionFound);

      const channelLabel = assignments[nodeId] ? `\n${assignments[nodeId]}` : '';
      const displayLabel = `${nodeId}${channelLabel}`;

      node.style({
        'background-color': colors.bg,
        'border-color': colors.border,
        'border-width': nodeId === currentVertex ? 4 : 3,
        color: colors.textColor,
        label: displayLabel,
      });
    });

    // Edge styles
    cy.edges().forEach((edge) => {
      const src = edge.source().id();
      const tgt = edge.target().id();

      let lineColor = '#CBD5E1';
      let width = 2;

      if (
        conflictEdge &&
        ((src === conflictEdge[0] && tgt === conflictEdge[1]) ||
          (src === conflictEdge[1] && tgt === conflictEdge[0]))
      ) {
        lineColor = '#EF4444';
        width = 4;
      } else if (
        currentVertex &&
        (src === currentVertex || tgt === currentVertex) &&
        currentEvent?.type !== 'BACKTRACK'
      ) {
        lineColor = '#3B82F6';
        width = 3;
      } else if (
        currentEvent?.type === 'BACKTRACK' &&
        (src === currentVertex || tgt === currentVertex)
      ) {
        lineColor = '#F59E0B';
        width = 3;
      }

      edge.style({
        'line-color': lineColor,
        width,
      });
    });
  }, [assignments, currentVertex, conflictVertex, conflictEdge, currentEvent, status, solutionFound]);

  const fitGraph = () => {
    cyRef.current?.fit(undefined, 40);
  };

  const resetLayout = () => {
    cyRef.current?.layout({ name: 'cose', animate: true, animationDuration: 600, padding: 40 }).run();
  };

  return (
    <div className="graph-container">
      <div className="graph-header">
        <h2 className="section-title" style={{ margin: 0 }}>
          Wi-Fi Network Graph
        </h2>
        <p className="graph-subtitle">Each node represents an Access Point. Edges show interference.</p>
        <div className="graph-toolbar">
          <button className="icon-btn" onClick={fitGraph} title="Fit to screen">
            <Maximize2 size={16} />
          </button>
          <button className="icon-btn" onClick={resetLayout} title="Reset layout">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      <div ref={containerRef} className="cytoscape-container" />
      {/* Legend */}
      <div className="graph-legend">
        {channels.map((ch) => (
          <div key={ch.id} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: ch.color }} />
            <span className="legend-label">{ch.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
