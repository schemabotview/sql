# CLAUDE.md — sql (concept app)

The **SQL** concept app for GraphL: a self-contained Vite/React app that renders the SQL courses as
progressive-reveal videos and serves its own narration audio. All rendering/reveal/player machinery
comes from the shared engine — [`flow-engine`](https://github.com/schemabotview/flow-engine) —
installed via GitHub. This repo supplies only what's specific to SQL.

> Parent context: `../CLAUDE.md` (workspace + domain model + locked principles) and
> `../flow-engine/CLAUDE.md` (the engine API). Don't relitigate the locked reveal decisions here.
> `../apache-spark/CLAUDE.md` is the reference sibling — this app mirrors its structure exactly.

## Layout

```
sql/
  package.json      depends on github:schemabotview/flow-engine (+ react, @xyflow/react, lucide-react)
  src/
    scenes/         this concept's SceneSpecs — the diagram STRUCTURE
      index.ts      the scene registry: getScene(id)  (SCAFFOLD: empty until Course 1)
    content/courses/*.ts   the typed Courses: sections → slide + focus + beats
      index.ts      the course catalog: courses[] + BLURBS  (SCAFFOLD: empty until Course 1)
    main.tsx        mounts <RevealPlayer course getScene audioBase=… />
  public/audio/     per-beat narration clips: <courseId>/<section-id>-<beatIndex>.wav
  scripts/
    gen-courses-json.ts     `npm run gen:courses` → public/courses.json (the concept's catalog)
    gen-audio-manifest.ts   `npm run gen:audio`   → scripts/audio-manifest.json (one entry per beat)
  .github/workflows/deploy.yml   CI = npm ci + npm run build → Pages artifact (base '/sql/')
```

## The content model (this is what gets authored)

Identical to `apache-spark` — read `../apache-spark/CLAUDE.md` for the full "content model", "slide &
narration density" benchmark, and "authoring by AI + the safety net" sections. In short:

- **Scenes** (`src/scenes`) = structure, authored with engine helpers
  (`import { type SceneSpec, container, wgrid, BLUE, … } from 'flow-engine'`), registered in
  `scenes/index.ts`.
- **Courses** (`src/content/courses/*.ts`, registered in `courses/index.ts`) = the script: a list of
  sections; each has `slide` (`{ title, body }`, Markdown), an optional `focus` (node ids the camera
  frames; default = the nodes the section solidifies; `focus: []` frames the whole scene), and
  ordered `beats` (`{ line, delta }`).
- **Audio** = one wav per beat, `public/audio/<courseId>/<section-id>-<beatIndex>.wav`.

Safety net is compile-time: `tsc` type-checks scenes + courses; `validateCourse` (dev-load, see
`main.tsx`) fails loud if a beat names a node id that isn't in its scene.

## Reveal model (locked — the "solid tour")

Same as the Spark courses: **no ghost build**. Every section is **one beat = one slide**; the diagram
is **solidified on scene entry** (the first section on a scene solidifies that whole scene — the
overview *and* any mid-course scene switch). Later sections on the same scene never re-ghost — each
just sets `focus` to its band, so that band is **lit** and the rest **dimmed**. Camera + focus do the
storytelling on an always-solid diagram. `focus: []` frames the whole scene with nothing dimmed.

## Course plan (approved 5-course arc — the lifecycle of working with a database)

Wrapped by *functional slice* like Spark's five, following the natural workflow
**design → query → change → tune → build**. Same five shapes as Spark
(map/foundation · language-surface · feature-area · runtime-internals · project):

| # | Course id | Title | Workflow | Covers | Spark analog |
|---|-----------|-------|----------|--------|--------------|
| 1 | `schema` | Modeling data | **Design** | relational model, the master `sql-landscape` map, DDL (`CREATE/ALTER/DROP…`), the catalog (Database→Schema→Table), columns/types, constraints (PK/FK/UNIQUE/CHECK), views | `evolution` |
| 2 | `queries` | Reading data | **Query** | logical execution order (FROM→…→LIMIT), all join types + row matching, GROUP BY/HAVING, **window functions in depth**, subqueries & CTEs (incl. recursive), set operations, NULL / three-valued logic | `api` |
| 3 | `mutations` | Changing data safely | **Write** | `INSERT/UPDATE/DELETE/MERGE`, transactions (`BEGIN/COMMIT/ROLLBACK/SAVEPOINT`, ACID), isolation levels & anomalies (dirty/non-repeatable/phantom), DCL (`GRANT/REVOKE`), programmatic SQL (stored procedures, functions, triggers, cursors) | `streaming` |
| 4 | `engine` | Under the hood | **Tune** | tablespace→pages→rows→WAL, B-tree index internals, the planner (parse→bind→optimize→execute), `EXPLAIN`, MVCC | `architecture` |
| 5 | `capstone` | End-to-end project | **Build** | design schema → grant → load in a txn → analytical queries (joins + windows) → tune with an index & read `EXPLAIN`, over an e-commerce dataset; each section highlights the concept it reuses | `capstone` |

**Master scene.** Course 1 opens on a dense `sql-landscape` map (8 bands: DDL · Catalog · Storage ·
Transactions · Query pipeline · Set ops · **DCL** · **Programmatic** — the last two added to complete
the five-sub-language story) framed whole, then the camera tours each band. Built from the owner's
own SQL mental-model diagram.

**Scenes.** Reuse the master scene where a section is a *tour* (light a container, explain it); give a
**dedicated scene** where the teaching is a *mechanism* the labeled boxes can't show — joins (rows
matching), isolation levels (interleaved transaction timelines), storage (page/B-tree internals),
window frames (sliding over partitioned rows). Same split Spark uses.

