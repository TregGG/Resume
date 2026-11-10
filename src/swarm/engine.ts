/*
 * Swarm build engine.
 * Inspired by the behavior of "Swarm" by Joel Califa (and the swarm-cursors rebuild):
 * a flock of named cursors flies in and assembles the page element by element.
 *
 * Every element marked with data-sw="box" | "chip" | "text" | "line" starts hidden
 * (see swarm.css, only while <html> has .sw-on). The engine assigns each one to a cursor:
 *   box / chip -> crosshair drags a draft rectangle with a live W × H badge, then the element appears
 *   text       -> I-beam types the text with a caret
 *   line       -> pen draws the rule from left to right
 * All coordinates are page coordinates; the overlay layer is absolutely positioned at the
 * document origin, so cursors scroll with the page and visibly chase the viewport.
 */

type Kind = 'box' | 'chip' | 'text' | 'line';
type Glyph = 'arrow' | 'cross' | 'ibeam' | 'pen';

interface Item {
  el: HTMLElement;
  kind: Kind;
  parent: Item | null;
  state: 'pending' | 'assigned' | 'built';
}

interface Task {
  item: Item;
  phase: 'fly' | 'work';
  t: number;
  dur: number;
  sx: number;
  sy: number;
  w: number;
  h: number;
  draft?: HTMLDivElement;
  badge?: HTMLSpanElement;
  text?: string;
  textNode?: Text;
  caret?: HTMLElement;
  typed?: HTMLElement;
  shown?: number;
  cps?: number;
}

interface Agent {
  name: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  maxSpeed: number;
  maxForce: number;
  phase: number;
  orbitR: number;
  spin: number;
  tilt: number;
  glyph: Glyph;
  el: HTMLDivElement;
  task: Task | null;
  leaving: boolean;
}

export interface SwarmStats {
  agents: number;
  built: number;
  total: number;
  running: boolean;
}

const NAMES = [
  'n3tr', '0xA1', 'ghost', 'vex', 'r1ot', 'kuro', 'byte', 'synth', 'neon', 'glitch', 'echo', 'zer0',
  'flux', 'hex', 'ion', 'nova', 'pix', 'raze', 'sable', 'trace', 'volt', 'wisp', 'yara', 'koda',
  'lumen', 'm4x', 'orbit', 'qbit', 'rune', 'shade', 'vanta', 'axon', 'blip', 'crux', 'dyn', 'jinx',
];
const COLORS = ['#00f0ff', '#ff2bd6', '#fcee0a', '#39ff14', '#ff7a00', '#a46bff', '#ff4d8d', '#00ffc3'];

const INTRO_AGENTS = 16;
const MAX_AGENTS = 40;
const IDLE_KEEP = 9;
const INTRO_TIME = 1.5;

const between = (lo: number, hi: number) => lo + (hi - lo) * Math.random();
const limit = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
/** Cosine ease: starts and ends at rest. */
const glide = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

const GLYPHS = `
<svg class="g g-arrow" width="16" height="22" viewBox="0 0 16 22"><path d="M1 1 L1 17 L5.2 13.2 L8 20 L10.6 18.9 L7.8 12.3 L13.5 12.3 Z" fill="var(--c)" stroke="#05050a" stroke-width="1.4" stroke-linejoin="round"/></svg>
<svg class="g g-cross" width="21" height="21" viewBox="0 0 21 21"><path d="M10.5 1 V20 M1 10.5 H20" stroke="#05050a" stroke-width="3.6"/><path d="M10.5 1.5 V19.5 M1.5 10.5 H19.5" stroke="var(--c)" stroke-width="1.6"/></svg>
<svg class="g g-ibeam" width="12" height="20" viewBox="0 0 12 20"><path d="M2 1.5 Q6 1.5 6 4 V16 Q6 18.5 2 18.5 M10 1.5 Q6 1.5 6 4 V16 Q6 18.5 10 18.5" fill="none" stroke="#05050a" stroke-width="3.4"/><path d="M2 1.5 Q6 1.5 6 4 V16 Q6 18.5 2 18.5 M10 1.5 Q6 1.5 6 4 V16 Q6 18.5 10 18.5" fill="none" stroke="var(--c)" stroke-width="1.5"/></svg>
<svg class="g g-pen" width="20" height="20" viewBox="0 0 20 20"><path d="M1 19 L3 13 L14 2 L18 6 L7 17 Z" fill="var(--c)" stroke="#05050a" stroke-width="1.4" stroke-linejoin="round"/><path d="M3 13 L7 17" stroke="#05050a" stroke-width="1.2"/></svg>`;

