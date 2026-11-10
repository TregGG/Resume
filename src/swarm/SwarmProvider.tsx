import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { SwarmEngine, type SwarmStats } from './engine';

interface SwarmCtx {
  stats: SwarmStats;
  enabled: boolean;
  skip: () => void;
  toggle: () => void;
}

const Ctx = createContext<SwarmCtx | null>(null);

const save = (v: 'on' | 'off') => {
  try {
    localStorage.setItem('swarm', v);
  } catch {
    /* storage unavailable: preference just isn't remembered */
  }
};

export function SwarmProvider({ children, colors }: { children: ReactNode; colors?: string[] }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SwarmEngine | null>(null);
  const [stats, setStats] = useState<SwarmStats>({ agents: 0, built: 0, total: 0, running: false });
  const [enabled, setEnabled] = useState(() => document.documentElement.classList.contains('sw-on'));

  useEffect(() => {
    const engine = new SwarmEngine(layerRef.current!, { colors });
    engineRef.current = engine;
    const unsub = engine.subscribe(setStats);
    if (document.documentElement.classList.contains('sw-on')) engine.start(true);
    return () => {
      unsub();
      engine.destroy();
    };
  }, []);

  const skip = useCallback(() => engineRef.current?.buildAll(), []);

  const toggle = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (enabled) {
      engine.stop();
      save('off');
      setEnabled(false);
    } else {
      // Content is already fully visible; mark it built so turning the swarm on never hides anything.
      document.querySelectorAll('[data-sw]').forEach((el) => el.classList.add('sw-built'));
      document.documentElement.classList.add('sw-on');
      engine.start(false);
      save('on');
      setEnabled(true);
    }
  }, [enabled]);

  return (
    <Ctx.Provider value={{ stats, enabled, skip, toggle }}>
      <div className="sw-root">
        {children}
        <div className="sw-layer" ref={layerRef} aria-hidden="true" />
      </div>
    </Ctx.Provider>
  );
}

export function useSwarm() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSwarm must be used inside SwarmProvider');
  return c;
}
