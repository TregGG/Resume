import { useCallback, useEffect, useRef, useState } from 'react';

const NOISE = '█▓▒░#%&@$<>/\\_=+*01';
const reduceMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

/**
 * The hero name: "FIRST" in orange plus "SECOND" on an orange block.
 * Glitch = two clipped colour copies that slice and shift + a short character scramble,
 * fired in random bursts and on hover. Each glyph carries data-glyph so <Specimen>
 * can draw guide columns at the real glyph edges.
 */
export function GlitchName({ first, second }: { first: string; second: string }) {
  const [a, setA] = useState(first);
  const [b, setB] = useState(second);
  const [on, setOn] = useState(false);
  const busy = useRef(false);

  const burst = useCallback(() => {
    if (busy.current || reduceMotion()) return;
    busy.current = true;
    setOn(true);
    const scramble = (s: string) =>
      s
        .split('')
        .map((ch) => (Math.random() < 0.22 ? NOISE[(Math.random() * NOISE.length) | 0] : ch))
        .join('');
    let ticks = 0;
    const id = window.setInterval(() => {
      ticks++;
      setA(scramble(first));
      setB(scramble(second));
      if (ticks >= 7) {
        window.clearInterval(id);
        setA(first);
        setB(second);
        setOn(false);
        busy.current = false;
      }
    }, 55);
  }, [first, second]);

  useEffect(() => {
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => {
        burst();
        loop();
      }, 2200 + Math.random() * 3200);
    };
    const start = window.setTimeout(() => {
      burst();
      loop();
    }, 900);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(t);
    };
  }, [burst]);

  const words = (glyphs: boolean) => (
    <>
      <span className="g-a">
        {a.split('').map((ch, i) => (
          <span key={i} data-glyph={glyphs ? first[i] : undefined}>
            {ch}
          </span>
        ))}
      </span>
      <span className="g-box">
        {b.split('').map((ch, i) => (
          <span key={i} data-glyph={glyphs ? second[i] : undefined}>
            {ch}
          </span>
        ))}
      </span>
    </>
  );

  return (
    // The h1's className must stay constant: the swarm engine adds .sw-built to it, and a
    // React re-render that changes className would wipe that class and hide the name again.
    // The glitch state therefore lives on an inner wrapper.
    <h1 className="g-name" data-sw="box" aria-label={`${first} ${second}`} onPointerEnter={burst}>
      <span className={`g-wrap${on ? ' is-glitch' : ''}`}>
        <span className="g-layer g-base" aria-hidden="true">
          {words(true)}
        </span>
        <span className="g-layer g-c1" aria-hidden="true">
          {words(false)}
        </span>
        <span className="g-layer g-c2" aria-hidden="true">
          {words(false)}
        </span>
      </span>
    </h1>
  );
}
