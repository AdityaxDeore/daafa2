import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';

export default function Statistics() {
  const network = useSimulationStore((s) => s.network);
  const channelCount = useSimulationStore((s) => s.channelCount);
  const steps = useSimulationStore((s) => s.steps);
  const conflicts = useSimulationStore((s) => s.conflicts);
  const backtracks = useSimulationStore((s) => s.backtracks);
  const assignments = useSimulationStore((s) => s.assignments);
  const recursionDepth = useSimulationStore((s) => s.recursionDepth);
  const status = useSimulationStore((s) => s.status);

  const channelsUsed = new Set(Object.values(assignments)).size;

  const statusLabel: Record<string, { text: string; color: string }> = {
    IDLE: { text: 'Idle', color: '#94A3B8' },
    RUNNING: { text: 'Running', color: '#3B82F6' },
    PAUSED: { text: 'Paused', color: '#F59E0B' },
    SUCCESS: { text: 'Success', color: '#10B981' },
    FAILED: { text: 'Failed', color: '#EF4444' },
  };

  const st = statusLabel[status] ?? statusLabel.IDLE;

  const stats = [
    { label: 'Access Points', value: network.nodes.length },
    { label: 'Interference Links', value: network.edges.length },
    { label: 'Available Channels', value: channelCount },
    { label: 'Algorithm Steps', value: steps },
    { label: 'Conflicts', value: conflicts, highlight: conflicts > 0 ? '#EF4444' : undefined },
    { label: 'Backtracks', value: backtracks, highlight: backtracks > 0 ? '#F59E0B' : undefined },
    { label: 'Channels Used', value: channelsUsed },
    { label: 'Current Depth', value: recursionDepth },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card stats-panel"
    >
      <h2 className="section-title">
        <BarChart3 size={18} />
        Live Statistics
      </h2>
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-label">{s.label}</span>
            <span className="stat-value" style={s.highlight ? { color: s.highlight } : undefined}>
              {s.value}
            </span>
          </div>
        ))}
        <div className="stat-item">
          <span className="stat-label">Status</span>
          <span className="stat-value" style={{ color: st.color, fontWeight: 700 }}>
            {st.text}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
