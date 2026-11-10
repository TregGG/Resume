import { SwarmProvider } from '../swarm/SwarmProvider';
import { SwarmHud } from '../swarm/SwarmHud';
import { T } from '../swarm/T';
import { activities, education, focusAreas, profile, skills } from '../data/profile';
import { archive, heroProjects } from '../data/projects';
import { GlitchName } from './Glitch';
import { Specimen } from './Specimen';
import { Win } from './Win';

const SWARM_COLORS = ['#ff4a00', '#edeae4', '#ff7a3d', '#8c877f'];

const NAV: [string, string, string][] = [
  ['01', 'Focus', '#focus'],
  ['02', 'Builds', '#builds'],
  ['03', 'Archive', '#archive'],
  ['04', 'Toolchain', '#toolchain'],
  ['05', 'Contact', '#contact'],
];

function Btn({ href, children, size = 'lg', external }: { href: string; children: string; size?: 'lg' | 'sm'; external?: boolean }) {
  return (
    <a
      className={`btn btn--${size}`}
      href={href}
      data-sw="chip"
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <span className="btn__fill" />
      {children}
      <i>↗</i>
    </a>
  );
}

function SecHead({ idx, title }: { idx: string; title: string }) {
  return (
    <div className="sec-head">
      <span className="sec-head__idx">[{idx}]</span>
      <T as="h2" className="sec-head__title">{title}</T>
    </div>
  );
}

