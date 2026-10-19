import { motion } from 'framer-motion';
import { Wifi, GitBranch, Radio, AlertTriangle, RotateCcw, CheckCircle } from 'lucide-react';

const steps = [
  { icon: Wifi, label: 'Network', color: '#3B82F6' },
  { icon: GitBranch, label: 'Graph', color: '#6366F1' },
  { icon: Radio, label: 'Channel\nAssignment', color: '#8B5CF6' },
  { icon: AlertTriangle, label: 'Conflict\nDetection', color: '#EF4444' },
  { icon: RotateCcw, label: 'Backtracking', color: '#F59E0B' },
  { icon: CheckCircle, label: 'Valid\nAllocation', color: '#10B981' },
];

export default function HowItWorks() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="card"
    >
      <h2 className="section-title">How It Works</h2>
      <div className="pipeline">
        {steps.map((step, i) => (
          <div key={step.label} className="pipeline-step-wrapper">
            <motion.div
              className="pipeline-step"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div
                className="pipeline-icon"
                style={{ backgroundColor: step.color + '18', color: step.color }}
              >
                <step.icon size={22} />
              </div>
              <span className="pipeline-label">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                className="pipeline-arrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                →
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
