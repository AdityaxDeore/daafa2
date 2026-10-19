import { motion } from 'framer-motion';
import { Clock, HardDrive } from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';

export default function Complexity() {
  const channelCount = useSimulationStore((s) => s.channelCount);
  const apCount = useSimulationStore((s) => s.network.nodes.length);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="card"
    >
      <h2 className="section-title">Algorithm Complexity</h2>
      <div className="complexity-grid">
        <div className="complexity-item">
          <div className="complexity-icon">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="complexity-label">Time Complexity</h3>
            <div className="complexity-formula">
              O(C<sup>V</sup>)
            </div>
            <p className="complexity-desc">
              <span className="complexity-var">C = {channelCount}</span> (channels) &nbsp;
              <span className="complexity-var">V = {apCount}</span> (Access Points)
            </p>
            <p className="complexity-note">
              Worst case: O({channelCount}<sup>{apCount}</sup>) ={' '}
              O({Math.pow(channelCount, apCount).toLocaleString()})
            </p>
          </div>
        </div>
        <div className="complexity-item">
          <div className="complexity-icon">
            <HardDrive size={20} />
          </div>
          <div>
            <h3 className="complexity-label">Space Complexity</h3>
            <div className="complexity-formula">
              O(V)
            </div>
            <p className="complexity-desc">
              <span className="complexity-var">V = {apCount}</span> (Access Points)
            </p>
          </div>
        </div>
      </div>
      <p className="text-muted" style={{ marginTop: '12px', fontSize: '13px' }}>
        This is the worst-case algorithmic complexity. Practical execution typically explores
        far fewer states due to early pruning from conflict detection.
      </p>
    </motion.section>
  );
}