**Dialect.** Standard SQL, **PostgreSQL-flavored** where a dialect is forced.

## Commands

```bash
npm install     # pulls flow-engine from GitHub
npm run dev     # http://localhost:5173 — SPACE plays, ← → page beats
npm run build   # gen:courses + tsc + vite build
```

To pick up a **published** engine change: `npm install github:schemabotview/flow-engine`, then
**commit the updated `package-lock.json`** (CI's `npm ci` installs the commit pinned in the lockfile;
see `../apache-spark/CLAUDE.md` for the full "landing themed, scenes stale" gotcha). The local
engine-preview loop (previewing UNPUBLISHED engine edits) is documented there too.

## Theme & fonts

Implements the canonical Zed-slate theme in `../CLAUDE.md`: fonts self-hosted
(`@fontsource/ibm-plex-sans` + `@fontsource/ibm-plex-mono`, imported in `src/main.tsx` — never a CDN,
safe for headless capture); `src/index.css` themes the course-index landing with the Zed-slate tokens.

## Status  (updated 2026-08-05)

### Scenes (`src/scenes/`)
- **`sql-landscape`** — the 8-band master map (72 nodes), from the owner's diagram, laid out as
  clean horizontal BANDS (top ops row: DDL/DCL · Catalog · Transactions · Programmatic; then
  full-width Storage · Query pipeline · Set ops). A labeled "life of data" flow threads it:
  `DDL→Catalog→Storage→Query→Set-ops` (+ `Transactions→Storage`, `DCL→Catalog`,
  `Programmatic→Transactions`). Used by `schema` §1 + §8.
- **`schema-erd`** — spacious e-commerce ERD, LANDSCAPE: DDL band · `customers` ─< `orders`
  (side-by-side, FK drawn) · constraints panel · view + index. Tables are containers of `term`
  rows (label + `type` tag). Used by `schema` §2–7.
- **`query-pipeline`** — Course 2 spine. 3 full-width rows: a `report.sql` multi-line **code**
  node ("how you write it") · the green "how it runs" pipeline (`run` container: FROM→JOIN→…→LIMIT,
  each stage + one-line `sub`, CTE/WINDOW feeders) · set-ops strip. Used by `queries` §1,2,4,5 (and
  will host §7,8,9).
- **`joins`** — mechanism detour: `customers` + `orders` as real **`table`** nodes (data grids),
  the match shown IN the data (`orders.customer_id` = 1,1,2,4,5 → Cat/Dan/Eve unmatched), one
  `id = customer_id` edge, + the six join types. Used by `queries` §3.
- **`windows`** — mechanism detour for `queries` §6. Headline is a GROUP-BY-vs-window contrast
  (same 5 orders as `joins`, for continuity): left `w-grouped` collapses to 4 rows, right
  `w-windowed` keeps all 5 + a `running_total` column. Below: `w-over` (PARTITION BY / ORDER BY /
  frame) + `w-funcs` (ranking · LAG/LEAD · running aggregates). Used by `queries` §6.
