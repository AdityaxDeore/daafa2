import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import { getChannelColor } from '../types';

export default function FinalAllocation() {
  const status = useSimulationStore((s) => s.status);
  const solutionFound = useSimulationStore((s) => s.solutionFound);
  const assignments = useSimulationStore((s) => s.assignments);
  const network = useSimulationStore((s) => s.network);
  const conflicts = useSimulationStore((s) => s.conflicts);
  const backtracks = useSimulationStore((s) => s.backtracks);
  const channelCount = useSimulationStore((s) => s.channelCount);

  if (status !== 'SUCCESS' && status !== 'FAILED') return null;

  const channelsUsed = new Set(Object.values(assignments)).size;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`card final-allocation ${solutionFound ? 'final-success' : 'final-failure'}`}
    >
      {solutionFound ? (
        <>
          <div className="final-header final-header-success">
            <CheckCircle size={24} />
            <h2>Valid Allocation Found</h2>
          </div>
          <div className="final-assignments">
            {network.nodes.map((node) => {
              const channel = assignments[node.id];
              return (
                <motion.div
                  key={node.id}
                  className="final-row"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="final-ap">{node.id}</span>
                  <ArrowRight size={14} className="final-arrow" />
                  <span
                    className="final-channel"
                    style={{
                      backgroundColor: getChannelColor(channel) + '20',
                      color: getChannelColor(channel),
                      borderColor: getChannelColor(channel),
                    }}
                  >
                    <span
                      className="channel-dot"
                      style={{ backgroundColor: getChannelColor(channel) }}
                    />
                    {channel}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <div className="final-stats">
            <span>Conflicts in final: <strong>0</strong></span>
            <span>Total backtracks: <strong>{backtracks}</strong></span>
            <span>Channels used: <strong>{channelsUsed}</strong></span>
          </div>
        </>
      ) : (
        <>
          <div className="final-header final-header-failure">
            <XCircle size={24} />
            <h2>No Valid Allocation</h2>
          </div>
          <p className="final-message">
            No valid channel allocation exists with {channelCount} available channel(s) for this
            network of {network.nodes.length} Access Points.
          </p>
          <p className="final-explanation">
            The backtracking algorithm explored all possible assignments but could not find a
            valid channel configuration where no two connected Access Points share the same channel.
          </p>
          <div className="final-stats">
            <span>Solution Found: <strong style={{ color: '#EF4444' }}>No</strong></span>
            <span>Total conflicts: <strong>{conflicts}</strong></span>
            <span>Total backtracks: <strong>{backtracks}</strong></span>
          </div>
        </>
      )}
    </motion.div>
  );
}