export class SwarmEngine {
  private layer: HTMLElement;
  private items: Item[] = [];
  private agents: Agent[] = [];
  private raf = 0;
  private last = 0;
  private time = 0;
  private schedAcc = 0;
  private spawnAcc = 0;
  private idleFor = 0;
  private nameIdx = 0;
  private mouse = { x: -9999, y: -9999, at: -99 };
  private running = false;
  private listeners = new Set<(s: SwarmStats) => void>();
  private statAcc = 0;

  private colors: string[];

  constructor(layer: HTMLElement, opts: { colors?: string[] } = {}) {
    this.layer = layer;
    this.colors = opts.colors?.length ? opts.colors : COLORS;
  }

  /* ---------- public API ---------- */

  subscribe(fn: (s: SwarmStats) => void) {
    this.listeners.add(fn);
    fn(this.stats());
    return () => {
      this.listeners.delete(fn);
    };
  }

  start(withIntro = true) {
    if (this.running) return;
    this.running = true;
    this.scan();
    this.time = withIntro ? 0 : INTRO_TIME;
    if (withIntro) {
      for (let i = 0; i < INTRO_AGENTS; i++) this.spawn(i % 2 === 0 ? 'left' : 'right');
    } else {
      for (let i = 0; i < IDLE_KEEP; i++) this.spawn(i % 2 === 0 ? 'left' : 'right');
    }
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    window.addEventListener('pointerdown', this.onPointer, { passive: true });
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
    this.emit();
  }

