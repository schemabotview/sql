import type { Section } from '../types'

export const from_: Section = {
  id: 'from',
  title: 'FROM: where rows come from',
  scene: 'row-sources',
  slide: `## FROM: where rows come from

Every query begins by choosing the rows it works on.

### FROM — the source rows
- Name the **table(s)** the query reads from
- The result is a working set of rows that every later stage shapes

### CTEs & subqueries — named sources
- A **subquery** in \`FROM\` is a table-shaped result you can select from (a *derived table*)
- A **CTE** (\`WITH name AS (…)\`) *names* that subquery — readable, reusable, defined once
- Chain several with commas; each can refer to the ones before it

### Recursive CTEs — a peek
- \`WITH RECURSIVE\` walks **hierarchies** (org charts, category trees, graphs)
- A **base case** plus a step that repeats until nothing new is produced

With rows in hand, the next stage combines tables — \`JOIN\`.`,
  narration:
    'Everything a query does starts at FROM, because FROM decides where the rows come from. In the simplest case you just name a table, and that becomes the working set of rows the rest of the pipeline filters, groups, and shapes. But FROM can take more than a plain table. Anywhere you can name a table, you can put a subquery — a query wrapped in parentheses whose result is itself a table of rows you select from. When those subqueries start to pile up or repeat, you pull them out into a CTE, a common table expression, written with the WITH keyword: you give the subquery a name once, up front, and then refer to it by that name below. It doesn\'t change what runs — it just makes the query readable, and lets you reuse the same intermediate result without copying it. CTEs also unlock something plain subqueries can\'t do easily: recursion. A recursive CTE, written WITH RECURSIVE, walks hierarchies — an org chart, a category tree, a graph of links — by starting from a base case and repeatedly applying a step that builds on the rows found so far, until no new rows appear. However you source them, once FROM has produced a set of rows, the next stage\'s job is to combine rows across tables — and that\'s the JOIN.',
}
