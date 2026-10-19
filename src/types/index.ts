// ============================================================
// Core Types for Virtual Wi-Fi Channel Allocation Model
// ============================================================

/** Represents a Wi-Fi Access Point (vertex in the graph) */
export interface AccessPoint {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

/** Represents interference between two APs (edge in the graph) */
export interface InterferenceLink {
  source: string;
  target: string;
}

/** The complete network graph */
export interface NetworkGraph {
  nodes: AccessPoint[];
  edges: InterferenceLink[];
}

/** Wi-Fi Channel definition */
export interface Channel {
  id: number;
  label: string;
  color: string;
}

/** Algorithm event types */
export type AlgorithmEventType =
  | 'SELECT_VERTEX'
  | 'TRY_CHANNEL'
  | 'CHANNEL_SAFE'
  | 'CHANNEL_ASSIGNED'
  | 'CONFLICT_DETECTED'
  | 'BACKTRACK'
  | 'SOLUTION_FOUND'
  | 'NO_SOLUTION';

/** A single algorithm event */
export interface AlgorithmEvent {
  step: number;
  type: AlgorithmEventType;
  vertex: string;
  channel?: string;
  channelIndex?: number;
  conflictingVertex?: string;
  depth: number;
  message: string;
  assignments: Record<string, string>;
}

/** Node state for visualization */
export type NodeState =
  | 'UNASSIGNED'
  | 'CURRENT'
  | 'ASSIGNED'
  | 'CONFLICT'
  | 'BACKTRACK'
  | 'FINAL';

/** Edge state for visualization */
export type EdgeState = 'NORMAL' | 'CURRENT' | 'CONFLICT' | 'BACKTRACK';

/** Algorithm execution status */
export type AlgorithmStatus =
  | 'IDLE'
  | 'RUNNING'
  | 'PAUSED'
  | 'SUCCESS'
  | 'FAILED';

/** Search tree node for React Flow */
export interface SearchTreeNode {
  id: string;
  vertex: string;
  channel: string;
  status: 'trying' | 'assigned' | 'conflict' | 'backtracked';
  parentId: string | null;
  depth: number;
}

/** Predefined network preset */
export interface NetworkPreset {
  name: string;
  description: string;
  apCount: number;
  graph: NetworkGraph;
}

/** Channel color map - 5 standard Wi-Fi channels */
export const CHANNEL_DEFINITIONS: Channel[] = [
  { id: 1, label: 'Channel 1', color: '#E74C6F' },
  { id: 6, label: 'Channel 6', color: '#3B82F6' },
  { id: 11, label: 'Channel 11', color: '#10B981' },
  { id: 36, label: 'Channel 36', color: '#8B5CF6' },
  { id: 44, label: 'Channel 44', color: '#F59E0B' },
];

/** Get channel color by label */
export function getChannelColor(label: string): string {
  const ch = CHANNEL_DEFINITIONS.find((c) => c.label === label);
  return ch?.color ?? '#94A3B8';
}

/** Get channel by index (0-based) */
export function getChannelByIndex(index: number): Channel | undefined {
  return CHANNEL_DEFINITIONS[index];
}
