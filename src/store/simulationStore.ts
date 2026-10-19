// ============================================================
// Simulation Store — Zustand State Management
// ============================================================

import { create } from 'zustand';
import type {
  NetworkGraph,
  AlgorithmEvent,
  AlgorithmStatus,
  SearchTreeNode,
  Channel,
} from '../types';
import { CHANNEL_DEFINITIONS } from '../types';
import { solveGraphColoring } from '../algorithm/BacktrackingSolver';
import { PREDEFINED_NETWORKS } from '../graph/predefinedNetworks';
import { generateRandomNetwork } from '../graph/graphGenerator';

interface SimulationState {
  // ── Network ──
  network: NetworkGraph;
  apCount: number;
  channelCount: number;
  channels: Channel[];

  // ── Algorithm ──
  events: AlgorithmEvent[];
  eventIndex: number; // index of the NEXT event to process (-1 = not started, events.length = done)
  currentEvent: AlgorithmEvent | null;
  assignments: Record<string, string>;
  currentVertex: string | null;
  currentChannel: string | null;
  conflictVertex: string | null;
  conflictEdge: [string, string] | null;

  // ── Statistics ──
  conflicts: number;
  backtracks: number;
  steps: number;
  recursionDepth: number;
  maxDepth: number;

  // ── Status ──
  status: AlgorithmStatus;
  isRunning: boolean;
  isPaused: boolean;
  solutionFound: boolean | null;

  // ── Search tree ──
  searchTreeNodes: SearchTreeNode[];

  // ── Speed ──
  speed: number; // ms between auto-steps

  // ── Before / After ──
  beforeAssignments: Record<string, string>;

  // ── Actions ──
  setApCount: (count: number) => void;
  setChannelCount: (count: number) => void;
  loadPreset: (name: string) => void;
  generateRandom: () => void;
  setNetwork: (graph: NetworkGraph) => void;
  setSpeed: (speed: number) => void;

  prepareAlgorithm: () => void;
  stepForward: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;

  // internal
  _processEvent: (event: AlgorithmEvent) => void;
}

const DEFAULT_AP_COUNT = 6;
const DEFAULT_CHANNEL_COUNT = 3;

function getDefaultNetwork(): NetworkGraph {
  return PREDEFINED_NETWORKS[0].graph;
}

function getChannels(count: number): Channel[] {
  return CHANNEL_DEFINITIONS.slice(0, count);
}

