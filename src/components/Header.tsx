import { Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="header"
    >
      <div className="header-inner">
        <div className="header-left">
          <div className="header-icon">
            <Wifi size={28} />
          </div>
          <div>
            <h1 className="header-title">Virtual Wi-Fi Channel Allocation Model</h1>
            <p className="header-subtitle">Graph Coloring with Backtracking</p>
          </div>
        </div>
        <div className="header-badge">
          DAA Algorithm Visualization
        </div>
      </div>
    </motion.header>
  );
}
