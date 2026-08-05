import type { Course } from 'flow-engine'

// Course 2 — "Reading data" (the QUERY slice of the SQL lifecycle). The spine is the
// `query-pipeline` scene (the logical execution order); two stages detour to their own
// mechanism scenes — `joins` (how rows match) and `windows` (frames over partitions).
// Solid-tour reveal throughout: 1 beat = 1 section; the scene is solidified on entry and the
// camera + focus tell the story.
//
// STATUS: COMPLETE (10 sections). §1 logical-order · §2 from · §3 join (detour) · §4 where ·
// §5 group-having · §6 window (detour) · §7 select-distinct · §8 order-limit · §9 set-ops ·
// §10 you-are-here (returns to the master map). §4 & §7 are scene re-entries (re-solidify the
// whole pipeline after a detour); §10 mirrors schema §8's master-map bookend.
export const queries: Course = {
  id: 'queries',
  title: 'Reading data',
  sections: [
    {
      // ── §1 THE BIG IDEA (SOLID TOUR opener): the whole pipeline drawn solid, framed whole
      //    (`focus: []` → nothing dimmed). The write-strip vs run-pipeline contrast is the
      //    headline; every later section rides this same scene, lighting one stage. ──
      id: 'logical-order',
      heading: 'The order it runs',
      scene: 'query-pipeline',
      focus: [],
      slide: {
        title: 'How a SELECT runs',
        body: [
          'You **write** a query in one order — the database **runs** it in another. That gap explains half of SQL’s surprises.',
          '',
          '### How you write it',
          '- `SELECT` → `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `ORDER BY` → `LIMIT`',
          '- `SELECT` comes *first* on the page — but it’s almost the *last* thing to run',
          '',
          '### How it runs — the logical order',
          '- `FROM`/`JOIN` get the rows → `WHERE` filters them → `GROUP BY`/`HAVING` group & filter groups',
          '- **then** `SELECT` chooses columns → `DISTINCT` → `ORDER BY` → `LIMIT`',
          '',
          '### Why the gap bites',
          '- A **column alias** you make in `SELECT` isn’t visible in `WHERE` — `SELECT` runs later',
          '- `WHERE` filters **rows**; `HAVING` filters **groups** — two different stages',
          '',
          'We’ll walk the pipeline stage by stage — in the order it actually runs.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Here's the single most useful thing to understand about reading data: the order you write a query in is not the order it runs in. You write SELECT first — it's the first word you type — followed by FROM, WHERE, GROUP BY, HAVING, ORDER BY, and LIMIT. But the database throws that order away and runs the query as a pipeline. It starts with FROM and JOIN to gather the raw rows from your tables. Then WHERE filters those rows down to the ones you care about. Then GROUP BY collapses them into groups and HAVING filters the groups. Only then — well down the pipeline — does SELECT run, choosing which columns and expressions to return, followed by DISTINCT to drop duplicates, ORDER BY to sort, and finally LIMIT to take the top few. This gap explains a whole class of SQL surprises. It's why an alias you invent in SELECT can't be used back in WHERE — because WHERE already ran, long before SELECT. And it's why WHERE and HAVING feel similar but aren't: WHERE filters individual rows near the start, while HAVING filters whole groups much later. Keep this pipeline in your head and SQL stops being a bag of tricks. We'll now walk it stage by stage, in the order it truly runs.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'writeq',
                'run', 'rp-cte', 'rp-window', 'rp-from', 'rp-join', 'rp-where', 'rp-groupby', 'rp-having', 'rp-select', 'rp-distinct', 'rp-orderby', 'rp-limit',
                'setops', 'so-a', 'so-union', 'so-unionall', 'so-intersect', 'so-except', 'so-b',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §2 FROM — the first stage: choose the source rows. Focus defaults to FROM + its CTE
      //    feeder → camera frames the head of the pipeline, lights it, dims the rest. ──
      id: 'from',
      heading: 'FROM: where rows come from',
      scene: 'query-pipeline',
      // Frame the whole pipeline band (keeps context — no disorienting zoom) but light only FROM.
      focus: ['run'],
      highlight: ['rp-from', 'rp-cte'],
      slide: {
        title: 'FROM — the source',
        body: [
          'Every query begins by choosing the rows it works on.',
          '',
          '### FROM — the source rows',
          '- Name the **table(s)** the query reads from',
          '- The result is a working set of rows that every later stage shapes',
          '',
          '### CTEs & subqueries — named sources',
          '- A **subquery** in `FROM` is a table-shaped result you can select from',
          '- A **CTE** (`WITH name AS (…)`) *names* that subquery — readable, reusable, defined once',
          '',
          '### Recursive CTEs — a peek',
          '- `WITH RECURSIVE` walks **hierarchies** (org charts, category trees, graphs)',
          '- A **base case** plus a step that repeats until nothing new is produced',
          '',
          'With rows in hand, the next stage combines tables — `JOIN`.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Everything a query does starts at FROM, because FROM decides where the rows come from. In the simplest case you just name a table, and that becomes the working set of rows the rest of the pipeline filters, groups, and shapes. But FROM can take more than a plain table. Anywhere you can name a table, you can put a subquery — a query wrapped in parentheses whose result is itself a table of rows you select from. When those subqueries start to pile up or repeat, you pull them out into a CTE, a common table expression, written with the WITH keyword: you give the subquery a name once, up front, and then refer to it by that name below. It doesn't change what runs — it just makes the query readable, and lets you reuse the same intermediate result without copying it. CTEs also unlock something plain subqueries can't do easily: recursion. A recursive CTE, written WITH RECURSIVE, walks hierarchies — an org chart, a category tree, a graph of links — by starting from a base case and repeatedly applying a step that builds on the rows found so far, until no new rows appear. However you source them, once FROM has produced a set of rows, the next stage's job is to combine rows across tables — and that's the JOIN.",
          delta: [{ kind: 'solidify', ids: ['rp-from', 'rp-cte'] }],
        },
      ],
    },
    {
      // ── §3 JOIN — a MECHANISM DETOUR to the `joins` scene. The scene switch resets the reveal,
      //    so this section solidifies the whole joins scene and frames it whole (`focus: []`). ──
      id: 'join',
      heading: 'JOIN: matching rows across tables',
      scene: 'joins',
      focus: [],
      slide: {
        title: 'JOIN — combine rows',
        body: [
          'A join combines rows from two tables by **matching on a key**.',
          '',
          '### How the match works',
          '- Line up `customers.id` with `orders.customer_id` — each order finds its customer',
          '- **Ann** has two orders, **Bob** one, **Cat** none — so Cat has no match to make',
          '',
          '### The join *type* decides what to keep',
          '- **INNER** — only rows that matched (Cat drops out)',
          '- **LEFT / RIGHT** — keep all of one side, matched or not (Cat stays, with `NULL`s)',
          '- **FULL OUTER** — keep everything from both sides',
          '',
          '### The other two',
          '- **CROSS** — every row of A paired with every row of B (a Cartesian product)',
          '- **SELF** — a table joined to itself (e.g. employee → their manager)',
          '',
          'Same rows, different survivors — the type is the whole game. Back to the pipeline: `WHERE`.',
        ].join('\n'),
      },
      beats: [
        {
          line: "A join is how you combine rows from two tables, and it all hinges on matching a key. Here we line up customers.id with orders.customer_id: order 101 and 102 both carry customer 1, so they match Ann; order 103 carries customer 2, so it matches Bob. Notice Cat — customer 3 — has no orders at all, so she has nothing to match. That single fact is what the different join types are really about, because they only disagree on what to do with rows that don't match. An inner join keeps only the rows that found a partner, so Ann and Bob's orders come through and Cat simply disappears. A left join keeps everything from the left table no matter what — so Cat stays, with nulls where an order would be — and a right join does the same for the right table. A full outer join keeps everything from both sides, matched or not. Those four cover almost everything you'll do. The last two are special-purpose: a cross join pairs every row of one table with every row of the other — a Cartesian product you usually create by accident — and a self join is a table joined to itself, which is how you'd match each employee to their manager in the same employees table. So the mechanics are always the same — match on a key — and the join type just decides which unmatched rows survive. Now back to the pipeline, where the next stage filters those rows: WHERE.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'j-customers', 'j-orders',
                'j-types', 'jt-inner', 'jt-left', 'jt-right', 'jt-full', 'jt-cross', 'jt-self',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §4 WHERE — RE-ENTRY to the query-pipeline scene (the joins detour switched scenes, so
      //    the reveal reset). Re-solidify the WHOLE pipeline to restore the solid tour, then use
      //    an explicit `focus` so only WHERE lights and the rest dims. ──
      id: 'where',
      heading: 'WHERE: filtering rows',
      scene: 'query-pipeline',
      // Re-entry: the delta re-solidifies the whole pipeline; frame the run band, light WHERE.
      focus: ['run'],
      highlight: ['rp-where'],
      slide: {
        title: 'WHERE — keep matching rows',
        body: [
          'WHERE keeps only the rows that satisfy a condition — and it runs *early*, before grouping or SELECT.',
          '',
          '### Filtering rows',
          '- Test each row against a predicate — `total > 0`, `status = \'paid\'`',
          '- Combine with `AND` / `OR` / `NOT`; `IN` for a set, `BETWEEN` for a range',
          '- `LIKE \'A%\'` matches a **text pattern** — `%` = any run of chars, `_` = exactly one; `NOT LIKE` inverts, Postgres `ILIKE` ignores case',
          '- Runs before `SELECT`, so it **can’t see a SELECT alias** (that stage hasn’t run yet)',
          '',
          '### NULL — the third truth value',
          '- SQL logic is **three-valued**: `TRUE`, `FALSE`, and **`UNKNOWN`**',
          '- Any comparison with `NULL` is `UNKNOWN` — `total = NULL` is *never* true',
          '- Test with **`IS NULL`** / **`IS NOT NULL`**, never `= NULL`',
          '',
          '### WHERE vs HAVING',
          '- **WHERE** filters individual **rows**, here, early — **HAVING** filters **groups**, later',
          '',
          'Filtered rows in hand, the next stage collapses them into groups — `GROUP BY`.',
        ].join('\n'),
      },
      beats: [
        {
          line: "After the rows are gathered and joined, WHERE is where you filter them down. It tests every row against a condition — total greater than zero, status equals paid — and keeps only the rows where that condition is true. You build up conditions with AND, OR, and NOT, and reach for IN to test a set of values and BETWEEN for a range. And when you need to match text by shape rather than exactly, that's LIKE: the pattern 'A percent' finds every name starting with A, where percent stands for any run of characters and underscore for exactly one character. NOT LIKE inverts it, and Postgres adds ILIKE for a case-insensitive match. Remember from the pipeline that WHERE runs early — before SELECT — which is why you can't refer to a column alias you invented in SELECT; that stage simply hasn't happened yet. Now the part that trips everyone up: NULL. SQL logic isn't two-valued, it's three-valued — a condition can be true, false, or unknown. And the moment NULL is involved, you get unknown. total equals NULL is not false, it's unknown, so the row is dropped — and crucially, total equals NULL is never true even when the value really is null. That's why you never write equals NULL; you write IS NULL or IS NOT NULL, which are the only operators that actually test for it. Finally, keep WHERE and HAVING straight: WHERE filters individual rows here, near the start, while HAVING filters whole groups much later, after grouping. Speaking of which — with our rows filtered, the next stage collapses them into groups: GROUP BY.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'writeq',
                'run', 'rp-cte', 'rp-window', 'rp-from', 'rp-join', 'rp-where', 'rp-groupby', 'rp-having', 'rp-select', 'rp-distinct', 'rp-orderby', 'rp-limit',
                'setops', 'so-a', 'so-union', 'so-unionall', 'so-intersect', 'so-except', 'so-b',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §5 GROUP BY + HAVING — consecutive same-scene section: solidify the two stages it lights;
      //    focus defaults to them (camera frames the grouping segment). ──
      id: 'group-having',
      heading: 'GROUP BY & HAVING: aggregation',
      scene: 'query-pipeline',
      // Keep the whole pipeline in frame; light GROUP BY + HAVING (the two grouping stages).
      focus: ['run'],
      highlight: ['rp-groupby', 'rp-having'],
      slide: {
        title: 'GROUP BY & HAVING',
        body: [
          'Grouping collapses many rows into one row per group, then summarizes each with an aggregate.',
          '',
          '### GROUP BY — collapse into groups',
          '- Rows sharing a value fold into **one row per group** — `GROUP BY customer_id`',
          '- Every selected column must be either **grouped** or wrapped in an **aggregate**',
          '',
          '### Aggregates — one value per group',
          '- `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`',
          '- `COUNT(*)` counts rows; `COUNT(col)` skips `NULL`s',
          '',
          '### HAVING — filter the groups',
          '- Like `WHERE`, but on **groups**, *after* aggregation — `HAVING COUNT(*) > 5`',
          '- `WHERE` filters rows *before* grouping; `HAVING` filters groups *after* it',
          '',
          'One thing grouping *can’t* do is keep every row while ranking — that’s a window function.',
        ].join('\n'),
      },
      beats: [
        {
          line: "GROUP BY is where a query stops thinking in individual rows and starts thinking in groups. It takes all the rows that share a value — say, all the orders with the same customer_id — and collapses them into a single row per group. Once you've grouped, there's a rule: every column you select has to be either one of the columns you grouped by, or wrapped in an aggregate function, because the group is now one row and the database needs to know how to squash the many values into one. Those aggregates are the familiar five — COUNT, SUM, AVG, MIN, and MAX — each producing one value per group. A small but important detail: COUNT star counts every row in the group, while COUNT of a specific column skips the nulls in that column. Then comes HAVING, which is simply WHERE for groups. WHERE already filtered the individual rows early on; HAVING filters the groups after aggregation — so HAVING COUNT star greater than five keeps only the groups with more than five rows. The way to remember it: WHERE runs before grouping and filters rows, HAVING runs after grouping and filters groups. Grouping is powerful, but it's lossy — it throws away the individual rows to give you the summary. When you need the summary AND every original row at the same time — a running total, a rank within each group — grouping can't help. For that, you need a window function.",
          delta: [{ kind: 'solidify', ids: ['rp-groupby', 'rp-having'] }],
        },
      ],
    },
    {
      // ── §6 WINDOW — a MECHANISM DETOUR to the `windows` scene. The scene switch resets the
      //    reveal, so this section solidifies the whole windows scene and frames it whole
      //    (`focus: []`). Answers §5's hook: keep every row AND compute across them. ──
      id: 'window',
      heading: 'Window functions: compute across rows, keep them',
      scene: 'windows',
      focus: [],
      slide: {
        title: 'Window functions',
        body: [
          'A window function computes across a set of rows **without collapsing them** — the exact thing `GROUP BY` can’t do.',
          '',
          '### GROUP BY vs a window',
          '- `GROUP BY` folds many rows into **one row per group** — the detail is gone',
          '- A window keeps **every original row** and adds a **computed column** beside it',
          '',
          '### `OVER( … )` — the window',
          '- **`PARTITION BY`** — split rows into groups (like `GROUP BY`, but rows stay)',
          '- **`ORDER BY`** — sequence rows *within* each partition (for ranks & running totals)',
          '- **frame** (`ROWS BETWEEN …`) — which nearby rows the function sees (a sliding window)',
          '',
          '### The function family',
          '- **Ranking** — `ROW_NUMBER`, `RANK`, `DENSE_RANK` (ties skip vs don’t)',
          '- **Offset** — `LAG` / `LEAD` peek at the previous / next row',
          '- **Running aggregates** — `SUM() OVER`, `AVG() OVER` — totals & moving averages',
          '',
          'Back to the pipeline — after the rows are shaped, `SELECT` chooses columns, then `DISTINCT`.',
        ].join('\n'),
      },
      beats: [
        {
          line: "GROUP BY had one big limitation: it's lossy. To give you a total per customer it collapses all of Ann's orders into a single row, and the individual orders are gone. A window function solves exactly that. Look at the two sides here: on the left, GROUP BY folds five orders down to four summary rows. On the right, the very same rows go in — but the window keeps all five and adds a new column beside them, a running total that climbs from forty to sixty-five across Ann's two orders. Same computation, but nothing is thrown away. The magic word is OVER. Any aggregate, or a special ranking function, followed by OVER and a set of parentheses, becomes a window function. Inside those parentheses you describe the window — the set of rows each row gets to see. PARTITION BY splits the rows into groups, just like GROUP BY, except the rows survive: here we partition by customer, so Ann's running total restarts independently of Bob's. ORDER BY sequences the rows within each partition, which is what lets you rank them or accumulate a running total in a defined order. And the frame — ROWS BETWEEN — narrows the window further to just the nearby rows, which is how you get a moving average over, say, the last three rows. As for what you can compute: there's a ranking family — ROW_NUMBER gives each row a position, RANK and DENSE_RANK handle ties, differing only in whether they skip numbers after a tie. There's an offset family — LAG and LEAD let a row peek at the previous or next row, perfect for period-over-period comparisons. And there are the running aggregates — SUM OVER for running totals, AVG OVER for moving averages. Windows are the tool for ranking, running totals, and comparisons — any time you need the summary and the detail together. Now back to the pipeline: with the rows fully shaped, SELECT finally chooses the columns, and DISTINCT drops any duplicates.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'w-grouped', 'w-windowed',
                'w-over', 'w-part', 'w-order', 'w-frame',
                'w-funcs', 'wf-rownum', 'wf-rank', 'wf-denserank', 'wf-lag', 'wf-sumover', 'wf-avgover',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §7 SELECT + DISTINCT — RE-ENTRY to the query-pipeline scene (the windows detour switched
      //    scenes, so the reveal reset). Re-solidify the WHOLE pipeline to restore the solid tour,
      //    then frame the run band and light SELECT + DISTINCT (the two projection stages). ──
      id: 'select-distinct',
      heading: 'SELECT & DISTINCT: choosing the columns',
      scene: 'query-pipeline',
      // Re-entry: the delta re-solidifies the whole pipeline; frame the run band, light SELECT+DISTINCT.
      focus: ['run'],
      highlight: ['rp-select', 'rp-distinct'],
      slide: {
        title: 'SELECT & DISTINCT',
        body: [
          'It’s written first, but `SELECT` runs *late* — near the end, once the rows are gathered, filtered, and grouped.',
          '',
          '### SELECT — choose the output',
          '- Pick **columns**, compute **expressions** (`price * qty`), call functions',
          '- Handle NULLs in the output with **`COALESCE(phone, \'—\')`** — returns the first non-NULL, left → right',
          '- `SELECT *` takes every column; name them explicitly in real queries',
          '- An **alias** (`AS total`) is *created here* — so `WHERE` can’t see it, but `ORDER BY` (later) can',
          '',
          '### DISTINCT — drop duplicate rows',
          '- Removes rows that are **identical across all selected columns**',
          '- Runs *after* `SELECT`, on the projected rows — so it dedupes what you actually chose',
          '- Postgres adds **`DISTINCT ON (col)`** — first row per value of `col`',
          '',
          '### Why the order matters',
          '- `SELECT` runs after `WHERE`/`GROUP BY` — that’s why its aliases aren’t available upstream',
          '',
        ].join('\n'),
      },
      beats: [
        {
          line: "SELECT is the word you write first, but by now you know it runs almost last — only after FROM gathered the rows, WHERE filtered them, and GROUP BY collapsed them does SELECT finally get to choose what comes out. Its job is projection: picking which columns to return, and computing expressions from them — price times quantity, a concatenated name, a function call. SELECT star is the shortcut that grabs every column, which is fine when you're exploring but something you'll almost always spell out explicitly in real queries. This is also the natural place to clean up NULLs in the output: COALESCE walks a list of values left to right and returns the first one that isn't null, so COALESCE of phone comma a dash shows the phone number when it exists and a dash when it doesn't. This is also where aliases are born: when you write AS total, that name total comes into existence right here, at the SELECT stage. And that single fact explains the alias rule that trips people up — WHERE ran earlier, so it can't see total, but ORDER BY runs later, so it can. The stage is the whole explanation. Once SELECT has produced its columns, DISTINCT steps in to remove duplicate rows — rows that are identical across every column you selected. Notice the ordering: DISTINCT runs after SELECT, so it dedupes the projected result, not the original rows — change which columns you select and you change what counts as a duplicate. Postgres adds a sharper tool, DISTINCT ON, which keeps just the first row for each value of a column you name — handy for grabbing the latest order per customer. So SELECT chooses the columns and DISTINCT removes the repeats. All that's left is to arrange the result: sorting it, and taking the top few — ORDER BY and LIMIT.",
          delta: [
            {
              kind: 'solidify',
              ids: [
                'writeq',
                'run', 'rp-cte', 'rp-window', 'rp-from', 'rp-join', 'rp-where', 'rp-groupby', 'rp-having', 'rp-select', 'rp-distinct', 'rp-orderby', 'rp-limit',
                'setops', 'so-a', 'so-union', 'so-unionall', 'so-intersect', 'so-except', 'so-b',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── §8 ORDER BY + LIMIT — consecutive same-scene section (rides §7's solid pipeline). Solidify
      //    the two arranging stages; keep the whole run band framed, light ORDER BY + LIMIT. ──
      id: 'order-limit',
      heading: 'ORDER BY & LIMIT: arranging the result',
      scene: 'query-pipeline',
      // Keep the whole pipeline in frame; light the last two stages.
      focus: ['run'],
      highlight: ['rp-orderby', 'rp-limit'],
      slide: {
        title: 'ORDER BY & LIMIT',
        body: [
          'The final two stages don’t change *which* rows you get — they arrange them.',
          '',
          '### ORDER BY — sort the result',
          '- Sort by one or more columns — `ORDER BY total DESC, name ASC`',
          '- Runs *after* `SELECT`, so it **can** use a `SELECT` alias (and even its column position)',
          '- Control `NULL`s explicitly with `NULLS FIRST` / `NULLS LAST`',
          '',
          '### LIMIT — take the top N',
          '- Keep only the first *N* rows — `LIMIT 10` — the last stage to run',
          '- Pair with `OFFSET` to page through results (`LIMIT 10 OFFSET 20`)',
          '- **Only meaningful with `ORDER BY`** — without a sort, "the top 10" is arbitrary',
          '',
          '### Order without collapsing rows',
          '- Ranking *within* groups is a window (`ROW_NUMBER`), not `LIMIT` — different tool',
          '',
          'That completes the pipeline. One more way to combine results sits outside it: set operations.',
        ].join('\n'),
      },
      beats: [
        {
          line: "We've reached the end of the pipeline, and the last two stages are the simplest to describe: they don't change which rows you get, only how they're arranged. ORDER BY sorts the result. You give it one or more columns, each ascending or descending — order by total descending, then name ascending, to break ties. Because ORDER BY runs after SELECT, it's allowed to use the aliases you created there, unlike WHERE — that late position finally works in your favor. One detail worth knowing: nulls sort to one end, and you can say exactly which with NULLS FIRST or NULLS LAST. Then LIMIT, the very last thing to run, simply keeps the first N rows and throws away the rest — LIMIT 10 for the top ten. Pair it with OFFSET and you can page through results, skipping the first twenty to show the next ten. But here's the catch that matters: LIMIT is only meaningful when the rows are already sorted. Without an ORDER BY, the database is free to return any ten rows it likes, so the top ten becomes whatever it happened to find first — almost never what you want. And one last distinction to keep clean: if you want the top three orders per customer, that's not LIMIT — LIMIT cuts the whole result. Ranking within each group is a window function, ROW_NUMBER, the tool we just met. That completes the pipeline, from FROM all the way to LIMIT. There's just one more way to combine results, and it sits outside the pipeline entirely: set operations.",
          delta: [{ kind: 'solidify', ids: ['rp-orderby', 'rp-limit'] }],
        },
      ],
    },
    {
      // ── §9 SET OPERATIONS — consecutive same-scene section. These live OUTSIDE the pipeline
      //    (they stack whole result sets), so light the bottom `setops` band, not a run stage.
      //    Frame that band (default focus = the ids it solidifies). ──
      id: 'set-ops',
      heading: 'Set operations: stacking whole results',
      scene: 'query-pipeline',
      slide: {
        title: 'Set operations',
        body: [
          'Joins combine tables **side by side** (more columns). Set operations stack two results **on top of each other** (more rows).',
          '',
          '### The rule',
          '- Both queries must return the **same number of columns**, with **compatible types**',
          '- Column *names* come from the first query; position is what matches',
          '',
          '### The four operators',
          '- **`UNION`** — all rows from both, **duplicates removed**',
          '- **`UNION ALL`** — all rows from both, **duplicates kept** (faster — no dedupe pass)',
          '- **`INTERSECT`** — only rows present in **both** results',
          '- **`EXCEPT`** — rows in the first result but **not** the second',
          '',
          '### A common trap',
          '- `UNION` pays to sort & dedupe — reach for **`UNION ALL`** when you know rows are distinct',
          '',
          'That’s the whole read path — from the pipeline to set operations. Let’s put the map back together.',
        ].join('\n'),
      },
      beats: [
        {
          line: "There's one more way to combine data, and it works completely differently from a join. A join glues tables side by side — it matches rows and gives you more columns. A set operation stacks two query results on top of each other — same columns, more rows. Because you're stacking them, there's one rule that must hold: both queries have to return the same number of columns, and those columns have to be type-compatible, matched by position, left to right. The column names in the final result just come from the first query. With that rule satisfied, there are four operators. UNION returns all the rows from both queries and removes duplicates, so you get a clean combined set. UNION ALL does the same but keeps every duplicate — and because it skips the work of sorting and de-duplicating, it's noticeably faster, which is why it's the one to reach for whenever you already know the two sets don't overlap. INTERSECT keeps only the rows that appear in both results — the overlap. And EXCEPT keeps the rows from the first query that are not in the second — a set difference, useful for finding what's missing. The trap to remember is that plain UNION always pays that dedupe cost; if you don't need it, UNION ALL is the right default. And that completes the entire read path: gather, filter, group, window, project, sort, limit — and, off to the side, stack results with set operations. Let's step back and put the whole map together.",
          delta: [
            {
              kind: 'solidify',
              ids: ['setops', 'so-a', 'so-union', 'so-unionall', 'so-intersect', 'so-except', 'so-b'],
            },
          ],
        },
      ],
    },
    {
      // ── §10 you-are-here — RETURN to the master map (scene switch resets it, so re-solidify all
      //    72 nodes to redraw the full map) and focus the two bands this course covered: the query
      //    pipeline + set operations light, the other six dim. The bookend to Course 1 §8, which
      //    lit DDL + Catalog; hands off to Course 3 (mutations). ──
      id: 'you-are-here',
      heading: 'You are here',
      scene: 'sql-landscape',
      focus: [
        'query-pipeline', 'qp-cte', 'qp-window', 'qp-from', 'qp-join', 'join-inner', 'join-left', 'join-right', 'join-full', 'join-cross', 'join-self', 'qp-where', 'qp-groupby', 'qp-having', 'qp-select', 'qp-distinct', 'qp-orderby', 'qp-limit',
        'set-operations', 'set-union', 'set-unionall', 'set-intersect', 'set-except',
      ],
      slide: {
        title: 'You are here',
        body: [
          'Back on the map: this course lit the **read path** — the query pipeline and set operations.',
          '',
          '### What you can now do',
          '- Read the pipeline in the **order it runs** — `FROM` → … → `LIMIT`, not the order you write',
          '- **Join** tables, **filter** rows (minding `NULL`), **group** & aggregate',
          '- Rank & run totals with **window functions**; combine results with **set operations**',
          '',
          '### The rest of the map',
          '- **DDL · Catalog** — design & define *(done — Course 1)*',
          '- **Transactions · DCL · Programmatic** — change data safely, control access *(next course)*',
          '- **Storage** — where the rows physically live *(a later course)*',
          '',
          'You can design a database and read it. Next: changing it — safely — with transactions.',
        ].join('\n'),
      },
      beats: [
        {
          line: "Let's zoom back out to the whole map of SQL. Two bands are lit now, and together they're the entire read path — the query pipeline and set operations — because that's exactly what this course covered. You can now read a query the way the database does, in the order it actually runs rather than the order you write it: FROM and JOIN gather the rows, WHERE filters them, GROUP BY and HAVING aggregate, then window functions, then SELECT, DISTINCT, ORDER BY, and finally LIMIT. You know how joins match rows across tables and how the join type decides which survive; how WHERE's three-valued logic treats NULL; how grouping collapses rows while windows keep them; and how set operations stack whole results with UNION, INTERSECT, and EXCEPT. Look at what's still dim, and you can see the road ahead. Design and definition — DDL and the catalog — you already lit in the first course. Next comes the middle of the map: transactions, access control, and the programmatic layer — how you change data safely and decide who's allowed to. And later, storage itself, where the rows physically live. But you've now crossed a real threshold: you can design a database and you can read it back. The next course is about changing it — safely — with transactions.",
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