- **`write-path`** — Course 3 spine (built 2026-08-05; sections not yet wired). 4 stacked bands,
  toured stage-by-stage: **DML verbs** (`wp-insert`/`wp-update`/`wp-delete`/`wp-merge`, ORANGE) ·
  **the transaction** (`wp-begin`→`wp-work`→`wp-commit`, `wp-rollback`, `wp-savepoint`, BLUE, with
  a BEGIN→work→COMMIT flow + an "on error"→ROLLBACK edge) · **ACID** (`wp-a`/`wp-c`/`wp-i`/`wp-d`,
  GREEN) · **who & what-else** = nested `wp-dcl` (GRANT/REVOKE, RED) + `wp-prog`
  (procs/funcs/triggers/cursors, PURPLE). Will host `mutations` §1–6, §8, §9.
- **`isolation`** — Course 3 §7 detour (built 2026-08-05). Two transactions on a shared 6-slot
  time axis (`iso-t1` reads x twice · `iso-t2` writes x=8 and commits in between → T1's 2nd read
  differs = a non-repeatable read), with per-timeline flow edges + a `t2-write→t1-read2` punchline
  edge. Then two **full-width horizontal** bands (vertical stacking collided labels — avoid it):
  `iso-anom` = 3 anomalies across (`iso-dirty`/`iso-nonrep`/`iso-phantom`, RED) · `iso-levels` =
  4 levels across (`iso-ru`/`iso-rc`/`iso-rr`/`iso-ser`, YELLOW, `symbol` kind so the level NAME is
  the headline — `term` clipped it). Used by `mutations` §7.
- **`engine-path`** — Course 4 spine (built 2026-08-05; sections not yet wired). 5 stacked
  full-width bands (access + storage were split out of a nested wrapper — nesting cramped the
  children; keep bands flat & full-width): an **EXPLAIN** plan (`ep-explain`, a `code` card, GREEN) ·
  the **planner** (`ep-parse`→`ep-analyze`→`ep-rewrite`→`ep-optimize`→`ep-execute`, BLUE) ·
  **access methods** (`ep-access` = `ep-seqscan`/`ep-idxscan`, ORANGE — §6 frames it) · **storage**
  (`ep-storage` = `ep-tablespace`→`ep-heap`→`ep-page`→`ep-tuple` + `ep-wal`, ORANGE — §4 frames it) ·
  a slim **MVCC** band (`ep-versions`/`ep-snapshot`/`ep-vacuum`, PURPLE). Will host `engine` §1–4, §6.
- **`btree`** — Course 4 §5 detour (built 2026-08-05). A B-tree drawn on a 4-col grid: `bt-root`
  (spans centre) → 2 `bt-n1`/`bt-n2` branches → 4 `bt-l1..bt-l4` leaves (TEAL), with descend edges +
  leaf→leaf links (sorted & linked → range scans). Below, full-width bands: `bt-why` (O(log n) ·
  sorted-linked, GREEN) + `bt-trade` (slows writes · costs disk, RED). Used by `engine` §5.
- **`mvcc`** — Course 4 §7 detour (built 2026-08-05). Version chain: `mv-v1` (dead, xmin/xmax, GRAY)
  ──UPDATE→ `mv-v2` (current, GREEN); two readers `mv-txa`/`mv-txb` on two snapshots (TEAL) with
  edges resolving to different versions (the mechanism behind isolation); + `mv-buys` = readers/
  writers don't block + `mv-vac` VACUUM (GREEN). Used by `engine` §7.
- **`capstone`** — Course 5 spine (built 2026-08-05; sections not yet wired). Unlike the other
  spines (concept diagrams) this one is the PROJECT: a **build-flow** across the top (`cap-flow`:
  `cap-model`→`cap-secure`→`cap-load`→`cap-analyze`→`cap-report`→`cap-optimize`, coloured per reused
  course) + **6 code cards** below (`cap-c1..cap-c6` = the real SQL, 3-col × 2-row). Sections frame
  each card (SQL readable) while lighting the matching flow step (spine = progress tracker). Hosts
  all of `capstone` §1–§8.

