import { T } from '../swarm/T';
import { activities, education, focusAreas, profile, skills } from '../data/profile';
import { archive, heroProjects, type HeroProject } from '../data/projects';

const NAV = [
  ['01', 'About', '#about'],
  ['02', 'Skills', '#skills'],
  ['03', 'Projects', '#projects'],
  ['04', 'Archive', '#archive'],
  ['05', 'Education', '#education'],
  ['06', 'Contact', '#contact'],
];

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap">
        <a className="logo" id="sw-logo" href="#top" aria-label="Aryan Jain, back to top">
          A<span>J</span>
        </a>
        <nav aria-label="Sections">
          <ul className="nav-links">
            {NAV.map(([n, label, href]) => (
              <li key={href}>
                <a href={href}>
                  <b>{n}</b>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn ghost" href="#contact">
          Contact
        </a>
      </div>
    </header>
  );
}

function SectionHead({ num, title, lead }: { num: string; title: string; lead?: string }) {
  return (
    <div className="sec-head">
      <T as="div" className="sec-num">{`// ${num}`}</T>
      <T as="h2" className="sec-title">{title}</T>
      <div className="sec-rule" data-sw="line" />
      {lead && <T as="p" className="sec-lead">{lead}</T>}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div>
          <T as="p" className="kicker">{'// sys.boot — portfolio v1.0'}</T>
          <T as="h1" className="glitch" data-text={profile.name}>{profile.name}</T>
          <T as="p" className="tagline">{profile.tagline}</T>
          <T as="p" className="role">{profile.role}</T>
          <T as="p" className="summary">{profile.summary}</T>
          <div className="cta">
            <a className="btn" href="#projects" data-sw="chip">View projects</a>
            <a className="btn ghost" href={profile.links[0].href} target="_blank" rel="noreferrer" data-sw="chip">
              GitHub ↗
            </a>
            <a className="btn ghost" href={`mailto:${profile.emails[0]}`} data-sw="chip">
              Email
            </a>
          </div>
          <div className="stats">
            {profile.stats.map((s) => (
              <div className="panel stat" key={s.label} data-sw="box">
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel terminal" data-sw="box">
          <div className="term-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            ~/aryan — zsh
          </div>
          <div className="term-body">
            <p className="cmd"><T>whoami</T></p>
            <T as="p" className="out">aryan_jain · ece @ iit roorkee '28</T>
            <p className="cmd"><T>ls ~/stack</T></p>
            <T as="p" className="out cyan">systemverilog c++17 glsl python pytorch</T>
            <p className="cmd"><T>cat focus.txt</T></p>
            <T as="p" className="out">logic gates → cpus → gpu compute</T>
            <p className="cmd"><T>uptime</T></p>
            <T as="p" className="out cyan">21 projects · 5 domains</T>
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <SectionHead
          num="01"
          title="What I build"
          lead="Most of my work sits where hardware meets software. I like owning the whole stack, from the clock tree to the frame on screen."
        />
        <div className="grid focus">
          {focusAreas.map((f) => (
            <div className="panel focus-card" key={f.code} data-sw="box">
              <div className="code">{f.code}</div>
              <T as="h3">{f.title}</T>
              <T as="p">{f.text}</T>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <SectionHead num="02" title="Toolchain" />
        <div className="grid skills">
          {skills.map((g) => (
            <div className="panel skill-group" key={g.group} data-sw="box">
              <T as="h3">{g.group}</T>
              <ul className="chips">
                {g.items.map((s) => (
                  <li className="chip" key={s} data-sw="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const catClass: Record<string, string> = {
  Hardware: 'yellow',
  Graphics: 'magenta',
  Systems: '',
  'ML / Vision': 'magenta',
  Games: 'yellow',
};

function ProjectCard({ p, i }: { p: HeroProject; i: number }) {
  return (
    <article className="panel project" data-sw="box">
      <div className="project-top">
        <span className={`chip ${catClass[p.category]}`}>{p.category}</span>
        <span className="project-code">
          {String(i + 1).padStart(2, '0')}
          {p.codename ? ` · ${p.codename}` : ''}
        </span>
      </div>
      <T as="h3">{p.title}</T>
      <T as="p" className="blurb">{p.blurb}</T>
      <div className="metrics">
        {p.metrics.map((m) => (
          <div className="metric" key={m.label} data-sw="chip">
            <b>{m.value}</b>
            <span>{m.label}</span>
          </div>
        ))}
      </div>
      <ul className="bullets">
        {p.bullets.map((b) => (
          <T as="li" key={b}>{b}</T>
        ))}
      </ul>
      <div className="project-foot">
        <ul className="chips">
          {p.stack.map((s) => (
            <li className="chip" key={s} data-sw="chip">
              {s}
            </li>
          ))}
        </ul>
        {p.repo && (
          <a className="repo-link" href={p.repo} target="_blank" rel="noreferrer">
            Source ↗
          </a>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section className="section" id="projects">
      <div className="wrap">
        <SectionHead
          num="03"
          title="Featured builds"
          lead="Five projects across hardware, graphics, systems, ML and engines."
        />
        <div className="grid projects">
          {heroProjects.map((p, i) => (
            <ProjectCard p={p} i={i} key={p.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Archive() {
  return (
    <section className="section" id="archive">
      <div className="wrap">
        <SectionHead num="04" title="More projects" />
        {archive.map((g) => (
          <div className="archive-group" key={g.category}>
            <div className="archive-label">
              <T as="h3">{g.category}</T>
              <span className="count">[{g.projects.length}]</span>
              <div className="sec-rule" data-sw="line" />
            </div>
            <div className="grid archive">
              {g.projects.map((p) => (
                <div className="panel mini" key={p.title} data-sw="box">
                  <div className="mini-head">
                    <T as="h4">{p.title}</T>
                    {p.repo && (
                      <a className="repo-link" href={p.repo} target="_blank" rel="noreferrer">
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

export function Education() {
  return (
    <section className="section" id="education">
      <div className="wrap">
        <SectionHead num="05" title="Education" />
        <div className="grid edu">
          <div className="panel edu-card" data-sw="box">
            <div className="years">{education.years}</div>
            <T as="h3">{education.school}</T>
            <T as="p" className="degree">{education.degree}</T>
            <T as="p" className="status">{education.status}</T>
          </div>
          <div className="panel act-card" data-sw="box">
            <h4>Activities</h4>
            {activities.map((a) => (
              <div className="act" key={a.title}>
                <T as="b">{a.title}</T>
                <T as="span">{a.years ? `${a.org} · ${a.years}` : a.org}</T>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="panel contact-card" data-sw="box">
          <div className="sec-num">// 06</div>
          <h2>
            Open a <em>channel</em>
          </h2>
          <T as="p">Internships, research, or a hard systems problem: I am happy to talk. Email is fastest.</T>
          <div className="contact-links">
            {profile.emails.map((e) => (
              <a className="btn" href={`mailto:${e}`} key={e} data-sw="chip">
                {e}
              </a>
            ))}
            {profile.links.map((l) => (
              <a className="btn ghost" href={l.href} target="_blank" rel="noreferrer" key={l.label} data-sw="chip">
                {l.label} · {l.value}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <span>© {new Date().getFullYear()} Aryan Jain</span>
        <span>
          Build animation inspired by{' '}
          <a href="https://github.com/califa/swarm-site" target="_blank" rel="noreferrer">
            Swarm by Joel Califa
          </a>
        </span>
      </div>
    </footer>
  );
}
