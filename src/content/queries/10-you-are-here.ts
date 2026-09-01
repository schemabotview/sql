import type { Section } from '../types'

export const youAreHere: Section = {
  id: 'you-are-here',
  title: 'You are here',
  scene: 'queries-recap',
  slide: `## You are here

Back on the map: this course lit the **read path** — the query pipeline and set operations.

### What you can now do
- Read the pipeline in the **order it runs** — \`FROM\` → … → \`LIMIT\`, not the order you write
- **Join** tables, **filter** rows (minding \`NULL\`), **group** and aggregate
- Rank and run totals with **window functions**; combine results with **set operations**

### The rest of the map
- **DDL · Catalog** — design and define *(done — Course 1)*
- **Transactions · DCL · Programmatic** — change data safely, control access *(next course)*
- **Storage** — where the rows physically live *(a later course)*

You can design a database and read it. Next: changing it — safely — with transactions.`,
  narration:
    'Let\'s zoom back out to the whole map of SQL. Two bands are lit now, and together they\'re the entire read path — the query pipeline and set operations — because that\'s exactly what this course covered. You can now read a query the way the database does, in the order it actually runs rather than the order you write it: FROM and JOIN gather the rows, WHERE filters them, GROUP BY and HAVING aggregate, then window functions, then SELECT, DISTINCT, ORDER BY, and finally LIMIT. You know how joins match rows across tables and how the join type decides which survive; how WHERE\'s three-valued logic treats NULL; how grouping collapses rows while windows keep them; and how set operations stack whole results with UNION, INTERSECT, and EXCEPT. Look at what\'s still dim, and you can see the road ahead. Design and definition — DDL and the catalog — you already lit in the first course. Next comes the middle of the map: transactions, access control, and the programmatic layer — how you change data safely and decide who\'s allowed to. And later, storage itself, where the rows physically live. But you\'ve now crossed a real threshold: you can design a database and you can read it back. The next course is about changing it — safely — with transactions.',
}
