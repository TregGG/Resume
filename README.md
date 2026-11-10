# Aryan Jain — Portfolio

Cyberpunk-themed resume site (React + Vite + TypeScript). On load, a swarm of named cursors
flies in and builds the page: crosshairs drag out each panel with a live `W × H` badge, I-beams
type the text, and pens draw the dividers. Sections build as you scroll to them.

## Run

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # static output in dist/
npm run preview   # serve the build
```

## Two designs

- `/` — v2 (main), mono + orange (`src/v2/`): JetBrains Mono, dot grid, framed windows with
  corner markers, a type-specimen hero with a glitching name (`src/v2/Glitch.tsx`, `src/v2/Specimen.tsx`)
- `/v1/` — v1, neon cyberpunk (`src/App.tsx`, `src/styles/theme.css`)

Both pages share the same data and swarm engine. In dev, open http://localhost:5173/ (v1 at /v1/).

## Edit content

All text lives in two files. Change those and the page follows:

- `src/data/profile.ts`: name, tagline, emails, links, focus areas, skills, education, activities
- `src/data/projects.ts`: the featured projects (`heroProjects`) and the grouped list (`archive`)

## How the swarm works

- `src/swarm/engine.ts`: animation loop, cursor steering, task scheduling
- `src/swarm/T.tsx`: wraps any text the swarm should type
- Any element with `data-sw="box" | "chip" | "line"` gets built by the swarm. Wrap text in `<T>`.
- The content is always in the DOM, so screen readers and search engines see all of it.
- The swarm is skipped when the visitor has `prefers-reduced-motion` set. Visitors can also skip
  the build or turn the swarm off from the HUD in the bottom-left corner (remembered per browser).

The concept and choreography are inspired by [Swarm by Joel Califa](https://github.com/califa/swarm-site)
and [swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors). This is a separate engine,
written after reading a description and short excerpts of swarm-cursors.
See `THIRD_PARTY_NOTICES.md` for the MIT notice from swarm-rebuild.

## Deploy

Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`).
In the repo, set Settings → Pages → Source to **GitHub Actions**.
