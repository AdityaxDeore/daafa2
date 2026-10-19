import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ScrollText, AlertTriangle, CheckCircle, RotateCcw, Radio, ArrowRight } from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import type { AlgorithmEventType } from '../types';

function getEventIcon(type: AlgorithmEventType) {
  switch (type) {
    case 'SELECT_VERTEX': return <ArrowRight size={14} />;
    case 'TRY_CHANNEL': return <Radio size={14} />;
    case 'CHANNEL_SAFE': return <CheckCircle size={14} />;
    case 'CHANNEL_ASSIGNED': return <CheckCircle size={14} />;
    case 'CONFLICT_DETECTED': return <AlertTriangle size={14} />;
    case 'BACKTRACK': return <RotateCcw size={14} />;
    case 'SOLUTION_FOUND': return <CheckCircle size={14} />;
    case 'NO_SOLUTION': return <AlertTriangle size={14} />;
  }
}

function getEventColor(type: AlgorithmEventType): string {
  switch (type) {
    case 'SELECT_VERTEX': return '#3B82F6';
    case 'TRY_CHANNEL': return '#6366F1';
    case 'CHANNEL_SAFE': return '#10B981';
    case 'CHANNEL_ASSIGNED': return '#059669';
    case 'CONFLICT_DETECTED': return '#EF4444';
    case 'BACKTRACK': return '#F59E0B';
    case 'SOLUTION_FOUND': return '#10B981';
    case 'NO_SOLUTION': return '#EF4444';
  }
}

function formatEventMessage(event: { type: AlgorithmEventType; vertex: string; channel?: string; conflictingVertex?: string }): string {
  switch (event.type) {
    case 'SELECT_VERTEX': return `Selected ${event.vertex}`;
    case 'TRY_CHANNEL': return `Trying ${event.channel} for ${event.vertex}`;
    case 'CHANNEL_SAFE': return `${event.channel} is safe for ${event.vertex}`;
    case 'CHANNEL_ASSIGNED': return `${event.vertex} assigned ${event.channel}`;
    case 'CONFLICT_DETECTED': return `Conflict: ${event.vertex} ↔ ${event.conflictingVertex} (${event.channel})`;
    case 'BACKTRACK': return `Backtrack: removing ${event.channel} from ${event.vertex}`;
    case 'SOLUTION_FOUND': return 'Solution found! All APs assigned.';
    case 'NO_SOLUTION': return 'No valid allocation exists.';
  }
}

export default function ExecutionLog() {
  const events = useSimulationStore((s) => s.events);
  const eventIndex = useSimulationStore((s) => s.eventIndex);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleEvents = events.slice(0, eventIndex);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [eventIndex]);

  return (
    <div className="card log-panel">
      <h2 className="section-title">
        <ScrollText size={18} />
        Algorithm Execution Log
      </h2>
      <div ref={scrollRef} className="log-scroll">
        {visibleEvents.length === 0 ? (
          <p className="text-muted" style={{ padding: '16px', textAlign: 'center' }}>
            No events yet. Start the algorithm to see the execution log.
          </p>
        ) : (
          visibleEvents.map((event, i) => {
            const isLatest = i === visibleEvents.length - 1;
            const color = getEventColor(event.type);
            return (
              <motion.div
                key={event.step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`log-entry ${isLatest ? 'log-entry-latest' : ''}`}
                style={{ borderLeftColor: color }}
              >
                <span className="log-step">{String(event.step).padStart(2, '0')}</span>
                <span className="log-icon" style={{ color }}>
                  {getEventIcon(event.type)}
                </span>
                <span className="log-message">{formatEventMessage(event)}</span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
