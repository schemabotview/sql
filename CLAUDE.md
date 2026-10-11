# CLAUDE.md — sql (lean operational pointers)

The **SQL** concept app of GraphL, authored from **`SQL-COURSE-PLAN.md`** — the reviewed syllabus:
10 chapters, 79 sections. Workspace-wide invariants (content model, route contract) are in the
workspace `CLAUDE.md`; the app skeleton is `apache-spark`'s (`flow@^1.2.0`, `shell@^0.10.1`).
Mapping the plan into the app's course/section model is this repo's job; the plan itself is not edited
here (it is reviewed upstream — see the `toc` README's workflow).

> **Status: Chapters 1–5 complete — 40 of 79 sections authored** (`foundations` 6/6, `structures`
> 9/9, `loading` 5/5, `retrieval` 10/10, `combining` 10/10). Work happens **directly on `main`**
> (decision of 2026-10-11). `tsc`, `npm run check` (layout + plan conformance), `npm run check:sql`
> (106 snippets + 4 hidden verification files) and `npm run build` clean; all 40 routes rendered at
> 1920×1080 inside the density targets. **Next: chapter 6 (`analytics`, 10 sections).**

## How the plan maps to the app

| plan | app |
| --- | --- |
| chapter *N* | a course `src/content/<course>/`, ids in the table below |
| section *M* | `NN-<id>.ts` with `NN = M`; its `title` is the plan's section title **verbatim** |
| objective, outcome, bridge | a comment in the course's `index.ts`; the **bridge** is also the last words of the chapter's final narration |

`foundations` · `structures` · `loading` · `retrieval` · `combining` · `analytics` · `performance` ·
`modification` · `transactions` · `access` = chapters 1–10. `scripts/check-plan.mjs` (part of
`npm run check`) parses the plan and fails on any drift: a wrong chapter or section title, a section
number the plan does not have, a duplicate, an unknown course. It prints authored/planned per chapter.

## Authoring rules (from the README that governs this course — read it, do not paraphrase from memory)

Synced to the README and to the plan after both dropped the "theory-focused" wording.

- **Explanation and application together.** The role is a lecturer and coach teaching from foundations
  to advanced understanding and reasoning. Show how something works **and why**, through annotated
  SQL with its real result, diagrams, worked calculations, execution traces, contrasting cases,
  misconceptions and failure walkthroughs. Teach **how to construct** a query or a design choice where
  that fits the section, not only how to read one.
- **Following along is optional, never required.** A slide may invite the learner to run an example
  ("follow along"), and the answer is always shown so nothing depends on it. **Not required, so not
  written as required:** submitted exercises, assessments, graded assignments, learner monitoring,
  installing a database, "your tasks".
- **Target** (plan, audience paragraph): understand how to design relational structures, construct SQL
  queries, interpret results, analyse common errors, and justify transaction, performance and
  access-control decisions. Learners "may run the queries alongside the explanation if they wish".
- **Outcomes**: copy the plan's chapter outcome verbatim into the course `index.ts`. In narration, do
  **not claim verified individual mastery** — nothing here observes the learner — and do not equate
  finishing the course with practical competence.
- **Section shape** (the plan's *Teaching method*): objective → mental model → **worked SQL query or
  schema and its results** → misconception or failure contrast → **explanation summary** → bridge.
  Small input/output tables before complex queries; define a term before relying on it; revisit ideas
  deeper later rather than front-loading them. Explain **assumptions, construction, expected
  behaviour and limitations** step by step — the plan asks for all four.
- **Each chapter lists its "Worked illustrations"** in the plan (one line per chapter). Treat that line
  as the minimum set of boards/cards the chapter must contain, and copy it into the course's
  `index.ts` beside the objective, outcome and bridge.
- **Safety and failure awareness arrive when the operation first does**: the first `UPDATE`, `DELETE`,
  `DROP`, `COPY` carries its rollback / affected-rows / validation note; chapter 9 deepens, not
  introduces.
- **Recurring example**: one online shop (customers, products, orders, order items). New examples
  extend it; they do not replace it.
- **Dialect honesty**: the plan names PostgreSQL 18; **this repo verifies on PostgreSQL 16** (decision
  of 2026-10-11). Say "PostgreSQL" for behaviour that is stable, label engine-specific behaviour as
  such, and avoid version-specific claims. Nothing here was run on 18.
- **Keep to TOC scope**: introductory vs specialist depth as the plan states; the plan's deferred
  list (JSON/arrays, spatial/search, partitioning, stored procedures, replication, backups, engine
  internals) stays deferred.

## The canonical dataset — `db/`

One shop, schema `shop`, that every section queries. **Frozen**: slides quote its numbers.

| file | role |
| --- | --- |
| `db/schema.sql` | DDL for the 8 tables — the finished schema that chapter 2 explains |
| `db/seed.sql` | small enough to count by eye and **deliberately awkward** (see its header) |
| `db/assertions.sql` | the facts lessons rely on; fails at the cause if someone edits the seed |

`categories` and `employees` are trees; customers 7–8 and product 10 have no orders (outer joins);
`customers.phone` and `reviews.comment` hold NULLs; customers 3 and 9 are a duplicate; order dates form
three islands; order 8 is cancelled, 10 part-paid, 9 and 11 unpaid. **When a chapter needs more data**
(time series, cohorts, hierarchies deeper than two levels), put it in a **second schema** — never
change `shop`. Change a number in `shop` and every slide that quotes it is wrong.

## Guards — run all before handing over

`npx tsc --noEmit` · `npm run build` · `npm run check` (layout budgets **and** plan conformance) ·
`npm run check:sql` — then **look at the route**: `npm run dev &`, `npm run shot -- <outDir> <slug> …`
(slug = `<course>-<section>`; no slugs = all) renders 1920×1080 and reports clipping, page errors and
density. It uses `/opt/pw-browsers/chromium` (override with `CHROMIUM=`). `scripts/measure-slides.mjs`
models slide height offline (±3.5 %; the DOM number from `shot` is the truth).

`check:sql` needs a PostgreSQL server named by the `PG*` variables (CI uses a service container;
locally `pg_ctlcluster 16 main start`). It rebuilds `shop`, runs the assertions, then runs **every
code node whose `filename` ends in `.sql`**, each in its own rolled-back transaction (PostgreSQL DDL
is transactional, so this is safe). A snippet meant to fail starts with `-- expect-error`; a snippet
that cannot run alone (psql meta-commands, two-session timelines) gets a non-`.sql` filename. Every
result table and error shown on a slide must be what the server really returned — check it, never
type it from memory.

**Hidden verifications — `db/verify/*.sql`.** Some claims no displayed snippet can show (which rule rejects
which record, what a rolled-back `TRUNCATE` restored). Assert them there: each file runs in a
rolled-back transaction and must finish without raising; use `DO` blocks with `ASSERT` and
`BEGIN … EXCEPTION WHEN <condition> THEN NULL; END` to prove a statement is refused. They are the
hidden half of a section's evidence — check that the guard fails when you break one.

Snippet rules: **a script stops at its first error**, so what happens *after* a failure cannot be
inside an `-- expect-error` snippet (show the error; verify the consequence by hand and say so; use
`SAVEPOINT … ROLLBACK TO` to show rollback without an error). `COPY … FROM STDIN` works inline
(data, then `\.`). **Each snippet is isolated**: it cannot use rows another card inserted. Don't show
anything that depends on `current_date`. Ids free for lessons: category 7, products 11+, customers
10+, orders 12+, payments 9+. `expect-error` proves *an* error occurred, not *which* — confirm the
message once by hand.

### Density targets — the frame must use the space it has

| | target | why |
| --- | --- | --- |
| slide height | **80–95 %** of the 1078px pane (≈ 860–1020px) | below 80 % the right half looks empty; above ~95 % it risks clipping |
| scene, binding axis | ≥ 0.85 of the pane | the board should reach the edge it is limited by |
| scene, area | ≥ 0.55 of the pane (w × h) | a wide board that fills the width but a third of the height wastes the pane |
| eyebrow | no node under the top-left `SQL · CHAPTER` label | boards that bind on height run up to y≈30 |

Levers: **add verified content, not padding**; **restack** a board toward the pane's ~1:1 aspect;
lower scene `padding` to 0.04 for boards that float, **raise** it (0.12–0.17) for tall boards that
touch the eyebrow.

## Scenes (the left side)

Declarative react-flow diagrams or code cards; never write x/y. A scene is content-agnostic and may be
shared by sections that differ only in `focus` (a shared board must carry every claim of every section
that uses it). Reusable board types worth keeping consistent: **schema board** (table nodes with PK/FK
badges), **query → result** (a `.sql` code card feeding a 3–5 row table), **before / after**,
**join board** (a chip per row, a line per match), **grouping**, **window frame**, **plan tree**,
**timeline** (two session cards, line-aligned), **access graph**. Use **chips for counted things**, tiles
for described ones; code lines **under 64 columns** with `hug: true`.

### Layout lessons (only the rendered frame shows them)

- **Containers shrink-wrap their children and wrap their own heading to that width.** Keep headings of
  narrow containers to a word or two; put the explanation on the parent.
- **An edge that ends inside a container crosses its heading** — land edges on chips outside any
  container, or give the container no competing heading.
- **A wide board binds on width and shrinks everything**; run long chains top-to-bottom and put the
  code card beside them with `flow: 'LR'` on the scene.
- **A tall chain of tiles sets the board's scale** and can shrink a neighbouring code card to
  unreadable. Make long chains `chip`s.
- **A container is only as wide as its content**: a wide table in a `cols: 2` cell stretches the column.
- **Leaves inside a container are unframed by default**; plan-style cards need `framed: true`.
- **Skip-rank edges draw through the node between them**; avoid them or drop the middle node.
- **Edge labels land mid-edge on whatever is there** — prefer none; say it in the slide.
- **Code-card comment lines count toward its width**; keep an `-- expect-error: …` note shorter than the
  longest real line.
- **Never build node ids in a helper** (`` id: `o${n}` ``): `check-content.mjs` finds `focus` targets by
  literal `id: '…'` text. Spell the id out at the call.

### Chapter 1 notes (for the chapters that follow)

- Only the **four core tables** (customers, products, orders, order items) appear in chapter 1, with key
  columns only and the board saying so; `categories`, `employees`, `payments`, `reviews` arrive when a
  chapter needs them. Chapter 2 shows each table in full.
- Boards shown here for later reuse: **fork** (two parallel columns, `dbms-vs-files`), **schema board**
  with PK/FK badges laid out **LR in ranks** so no edge skips a rank (`key-integrity`), **query → result**
  cards in a grid (`types-and-null`), **token table + contrast cards** (`statement-anatomy`).
- A table node is a *data dictionary* when it has `headers`/`values`, and a *schema* when it has
  `columns` — use `columns` only for real column lists with keys.

### Chapter 2 notes

- The running example from §4 to §9 is a **`wishlist`** table (which customer wants which product), a
  small extension of the shop: created bare, typed, keyed, constrained, altered, dropped. The full
  8-table `shop` schema is **read** (metadata, §7), not re-created.
- A snippet may create a table the shop does not have (`wishlist`, `tag`, `note`): it is rolled back,
  so the frozen `shop` schema never changes.
- A board that needs an edge to land on a chip inside a heading-bearing container should be laid out
  **left to right** in columns (`requirements-structures`): the edges run horizontally between columns
  and never cross a heading.

### Chapter 3 notes

- DML returns no rows, so a board shows **command tags, `RETURNING` output, or a follow-up `SELECT`**.
- **A script stops at its first error**, so what a failed statement left behind (all-or-nothing, an
  undone identity number) is asserted in `db/verify/ch03-loading.sql` with
  `BEGIN … EXCEPTION WHEN … THEN NULL; END`, and the slide says it was checked.
- **Identity numbers survive a rollback** (ids 1 and 3), so a snippet that shows ids must say why.
- **`COPY … FROM STDIN` works inline** in a snippet (data lines, then `\.`), so imports need no file.
- A **staging table of `text` columns** lets a bad row be classified instead of refused — the
  reconciliation case (`6 = 3 loaded + 3 rejected`) is built on it.
- Seed ids free for lessons: category 7, products 11+, customers 10+, orders 12+, payments 9+.
- A long code card (25 lines) next to a result column works as a `flow: 'LR'` scene (`reconciliation`);
  shorten the **widest line** first — one 70-character line made the whole card shrink.

### Chapter 4 notes

- `src/scenes/pair.ts` offers `pair({id,title,file,sql,outs,err})` (a `.sql` code card feeding result
  tables or an error tile) and `grid(...)`. Its node ids are generated, so **no `focus` may target
  them**; spell ids out in scenes that need `focus`.
- Claims no snippet can show (grain 11/4 and 9/8, NULLs sort last ascending, 8 distinct people) are
  asserted in `db/verify/ch04-retrieval.sql`.
- Label engine-specific behaviour as PostgreSQL's (NULL ordering defaults, function names, casts).
- Tall boards need scene `padding` 0.15 to stay clear of the eyebrow; 0.10 for medium ones.

### Chapter 5 notes

- Same `pair()` boards as chapter 4. A `Scene` needs `edges` even when empty (`edges: []`).
- Join boards are **result tables with counts**, not drawn lines; the lesson is the grain, so every
  card states its row count. Plausible-wrong results (wrong join key, amplified sum, `NOT IN` with a
  `NULL`) are shown as real output, with the cause asserted in `db/verify/ch05-combining.sql`.
- A view snippet creates its view inside its own rolled-back transaction, so `shop` never gains one.
- `INTERSECT ALL` / `EXCEPT ALL` are labelled as PostgreSQL's. Boards with four 2-column cards need
  scene `padding` 0.15 to clear the eyebrow.

### Known, not a defect

Routes with table nodes log React's *"unique key"* warning in dev — the published engine's
`TableNode`, no effect on the render (same note as `apache-spark`). `scripts/shot.mjs` filters it.