/** Generate a fake "before" allocation that intentionally has conflicts */
function generateConflictingAllocation(
  graph: NetworkGraph,
  channels: Channel[]
): Record<string, string> {
  const result: Record<string, string> = {};
  // Assign the same channel to connected nodes to create visible conflicts
  for (let i = 0; i < graph.nodes.length; i++) {
    result[graph.nodes[i].id] = channels[i % Math.max(1, Math.floor(channels.length / 2))].label;
  }
  return result;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  // ── Defaults ──
  network: getDefaultNetwork(),
  apCount: DEFAULT_AP_COUNT,
  channelCount: DEFAULT_CHANNEL_COUNT,
  channels: getChannels(DEFAULT_CHANNEL_COUNT),

  events: [],
  eventIndex: -1,
  currentEvent: null,
  assignments: {},
  currentVertex: null,
  currentChannel: null,
  conflictVertex: null,
  conflictEdge: null,

  conflicts: 0,
  backtracks: 0,
  steps: 0,
  recursionDepth: 0,
  maxDepth: 0,

  status: 'IDLE',
  isRunning: false,
  isPaused: false,
  solutionFound: null,

  searchTreeNodes: [],
  speed: 800,

  beforeAssignments: {},

  // ── Actions ──

  setApCount: (count) => {
    const state = get();
    if (state.status !== 'IDLE') return;
    set({ apCount: count });
  },

  setChannelCount: (count) => {
    const state = get();
    if (state.status !== 'IDLE') return;
    set({
      channelCount: count,
      channels: getChannels(count),
    });
  },

  loadPreset: (name) => {
    const preset = PREDEFINED_NETWORKS.find((p) => p.name === name);
    if (!preset) return;
    const state = get();
    // Reset first
    state.reset();
    set({
      network: preset.graph,
      apCount: preset.apCount,
    });
  },

  generateRandom: () => {
    const state = get();
    state.reset();
    const graph = generateRandomNetwork(state.apCount);
    set({ network: graph });
  },

  setNetwork: (graph) => {
    const state = get();
    state.reset();
    set({ network: graph, apCount: graph.nodes.length });
  },

  setSpeed: (speed) => set({ speed }),

  prepareAlgorithm: () => {
    const { network, channels } = get();
    if (network.nodes.length === 0 || channels.length === 0) return;

    const channelLabels = channels.map((c) => c.label);
    const events = solveGraphColoring(network, channelLabels);
    const beforeAssignments = generateConflictingAllocation(network, channels);

    set({
      events,
      eventIndex: 0,
      currentEvent: null,
      assignments: {},
      currentVertex: null,
      currentChannel: null,
      conflictVertex: null,
      conflictEdge: null,
      conflicts: 0,
      backtracks: 0,
      steps: 0,
      recursionDepth: 0,
      maxDepth: 0,
      status: 'RUNNING',
      isRunning: false,
      isPaused: false,
      solutionFound: null,
      searchTreeNodes: [],
      beforeAssignments,
    });
  },

  stepForward: () => {
    const { events, eventIndex, status } = get();
    if (status === 'IDLE') {
      get().prepareAlgorithm();
      return;
    }
    if (status === 'SUCCESS' || status === 'FAILED') return;
    if (eventIndex < 0 || eventIndex >= events.length) return;

    const event = events[eventIndex];
    get()._processEvent(event);
    set({ eventIndex: eventIndex + 1 });
  },

  start: () => {
    const { status } = get();
    if (status === 'IDLE') {
      get().prepareAlgorithm();
    }
    set({ isRunning: true, isPaused: false, status: get().status === 'IDLE' ? 'RUNNING' : get().status });
  },

  pause: () => {
    set({ isRunning: false, isPaused: true, status: 'PAUSED' });
  },

  resume: () => {
    set({ isRunning: true, isPaused: false, status: 'RUNNING' });
  },

  reset: () => {
    set({
      events: [],
      eventIndex: -1,
      currentEvent: null,
      assignments: {},
      currentVertex: null,
      currentChannel: null,
      conflictVertex: null,
      conflictEdge: null,
      conflicts: 0,
      backtracks: 0,
      steps: 0,
      recursionDepth: 0,
      maxDepth: 0,
      status: 'IDLE',
      isRunning: false,
      isPaused: false,
      solutionFound: null,
      searchTreeNodes: [],
      beforeAssignments: {},
    });
  },

  _processEvent: (event: AlgorithmEvent) => {
    const state = get();
    const updates: Partial<SimulationState> = {
      currentEvent: event,
      steps: state.steps + 1,
      recursionDepth: event.depth,
      maxDepth: Math.max(state.maxDepth, event.depth),
    };

    // Clear transient highlights
    updates.conflictVertex = null;
    updates.conflictEdge = null;

    switch (event.type) {
      case 'SELECT_VERTEX':
        updates.currentVertex = event.vertex;
        updates.currentChannel = null;
        break;

      case 'TRY_CHANNEL':
        updates.currentVertex = event.vertex;
        updates.currentChannel = event.channel ?? null;
        break;

      case 'CHANNEL_SAFE':
        updates.currentVertex = event.vertex;
        updates.currentChannel = event.channel ?? null;
        break;

      case 'CHANNEL_ASSIGNED':
        updates.assignments = { ...state.assignments, [event.vertex]: event.channel! };
        updates.currentVertex = event.vertex;
        updates.currentChannel = event.channel ?? null;
        // Add to search tree
        {
          const parentNode = state.searchTreeNodes
            .filter((n) => n.status === 'assigned')
            .sort((a, b) => b.depth - a.depth)
            .find((n) => n.depth === event.depth - 1);
          const newTreeNode: SearchTreeNode = {
            id: `tree-${event.step}`,
            vertex: event.vertex,
            channel: event.channel!,
            status: 'assigned',
            parentId: parentNode?.id ?? null,
            depth: event.depth,
          };
          updates.searchTreeNodes = [...state.searchTreeNodes, newTreeNode];
        }
        break;

      case 'CONFLICT_DETECTED':
        updates.conflicts = state.conflicts + 1;
        updates.conflictVertex = event.conflictingVertex ?? null;
        updates.currentVertex = event.vertex;
        updates.currentChannel = event.channel ?? null;
        // Build conflict edge
        if (event.conflictingVertex) {
          updates.conflictEdge = [event.vertex, event.conflictingVertex];
        }
        // Add conflict node to search tree
        {
          const parentNode2 = state.searchTreeNodes
            .filter((n) => n.status === 'assigned')
            .sort((a, b) => b.depth - a.depth)
            .find((n) => n.depth === event.depth - 1);
          const conflictTreeNode: SearchTreeNode = {
            id: `tree-${event.step}`,
            vertex: event.vertex,
            channel: event.channel!,
            status: 'conflict',
            parentId: parentNode2?.id ?? null,
            depth: event.depth,
          };
          updates.searchTreeNodes = [...state.searchTreeNodes, conflictTreeNode];
        }
        break;

      case 'BACKTRACK':
        updates.backtracks = state.backtracks + 1;
        updates.currentVertex = event.vertex;
        updates.currentChannel = null;
        // Remove assignment
        {
          const newAssignments = { ...state.assignments };
          delete newAssignments[event.vertex];
          updates.assignments = newAssignments;
        }
        // Update tree — mark the last assigned node for this vertex as backtracked
        {
          const updatedTree = state.searchTreeNodes.map((n) =>
            n.vertex === event.vertex && n.channel === event.channel && n.status === 'assigned'
              ? { ...n, status: 'backtracked' as const }
              : n
          );
          updates.searchTreeNodes = updatedTree;
        }
        break;

      case 'SOLUTION_FOUND':
        updates.status = 'SUCCESS';
        updates.isRunning = false;
        updates.solutionFound = true;
        updates.currentVertex = null;
        updates.currentChannel = null;
        break;

      case 'NO_SOLUTION':
        updates.status = 'FAILED';
        updates.isRunning = false;
        updates.solutionFound = false;
        updates.currentVertex = null;
        updates.currentChannel = null;
        break;
    }

    set(updates as SimulationState);
  },
}));