### Courses (`src/content/courses/`)
- **`schema` — COMPLETE (8 sections).** §1 the-shape (map) · §2 relational-model · §3 the-table ·
  §4 keys · §5 constraints · §6 ddl · §7 views-indexes · §8 you-are-here. Solid-tour throughout.
- **`queries` — COMPLETE (10 sections).** §1 logical-order (write-vs-run, whole scene) · §2 from ·
  §3 join (`joins` detour) · §4 where (+NULL/3-valued logic, re-entry) · §5 group-having ·
  §6 window (`windows` detour) · §7 select-distinct (re-entry, re-solidifies pipeline) ·
  §8 order-limit · §9 set-ops (lights the `setops` band) · §10 you-are-here (RETURNS to the master
  `sql-landscape` map, lights the query-pipeline + set-ops bands — the Course 1 §8 bookend pattern).

### Authoring patterns established (follow these)
- **Solid-tour.** 1 beat = 1 section; scene solidified on entry; camera + focus tell the story.
- **Scene re-entry.** After a detour switches scenes, returning re-solidifies the WHOLE scene
  (reveal resets on scene change). See `queries` §4 (`where`).
- **`focus` vs `highlight` (engine feature — see below).** `focus` = camera framing; `highlight` =
  the lit set. The pipeline stage sections set `focus: ['run']` (keep the whole pipeline in view,
  no disorienting zoom) + `highlight: [<stage ids>]` (light just that stage). Use this for §7–9.
- **Lay symbol groups HORIZONTALLY, not vertically.** A `symbol`'s label renders as a heading
  layered above/behind its box; stacking symbols in a tall thin column (`cols:1 rows:N`) makes each
  row's label collide with the box above. Give a group of items its own full-width band with
  `cols:N rows:1`. And use `symbol` (not `term`) when the item's NAME must be the headline — `term`
  clipped the isolation-level names in a cramped cell. (Learned on `isolation`, 2026-08-05.)
- **Verify without a browser:** `scratchpad/fullcheck2.ts` walks every scene's grid
  (`validateLayout`, now fully recursive for nested containers) + runs `validateCourse` per course,
  via `node --experimental-strip-types` with
  a tiny `document` stub (the dist bundle touches DOM at import). Re-create it if the scratchpad is gone.

### Engine dependency (resolved)
Course 1 + 2 rely on flow-engine features — multi-line **`code`** nodes · the **`table`** node kind ·
whitespace-pre in code · ERD-row padding · the **`Section.highlight`** camera/lit decouple. These are
**committed + pushed** (flow-engine `main` @ `131e452`, 2026-08-05) and this app's `package-lock.json`
pins that commit, so **`npm install` / `npm ci` is safe** (pulls the official dist). See
`../flow-engine/CLAUDE.md` → "Recent additions". For previewing UNPUBLISHED future engine edits, use
the local engine-preview loop above (rebuild dist → `cp -R` into `node_modules` → clear `.vite`).

### Course 3 `mutations` — COMPLETE (10 sections)
§1 write-safely (whole-scene opener, `focus: []`) · §2 insert · §3 update · §4 delete-merge
(DML tour, `focus: ['wp-dml']`) · §5 transactions (`focus: ['wp-txn']`) · §6 acid
(`focus: ['wp-acid']`) · §7 isolation (`isolation` **detour**, `focus: []`) · §8 dcl (**re-entry** —
re-solidifies `write-path`, `focus: ['wp-control']`) · §9 programmatic (`focus: ['wp-control']`) ·
§10 you-are-here (RETURNS to the master `sql-landscape` map, lights the transactions + DCL +
programmatic bands — the `schema` §8 / `queries` §10 bookend). Registered in `courses/index.ts` +
BLURBS. **No audio yet** (10 beats awaiting TTS). With Courses 1–3 done, only Storage is unlit on
the master map (→ Course 4 `engine`).

