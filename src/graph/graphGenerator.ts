// ============================================================
// Random Network Generator
// ============================================================

import type { NetworkGraph } from '../types';

/**
 * Generate a random network graph with the given number of APs.
 * Guarantees: no self-loops, no duplicate edges, reasonable density.
 */
export function generateRandomNetwork(apCount: number): NetworkGraph {
  const nodes = Array.from({ length: apCount }, (_, i) => ({
    id: `AP${i + 1}`,
    label: `AP${i + 1}`,
  }));

  const edges: { source: string; target: string }[] = [];
  const edgeSet = new Set<string>();

  const addEdge = (a: string, b: string) => {
    const key = [a, b].sort().join('-');
    if (!edgeSet.has(key) && a !== b) {
      edgeSet.add(key);
      edges.push({ source: a, target: b });
    }
  };

  // Step 1: create a spanning path so the graph is connected
  for (let i = 0; i < apCount - 1; i++) {
    addEdge(nodes[i].id, nodes[i + 1].id);
  }

  // Step 2: add random edges for density
  // Target density: ~40-60% of max possible edges beyond spanning tree
  const maxExtra = (apCount * (apCount - 1)) / 2 - (apCount - 1);
  const targetExtra = Math.max(1, Math.floor(maxExtra * (0.25 + Math.random() * 0.2)));

  let added = 0;
  let attempts = 0;
  while (added < targetExtra && attempts < maxExtra * 3) {
    const i = Math.floor(Math.random() * apCount);
    const j = Math.floor(Math.random() * apCount);
    if (i !== j) {
      const key = [nodes[i].id, nodes[j].id].sort().join('-');
      if (!edgeSet.has(key)) {
        addEdge(nodes[i].id, nodes[j].id);
        added++;
      }
    }
    attempts++;
  }

  return { nodes, edges };
}
