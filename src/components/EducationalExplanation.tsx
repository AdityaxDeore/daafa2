import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function EducationalExplanation() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="educational-section"
    >
      <div className="card edu-card">
        <h2 className="section-title">
          <BookOpen size={18} />
          What is Graph Coloring?
        </h2>
        <p className="text-body">
          Graph coloring assigns a color to each vertex so that connected vertices do not have
          the same color. In this model, vertices represent Access Points and colors represent
          Wi-Fi channels. The minimum number of colors needed to properly color a graph is called
          its <strong>chromatic number</strong>.
        </p>
      </div>

      <div className="card edu-card">
        <h2 className="section-title">
          <BookOpen size={18} />
          What is Backtracking?
        </h2>
        <p className="text-body">
          Backtracking systematically tries possible channel assignments. When an assignment
          causes a conflict and no valid continuation is possible, the algorithm goes back to
          a previous decision and tries another channel. This ensures that all possibilities
          are explored before declaring that no solution exists.
        </p>
      </div>
    </motion.section>
  );
}
