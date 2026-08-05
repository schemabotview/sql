import type { Course } from 'flow-engine'

// Course 4 — "Under the hood" (the TUNE slice of the SQL lifecycle). The spine is the
// `engine-path` scene (EXPLAIN → the planner → access + storage → MVCC); two stages detour to
// their own mechanism scenes — `btree` (index internals) and `mvcc` (row versions & snapshots).
// Solid-tour reveal throughout: 1 beat = 1 section; the scene is solidified on entry and the
// camera + focus tell the story.
//
// STATUS: COMPLETE (8 sections). §1 under-the-hood · §2 planner · §3 explain · §4 storage ·
// §5 indexes (`btree` detour) · §6 scans (re-entry) · §7 mvcc (`mvcc` detour) · §8 you-are-here
// (master map, lights Storage → whole map complete). §6 is a scene re-entry (re-solidifies
// engine-path after the btree detour); §8 mirrors the schema/queries/mutations bookend.
export const engine: Course = {
  id: 'engine',
  title: 'Under the hood',
  sections: [
    {
      // ── §1 THE BIG IDEA (SOLID TOUR opener): the whole engine-path drawn solid, framed whole
      //    (`focus: []` → nothing dimmed). The headline is the physical journey a query takes;
      //    every later section rides this same scene, lighting one band. ──
      id: 'under-the-hood',
      heading: 'What happens when you run a query',
      scene: 'engine-path',
      focus: [],
      slide: {
        title: 'Under the hood',
        body: [
          'You’ve designed, read, and changed data. Now: what does the database *actually do* when you hit run — and how do you make it fast?',
          '',
          '### The journey of a query',
          '- **The planner** turns your SQL into an **execution plan** — choosing *how* to get the rows',
          '- **`EXPLAIN`** shows you that plan — the single most useful tuning tool',
          '',
          '### Where the rows live',
          '- **Storage** — tablespaces → heap files → 8 KB **pages** → **tuples** (rows), with a **WAL** for durability',
          '- **Access methods** — read every page (**Seq Scan**) or jump via an **index** (**Index Scan**)',
          '',
          '### The two big mechanisms',
          '- **Indexes** (B-trees) make lookups fast — the heart of tuning',
          '- **MVCC** lets readers and writers run concurrently without blocking',
          '',
          'Understand these and “why is this query slow?” becomes a question you can answer. Let’s start with the planner.',
        ].join('\n'),
      },
      beats: [
        {
          line: "You can now design a database, read from it, and change it safely. This course answers the next question: when you actually run a query, what does the database do with it — and just as importantly, how do you make it fast? Here's the whole journey on one map. It starts at the top with the planner. You hand the database a SELECT, and it doesn't just blindly execute it — it first turns your query into an execution plan, deciding how to fetch the rows: which order to join tables, whether to use an index or scan the whole table. And the tool that lets you see the plan it chose is EXPLAIN, which is, without exaggeration, the single most useful thing to learn for making queries fast. Below that is where the data physically lives: storage. Your rows sit in files organized into fixed-size eight-kilobyte pages, each row stored as a tuple, with a write-ahead log guarding durability. To read those rows, the executor uses an access method — either a sequential scan that reads every page, or an index scan that jumps straight to what it needs. Which brings us to the two big mechanisms this course zooms into. Indexes, built as B-trees, are what make lookups fast, and they're the heart of tuning. And MVCC — multi-version concurrency control — is the clever trick that lets many transactions read and write at the same time without waiting on each other. Master these, and why is this query slow stops being a mystery and becomes a question you can actually answer. Let's start where the query does: the planner.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'ep-explain',
                'ep-planner', 'ep-parse', 'ep-analyze', 'ep-rewrite', 'ep-optimize', 'ep-execute',
                'ep-access', 'ep-seqscan', 'ep-idxscan',
                'ep-storage', 'ep-tablespace', 'ep-heap', 'ep-page', 'ep-tuple', 'ep-wal',
                'ep-mvcc', 'ep-versions', 'ep-snapshot', 'ep-vacuum',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §2 THE PLANNER — first band: SQL becomes a cost-based plan. Same scene; frame the
      //    planner band, light its five stages. ──
      id: 'planner',
      heading: 'The planner: SQL → a plan',
      scene: 'engine-path',
      focus: ['ep-planner'],
      highlight: ['ep-parse', 'ep-analyze', 'ep-rewrite', 'ep-optimize', 'ep-execute'],
      slide: {
        title: 'The planner',
        body: [
          'SQL is **declarative** — you say *what* rows you want, not *how* to get them. The planner decides the how.',
          '',
          '### From text to a plan',
          '- **Parse** — your SQL becomes a syntax tree · **Analyze** — resolve table & column names, types',
          '- **Rewrite** — expand views and rules · **Optimize** — choose the plan · **Execute** — run it',
          '',
          '### The optimizer is cost-based',
          '- For one query there are **many** ways to run it — join orders, scan types, index or not',
          '- It **estimates the cost** of each using table **statistics** (row counts, value spread) — picks the cheapest',
          '',
          '### Why plans go wrong',
          '- **Stale statistics** → bad cost estimates → a slow plan. `ANALYZE` refreshes them',
          '',
          'The optimizer’s chosen plan isn’t hidden — `EXPLAIN` shows it to you.',
        ].join('\n'),
      },
      beats: [
        {
          line: "The journey starts with the planner, and to understand it you have to remember that SQL is declarative: you describe what rows you want, never how to fetch them. That how is entirely the database's job, and the planner is where it's decided. It works in stages. First it parses your SQL text into a syntax tree — a structured form of the query. Then it analyzes that tree, resolving the names you used to real tables and columns and checking their types. Then it rewrites the query, expanding any views or rules into their underlying definitions. Then comes the interesting stage: optimize. For any given query there are usually many different ways to actually run it — which table to read first, what order to join them in, whether to use an index or just scan the whole table. The optimizer's job is to choose, and it does so by cost: it estimates how expensive each candidate plan would be, using statistics the database keeps about your tables — how many rows they have, how values are distributed — and it picks the cheapest one. Finally, execute runs that chosen plan. This cost-based approach is powerful, but it has a well-known failure mode: if those statistics are stale — if the table has grown ten times since they were last gathered — the cost estimates are wrong and the optimizer can pick a genuinely slow plan. The fix is to run ANALYZE, which refreshes the statistics. Now, the plan the optimizer settled on isn't a black box. There's a command that shows it to you, and it's the most important tuning tool in SQL: EXPLAIN.",
          delta: [{ kind: 'solidify', ids: ['ep-parse', 'ep-analyze', 'ep-rewrite', 'ep-optimize', 'ep-execute'] }],
        },
      ],
    },
    {
      // ── §3 EXPLAIN — frame the EXPLAIN code card. The practical tuning read-out. ──
      id: 'explain',
      heading: 'EXPLAIN: reading the plan',
      scene: 'engine-path',
      focus: ['ep-explain'],
      highlight: ['ep-explain'],
      slide: {
        title: 'EXPLAIN — reading the plan',
        body: [
          '`EXPLAIN` prints the plan the optimizer chose — without running the query. `EXPLAIN ANALYZE` runs it and adds the *real* numbers.',
          '',
          '### How to read it',
          '- A **tree of nodes** — read **inside-out / bottom-up**; each node feeds its parent',
          '- Each node shows a **cost** (`startup..total`) and an **estimated row count**',
          '',
          '### What to look for',
          '- **Seq Scan on a big table** where a filter is selective → a missing **index**',
          '- Estimated rows **far** from actual (in `ANALYZE`) → **stale statistics**',
          '- Join method — **Nested Loop** vs **Hash** vs **Merge** — the optimizer picks by size',
          '',
          '### The plan above',
          '- `Index Scan … Index Cond: (customer_id = 42)` — it jumped straight to customer 42’s rows',
          '',
          'The plan talks about scans and pages. Those are storage — where the rows actually live.',
        ].join('\n'),
      },
      beats: [
        {
          line: "EXPLAIN is how you see the plan, and learning to read it is the core skill of tuning. Put EXPLAIN in front of any query and, instead of running it, the database prints the plan the optimizer chose. Add the word ANALYZE and it actually runs the query too, so you also get the real execution times and the real row counts alongside the estimates — which is what you usually want. A plan is a tree of nodes, and the trick to reading it is to go inside-out, or bottom-up: the innermost, most-indented nodes run first and feed their results up to their parents. Each node tells you two key things — a cost, shown as a startup-dot-dot-total pair, and an estimated number of rows it will produce. Now, what are you actually looking for? A few tell-tale signs. The biggest one: a sequential scan on a large table when your query filters down to just a few rows — that's the classic signature of a missing index, the database reading the entire table because it has no faster path. Another: in an ANALYZE plan, if the estimated row count is wildly different from the actual, your statistics are stale and the optimizer is flying blind. And the join method — whether it chose a nested loop, a hash join, or a merge join — tells you how it's combining tables, a choice it makes based on their sizes. Look at the plan on the left: it chose an Index Scan with an index condition on customer_id equals forty-two, meaning it jumped straight to that customer's rows instead of scanning the table. Notice the plan keeps talking about scans and pages — and that's storage, where the rows physically live. Let's go there next.",
          delta: [{ kind: 'solidify', ids: ['ep-explain'] }],
        },
      ],
    },
    {
      // ── §4 STORAGE — frame the storage band: the physical hierarchy rows live in. ──
      id: 'storage',
      heading: 'Storage: pages, tuples & the WAL',
      scene: 'engine-path',
      focus: ['ep-storage'],
      highlight: ['ep-tablespace', 'ep-heap', 'ep-page', 'ep-tuple', 'ep-wal'],
      slide: {
        title: 'Storage — where rows live',
        body: [
          'Under every table is a physical layout — and it explains *why* scans and indexes cost what they do.',
          '',
          '### The hierarchy',
          '- **Tablespace** — a location on disk · **Heap file** — a table’s rows, in **no particular order**',
          '- **Page** — a fixed **8 KB** block; the database reads and writes **whole pages**, never single rows',
          '- **Tuple** — one row, stored inside a page',
          '',
          '### Why it matters for speed',
          '- A **Seq Scan** reads *every page* — fine for small tables, costly for big ones',
          '- The heap is **unordered**, so “find customer 42” means scanning — unless an **index** points the way',
          '',
          '### Durability — the WAL',
          '- A change is written to the **write-ahead log** *before* the data pages — that’s ACID’s **D**',
          '',
          'The heap can’t find a row fast on its own. The thing that can is an index — a B-tree.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Everything the planner talked about — scans, pages, costs — ultimately comes down to how rows are physically stored, so let's look at that layout. It's a hierarchy. At the outside is a tablespace, which is really just a location on disk where the database keeps files. Inside, each table is a heap file — and the word heap is important: the rows are stored in no particular order, just piled in wherever there's room. That file is divided into pages, each a fixed size, typically eight kilobytes, and this is the crucial unit: the database always reads and writes whole pages, never individual rows. It pulls an entire eight-kilobyte page into memory even if it only wants one row from it. And within a page sit the tuples — a tuple is just the stored form of one row. Now you can see exactly why performance works the way it does. A sequential scan has to read every page of the heap, which is perfectly fine for a small table but expensive for a huge one. And because the heap is unordered, a request like find customer forty-two has no shortcut — the database would have to scan looking for it, page by page, unless something tells it where to jump. There's also one more piece here, for writes: durability. When you change data, the change is written first to the write-ahead log, the WAL, before the actual data pages are updated — and that write-ahead guarantee is the D, durability, in ACID. So the heap alone can find a specific row only by scanning. The structure that fixes that — that lets the database jump straight to a row — is an index, and almost always it's a B-tree. Let's open one up.",
          delta: [{ kind: 'solidify', ids: ['ep-tablespace', 'ep-heap', 'ep-page', 'ep-tuple', 'ep-wal'] }],
        },
      ],
    },
    {
      // ── §5 INDEXES — a MECHANISM DETOUR to the `btree` scene. The scene switch resets the reveal,
      //    so this section solidifies the whole btree scene and frames it whole (`focus: []`).
      //    Answers §4's hook: how an index finds a row without scanning the heap. ──
      id: 'indexes',
      heading: 'Indexes: inside a B-tree',
      scene: 'btree',
      focus: [],
      slide: {
        title: 'Indexes — the B-tree',
        body: [
          'An index is a separate, sorted structure that lets the database **jump** to a row instead of scanning for it. Almost always it’s a **B-tree**.',
          '',
          '### How a lookup works',
          '- Start at the **root**, compare your key, follow one pointer down — **root → branch → leaf**',
          '- The **leaf** holds the sorted key and a pointer to the row’s place in the heap',
          '- Just **3–4 hops** to find one row among **millions** — that’s **O(log n)**',
          '',
          '### Range scans are cheap too',
          '- Leaves are kept in **sorted order and linked** — so `BETWEEN` / `>` walk sideways along them',
          '',
          '### The trade-off',
          '- Every `INSERT`/`UPDATE`/`DELETE` must **update the index** too — writes get slower',
          '- Indexes cost disk — so index the columns you **filter and join on**, not every column',
          '',
          'An index gives the planner a *choice*: scan the whole table, or use me. Which does it pick?',
        ].join('\n'),
      },
      beats: [
        {
          line: "An index is the structure that lets the database jump straight to a row instead of scanning the heap for it, and to see how, we have to open one up. Almost every index you'll use is a B-tree — a balanced tree of key values, and it's drawn here. At the very top is the root. When you search for a key — say customer forty-two — you start at the root and make a comparison: is the key below or above the split point? That answer sends you down exactly one pointer to a branch node, where you compare again and descend once more, until you reach the bottom level, the leaves. The leaves are where the real work pays off: they hold the actual key values, in sorted order, each paired with a pointer to exactly where that row sits in the heap. So the database follows this path — root, branch, leaf — and lands directly on the row. The magic is in how few steps that takes. Because each level fans out to many children, even a table with millions of rows is only three or four levels deep, so any single row is just three or four hops away. That's what O-of-log-n means in practice, and it's the difference between reading a handful of pages and reading the entire table. There's a bonus, too. Notice the leaves are linked together in sorted order, left to right. That means a range query — everything BETWEEN two values, or greater than something — doesn't restart at the root for each row; it finds the start and then just walks sideways along the linked leaves. But indexes aren't free, and that's the trade-off on the bottom. Every time you insert, update, or delete a row, the database has to update the index too, so writes get a little slower and every index takes extra disk. The rule that follows is simple: index the columns you actually filter and join on, not every column just in case. So now the table has an index, which means the planner has a choice to make: scan the whole thing, or use the index? Let's see how it decides.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'bt-tree', 'bt-root', 'bt-n1', 'bt-n2', 'bt-l1', 'bt-l2', 'bt-l3', 'bt-l4',
                'bt-why', 'bt-log', 'bt-range',
                'bt-trade', 'bt-writes', 'bt-disk',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §6 SCANS — RE-ENTRY to the engine-path scene (the btree detour switched scenes, so the
      //    reveal reset). Re-solidify the WHOLE engine-path, then frame the access band and light
      //    Seq Scan vs Index Scan — the choice the planner makes by selectivity. ──
      id: 'scans',
      heading: 'Seq Scan vs Index Scan',
      scene: 'engine-path',
      // Re-entry: the delta re-solidifies the whole scene; frame the access band, light both scans.
      focus: ['ep-access'],
      highlight: ['ep-seqscan', 'ep-idxscan'],
      slide: {
        title: 'Seq Scan vs Index Scan',
        body: [
          'Having an index doesn’t mean using it. The planner **chooses** per query — and sometimes a full scan really is cheaper.',
          '',
          '### The choice is about selectivity',
          '- **Selective** query (few rows match) → **Index Scan** — jump to just those rows',
          '- **Unselective** (most rows match) → **Seq Scan** — reading every page in order beats thousands of random index look-ups',
          '',
          '### Why an index scan isn’t free',
          '- Each match means a hop to the heap for the row — **random I/O**, costly at volume',
          '- (A **Bitmap** scan is the middle ground; an **index-only** scan skips the heap entirely)',
          '',
          '### “I added an index but it’s not used!”',
          '- Usually the query isn’t **selective** enough — or **statistics are stale** (`ANALYZE`)',
          '- The optimizer is doing its job: below a threshold, the scan is genuinely faster',
          '',
          'That’s the read path tuned. One mechanism remains — how all this stays consistent under concurrency: MVCC.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Here's a fact that surprises people: just because a table has an index doesn't mean a query will use it. The planner decides, per query, whether to do an index scan or a sequential scan — and sometimes scanning the entire table is genuinely the faster choice. The deciding factor is selectivity: how many rows your query actually matches. If it's very selective — you want customer forty-two, one row out of a million — the index scan is a huge win: descend the B-tree, grab that row, done. But if your query matches most of the table — say, all orders from the last two years out of three years of data — then an index scan is actually the wrong tool, because of a subtle cost. Each row an index finds requires a separate hop back to the heap to fetch the actual data, and those hops are random I/O, scattered all over the disk. Do that for millions of rows and it's slower than just reading every page of the table in one smooth sequential sweep — which is exactly what a seq scan does. So above a certain fraction of the table, the sequential scan wins, and the optimizer knows it. This is the answer to one of the most common complaints in SQL: I added an index but the database isn't using it. Almost always, it's because the query isn't selective enough to justify the index — or the statistics are stale and the optimizer is mis-estimating how many rows match, which a quick ANALYZE fixes. The planner isn't being stubborn; it's picking the genuinely cheaper plan. That's the read path understood and tunable. There's one last mechanism that makes all of this work while many users read and write at once — MVCC. Let's look at it.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'ep-explain',
                'ep-planner', 'ep-parse', 'ep-analyze', 'ep-rewrite', 'ep-optimize', 'ep-execute',
                'ep-access', 'ep-seqscan', 'ep-idxscan',
                'ep-storage', 'ep-tablespace', 'ep-heap', 'ep-page', 'ep-tuple', 'ep-wal',
                'ep-mvcc', 'ep-versions', 'ep-snapshot', 'ep-vacuum',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §7 MVCC — a MECHANISM DETOUR to the `mvcc` scene. The scene switch resets the reveal, so
      //    this section solidifies the whole mvcc scene and frames it whole (`focus: []`). This is
      //    the mechanism behind isolation (C3): readers see a snapshot, writers add versions. ──
      id: 'mvcc',
      heading: 'MVCC: versions & snapshots',
      scene: 'mvcc',
      focus: [],
      slide: {
        title: 'MVCC — versions & snapshots',
        body: [
          'How can readers and writers hit the same row at once without locking each other out? The database keeps **multiple versions** of every row.',
          '',
          '### One row, many versions',
          '- An `UPDATE` doesn’t overwrite — it writes a **new version** and marks the old one dead',
          '- Each version carries **`xmin`/`xmax`** — the transactions that created and ended it',
          '',
          '### A snapshot decides what you see',
          '- Each transaction reads against a **snapshot** — the set of versions committed as of its start',
          '- Two transactions can see **different versions of the same row** — no waiting (this is the mechanism behind **isolation**, Course 3)',
          '',
          '### The cleanup — VACUUM',
          '- Dead versions pile up; **`VACUUM`** reclaims them (autovacuum runs it for you)',
          '- Skip it and tables **bloat** — the one MVCC chore you must not ignore',
          '',
          'Readers never block writers; writers never block readers. That completes the engine — let’s see the whole map.',
        ].join('\n'),
      },
      beats: [
        {
          line: "One question has been lurking since the last course: how can one transaction read a row at the very moment another is updating it, without the two blocking each other? The answer is MVCC — multi-version concurrency control — and the idea is beautifully simple: the database never overwrites a row in place. Look at row forty-two here. When a transaction updates its total from forty dollars to fifty-five, the database doesn't change the old value — it writes a brand-new version of the row, version two, and marks the old version, version one, as dead. For a while, both physically exist. How does each version know its lifespan? Every version carries two hidden fields, xmin and xmax — the id of the transaction that created it, and the id of the one that retired it. Now the clever part: what any given transaction sees is governed by a snapshot, taken when it starts, which is essentially the list of versions that were committed as of that moment. So transaction A, which started at time one-fifty — before the update committed — looks at row forty-two and sees version one, forty dollars. Transaction B, which started at two hundred, sees version two, fifty-five dollars. Same row, same instant, two different truths, and neither transaction waited on the other for a moment. This is the actual machinery underneath the isolation levels from the previous course — snapshots are how the database gives each transaction its consistent view. There's one catch, and it's the bottom of the picture: all those dead versions accumulate, and something has to clean them up. That's VACUUM, which reclaims the space dead versions occupy. PostgreSQL runs it automatically as autovacuum, but if it ever falls behind, tables bloat with dead rows — the one piece of MVCC housekeeping you can't ignore. The payoff, though, is the whole reason for MVCC: readers never block writers, and writers never block readers. And with that, the engine is complete. Let's zoom back out to the map.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'mv-chain', 'mv-v1', 'mv-v2',
                'mv-snap', 'mv-txa', 'mv-txb',
                'mv-buys', 'mv-rw', 'mv-wr', 'mv-vac',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §8 you-are-here — RETURN to the master map (scene switch resets it, so re-solidify all
      //    72 nodes to redraw the full map) and focus the one band this course fills: Storage.
      //    With Courses 1–4 done, EVERY region is now covered — the map is complete. The bookend
      //    to schema §8 / queries §10 / mutations §10; hands off to Course 5 (capstone). ──
      id: 'you-are-here',
      heading: 'You are here',
      scene: 'sql-landscape',
      focus: ['storage', 'st-tablespace', 'st-pages', 'st-rows', 'st-wal'],
      slide: {
        title: 'You are here',
        body: [
          'Back on the map: this course lit the **foundation** — **Storage**, where every row physically lives — and with it, the whole map is covered.',
          '',
          '### What you can now do',
          '- Read the **planner**’s choices with `EXPLAIN` — the core tuning skill',
          '- Reason about **storage** (pages, tuples, the heap, the WAL) and why scans cost what they do',
          '- Speed lookups with **B-tree indexes**, and know **when** the planner will actually use one',
          '- Explain **MVCC** — the versions & snapshots behind concurrency and isolation',
          '',
          '### The whole map, across four courses',
          '- **Design** (DDL · Catalog) → **Read** (pipeline · sets) → **Change** (transactions · DCL · programmatic) → **Tune** (storage · the engine)',
          '- Every region is now lit — you understand SQL from the query down to the disk',
          '',
          'One course remains — and it’s different: a **capstone** that uses all of this on one real project.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Let's return to the map a final time. The last dark region, storage, is now lit — and with it, look at the whole picture: every region of the map is bright. Over four courses you've covered all of SQL, from the surface language down to the physical disk. In this course specifically, you learned to go under the hood. You can now read what the planner decided using EXPLAIN, which is the single most valuable tuning skill there is. You understand storage — that rows live as tuples inside eight-kilobyte pages in an unordered heap, with a write-ahead log for durability — and so you understand why a sequential scan costs what it does. You know how a B-tree index turns a scan into a handful of hops, and, just as importantly, when the planner will actually choose to use one and when it won't. And you can explain MVCC — the versions and snapshots that let many transactions read and write at once, the very machinery underneath the isolation levels from before. Step back and trace the arc of the whole series. You started by designing a database — DDL and the catalog. You learned to read it — the query pipeline and set operations. You learned to change it safely — transactions, access control, and server-side logic. And now you've learned to tune it — storage and the engine. Design, read, change, tune: the entire lifecycle, the entire map. There's one course left, and it's a different kind of course. Instead of teaching a new region, it takes everything you now know and puts it to work on a single, real project, end to end — the capstone.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'ddl', 'ddl-create-table', 'ddl-alter-table', 'ddl-drop-table', 'ddl-truncate', 'ddl-create-index', 'ddl-create-view', 'ddl-rename',
                'catalog', 'cat-database', 'cat-schema', 'cat-table', 'tbl-columns', 'tbl-indexes', 'tbl-constraints', 'con-pk', 'con-fk', 'con-notnull', 'con-unique', 'con-check', 'tbl-views',
                'transactions', 'txn-begin', 'txn-writedml', 'dml-insert', 'dml-update', 'dml-delete', 'dml-merge', 'txn-commit', 'txn-rollback', 'txn-isolation', 'iso-ru', 'iso-rc', 'iso-rr', 'iso-ser',
                'dcl', 'dcl-grant', 'dcl-revoke', 'dcl-roles',
                'storage', 'st-tablespace', 'st-pages', 'st-rows', 'st-wal',
                'programmatic', 'prog-procs', 'prog-funcs', 'prog-triggers', 'prog-cursors',
                'query-pipeline', 'qp-cte', 'qp-window', 'qp-from', 'qp-join', 'join-inner', 'join-left', 'join-right', 'join-full', 'join-cross', 'join-self', 'qp-where', 'qp-groupby', 'qp-having', 'qp-select', 'qp-distinct', 'qp-orderby', 'qp-limit',
                'set-operations', 'set-union', 'set-unionall', 'set-intersect', 'set-except',
              ],
            },
          ],
        },
      ],
    },
  ],
}
