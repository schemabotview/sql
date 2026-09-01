# CLAUDE.md — sql (lean operational pointers)

> **Status: ALL 5 COURSES COMPLETE 2026-09-01.** 46 sections · 46 scenes · 46 wavs (55.9 min,
> 154 MB) — 20 table nodes, 12 code cards. `npm run build`, `tsc --noEmit` and `npm run check` all
> clean. `scripts/audio-manifest.json` generated and cross-checked (46/46 entries have a wav).
> Pushed to `schemabotview/sql` and deployed — live at **graphl.in/sql/**. Remaining downstream
> work: record.
> `scripts/titles.json` is this repo's own (curated publish titles), not the scaffold source's.

The **SQL** concept app of GraphL. Workspace-wide invariants, content model, and working agreement
live in the workspace [`CLAUDE.md`](../CLAUDE.md) — read that first; this file is SQL-specific.

## What this is

A standalone concept app: its own scenes + courses + a bundled render-engine (`src/render-engine`).
Each **section** = `(scene, slide, narration)`; the left scene is a react-flow diagram or a code
snippet, the right slide is markdown. One section = one slide = one video segment. (SQL content
pairs schema/plan diagrams with code-snippet scenes for the actual statements.)

## Course arc (5)

`schema · queries · mutations · engine · capstone`. Played in syllabus order; `capstone` is the
end-to-end e-commerce project that weaves in every prior course. 46 sections in total.

## Where the content comes from

Spine, slides and narration port from **`~/graphl-studio/sql`** — the same five courses, 46 sections,
and **46 already-generated wavs (56.0 min)**, so narration needs no Colab round-trip. Slides are
*enriched* from the matching section in **`~/Workspace/sql-ct`** (10 modules / 100 sections of
`.md` + `.slide` + `.tts`, deeper on queries) up to the render budget, rather than copied verbatim —
safe for audio, since narration is a separate field.

**Scenes do not port.** The studio repo's scenes are `reveal-engine` specs with hand-placed
`cell`/`grid`/`canvas` coordinates and camera beats; this engine is declarative and has no camera, so
its heavy scene sharing (one `sql-landscape` serving five sections) collapses into roughly one solid
scene per section. Authoring those is the real work of each slice.

## The table node (this repo added it)

`kind: 'table'` renders a real relation — a caption over a monospace grid — in two modes:
`columns: [{ name, type, key: 'PK'|'FK' }]` (schema) or `headers` + `values` (a small result set).
It sizes itself from its content via `tableMetrics.ts`, exactly as the code card does via
`codeMetrics.ts`, so every table in the deck shares one type size after `fitView`.

Reach for it whenever a scene means *a table*: faking one as a container of tiles gives each column a
46px glyph and says nothing about the shape. **Edges anchor to the NODE, never to a row** — a
column-to-column claim (a FK pointing at a PK) still needs two leaf cards, which is why §5
`keys-pk-fk` is built that way and §3 `two-tables` is not.

## Palette note

This concept **inverts** the other repos' warm/cool pairing: `--brand` is SQL's teal `#34e0d0`
(carried from the thumbnail gradient, and the `service` pattern colour), so the slide `h3` counters
it in warm amber `#f0a35e` instead of teal. Watch `service` (teal) against `storage` (green
`#37b877`) — closer hues than the red/green the other repos ship.

## Layout

```
src/render-engine/   layout + renderer (import from the barrel index, never deep paths)
src/scenes/          scenes + registry (a scene can be shared across sections)
src/content/         courses → sections + registry
src/section/         scene-left / slide-right composited view (responsive)
src/App.tsx          hash router: section (whole-scene) view · scene (individual) view
scripts/             record-course · record-reels · thumb · gen-descriptions · colab · audio-manifest
public/audio/<course>/   narration wavs
```

## Build & verify

- `npm install` → `npm run dev`; `npm run build` must stay clean.
- `npm run check` gates FOUR silent failures — ones that build green and break only on screen:
  fixed 210×96 leaf cards · non-fitting slides · unregistered `icon:` keys (they fall back to the
  pattern glyph) · a `focus:` naming no node in its scene (nothing lights up). Run it with build +
  `tsc --noEmit` every slice; neither of those catches a broken frame.
- No test runner. Bar for a change: **build clean + visually correct** at the relevant route.
- Adding a scene: define in `src/scenes/`, register in `src/scenes/index.ts`.
- Adding content: add a `Section` under `src/content/<course>/`, list it in that folder's `index.ts`.

## Working agreement

Owner drives, **one reviewed slice at a time**: propose → approve → build → verify in-app → stop.
Before authoring a course/scene, deliver an **ASCII sketch** of the scene for approval first.
