import { motion } from 'framer-motion';
import { Info, GitBranch, Palette } from 'lucide-react';

export default function ProjectOverview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card"
    >
      <h2 className="section-title">
        <Info size={20} />
        Project Overview
      </h2>
      <p className="text-body">
        Multiple Wi-Fi Access Points operating near each other may interfere when they use
        conflicting channels. This model represents the wireless network as a graph and uses
        graph coloring with backtracking to assign channels while avoiding conflicts between
        interfering Access Points.
      </p>
      <div className="concept-grid">
        <div className="concept-item">
          <GitBranch size={18} className="concept-icon" />
          <span className="concept-label">Vertex</span>
          <span className="concept-arrow">→</span>
          <span className="concept-value">Access Point</span>
        </div>
        <div className="concept-item">
          <GitBranch size={18} className="concept-icon" style={{ transform: 'rotate(90deg)' }} />
          <span className="concept-label">Edge</span>
          <span className="concept-arrow">→</span>
          <span className="concept-value">Interference</span>
        </div>
        <div className="concept-item">
          <Palette size={18} className="concept-icon" />
          <span className="concept-label">Color</span>
          <span className="concept-arrow">→</span>
          <span className="concept-value">Wi-Fi Channel</span>
        </div>
      </div>
    </motion.section>
  );
}
