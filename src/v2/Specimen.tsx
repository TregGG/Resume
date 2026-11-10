import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/* JetBrains Mono vertical metrics (units per em = 1000). With line-height 1.32 the
   baseline sits exactly 1.02em below the top of the line box. */
const METRICS: [string, number, number][] = [
  ['ASC', 1020, 0],
  ['CAP', 730, 0.29],
  ['X', 550, 0.47],
  ['BASE', 0, 1.02],
  ['DESC', -300, 1.32],
];

const code = (ch: string) => `U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`;

/**
 * Type-specimen frame: ascender/cap/x/base/descender guides, dashed glyph columns with
 * Unicode labels and orange crosshairs, plus an advance-width measure. Columns are
 * measured from the [data-glyph] spans of the children, so they follow any content.
 */
export function Specimen({
  children,
  size,
  note = 'JetBrains Mono · 800',
  className = '',
}: {
  children: ReactNode;
  size: string;
  note?: string;
  className?: string;
}) {
  const typeRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState<{ x: number; label?: string }[]>([]);

  useLayoutEffect(() => {
    const el = typeRef.current;
    if (!el) return;
    const measure = () => {
      const base = el.getBoundingClientRect();
      const glyphs = Array.from(el.querySelectorAll<HTMLElement>('[data-glyph]'));
      const out: { x: number; label?: string }[] = [];
      for (const g of glyphs) {
        const r = g.getBoundingClientRect();
        const ch = g.dataset.glyph!;
        out.push({ x: r.left - base.left, label: ch.trim() ? code(ch) : undefined });
      }
      const last = glyphs[glyphs.length - 1];
      if (last) out.push({ x: last.getBoundingClientRect().right - base.left });
      setCols(out);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, []);

  const adv = cols.length > 1 ? cols[1].x - cols[0].x : 0;

  return (
    <div className={`spec ${className}`} style={{ '--spec-size': size } as CSSProperties}>
      <div className="spec__type" ref={typeRef}>
        {METRICS.map(([name, val, em]) => (
          <div
            key={name}
            className={`spec__line${name === 'BASE' ? ' is-base' : ''}`}
            style={{ top: `${em}em` }}
            data-sw="line"
          >
            <span className="spec__metric">
              {name} <b>{val}</b>
            </span>
          </div>
        ))}
        {cols.map((c, i) => (
          <div className="spec__col" key={i} style={{ left: c.x }} aria-hidden="true">
            {c.label && i < cols.length - 1 && <span className="spec__code">{c.label}</span>}
            {[0.29, 0.47, 1.02].map((em) => (
              <i key={em} className="spec__plus" style={{ top: `${em}em` }} />
            ))}
          </div>
        ))}
        {children}
        {adv > 0 && (
          <div className="spec__measure" style={{ left: cols[0].x, width: adv }} aria-hidden="true">
            <span>600</span>
          </div>
        )}
        <div className="spec__note" aria-hidden="true">
          {note}
        </div>
      </div>
    </div>
  );
}
