import type { Section } from '../types'

export const orderLimit: Section = {
  id: 'order-limit',
  title: 'ORDER BY & LIMIT: arranging the result',
  scene: 'arrange',
  slide: `## ORDER BY & LIMIT

The final two stages don't change *which* rows you get — they arrange them.

### ORDER BY — sort the result
- Sort by one or more columns — \`ORDER BY total DESC, name ASC\`
- Runs *after* \`SELECT\`, so it **can** use a \`SELECT\` alias (and even a column position)
- Control \`NULL\`s explicitly with \`NULLS FIRST\` / \`NULLS LAST\`

### LIMIT — take the top N
- Keep only the first *N* rows — \`LIMIT 10\` — the last stage to run
- Pair with \`OFFSET\` to page through results (\`LIMIT 10 OFFSET 20\`)
- **Only meaningful with \`ORDER BY\`** — without a sort, "the top 10" is arbitrary

### Order without collapsing rows
- Ranking *within* groups is a window (\`ROW_NUMBER\`), not \`LIMIT\` — a different tool

That completes the pipeline. One more way to combine results sits outside it: set operations.`,
  narration:
    'We\'ve reached the end of the pipeline, and the last two stages are the simplest to describe: they don\'t change which rows you get, only how they\'re arranged. ORDER BY sorts the result. You give it one or more columns, each ascending or descending — order by total descending, then name ascending, to break ties. Because ORDER BY runs after SELECT, it\'s allowed to use the aliases you created there, unlike WHERE — that late position finally works in your favor. One detail worth knowing: nulls sort to one end, and you can say exactly which with NULLS FIRST or NULLS LAST. Then LIMIT, the very last thing to run, simply keeps the first N rows and throws away the rest — LIMIT 10 for the top ten. Pair it with OFFSET and you can page through results, skipping the first twenty to show the next ten. But here\'s the catch that matters: LIMIT is only meaningful when the rows are already sorted. Without an ORDER BY, the database is free to return any ten rows it likes, so the top ten becomes whatever it happened to find first — almost never what you want. And one last distinction to keep clean: if you want the top three orders per customer, that\'s not LIMIT — LIMIT cuts the whole result. Ranking within each group is a window function, ROW_NUMBER, the tool we just met. That completes the pipeline, from FROM all the way to LIMIT. There\'s just one more way to combine results, and it sits outside the pipeline entirely: set operations.',
}
