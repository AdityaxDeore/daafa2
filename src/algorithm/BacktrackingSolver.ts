// ============================================================
// Backtracking Solver — Graph Coloring Algorithm
// ============================================================
// Generates a complete list of AlgorithmEvents by running
// a genuine recursive backtracking graph coloring algorithm.
// ============================================================

import type { AlgorithmEvent, NetworkGraph } from '../types';

/**
 * Run the full graph-coloring backtracking algorithm and return
 * every individual step as an AlgorithmEvent array.
 *
 * @param graph   The network graph (nodes + edges)
 * @param channels  Array of channel labels to use (e.g. ["Channel 1","Channel 6","Channel 11"])
 * @returns Array of algorithm events representing every decision point
 */
export function solveGraphColoring(
  graph: NetworkGraph,
  channels: string[]
): AlgorithmEvent[] {
  const events: AlgorithmEvent[] = [];
  let stepCounter = 0;

  // Build adjacency list
  const adjacency: Record<string, string[]> = {};
  for (const node of graph.nodes) {
    adjacency[node.id] = [];
  }
  for (const edge of graph.edges) {
    adjacency[edge.source].push(edge.target);
    adjacency[edge.target].push(edge.source);
  }

  const vertexIds = graph.nodes.map((n) => n.id);
  const assignments: Record<string, string> = {};

  function pushEvent(
    type: AlgorithmEvent['type'],
    vertex: string,
    channel: string | undefined,
    depth: number,
    message: string,
    conflictingVertex?: string
  ) {
    stepCounter++;
    events.push({
      step: stepCounter,
      type,
      vertex,
      channel,
      channelIndex: channel ? channels.indexOf(channel) : undefined,
      conflictingVertex,
      depth,
      message,
      assignments: { ...assignments },
    });
  }

  /**
   * Check if assigning `channel` to `vertex` is safe
   * (no adjacent vertex already has this channel).
   * Returns the conflicting vertex id if unsafe, or null if safe.
   */
  function findConflict(vertex: string, channel: string): string | null {
    for (const neighbor of adjacency[vertex]) {
      if (assignments[neighbor] === channel) {
        return neighbor;
      }
    }
    return null;
  }

  /**
   * Recursive backtracking solver.
   * @param idx  Index into vertexIds
   * @returns true if a valid coloring was found
   */
  function backtrack(idx: number, depth: number): boolean {
    // Base case — all vertices assigned
    if (idx === vertexIds.length) {
      pushEvent(
        'SOLUTION_FOUND',
        '',
        undefined,
        depth,
        'All Access Points have been successfully assigned channels!'
      );
      return true;
    }

    const vertex = vertexIds[idx];

    // SELECT_VERTEX
    pushEvent(
      'SELECT_VERTEX',
      vertex,
      undefined,
      depth,
      `Selecting ${vertex} for channel assignment`
    );

    // Try each channel
    for (let ci = 0; ci < channels.length; ci++) {
      const channel = channels[ci];

      // TRY_CHANNEL
      pushEvent(
        'TRY_CHANNEL',
        vertex,
        channel,
        depth,
        `Trying ${channel} for ${vertex}`
      );

      const conflict = findConflict(vertex, channel);

      if (conflict) {
        // CONFLICT_DETECTED
        pushEvent(
          'CONFLICT_DETECTED',
          vertex,
          channel,
          depth,
          `${channel} conflicts with ${conflict} because ${conflict} is connected to ${vertex} and already uses ${channel}`,
          conflict
        );
      } else {
        // CHANNEL_SAFE
        pushEvent(
          'CHANNEL_SAFE',
          vertex,
          channel,
          depth,
          `${channel} is safe for ${vertex} — no neighboring AP uses this channel`
        );

        // CHANNEL_ASSIGNED
        assignments[vertex] = channel;
        pushEvent(
          'CHANNEL_ASSIGNED',
          vertex,
          channel,
          depth,
          `${vertex} assigned ${channel}`
        );

        // Recurse
        if (backtrack(idx + 1, depth + 1)) {
          return true;
        }

        // BACKTRACK — undo assignment
        delete assignments[vertex];
        pushEvent(
          'BACKTRACK',
          vertex,
          channel,
          depth,
          `Backtracking from ${vertex} — removing ${channel} assignment`
        );
      }
    }

    // All channels exhausted for this vertex
    if (idx === 0) {
      // Top-level failure
      pushEvent(
        'NO_SOLUTION',
        vertex,
        undefined,
        depth,
        `No valid channel allocation exists with ${channels.length} available channel(s) for this network`
      );
    }

    return false;
  }

  backtrack(0, 0);
  return events;
}