### Course 4 `engine` — COMPLETE (8 sections)
§1 under-the-hood (whole-scene opener, `focus: []`) · §2 planner (`focus: ['ep-planner']`) ·
§3 explain (`focus: ['ep-explain']`) · §4 storage (`focus: ['ep-storage']`) · §5 indexes (`btree`
**detour**, `focus: []`) · §6 scans (**re-entry** — Seq vs Index by selectivity, `focus: ['ep-access']`)
· §7 mvcc (`mvcc` **detour**, `focus: []`) · §8 you-are-here (RETURNS to the master `sql-landscape`
map, lights the **Storage** band — the schema §8 / queries §10 / mutations §10 bookend). Registered
(`courses/index.ts` + BLURBS). **No audio yet** (8 beats awaiting TTS). With Courses 1–4 done, the
**whole master map is now lit** (only `capstone` remains).

### Course 4 `engine` — PLAN (approved 2026-08-05)
"Under the hood" (the **Tune** slice). Mechanism-dense: one spine + **two** detours; on the master
map it lights the last dark band, **Storage**, completing the map. **3 new scenes:**
- **`engine-path`** (spine, 5 of 8 sections) — the physical life of a query, 4 bands: an **EXPLAIN**
  plan (a `code` card, GREEN) · the **planner** (`ep-parse`→`ep-analyze`→`ep-rewrite`→`ep-optimize`
  →`ep-execute`, BLUE, cost-based) · **access + storage** (nested: `ep-seqscan`/`ep-idxscan` |
  Tablespace→Heap→Page(8KB)→Tuple + WAL, ORANGE) · a slim **MVCC** band (versions/snapshot/VACUUM,
  PURPLE — the overview; §7 detours deep).
- **`btree`** (detour, §5) — index internals: Root→internal→leaf tree (edges), leaves sorted+linked
  for range scans (why lookup is O(log n)); + why-fast / trade-off notes. A labeled "index" can't
  show the descent.
- **`mvcc`** (detour, §7) — one logical row, a version chain (`v1` xmin/xmax dead → `v2` current);
  two readers on two snapshots see different versions; readers/writers never block + VACUUM. The
  mechanism behind isolation (C3).

**8 sections:** §1 under-the-hood (whole scene) · §2 planner · §3 explain (EXPLAIN card) · §4 storage
· §5 indexes (**btree detour**) · §6 scans (**re-entry** — Seq vs Index by selectivity) · §7 mvcc
(**mvcc detour**) · §8 you-are-here (**master map**, lights **Storage** → map complete → capstone).

### Course 5 `capstone` — COMPLETE (8 sections)
§1 the-brief (whole scene `focus: []` — all bright, no dims; owner wanted the overview un-dimmed) ·
§2 model (card 01, C1) · §3 secure (card 02, C3·DCL) · §4 load (card 03, C3·txn) · §5 analyze
(card 04, C2·joins) · §6 report (card 05, C2·windows) · §7 optimize (card 06, C4·index+EXPLAIN) —
each `focus: ['cap-cN']` zooms to its code card so the SQL reads · §8 shipped (finale — whole
`capstone` scene, all bright `focus: []`: the completed project. Owner preferred ending on the
project scene, not the abstract `sql-landscape` map). Registered; preview at `#/capstone`.
**No audio yet** (8 beats awaiting TTS).

"End-to-end project" (the **Build** slice) — a pure REUSE course: one e-commerce project walked
end to end, each step reusing a concept from C1–C4. **1 new scene** (`capstone`, above): a build-flow
spine + 6 code cards holding the real SQL (left pane = the project code; right slide = explanation +
reuse citation). Solid-tour reveal (all solid from §1; camera frames each card + lights its spine
step). **8 sections:** §1 the-brief (frame the spine — the plan) · §2 model (card 01, C1) · §3 secure
(card 02, C3·DCL) · §4 load (card 03, C3·txn) · §5 analyze (card 04, C2·joins) · §6 report (card 05,
C2·windows) · §7 optimize (card 06, C4·index+EXPLAIN) · §8 shipped (whole spine lit — series
complete). Dataset = customers/orders (the `schema-erd` e-commerce set).

### Deferred / next
- TTS: regen `audio-manifest.json` (`npm run gen:audio`) once Course 2 beats are final, then Colab.
  **Course 2 `queries` has NO audio yet** — 10 beats awaiting a TTS pass.
- Add `{ "slug": "sql", "name": "SQL" }` to `../schemabotview.github.io/concepts.json` once a course
  is signed off + deployable (not before).
- Build Course 3 `mutations` (plan above), then Courses 4 `engine` · 5 `capstone`.
