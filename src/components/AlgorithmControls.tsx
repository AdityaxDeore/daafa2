import { useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, StepForward } from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';

export default function AlgorithmControls() {
  const {
    status,
    isRunning,
    isPaused,
    speed,
    eventIndex,
    events,
    stepForward,
    start,
    pause,
    resume,
    reset,
    setSpeed,
  } = useSimulationStore();

  const intervalRef = useRef<number | null>(null);

  // Auto-step when running
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        const state = useSimulationStore.getState();
        if (state.eventIndex >= state.events.length || state.status === 'SUCCESS' || state.status === 'FAILED') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          useSimulationStore.setState({ isRunning: false });
          return;
        }
        state.stepForward();
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, speed]);

  const isFinished = status === 'SUCCESS' || status === 'FAILED';
  const canStep = !isFinished && (!isRunning || isPaused);
  const progress = events.length > 0 ? Math.round((eventIndex / events.length) * 100) : 0;

  return (
    <div className="controls-container">
      <div className="controls-buttons">
        {/* Start / Resume / Pause */}
        {status === 'IDLE' && (
          <button className="btn btn-primary" onClick={start} title="Start algorithm execution">
            <Play size={16} />
            Start
          </button>
        )}
        {(status === 'RUNNING' || status === 'PAUSED') && !isFinished && (
          <>
            {isRunning && !isPaused ? (
              <button className="btn btn-warning" onClick={pause} title="Pause execution">
                <Pause size={16} />
                Pause
              </button>
            ) : (
              <button className="btn btn-primary" onClick={resume} title="Resume execution">
                <SkipForward size={16} />
                Resume
              </button>
            )}
          </>
        )}

        {/* Step */}
        <button
          className="btn btn-secondary"
          onClick={stepForward}
          disabled={!canStep && status !== 'IDLE'}
          title="Execute one algorithm step"
        >
          <StepForward size={16} />
          Step
        </button>

        {/* Reset */}
        <button className="btn btn-danger" onClick={reset} title="Reset simulation">
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Speed slider */}
      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        <span className="speed-value">
          {speed <= 200 ? 'Fast' : speed <= 600 ? 'Normal' : 'Slow'}
        </span>
        <input
          type="range"
          min={100}
          max={1500}
          step={100}
          value={1600 - speed}
          onChange={(e) => setSpeed(1600 - Number(e.target.value))}
          className="speed-slider"
          title="Adjust animation speed"
        />
        <div className="speed-labels">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Progress bar */}
      {events.length > 0 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">
            {eventIndex} / {events.length} steps
          </span>
        </div>
      )}
    </div>
  );
}
