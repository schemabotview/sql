import type { Section } from '../types'

export const groupHaving: Section = {
  id: 'group-having',
  title: 'GROUP BY & HAVING: aggregation',
  scene: 'grouping-collapse',
  slide: `## GROUP BY & HAVING: aggregation

Grouping collapses many rows into one row per group, then summarizes each with an aggregate.

### GROUP BY — collapse into groups
- Rows sharing a value fold into **one row per group** — \`GROUP BY customer_id\`
- Every selected column must be either **grouped** or wrapped in an **aggregate**
- Group by several columns for one row per *combination*

### Aggregates — one value per group
- \`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`
- \`COUNT(*)\` counts rows; \`COUNT(col)\` skips \`NULL\`s — as do \`SUM\` and \`AVG\`

### HAVING — filter the groups
- Like \`WHERE\`, but on **groups**, *after* aggregation — \`HAVING COUNT(*) > 5\`
- \`WHERE\` filters rows *before* grouping; \`HAVING\` filters groups *after* it

One thing grouping *can't* do is keep every row while ranking — that's a window function.`,
  narration:
    'GROUP BY is where a query stops thinking in individual rows and starts thinking in groups. It takes all the rows that share a value — say, all the orders with the same customer_id — and collapses them into a single row per group. Once you\'ve grouped, there\'s a rule: every column you select has to be either one of the columns you grouped by, or wrapped in an aggregate function, because the group is now one row and the database needs to know how to squash the many values into one. Those aggregates are the familiar five — COUNT, SUM, AVG, MIN, and MAX — each producing one value per group. A small but important detail: COUNT star counts every row in the group, while COUNT of a specific column skips the nulls in that column. Then comes HAVING, which is simply WHERE for groups. WHERE already filtered the individual rows early on; HAVING filters the groups after aggregation — so HAVING COUNT star greater than five keeps only the groups with more than five rows. The way to remember it: WHERE runs before grouping and filters rows, HAVING runs after grouping and filters groups. Grouping is powerful, but it\'s lossy — it throws away the individual rows to give you the summary. When you need the summary AND every original row at the same time — a running total, a rank within each group — grouping can\'t help. For that, you need a window function.',
}
