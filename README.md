# sql

The **SQL** concept app for GraphL. A self-contained Vite/React app that renders the SQL courses as
progressive-reveal videos and serves its own narration audio.

It depends on the shared engine — [`flow-engine`](https://github.com/schemabotview/flow-engine) —
for all the rendering, the reveal fold, and the `<RevealPlayer>`. This repo supplies only what's
specific to SQL: its scenes, its courses, and its audio. It mirrors the `apache-spark` sibling app.

## Layout

```
src/
  scenes/               this concept's SceneSpecs (authored with flow-engine helpers)
  content/courses/*.ts  the typed courses: sections → slide (Markdown body) + focus + beats
  main.tsx              mounts <RevealPlayer course=… getScene=… audioBase=… />
public/audio/           per-beat narration clips  <courseId>/<section-id>-<beatIndex>.wav
```

## Course plan (approved — 5 courses, the lifecycle of working with a database)

1. **`schema`** — Modeling data: the relational model, DDL & the catalog *(Design)*
2. **`queries`** — Reading data: the SELECT pipeline, joins, windows, set operations *(Query)*
3. **`mutations`** — Changing data safely: DML, transactions, DCL, procedures *(Write)*
4. **`engine`** — Under the hood: storage, indexes, the planner & `EXPLAIN` *(Tune)*
5. **`capstone`** — an end-to-end project over an e-commerce schema *(Build)*

See `CLAUDE.md` for the full plan (coverage, scenes, dialect) and the **current status**.

**Status (2026-08-05):** Course 1 `schema` complete (8 sections); Course 2 `queries` in progress
(5 of 10 sections — through `group-having`). Scenes built: `sql-landscape`, `schema-erd`,
`query-pipeline`, `joins`. See `CLAUDE.md` → Status for the detailed state and what's next.

The `flow-engine` features this app uses are committed + pushed, and `package-lock.json` pins that
commit — so `npm install` is safe.

## Develop

```bash
npm install     # pulls flow-engine (pinned commit) from GitHub
npm run dev     # http://localhost:5173  — SPACE plays, ← → page beats
npm run build   # gen:courses + tsc (type-checks scenes + courses) + vite build
```

Because scenes and beats live in the same TypeScript project, a beat that references a scene node id
which doesn't exist is caught at build (types) and at dev-load (`validateCourse`, logged to console).

## Look & feel

The Zed-slate theme (canonical tokens in the repo root's `CLAUDE.md`) is applied via self-hosted
fonts — `@fontsource/ibm-plex-sans` + `@fontsource/ibm-plex-mono`, imported in `src/main.tsx` (no
CDN, so they render in headless capture) — plus `src/index.css` for the course landing.
