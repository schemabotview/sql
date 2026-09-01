import type { Section } from '../types'

export const setOps: Section = {
  id: 'set-ops',
  title: 'Set operations: stacking whole results',
  scene: 'set-operations',
  slide: `## Set operations

Joins combine tables **side by side** (more columns). Set operations stack two results **on top of each other** (more rows).

### The rule
- Both queries must return the **same number of columns**, with **compatible types**
- Column *names* come from the first query; **position** is what matches

### The four operators
- **\`UNION\`** — all rows from both, **duplicates removed**
- **\`UNION ALL\`** — all rows from both, **duplicates kept** (faster — no dedupe pass)
- **\`INTERSECT\`** — only rows present in **both** results
- **\`EXCEPT\`** — rows in the first result but **not** the second

### Choosing between them and a join
- Columns from *both* tables → a **join**. Pure set membership → a **set op**
- \`UNION\` pays to sort and dedupe — reach for **\`UNION ALL\`** when rows are already distinct`,
  narration:
    'There\'s one more way to combine data, and it works completely differently from a join. A join glues tables side by side — it matches rows and gives you more columns. A set operation stacks two query results on top of each other — same columns, more rows. Because you\'re stacking them, there\'s one rule that must hold: both queries have to return the same number of columns, and those columns have to be type-compatible, matched by position, left to right. The column names in the final result just come from the first query. With that rule satisfied, there are four operators. UNION returns all the rows from both queries and removes duplicates, so you get a clean combined set. UNION ALL does the same but keeps every duplicate — and because it skips the work of sorting and de-duplicating, it\'s noticeably faster, which is why it\'s the one to reach for whenever you already know the two sets don\'t overlap. INTERSECT keeps only the rows that appear in both results — the overlap. And EXCEPT keeps the rows from the first query that are not in the second — a set difference, useful for finding what\'s missing. The trap to remember is that plain UNION always pays that dedupe cost; if you don\'t need it, UNION ALL is the right default. And that completes the entire read path: gather, filter, group, window, project, sort, limit — and, off to the side, stack results with set operations. Let\'s step back and put the whole map together.',
}
