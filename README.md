# sql — GraphL concept repo

The **SQL** concept app for [GraphL](https://graphl.in). One section = a left **scene** (react-flow
diagram or code snippet) + a right **slide** (markdown) + a **narration** script, rendered
responsively (4K capture · laptop web app · mobile) and captured to video.

> **Status: complete.** Five courses, 46 sections, each with its narration wav. The render engine is
> the [`@graphlearning/flow`](https://www.npmjs.com/package/@graphlearning/flow) package.

Workspace-wide model, pipeline, and conventions: see the workspace [`README.md`](../README.md).

## The course arc (5 courses)

| # | Course | What it covers |
|--:|--------|----------------|
| 1 | **schema** | The relational model, DDL & the catalog — tables, keys & constraints. |
| 2 | **queries** | The SELECT pipeline, joins, windows & set operations — reading data back out. |
| 3 | **mutations** | DML, transactions & ACID, isolation levels, DCL & procedures — changing data safely. |
| 4 | **engine** | Storage, B-tree indexes, the planner, EXPLAIN & MVCC — how it runs under the hood. |
| 5 | **capstone** | One e-commerce project end to end — design, secure, load, analyze, report, tune. |

## Layout

```
src/
  scenes/          hand-authored scenes + registry
  content/         courses → sections (one file per section) + registry
  section/         composited scene-left / slide-right view (responsive)
  App.tsx          hash router — section (whole-scene) view · scene (individual) view
scripts/
  record-course.mjs / record-reels.mjs   capture → mp4 (landscape / portrait)
  thumb.mjs / gen-descriptions.mjs        thumbnails / video descriptions
  colab_generate_audio.ipynb              Colab + Chatterbox TTS → .wav
```

## Run

```bash
npm install
npm run dev                  # open the printed URL, try #/schema
npm run build                # vite build only — NO typecheck; run `npx tsc --noEmit` separately
npm run record schema        # 4K video → scripts/out/schema.mp4
npm run record:reels schema  # portrait reels
```
