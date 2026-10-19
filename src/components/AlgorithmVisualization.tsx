import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import { getChannelColor } from '../types';

function getStatusStyle(type: string | undefined): { color: string; bg: string; label: string; Icon: React.ElementType } {
  switch (type) {
    case 'SELECT_VERTEX':
      return { color: '#3B82F6', bg: '#DBEAFE', label: 'SELECTING', Icon: Activity };
    case 'TRY_CHANNEL':
      return { color: '#6366F1', bg: '#E0E7FF', label: 'TRYING', Icon: Activity };
    case 'CHANNEL_SAFE':
      return { color: '#10B981', bg: '#D1FAE5', label: 'SAFE', Icon: CheckCircle };
    case 'CHANNEL_ASSIGNED':
      return { color: '#10B981', bg: '#D1FAE5', label: 'ASSIGNED', Icon: CheckCircle };
    case 'CONFLICT_DETECTED':
      return { color: '#EF4444', bg: '#FEE2E2', label: 'CONFLICT DETECTED', Icon: AlertTriangle };
    case 'BACKTRACK':
      return { color: '#F59E0B', bg: '#FEF3C7', label: 'BACKTRACKING', Icon: RotateCcw };
    case 'SOLUTION_FOUND':
      return { color: '#10B981', bg: '#D1FAE5', label: 'SUCCESS', Icon: CheckCircle };
    case 'NO_SOLUTION':
      return { color: '#EF4444', bg: '#FEE2E2', label: 'FAILED', Icon: XCircle };
    default:
      return { color: '#94A3B8', bg: '#F1F5F9', label: 'IDLE', Icon: Activity };
  }
}

export default function AlgorithmVisualization() {
  const currentEvent = useSimulationStore((s) => s.currentEvent);
  const currentVertex = useSimulationStore((s) => s.currentVertex);
  const currentChannel = useSimulationStore((s) => s.currentChannel);
  const status = useSimulationStore((s) => s.status);

  const statusInfo = getStatusStyle(currentEvent?.type);
  const StatusIcon = statusInfo.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="card algo-viz-panel"
    >
      <h2 className="section-title">
        <Activity size={18} />
        Algorithm Visualization
        {status !== 'IDLE' && (
          <span
            className="status-indicator"
            style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
          >
            {status}
          </span>
        )}
      </h2>

      {!currentEvent ? (
        <div className="algo-viz-empty">
          <p className="text-muted">Click <strong>Start</strong> or <strong>Step</strong> to begin the algorithm</p>
        </div>
      ) : (
        <div className="algo-viz-content">
          {/* Current Vertex */}
          <div className="algo-viz-row">
            <span className="algo-viz-label">Current Vertex</span>
            <span className="algo-viz-value" style={{ color: '#3B82F6', fontWeight: 700 }}>
              {currentVertex ?? '—'}
            </span>
          </div>

          {/* Trying Channel */}
          {currentChannel && (
            <div className="algo-viz-row">
              <span className="algo-viz-label">Trying Channel</span>
              <span className="algo-viz-value">
                <span
                  className="channel-badge"
                  style={{
                    backgroundColor: getChannelColor(currentChannel) + '20',
                    color: getChannelColor(currentChannel),
                    borderColor: getChannelColor(currentChannel),
                  }}
                >
                  {currentChannel}
                </span>
              </span>
            </div>
          )}

          {/* Status */}
          <div className="algo-viz-row">
            <span className="algo-viz-label">Status</span>
            <span
              className="algo-viz-status"
              style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
            >
              <StatusIcon size={14} />
              {statusInfo.label}
            </span>
          </div>

          {/* Conflict info */}
          {currentEvent.conflictingVertex && (
            <div className="algo-viz-row">
              <span className="algo-viz-label">Conflicts With</span>
              <span className="algo-viz-value" style={{ color: '#EF4444', fontWeight: 600 }}>
                {currentEvent.conflictingVertex}
              </span>
            </div>
          )}

          {/* Depth */}
          <div className="algo-viz-row">
            <span className="algo-viz-label">Recursion Depth</span>
            <span className="algo-viz-value">{currentEvent.depth}</span>
          </div>

          {/* Message */}
          <motion.div
            key={currentEvent.step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="algo-viz-message"
            style={{ borderLeftColor: statusInfo.color }}
          >
            {currentEvent.message}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
