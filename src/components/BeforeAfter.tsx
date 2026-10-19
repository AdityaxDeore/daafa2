import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import { getChannelColor } from '../types';

export default function BeforeAfter() {
  const status = useSimulationStore((s) => s.status);
  const solutionFound = useSimulationStore((s) => s.solutionFound);
  const assignments = useSimulationStore((s) => s.assignments);
  const beforeAssignments = useSimulationStore((s) => s.beforeAssignments);
  const network = useSimulationStore((s) => s.network);

  if (status !== 'SUCCESS' || !solutionFound) return null;

  // Check conflicts in before state
  const beforeConflicts: string[] = [];
  for (const edge of network.edges) {
    const srcCh = beforeAssignments[edge.source];
    const tgtCh = beforeAssignments[edge.target];
    if (srcCh && tgtCh && srcCh === tgtCh) {
      beforeConflicts.push(`${edge.source} ↔ ${edge.target}`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card before-after-container"
    >
      <h2 className="section-title">Before & After Allocation</h2>
      <p className="text-muted" style={{ fontSize: '12px', marginBottom: '16px' }}>
        Simulated configuration for algorithm visualization — not real Wi-Fi interference measurements.
      </p>

      <div className="before-after-grid">
        {/* BEFORE */}
        <div className="ba-panel ba-before">
          <h3 className="ba-title">
            <AlertTriangle size={16} className="ba-icon-danger" />
            Before Allocation
          </h3>
          <div className="ba-assignments">
            {network.nodes.map((node) => {
              const ch = beforeAssignments[node.id];
              return (
                <div key={node.id} className="ba-row">
                  <span className="ba-ap">{node.id}</span>
                  <ArrowRight size={12} />
                  {ch ? (
                    <span
                      className="ba-channel"
                      style={{
                        backgroundColor: getChannelColor(ch) + '20',
                        color: getChannelColor(ch),
                        borderColor: getChannelColor(ch),
                      }}
                    >
                      {ch}
                    </span>
                  ) : (
                    <span className="ba-channel ba-unassigned">—</span>
                  )}
                </div>
              );
            })}
          </div>
          {beforeConflicts.length > 0 && (
            <div className="ba-conflicts">
              <strong style={{ color: '#EF4444' }}>
                {beforeConflicts.length} conflict(s)
              </strong>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="ba-arrow">
          <ArrowRight size={28} />
        </div>

        {/* AFTER */}
        <div className="ba-panel ba-after">
          <h3 className="ba-title">
            <CheckCircle size={16} className="ba-icon-success" />
            After Allocation
          </h3>
          <div className="ba-assignments">
            {network.nodes.map((node) => {
              const ch = assignments[node.id];
              return (
                <div key={node.id} className="ba-row">
                  <span className="ba-ap">{node.id}</span>
                  <ArrowRight size={12} />
                  {ch ? (
                    <span
                      className="ba-channel"
                      style={{
                        backgroundColor: getChannelColor(ch) + '20',
                        color: getChannelColor(ch),
                        borderColor: getChannelColor(ch),
                      }}
                    >
                      {ch}
                    </span>
                  ) : (
                    <span className="ba-channel ba-unassigned">—</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="ba-conflicts">
            <strong style={{ color: '#10B981' }}>0 conflicts</strong>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
