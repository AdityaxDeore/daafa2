import { useMemo, useCallback } from 'react';
import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  MiniMap,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSimulationStore } from '../store/simulationStore';
import { getChannelColor } from '../types';
import { GitBranch } from 'lucide-react';

function getNodeStyle(status: string): React.CSSProperties {
  switch (status) {
    case 'assigned':
      return {
        border: '2px solid #10B981',
        backgroundColor: '#D1FAE5',
        color: '#065F46',
      };
    case 'conflict':
      return {
        border: '2px solid #EF4444',
        backgroundColor: '#FEE2E2',
        color: '#991B1B',
      };
    case 'backtracked':
      return {
        border: '2px solid #F59E0B',
        backgroundColor: '#FEF3C7',
        color: '#92400E',
      };
    default:
      return {
        border: '2px solid #CBD5E1',
        backgroundColor: '#F1F5F9',
        color: '#475569',
      };
  }
}

function getStatusSymbol(status: string): string {
  switch (status) {
    case 'assigned': return '✓';
    case 'conflict': return '✗';
    case 'backtracked': return '↩';
    default: return '…';
  }
}

export default function SearchTree() {
  const searchTreeNodes = useSimulationStore((s) => s.searchTreeNodes);

  const { nodes, edges } = useMemo(() => {
    if (searchTreeNodes.length === 0) {
      return { nodes: [], edges: [] };
    }

    // Build position map using a simple tree layout
    const childrenMap: Record<string, string[]> = {};
    for (const tn of searchTreeNodes) {
      const parentId = tn.parentId ?? '__root__';
      if (!childrenMap[parentId]) childrenMap[parentId] = [];
      childrenMap[parentId].push(tn.id);
    }

    // Position nodes level by level
    const positions: Record<string, { x: number; y: number }> = {};
    const levelWidths: Record<number, number> = {};

    // Count nodes per depth
    for (const tn of searchTreeNodes) {
      levelWidths[tn.depth] = (levelWidths[tn.depth] ?? 0) + 1;
    }

    // Assign positions
    const levelCounters: Record<number, number> = {};
    for (const tn of searchTreeNodes) {
      const depth = tn.depth;
      const count = levelWidths[depth] ?? 1;
      const idx = levelCounters[depth] ?? 0;
      levelCounters[depth] = idx + 1;

      const spacing = 180;
      const totalWidth = (count - 1) * spacing;
      const x = idx * spacing - totalWidth / 2;
      const y = depth * 100;

      positions[tn.id] = { x, y };
    }

    const flowNodes: Node[] = searchTreeNodes.map((tn) => {
      const pos = positions[tn.id] ?? { x: 0, y: 0 };
      const channelColor = getChannelColor(tn.channel);
      const nodeStyle = getNodeStyle(tn.status);

      return {
        id: tn.id,
        position: pos,
        data: {
          label: (
            <div style={{ textAlign: 'center', fontSize: '11px', lineHeight: 1.3 }}>
              <div style={{ fontWeight: 700 }}>{tn.vertex}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: channelColor,
                    display: 'inline-block',
                  }}
                />
                <span>{tn.channel}</span>
              </div>
              <div style={{ fontSize: '13px', marginTop: 2 }}>{getStatusSymbol(tn.status)}</div>
            </div>
          ),
        },
        style: {
          ...nodeStyle,
          borderRadius: 8,
          padding: '4px 8px',
          width: 110,
          fontSize: '11px',
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      };
    });

    const flowEdges: Edge[] = searchTreeNodes
      .filter((tn) => tn.parentId)
      .map((tn) => ({
        id: `edge-${tn.parentId}-${tn.id}`,
        source: tn.parentId!,
        target: tn.id,
        style: {
          stroke:
            tn.status === 'conflict'
              ? '#EF4444'
              : tn.status === 'backtracked'
              ? '#F59E0B'
              : '#10B981',
          strokeWidth: 2,
        },
        animated: tn.status === 'assigned',
      }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [searchTreeNodes]);

  const onInit = useCallback((instance: { fitView: () => void }) => {
    setTimeout(() => instance.fitView(), 100);
  }, []);

  return (
    <div className="card search-tree-panel">
      <h2 className="section-title">
        <GitBranch size={18} />
        Backtracking Search Tree
      </h2>
      <div className="search-tree-container">
        {nodes.length === 0 ? (
          <p className="text-muted" style={{ padding: '24px', textAlign: 'center' }}>
            The search tree will appear as the algorithm explores channel assignments.
          </p>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onInit={onInit}
            fitView
            panOnDrag
            zoomOnScroll
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={16} size={1} color="#E2E8F0" />
            <Controls showInteractive={false} />
            <MiniMap
              style={{ height: 60, width: 100 }}
              maskColor="rgba(241,245,249,0.7)"
            />
          </ReactFlow>
        )}
      </div>
      {/* Legend */}
      <div className="tree-legend">
        <span className="tree-legend-item">
          <span style={{ color: '#10B981' }}>✓</span> Assigned
        </span>
        <span className="tree-legend-item">
          <span style={{ color: '#EF4444' }}>✗</span> Conflict
        </span>
        <span className="tree-legend-item">
          <span style={{ color: '#F59E0B' }}>↩</span> Backtracked
        </span>
      </div>
    </div>
  );
}