  /** Finish every element instantly and remove all cursors. */
  stop() {
    this.buildAll();
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onPointer);
    window.removeEventListener('pointerdown', this.onPointer);
    for (const a of this.agents) {
      if (a.task) this.dropTask(a);
      a.el.remove();
    }
    this.agents = [];
    this.emit();
  }

  /** Tear down without touching page content (used on unmount). */
  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onPointer);
    window.removeEventListener('pointerdown', this.onPointer);
    for (const a of this.agents) {
      a.task?.draft?.remove();
      a.el.remove();
    }
    this.agents = [];
    this.listeners.clear();
  }

  /** Finish every element instantly but keep the swarm flying. */
  buildAll() {
    if (!this.items.length) this.scan();
    for (const a of this.agents) if (a.task) this.dropTask(a);
    for (const it of this.items) if (it.state !== 'built') this.finish(it);
    this.emit();
  }

  /* ---------- setup ---------- */

  private scan() {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-sw]'));
    const map = new Map<HTMLElement, Item>();
    this.items = els.map((el) => {
      const kind = el.dataset.sw as Kind;
      const parentEl = el.parentElement?.closest<HTMLElement>('[data-sw]') ?? null;
      const it: Item = {
        el,
        kind,
        parent: parentEl ? map.get(parentEl) ?? null : null,
        state: el.classList.contains('sw-built') ? 'built' : 'pending',
      };
      map.set(el, it);
      return it;
    });
  }

  private onPointer = (e: PointerEvent) => {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.at = this.time;
  };

  private spawn(side: 'left' | 'right' | 'auto') {
    if (side === 'auto') side = Math.random() < 0.5 ? 'left' : 'right';
    const vw = document.documentElement.clientWidth;
    const pace = Math.random() ** 2; // mostly steady cursors, a few quick ones
    const color = this.colors[this.nameIdx % this.colors.length];
    const name = NAMES[this.nameIdx % NAMES.length];
    this.nameIdx++;
    const el = document.createElement('div');
    el.className = 'sw-agent';
    el.style.setProperty('--c', color);
    el.innerHTML = `${GLYPHS}<span class="sw-tag">${name}</span>`;
    el.dataset.glyph = 'arrow';
    this.layer.appendChild(el);
    const a: Agent = {
      name,
      color,
      x: side === 'left' ? between(-80, -30) : vw + between(30, 80),
      y: window.scrollY + between(0.1, 0.9) * window.innerHeight,
      vx: side === 'left' ? between(200, 500) : -between(200, 500),
      vy: between(-120, 120),
      maxSpeed: 520 + 900 * pace,
      maxForce: 1900 + 3800 * pace,
      phase: between(0, Math.PI * 2),
      orbitR: between(0.55, 1.25),
      spin: (Math.random() < 0.5 ? -1 : 1) * between(0.7, 1.4),
      tilt: 0,
      glyph: 'arrow',
      el,
      task: null,
      leaving: false,
    };
    this.agents.push(a);
    return a;
  }

  /* ---------- main loop ---------- */

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;
    this.step(dt);
    this.raf = requestAnimationFrame(this.frame);
  };

  private step(dt: number) {
    if (this.time >= INTRO_TIME) {
      this.schedAcc += dt;
      if (this.schedAcc > 0.08) {
        this.schedAcc = 0;
        this.schedule();
      }
    }
    this.spawnAcc = Math.max(0, this.spawnAcc - dt);

    const anchor = this.anchor();
    for (const a of this.agents) {
      if (a.task) this.runTask(a, dt);
      else this.idle(a, anchor, dt);
    }
    this.agents = this.agents.filter((a) => {
      if (!a.leaving) return true;
      const vw = document.documentElement.clientWidth;
      if (a.x < -120 || a.x > vw + 120) {
        a.el.remove();
        return false;
      }
      return true;
    });
    for (const a of this.agents) this.render(a);

    this.statAcc += dt;
    if (this.statAcc > 0.25) {
      this.statAcc = 0;
      this.emit();
    }
  }

  /* ---------- scheduling ---------- */

  private schedule() {
    const top = window.scrollY;
    const bottom = top + window.innerHeight;
    const eligible: { it: Item; x: number; y: number }[] = [];
    const instant: Item[] = [];
    for (const it of this.items) {
      if (it.state !== 'pending') continue;
      if (it.parent && it.parent.state !== 'built') continue;
      const r = it.el.getBoundingClientRect();
      const pt = r.top + top;
      const pb = r.bottom + top;
      if (pb < top - 10) instant.push(it); // scrolled past: no point animating it
      else if (pt < bottom + 30) eligible.push({ it, x: r.left + window.scrollX, y: pt });
    }
    for (const it of instant) this.finish(it);

    const idle = this.agents.filter((a) => !a.task && !a.leaving);
    let assigned = 0;
    for (const e of eligible) {
      if (!idle.length) break;
      let best = 0;
      let bd = Infinity;
      for (let i = 0; i < idle.length; i++) {
        const d = (idle[i].x - e.x) ** 2 + (idle[i].y - e.y) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      }
      this.assign(idle[best], e.it);
      idle.splice(best, 1);
      assigned++;
    }

    const backlog = eligible.length - assigned;
    if (backlog > 0 && this.agents.length < MAX_AGENTS && this.spawnAcc === 0) {
      this.spawn('auto');
      this.spawnAcc = 0.06;
    }

    const busy = this.agents.some((a) => a.task);
    if (!busy && eligible.length === 0) this.idleFor += 0.08;
    else this.idleFor = 0;
    if (this.idleFor > 2.5) {
      const active = this.agents.filter((a) => !a.leaving);
      for (let i = IDLE_KEEP; i < active.length; i++) active[i].leaving = true;
    }
  }

  private assign(a: Agent, it: Item) {
    it.state = 'assigned';
    const r = it.el.getBoundingClientRect();
    const sx = r.left + window.scrollX;
    const sy = r.top + window.scrollY;
    const task: Task = { item: it, phase: 'fly', t: 0, dur: 0, sx, sy, w: r.width, h: r.height };
    if (it.kind === 'text') {
      const p = this.caretStart(it.el);
      task.sx = p.x;
      task.sy = p.y;
    } else if (it.kind === 'line') {
      task.sy = sy + r.height / 2;
    }
    a.task = task;
    a.leaving = false;
    this.setGlyph(a, 'arrow');
  }

  private caretStart(el: HTMLElement) {
    const ghost = el.querySelector<HTMLElement>('.sw-ghost');
    const r = (ghost ?? el).getBoundingClientRect();
    const lh = parseFloat(getComputedStyle(el).lineHeight) || r.height;
    return { x: r.left + window.scrollX, y: r.top + window.scrollY + Math.min(lh, r.height) / 2 };
  }

  /* ---------- tasks ---------- */

  private runTask(a: Agent, dt: number) {
    const t = a.task!;
    if (t.phase === 'fly') {
      t.t += dt;
      this.steer(a, t.sx, t.sy, dt, true);
      // the timeout guards against a cursor jostled by neighbours never quite settling
      if (Math.hypot(t.sx - a.x, t.sy - a.y) < 6 || t.t > 3) this.beginWork(a, t);
      return;
    }
    t.t += dt;
    const it = t.item;
    if (it.kind === 'text') {
      const n = Math.min(t.text!.length, Math.floor(t.t * t.cps!));
      if (n !== t.shown) {
        t.shown = n;
        t.textNode!.data = t.text!.slice(0, n);
      }
      const cr = t.caret!.getBoundingClientRect();
      a.x = cr.left + window.scrollX + 1;
      a.y = cr.top + window.scrollY + cr.height / 2;
      if (n >= t.text!.length && t.t > t.text!.length / t.cps! + 0.12) this.complete(a);
      return;
    }
    const p = limit(t.t / t.dur, 0, 1);
    const e = glide(p);
    if (it.kind === 'line') {
      it.el.style.setProperty('--sw-p', String(e));
      a.x = t.sx + t.w * e;
      a.y = t.sy;
    } else {
      const w = t.w * e;
      const h = t.h * e;
      t.draft!.style.width = `${w}px`;
      t.draft!.style.height = `${h}px`;
      if (t.badge) t.badge.textContent = `${Math.round(w)} × ${Math.round(h)}`;
      a.x = t.sx + w;
      a.y = t.sy + h;
    }
    a.vx = a.vy = 0;
    if (p >= 1) this.complete(a);
  }

  private beginWork(a: Agent, t: Task) {
    t.phase = 'work';
    t.t = 0;
    const it = t.item;
    const r = it.el.getBoundingClientRect();
    t.w = r.width;
    t.h = r.height;
    if (it.kind === 'text') {
      this.setGlyph(a, 'ibeam');
      const ghost = it.el.querySelector<HTMLElement>('.sw-ghost');
      const typed = it.el.querySelector<HTMLElement>('.sw-typed');
      t.text = (ghost?.textContent ?? '').replace(/\s+/g, ' ');
      if (!typed || !t.text.length) {
        this.complete(a);
        return;
      }
      typed.textContent = '';
      t.textNode = document.createTextNode('');
      t.caret = document.createElement('i');
      t.caret.className = 'sw-caret';
      t.caret.style.setProperty('--c', a.color);
      typed.append(t.textNode, t.caret);
      t.typed = typed;
      t.shown = 0;
      t.cps = limit(t.text.length / 0.9, 28, 170);
      it.el.classList.add('sw-typing');
    } else if (it.kind === 'line') {
      this.setGlyph(a, 'pen');
      t.sx = r.left + window.scrollX;
      t.sy = r.top + window.scrollY + r.height / 2;
      t.dur = limit(0.2 + r.width / 1400, 0.25, 0.8);
      it.el.classList.add('sw-drawing');
    } else {
      this.setGlyph(a, 'cross');
      t.sx = r.left + window.scrollX;
      t.sy = r.top + window.scrollY;
      t.dur = it.kind === 'chip' ? between(0.14, 0.22) : limit(0.25 + Math.sqrt(r.width * r.height) / 1100, 0.3, 0.9);
      const d = document.createElement('div');
      d.className = 'sw-draft';
      d.style.setProperty('--c', a.color);
      d.style.transform = `translate(${t.sx}px, ${t.sy}px)`;
      if (it.kind === 'box') {
        t.badge = document.createElement('span');
        t.badge.className = 'sw-badge';
        d.appendChild(t.badge);
      }
      this.layer.appendChild(d);
      t.draft = d;
    }
    a.x = t.sx;
    a.y = t.sy;
  }

  private complete(a: Agent) {
    const t = a.task!;
    this.finish(t.item);
    if (t.draft) {
      const d = t.draft;
      d.classList.add('sw-draft-out');
      setTimeout(() => d.remove(), 450);
    }
    a.task = null;
    a.vx = between(-160, 160);
    a.vy = between(-160, 160);
    this.setGlyph(a, 'arrow');
  }

  private dropTask(a: Agent) {
    const t = a.task;
    if (!t) return;
    t.draft?.remove();
    if (t.item.state === 'assigned') t.item.state = 'pending';
    a.task = null;
    this.setGlyph(a, 'arrow');
  }

  private finish(it: Item) {
    it.state = 'built';
    const el = it.el;
    el.classList.remove('sw-typing', 'sw-drawing');
    el.style.removeProperty('--sw-p');
    const typed = el.querySelector<HTMLElement>(':scope > .sw-typed');
    if (typed) typed.textContent = '';
    el.classList.add('sw-built');
  }

  /* ---------- motion ---------- */

  private anchor() {
    const vw = document.documentElement.clientWidth;
    const sy = window.scrollY;
    if (this.time < INTRO_TIME) {
      const logo = document.getElementById('sw-logo');
      if (logo) {
        const r = logo.getBoundingClientRect();
        return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + sy, r: 110 };
      }
    }
    if (this.time - this.mouse.at < 4 && this.mouse.x > -999) {
      return { x: this.mouse.x + window.scrollX, y: this.mouse.y + sy, r: 70 };
    }
    // Dock in the lower-right corner of the viewport, out of the way of the content.
    return { x: vw - 80, y: sy + window.innerHeight - 110, r: 46 };
  }

  private idle(a: Agent, anc: { x: number; y: number; r: number }, dt: number) {
    if (a.leaving) {
      const vw = document.documentElement.clientWidth;
      const tx = a.x < vw / 2 ? -200 : vw + 200;
      this.steer(a, tx, a.y, dt, false);
      return;
    }
    const ang = this.time * a.spin + a.phase;
    const R = anc.r * a.orbitR * (1 + 0.15 * Math.sin(this.time * 0.6 + a.phase));
    this.steer(a, anc.x + Math.cos(ang) * R, anc.y + Math.sin(ang) * R * 0.8, dt, false);
  }

  private steer(a: Agent, tx: number, ty: number, dt: number, arrive: boolean) {
    const dx = tx - a.x;
    const dy = ty - a.y;
    const d = Math.hypot(dx, dy) || 1;
    const slow = arrive ? 160 : 60;
    const speed = d < slow ? a.maxSpeed * (d / slow) : a.maxSpeed;
    let fx = (dx / d) * speed - a.vx;
    let fy = (dy / d) * speed - a.vy;

    // separation + light alignment with nearby flyers
    let sx = 0, sy = 0, ax = 0, ay = 0, n = 0;
    const settling = arrive && d < 40;
    for (const b of this.agents) {
      if (settling) break;
      if (b === a || (b.task && b.task.phase === 'work')) continue;
      const ox = a.x - b.x;
      const oy = a.y - b.y;
      const od = Math.hypot(ox, oy);
      if (od > 0 && od < 26) {
        sx += (ox / od) * (26 - od) * 40;
        sy += (oy / od) * (26 - od) * 40;
      }
      if (!arrive && od < 90) {
        ax += b.vx;
        ay += b.vy;
        n++;
      }
    }
    fx += sx;
    fy += sy;
    if (n) {
      fx = fx * 0.75 + (ax / n - a.vx) * 0.25;
      fy = fy * 0.75 + (ay / n - a.vy) * 0.25;
    }

    // keep clear of the real mouse pointer
    if (!arrive) {
      const mx = this.mouse.x + window.scrollX;
      const my = this.mouse.y + window.scrollY;
      const md = Math.hypot(a.x - mx, a.y - my);
      if (md < 50 && md > 0) {
        fx += ((a.x - mx) / md) * 5000;
        fy += ((a.y - my) / md) * 5000;
      }
    }

    const fm = Math.hypot(fx, fy);
    const lim = a.maxForce * (arrive ? 1.4 : 1);
    if (fm > lim) {
      fx = (fx / fm) * lim;
      fy = (fy / fm) * lim;
    }
    a.vx += fx * dt * 4;
    a.vy += fy * dt * 4;
    const v = Math.hypot(a.vx, a.vy);
    if (v > a.maxSpeed) {
      a.vx = (a.vx / v) * a.maxSpeed;
      a.vy = (a.vy / v) * a.maxSpeed;
    }
    a.x += a.vx * dt;
    a.y += a.vy * dt;
  }

  private setGlyph(a: Agent, g: Glyph) {
    if (a.glyph === g) return;
    a.glyph = g;
    a.el.dataset.glyph = g;
  }

  private render(a: Agent) {
    const target = a.glyph === 'arrow' ? limit(a.vx * 0.02, -22, 22) : 0;
    a.tilt += (target - a.tilt) * 0.2;
    a.el.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
    a.el.style.setProperty('--tilt', `${a.tilt.toFixed(1)}deg`);
  }

  /* ---------- stats ---------- */

  private stats(): SwarmStats {
    let built = 0;
    for (const it of this.items) if (it.state === 'built') built++;
    return {
      agents: this.agents.filter((a) => !a.leaving).length,
      built,
      total: this.items.length,
      running: this.running,
    };
  }

  private emit() {
    const s = this.stats();
    for (const fn of this.listeners) fn(s);
  }
}
