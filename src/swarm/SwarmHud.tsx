import { useSwarm } from './SwarmProvider';

export function SwarmHud() {
  const { stats, enabled, skip, toggle } = useSwarm();
  const pct = stats.total ? Math.round((stats.built / stats.total) * 100) : 100;
  const building = enabled && stats.built < stats.total;

  return (
    <div className="hud" role="region" aria-label="Build animation controls">
      <div className="hud-line">
        <span className={`hud-dot ${enabled ? 'on' : ''}`} />
        <span>SWARM</span>
        <span className="hud-dim">{enabled ? `${stats.agents} agents` : 'offline'}</span>
      </div>
      {enabled && (
        <div className="hud-bar" aria-label={`Page built ${pct}%`}>
          <span style={{ width: `${pct}%` }} />
        </div>
      )}
      <div className="hud-actions">
        {building && (
          <button type="button" onClick={skip}>
            Skip build
          </button>
        )}
        <button type="button" onClick={toggle} aria-pressed={enabled}>
          {enabled ? 'Swarm off' : 'Swarm on'}
        </button>
      </div>
    </div>
  );
}
