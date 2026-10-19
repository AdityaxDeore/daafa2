import { motion } from 'framer-motion';
import { Settings, Shuffle, Building2, GraduationCap, Network } from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import { CHANNEL_DEFINITIONS } from '../types';
import { PREDEFINED_NETWORKS } from '../graph/predefinedNetworks';

const AP_OPTIONS = [4, 5, 6, 7, 8, 10];
const CHANNEL_COUNT_OPTIONS = [2, 3, 4, 5];

const presetIcons: Record<string, React.ReactNode> = {
  'Small Office': <Building2 size={16} />,
  'College Floor': <GraduationCap size={16} />,
  'Dense Network': <Network size={16} />,
};

export default function NetworkConfiguration() {
  const {
    apCount,
    channelCount,
    channels,
    status,
    setApCount,
    setChannelCount,
    loadPreset,
    generateRandom,
  } = useSimulationStore();

  const isIdle = status === 'IDLE';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="card config-panel"
    >
      <h2 className="section-title">
        <Settings size={18} />
        Network Configuration
      </h2>

      {/* AP Count */}
      <div className="config-group">
        <label className="config-label">Number of Access Points</label>
        <div className="config-options">
          {AP_OPTIONS.map((n) => (
            <button
              key={n}
              className={`config-btn ${apCount === n ? 'config-btn-active' : ''}`}
              onClick={() => setApCount(n)}
              disabled={!isIdle}
              title={`Set ${n} Access Points`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Count */}
      <div className="config-group">
        <label className="config-label">Number of Available Channels</label>
        <div className="config-options">
          {CHANNEL_COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              className={`config-btn ${channelCount === n ? 'config-btn-active' : ''}`}
              onClick={() => setChannelCount(n)}
              disabled={!isIdle}
              title={`Use ${n} channels`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Set */}
      <div className="config-group">
        <label className="config-label">Channel Set</label>
        <div className="channel-list">
          {channels.map((ch) => (
            <div key={ch.id} className="channel-chip">
              <span className="channel-dot" style={{ backgroundColor: ch.color }} />
              {ch.label}
            </div>
          ))}
        </div>
        {channelCount < 5 && (
          <div className="channel-list channel-list-disabled">
            {CHANNEL_DEFINITIONS.slice(channelCount).map((ch) => (
              <div key={ch.id} className="channel-chip channel-chip-disabled">
                <span className="channel-dot" style={{ backgroundColor: '#CBD5E1' }} />
                {ch.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Predefined Networks */}
      <div className="config-group">
        <label className="config-label">Network Examples</label>
        <div className="preset-list">
          {PREDEFINED_NETWORKS.map((preset) => (
            <button
              key={preset.name}
              className="preset-btn"
              onClick={() => loadPreset(preset.name)}
              disabled={!isIdle}
              title={`Load ${preset.name} preset`}
            >
              <span className="preset-btn-icon">{presetIcons[preset.name]}</span>
              <span className="preset-btn-text">
                <strong>{preset.name}</strong>
                <small>{preset.apCount} Access Points</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Random */}
      <button
        className="btn btn-generate"
        onClick={generateRandom}
        disabled={!isIdle}
        title="Generate a random network topology"
      >
        <Shuffle size={16} />
        Generate Random Network
      </button>
    </motion.div>
  );
}