function Nav() {
  return (
    <header className="nav">
      <a className="nav__brand" id="sw-logo" href="#top" aria-label="Aryan Jain, back to top">
        AJ<span className="blink">_</span>
      </a>
      <nav aria-label="Sections">
        <ul className="nav__links">
          {NAV.map(([n, l, h]) => (
            <li key={h}>
              <a href={h}>
                <b>{n}</b>
                {l}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="nav__cta">
        <Btn href={`mailto:${profile.emails[0]}`} size="sm">
          Say hi
        </Btn>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__top">
        <span className="tag" data-sw="chip">
          <span className="tag__sq" />
          ECE · IIT Roorkee · Class of 2028
        </span>
        <span className="hero__coords">29.85°N 77.89°E</span>
      </div>
      <div className="hero__mark">
        <Specimen size="clamp(40px, 12.4vw, 168px)">
          <GlitchName first="ARYAN" second="JAIN" />
        </Specimen>
      </div>
      <div className="hero__foot">
        <div className="hero__copy">
          <T as="p" className="hero__tagline">{profile.tagline}</T>
          <T as="p">{profile.summary}</T>
        </div>
        <div className="hero__cta">
          <Btn href="#builds">View builds</Btn>
          <Btn href={profile.links[0].href} external>
            GitHub
          </Btn>
        </div>
      </div>
    </section>
  );
}

function Pair() {
  return (
    <section className="pair" aria-label="What I do">
      <Win label="HW.01" className="pair__win">
        <div className="pair__art">
          <Specimen size="clamp(90px, 11vw, 170px)" note="0b01 · gate level">
            <span className="glyphs">
              <span data-glyph="0" className="solid">0</span>
              <span data-glyph="1" className="outline">1</span>
            </span>
          </Specimen>
        </div>
        <div className="pair__body">
          <p className="pair__kicker">
            {'<HI,'}
            <b>RECRUITER</b>
            {'>={'}
          </p>
          <T as="h3" className="pair__title is-orange">Hardware</T>
          <T as="p" className="pair__text">
            I like starting from the bottom: logic gates that become processors, and FPGAs that end up drawing on a screen.
          </T>
        </div>
      </Win>
      <span className="pair__plus" aria-hidden="true">+</span>
      <Win label="SW.02" className="pair__win">
        <div className="pair__art">
          <Specimen size="clamp(90px, 11vw, 170px)" note="0x2F · full stack">
            <span className="glyphs">
              <span data-glyph="<" className="solid">{'<'}</span>
              <span data-glyph="/" className="outline">/</span>
              <span data-glyph=">" className="solid">{'>'}</span>
            </span>
          </Specimen>
        </div>
        <div className="pair__body">
          <p className="pair__kicker">
            {'(HI,'}
            <b>ENGINEER</b>
            {')={+'}
          </p>
          <T as="h3" className="pair__title">Software</T>
          <T as="p" className="pair__text">
            Then I climb the stack: GPU compute, real-time systems, streaming ML and the engines that tie it together.
          </T>
        </div>
      </Win>
    </section>
  );
}

function Focus() {
  return (
    <section className="block" id="focus">
      <SecHead idx="01" title="Focus" />
      <div className="tiers">
        {focusAreas.map((f, i) => (
          <div className="tier" key={f.code}>
            <div className="tier__name">
              <b>{String(i + 1).padStart(2, '0')}</b>
              <T as="span">{f.code}</T>
            </div>
            <div className="tier__body tier__body--row">
              <T as="h3" className="tier__title">{f.title}</T>
              <T as="p" className="tier__text">{f.text}</T>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Builds() {
  return (
    <section className="block" id="builds">
      <SecHead idx="02" title="Builds" />
      <div className="builds">
        {heroProjects.map((p, i) => (
          <Win key={p.id} label={`${String(i + 1).padStart(2, '0')} · ${(p.codename ?? p.category).toUpperCase()}`} className="build">
            <div className="build__top">
              <span className="micro is-orange">{p.category}</span>
              <span className="micro">{p.stack[0]}</span>
            </div>
            <T as="h3" className="build__title">{p.title}</T>
            <T as="p" className="build__blurb">{p.blurb}</T>
            <div className="build__metrics">
              {p.metrics.map((m) => (
                <div className="metric" key={m.label} data-sw="chip">
                  <b>{m.value}</b>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
            <ul className="build__bullets">
              {p.bullets.map((b) => (
                <T as="li" key={b}>{b}</T>
              ))}
            </ul>
            <div className="build__foot">
              <ul className="chips">
                {p.stack.map((s) => (
                  <li className="chip" key={s} data-sw="chip">
                    {s}
                  </li>
                ))}
              </ul>
              {p.repo && (
                <a className="ulink" href={p.repo} target="_blank" rel="noreferrer">
                  Source ↗
                </a>
              )}
            </div>
          </Win>
        ))}
      </div>
    </section>
  );
}

function Archive() {
  return (
    <section className="block" id="archive">
      <SecHead idx="03" title="Archive" />
      <div className="tiers">
        {archive.map((g, gi) => (
          <div className="tier" key={g.category}>
            <div className="tier__name">
              <b>{String(gi + 1).padStart(2, '0')}</b>
              <T as="span">{g.category}</T>
              <em>[{g.projects.length}]</em>
            </div>
            <div className="tier__body tier__grid">
              {g.projects.map((p) => (
                <div className="item" key={p.title} data-sw="box">
                  <div className="item__head">
                    <T as="h4">{p.title}</T>
                    {p.repo && (
                      <a className="ulink" href={p.repo} target="_blank" rel="noreferrer" aria-label={`${p.title} source`}>
                        ↗
                      </a>
                    )}
                  </div>
                  <T as="p">{p.text}</T>
                  <ul className="chips">
                    {p.stack.map((s) => (
                      <li className="chip" key={s} data-sw="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Toolchain() {
  return (
    <section className="block" id="toolchain">
      <SecHead idx="04" title="Toolchain" />
      <div className="tiers">
        {skills.map((g, i) => (
          <div className="tier" key={g.group}>
            <div className="tier__name">
              <b>{String(i + 1).padStart(2, '0')}</b>
              <T as="span">{g.group}</T>
            </div>
            <div className="tier__body">
              <ul className="chips chips--lg">
                {g.items.map((s) => (
                  <li className="chip" key={s} data-sw="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        <div className="tier">
          <div className="tier__name">
            <b>06</b>
            <T as="span">School</T>
          </div>
          <div className="tier__body tier__body--row">
            <div>
              <T as="h3" className="tier__title">{education.school}</T>
              <T as="p" className="tier__text">{`${education.degree} · ${education.years} · ${education.status}`}</T>
            </div>
            <div className="school__side">
              <span className="micro">Activities</span>
              {activities.map((a) => (
                <T as="p" className="tier__text" key={a.title}>{a.years ? `${a.title} — ${a.org}, ${a.years}` : `${a.title} — ${a.org}`}</T>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const rows: [string, string, string][] = [
    ['Email', profile.emails[0], `mailto:${profile.emails[0]}`],
    ['Institute', profile.emails[1], `mailto:${profile.emails[1]}`],
    ['GitHub', profile.links[0].value, profile.links[0].href],
    ['Codeforces', profile.links[1].value, profile.links[1].href],
  ];
  return (
    <section className="contact" id="contact">
      <div className="contact__side">
        <span className="sec-head__idx">[05]</span>
        <h2 className="contact__title">
          <span>Open a</span>
          <span className="hl">channel</span>
        </h2>
        <T as="p" className="muted">Internships, research, or a hard systems problem: I am happy to talk. Email is fastest.</T>
      </div>
      <ol className="contact__list">
        {rows.map(([k, v, href], i) => (
          <li key={k} data-sw="box">
            <span className="micro is-orange">{String(i + 1).padStart(2, '0')}</span>
            <span className="micro">{k}</span>
            <a
              className="contact__link"
              href={href}
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {v} <i>↗</i>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__big" aria-hidden="true">
        Gates → GPUs<span className="blink">_</span>
      </p>
      <div className="footer__row">
        <span>© {new Date().getFullYear()} Aryan Jain</span>
        <span>
          <a href="./v1/">v1 (neon)</a> · Build animation inspired by{' '}
          <a href="https://github.com/califa/swarm-site" target="_blank" rel="noreferrer">
            Swarm by Joel Califa
          </a>
        </span>
      </div>
    </footer>
  );
}

export default function AppV2() {
  return (
    <SwarmProvider colors={SWARM_COLORS}>
      <Nav />
      <main>
        <Hero />
        <Pair />
        <Focus />
        <Builds />
        <Archive />
        <Toolchain />
        <Contact />
      </main>
      <Footer />
      <SwarmHud />
    </SwarmProvider>
  );
}
