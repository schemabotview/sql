import type { Section } from '../types'

export const logicalOrder: Section = {
  id: 'logical-order',
  title: 'The order it runs',
  scene: 'logical-order',
  slide: `## The order it runs

You **write** a query in one order — the database **runs** it in another. That gap explains half of SQL's surprises.

### How you write it
- \`SELECT\` → \`FROM\` → \`WHERE\` → \`GROUP BY\` → \`HAVING\` → \`ORDER BY\` → \`LIMIT\`
- \`SELECT\` comes *first* on the page, but it's almost the *last* thing to run

### How it runs — the logical order
- \`FROM\`/\`JOIN\` get the rows → \`WHERE\` filters them → \`GROUP BY\`/\`HAVING\` group and filter groups
- **then** \`SELECT\` chooses columns → \`DISTINCT\` → \`ORDER BY\` → \`LIMIT\`

### Why the gap bites
- A **column alias** made in \`SELECT\` isn't visible in \`WHERE\` — \`SELECT\` runs later
- \`ORDER BY\` **can** use it, because it runs after \`SELECT\`
- \`WHERE\` filters **rows**; \`HAVING\` filters **groups** — two different stages

> Gather and filter first · shape in the middle · sort and trim last`,
  narration:
    'Here\'s the single most useful thing to understand about reading data: the order you write a query in is not the order it runs in. You write SELECT first — it\'s the first word you type — followed by FROM, WHERE, GROUP BY, HAVING, ORDER BY, and LIMIT. But the database throws that order away and runs the query as a pipeline. It starts with FROM and JOIN to gather the raw rows from your tables. Then WHERE filters those rows down to the ones you care about. Then GROUP BY collapses them into groups and HAVING filters the groups. Only then — well down the pipeline — does SELECT run, choosing which columns and expressions to return, followed by DISTINCT to drop duplicates, ORDER BY to sort, and finally LIMIT to take the top few. This gap explains a whole class of SQL surprises. It\'s why an alias you invent in SELECT can\'t be used back in WHERE — because WHERE already ran, long before SELECT. And it\'s why WHERE and HAVING feel similar but aren\'t: WHERE filters individual rows near the start, while HAVING filters whole groups much later. Keep this pipeline in your head and SQL stops being a bag of tricks. We\'ll now walk it stage by stage, in the order it truly runs.',
}
