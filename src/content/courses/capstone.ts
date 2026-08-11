import type { Course } from 'reveal-engine'

// Course 5 — "End-to-end project" (the BUILD slice, and the series finale). It teaches no new
// region: it walks ONE real e-commerce project end to end, reusing a concept from each earlier
// course at each step. The `capstone` scene carries the project itself — a build-flow spine
// across the top and the real SQL as six code cards below. Each section frames its code card
// (the SQL is readable) while lighting the matching flow step; the right slide explains the step
// and names the concept it reuses. Solid-tour reveal: 1 beat = 1 section, scene solid on entry.
//
// STATUS: COMPLETE (8 sections). §1 the-brief (whole scene, `focus: []`) · §2 model · §3 secure ·
// §4 load · §5 analyze · §6 report · §7 optimize (each frames its code card, `focus: ['cap-cN']`) ·
// §8 shipped (finale — whole `capstone` scene, all bright `focus: []`: the completed project).
// Solid-tour throughout.
export const capstone: Course = {
  id: 'capstone',
  title: 'End-to-end project',
  sections: [
    {
      // ── §1 THE BRIEF (SOLID TOUR opener): the whole project drawn solid and framed whole
      //    (`focus: []` → nothing dimmed, full brightness) — the flow spine AND all six code cards
      //    read at once. Later sections drop to each code card. ──
      id: 'the-brief',
      heading: 'The brief: build it end to end',
      scene: 'capstone',
      focus: [],
      slide: {
        title: 'The capstone',
        body: [
          'No new SQL this time — instead, one real project, built end to end. You’ll **use everything** from the last four courses on a single e-commerce database.',
          '',
          '### The six steps',
          '- **Model** the schema → **Secure** it with roles → **Load** data in a transaction',
          '- **Analyze** with a join + aggregation → **Report** with window functions → **Optimize** with an index',
          '',
          '### Each step reuses a course',
          '- **Model** (Course 1 · DDL) · **Secure** & **Load** (Course 3 · DCL, transactions)',
          '- **Analyze** & **Report** (Course 2 · joins, windows) · **Optimize** (Course 4 · indexes, EXPLAIN)',
          '',
          '### How to watch',
          '- The **flow** up top is the plan; each step lights as we reach it',
          '- The **code** below is the real SQL — the left pane is the project; the slide explains it',
          '',
          'Let’s build. First, the foundation everything rests on — the schema.',
        ].join('\n'),
      },
      beats: [
        {
          line: "This last course is different from the four before it. It doesn't teach a new corner of SQL — you've now seen them all. Instead, it takes everything you've learned and puts it to work building one real thing, end to end: a small e-commerce database, from an empty schema to a tuned, queryable system. Here's the plan, laid out as a flow across the top. Six steps. First we model the schema — the tables, keys, and constraints. Then we secure it, setting up roles so the right people have the right access. Then we load some data, safely, inside a transaction. With data in place, we analyze it — a real reporting query that joins customers to their orders and aggregates the results. Then we go further with a report that uses window functions to rank customers and compute running totals. And finally we optimize: we add an index and use EXPLAIN to prove it made the query faster. Notice that each step is really a callback to one of our courses — modeling is course one, securing and loading are course three, analyzing and reporting are course two, and optimizing is course four. That's the whole point of a capstone: the pieces you learned separately now click together into one workflow. As we go, the flow up top will light up step by step to show where we are, and the real SQL for each step appears as code on the left, while I explain what it's doing and why. Enough setup — let's build. Everything starts with the foundation: the schema.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'cap-flow', 'cap-model', 'cap-secure', 'cap-load', 'cap-analyze', 'cap-report', 'cap-optimize',
                'cap-c1', 'cap-c2', 'cap-c3', 'cap-c4', 'cap-c5', 'cap-c6',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §2 MODEL — frame card 01 (CREATE TABLE). Reuses Course 1 (DDL, keys, constraints). ──
      id: 'model',
      heading: 'Model: design the schema',
      scene: 'capstone',
      focus: ['cap-c1'],
      slide: {
        title: 'Model — the schema',
        body: [
          'Every project starts where Course 1 did: the tables. Two of them capture the whole shop.',
          '',
          '### The tables',
          '- **`customers`** — `id` primary key, `name` required, `email` unique',
          '- **`orders`** — `id` primary key, a **foreign key** `customer_id → customers(id)`',
          '',
          '### Constraints do the guarding',
          '- `CHECK (total >= 0)` — no negative orders can ever exist',
          '- `DEFAULT now()` fills `created_at`; the FK guarantees every order has a real customer',
          '',
          '### Why this first',
          '- Get the shape and the rules right and everything downstream — queries, integrity, speed — follows',
          '',
          'The schema exists. Before we put data in, decide **who** is allowed to.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Step one is the schema, exactly where the very first course began. Our shop needs just two tables to start. Customers, on the left, has an id as its primary key, a name that's required, and an email marked unique so no two customers can share one. Orders has its own id primary key, and crucially a foreign key — customer_id references customers id — which is the link that ties every order to a real customer. Look at the constraints doing their quiet work: the CHECK on total greater than or equal to zero means a negative order is simply impossible, the database will reject it; DEFAULT now fills in the created_at timestamp automatically; and that foreign key guarantees you can never insert an order for a customer who doesn't exist. This is the whole philosophy of course one in practice — we're pushing the business rules down into the schema so the database enforces them for us, on every write, forever. And we do it first because everything else in this project rests on it: get these tables and their rules right, and the queries, the integrity, and the performance all have solid ground to stand on. The schema now exists. But before we load a single row, there's a question course three taught us to ask: who is actually allowed to write to it?",
          delta: [{ kind: 'solidify', ids: ['cap-c1'] }],
        },
      ],
    },
    {
      // ── §3 SECURE — frame card 02 (GRANT). Reuses Course 3 (DCL, roles, least privilege). ──
      id: 'secure',
      heading: 'Secure: grant access',
      scene: 'capstone',
      focus: ['cap-c2'],
      slide: {
        title: 'Secure — roles & grants',
        body: [
          'Before any data goes in, decide who may touch it — the DCL from Course 3.',
          '',
          '### Two roles, least privilege',
          '- **`app_rw`** — the application: `SELECT, INSERT, UPDATE` (it runs the shop)',
          '- **`analyst_ro`** — reporting: `SELECT` only (it can never change data)',
          '',
          '### Grant to roles, not people',
          '- Add users to a role and they inherit its rights — access managed in one place',
          '- The analyst login **can’t** delete an order even by accident — it was never granted the right',
          '',
          'With access locked down, we can safely load the data — inside a transaction.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Before we trust this database with any data, we set up who's allowed to do what — the access control from course three. We create two roles, each with exactly the privileges it needs and no more. The first, app_rw, is for the application itself: it gets SELECT, INSERT, and UPDATE, because it runs the shop and needs to read and write orders. The second, analyst_ro, is for reporting and analytics: it gets SELECT and nothing else, so an analyst or a dashboard can read every table but can never, under any circumstances, change or delete a row. This is the principle of least privilege made concrete. Notice we grant to roles, not to individual people — that way we add users into a role and they inherit its rights, and access lives in one place instead of being scattered across dozens of accounts. And think about what this buys us: the reporting login literally cannot drop an order table or delete a customer, even if its password leaked or someone fat-fingered a query, because that permission was never granted to it in the first place. The safest write is the one that was never allowed. With the doors locked and the right keys handed out, we can finally load our data — and we'll do it the safe way, wrapped in a transaction.",
          delta: [{ kind: 'solidify', ids: ['cap-c2'] }],
        },
      ],
    },
    {
      // ── §4 LOAD — frame card 03 (BEGIN/INSERT/COMMIT). Reuses Course 3 (DML + transactions). ──
      id: 'load',
      heading: 'Load: seed data in a transaction',
      scene: 'capstone',
      focus: ['cap-c3'],
      slide: {
        title: 'Load — seed in a transaction',
        body: [
          'Now put data in — but as **one atomic unit**, the transaction pattern from Course 3.',
          '',
          '### All-or-nothing',
          '- `BEGIN` → insert customers → insert their orders → `COMMIT`',
          '- If any insert fails (a bad FK, a `CHECK` violation), `ROLLBACK` leaves the table **untouched**',
          '',
          '### Why wrap it',
          '- Orders reference customers — loading them half-way would leave **orphans or errors**',
          '- The transaction guarantees the database is only ever seen **before** or **after**, never mid-load',
          '',
          'Data is in and consistent. Now the payoff — asking it questions.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Now we load the data, and we do it the way course three taught: as a single atomic transaction. We say BEGIN, then insert our customers — Ann and Bob — then insert their orders, and finally COMMIT to make it all permanent at once. Why bother wrapping a few inserts in a transaction? Because these rows depend on each other. The orders carry foreign keys pointing at the customers, so if we loaded the orders before the customers existed, or if the process died halfway through, we'd be left with a broken, half-populated database — orphaned orders, or outright errors. The transaction makes that impossible: every insert inside it succeeds together, or if any one of them fails — a foreign key that doesn't match, a total that violates the CHECK constraint — the whole thing rolls back and the tables are left exactly as they were before we started. Anyone querying the database sees it either fully before the load or fully after, never in some inconsistent middle state. That's the guarantee that lets you load data with confidence. Our shop now has customers and orders, and they're consistent. Which means we've reached the fun part — actually asking the data questions.",
          delta: [{ kind: 'solidify', ids: ['cap-c3'] }],
        },
      ],
    },
    {
      // ── §5 ANALYZE — frame card 04 (JOIN + GROUP BY). Reuses Course 2 (joins, aggregation). ──
      id: 'analyze',
      heading: 'Analyze: join & aggregate',
      scene: 'capstone',
      focus: ['cap-c4'],
      slide: {
        title: 'Analyze — the revenue report',
        body: [
          'With data loaded, we ask a real business question — the query pipeline from Course 2.',
          '',
          '### Revenue per customer',
          '- **`JOIN`** stitches each order to its customer on the key',
          '- **`GROUP BY c.name`** collapses each customer’s orders into one row',
          '- **`count(*)`** and **`sum(o.total)`** aggregate — orders and revenue per customer',
          '',
          '### Filter groups, then sort',
          '- **`HAVING sum(o.total) > 50`** keeps only the valuable customers (groups, not rows)',
          '- **`ORDER BY revenue DESC`** puts the biggest spenders on top',
          '',
          'That’s the summary. But a summary loses the detail — for ranking *and* rows, we need a window.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Now the payoff — we ask the database a real business question, using the query pipeline from course two. The question is: who are our most valuable customers, by revenue? Read the query as the pipeline runs it. FROM and JOIN come first, stitching each order to its customer by matching customer_id to the customer's id. Then GROUP BY c.name collapses all of a single customer's orders down into one row per customer. On those groups we run our aggregates — count star for how many orders they placed, and sum of o.total for their total revenue. Then HAVING filters the groups, keeping only customers whose revenue tops fifty dollars — remember, HAVING filters groups after aggregation, where WHERE would have filtered individual rows before it. And finally ORDER BY revenue descending puts the biggest spenders right at the top. In one statement we've turned a pile of raw orders into a ranked revenue report. But notice what grouping did: it collapsed the orders away, giving us the summary but throwing out the detail. When you want the summary and the individual rows together — a rank, a running total — grouping can't do it. For that, course two gave us one more tool: the window function.",
          delta: [{ kind: 'solidify', ids: ['cap-c4'] }],
        },
      ],
    },
    {
      // ── §6 REPORT — frame card 05 (window fns). Reuses Course 2 (windows). ──
      id: 'report',
      heading: 'Report: rank with window functions',
      scene: 'capstone',
      focus: ['cap-c5'],
      slide: {
        title: 'Report — windows',
        body: [
          'The advanced report keeps every customer row **and** computes across them — window functions, from Course 2.',
          '',
          '### Ranking & running totals',
          '- **`RANK() OVER (ORDER BY revenue DESC)`** — a leaderboard position on every row',
          '- **`SUM(revenue) OVER (ORDER BY revenue DESC)`** — a **running total** of revenue down the list',
          '',
          '### Why not GROUP BY',
          '- The window **keeps every row** and adds the computed columns beside it — no collapse',
          '- `OVER(…)` is the whole difference: same aggregate, but *alongside* the rows, not instead of them',
          '',
          'The report is perfect — but as the shop grows, is it *fast*? Time to look under the hood.',
        ].join('\n'),
      },
      beats: [
        {
          line: "For the polished report, we reach for window functions — the tool from course two that computes across rows without collapsing them. Building on our revenue figures, we add two columns. RANK, over an ordering by revenue descending, stamps each customer with their leaderboard position — number one, number two, and so on. And SUM of revenue, over that same ordering, gives a running total: as you read down the list from the top spender, it accumulates the revenue, so you can see what fraction of your total comes from your top few customers. The magic word, as always, is OVER. Without it, SUM of revenue would collapse everything into a single grand total. With OVER, the sum is computed alongside every row instead of replacing them, so we keep every customer visible and just add these analytical columns beside them. That's the entire difference between an aggregate and a window function, and it's why windows are the right tool for rankings and running totals. Our reporting is now genuinely powerful — ranked customers, running revenue, all in one query. But there's one question left, and it's the one course four was all about: as this shop grows from two customers to two million, is this query still fast? Let's look under the hood and make sure.",
          delta: [{ kind: 'solidify', ids: ['cap-c5'] }],
        },
      ],
    },
    {
      // ── §7 OPTIMIZE — frame card 06 (CREATE INDEX + EXPLAIN). Reuses Course 4 (indexes, EXPLAIN). ──
      id: 'optimize',
      heading: 'Optimize: index & EXPLAIN',
      scene: 'capstone',
      focus: ['cap-c6'],
      slide: {
        title: 'Optimize — index & prove it',
        body: [
          'The final step makes it fast — and *proves* it — with Course 4’s tools.',
          '',
          '### Add the index',
          '- Lookups filter on `orders.customer_id`, so **`CREATE INDEX`** on that column',
          '- The B-tree turns a full-table scan into a **3–4-hop** jump to the matching rows',
          '',
          '### Prove it with EXPLAIN',
          '- Run **`EXPLAIN`** before and after — the plan flips from **`Seq Scan`** to **`Index Scan`**',
          '- Don’t guess at performance; **read the plan** and confirm the optimizer uses the index',
          '',
          'Modeled, secured, loaded, queried, and tuned — the project is shipped.',
        ].join('\n'),
      },
      beats: [
        {
          line: "The last step is to make it fast, and — just as importantly — to prove that it is, using the tools from course four. Our queries constantly filter and join on orders.customer_id, and right now, finding a given customer's orders means a sequential scan: reading every page of the orders table. So we create an index on customer_id. Behind that one line, the database builds a B-tree, which turns that full-table scan into a jump of just three or four hops straight to the matching rows, no matter how large the table grows. But here's the discipline course four drilled in: don't just assume the index helped — prove it. We run EXPLAIN on our query, and we read the plan. Before the index, the plan said Seq Scan on orders. After, it says Index Scan using our new index. That flip, from Seq Scan to Index Scan, is the optimizer telling us, in its own words, that it's now using the fast path. We didn't guess; we measured. And with that, look at what we've done: we modeled the schema, secured it with roles, loaded data safely in a transaction, analyzed it with joins and windows, and tuned it with an index we verified. The project is built, and it's shipped.",
          delta: [{ kind: 'solidify', ids: ['cap-c6'] }],
        },
      ],
    },
    {
      // ── §8 SHIPPED — the finale, on the PROJECT itself. Return to the whole capstone scene and
      //    frame it whole (`focus: []` → nothing dimmed): the complete build — flow spine + all six
      //    code cards — the thing you actually made. (Owner preferred ending on the project scene,
      //    not the abstract master map.) ──
      id: 'shipped',
      heading: 'Shipped',
      scene: 'capstone',
      focus: [],
      slide: {
        title: 'Shipped',
        body: [
          'The project is live — and there it is, whole: **every step, start to finish.** You’ve used all of SQL, together, on one real database.',
          '',
          '### What you built',
          '- A schema with keys & constraints → roles & grants → an atomic data load',
          '- A revenue report (joins + aggregation) → a ranked report (windows) → an index, proven with `EXPLAIN`',
          '',
          '### The whole journey',
          '- **Design** *(C1)* → **Read** *(C2)* → **Change** *(C3)* → **Tune** *(C4)* → **Build** *(this)*',
          '- Every sub-language, every mechanism, from the query down to the disk',
          '',
          'You can now design a database, query it, change it safely, tune it, and ship a project on it. That’s SQL — end to end.',
        ].join('\n'),
      },
      beats: [
        {
          line: "The project is live. Step back and look at the whole thing you just built — every step of it, from the empty schema at the top to the tuned, indexed query at the end. You modeled a schema with primary keys, foreign keys, and constraints. You secured it with roles and the principle of least privilege. You loaded data safely inside a transaction, all or nothing. You analyzed it with a join and aggregation, and then went further with window functions for ranking and running totals. And you tuned it with an index, proving the speedup by reading the query plan with EXPLAIN. That's not six separate scripts anymore — it's one fluent workflow, and every step of it reached back into something you'd already learned. That mirrors the whole journey of this series: you learned to design a database, to read it, to change it safely, to tune it, and finally, here, to build with it. Every sub-language, every mechanism, from the surface query all the way down to how the rows sit on disk. You started not knowing where SELECT ran in the pipeline, and you're ending able to architect, secure, populate, query, and optimize a real system. That's SQL, end to end — and it's yours now. Congratulations.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'cap-flow', 'cap-model', 'cap-secure', 'cap-load', 'cap-analyze', 'cap-report', 'cap-optimize',
                'cap-c1', 'cap-c2', 'cap-c3', 'cap-c4', 'cap-c5', 'cap-c6',
              ],
            },
          ],
        },
      ],
    },
  ],
}
