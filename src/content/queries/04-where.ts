import type { Section } from '../types'

export const where: Section = {
  id: 'where',
  title: 'WHERE: filtering rows',
  scene: 'where-filter',
  slide: `## WHERE: filtering rows

WHERE keeps only the rows that satisfy a condition — and it runs *early*, before grouping or SELECT.

### Filtering rows
- Test each row against a predicate — \`total > 0\`, \`status = 'paid'\`
- Combine with \`AND\` / \`OR\` / \`NOT\`; \`IN\` for a set, \`BETWEEN\` for an inclusive range
- \`LIKE 'A%'\` matches a pattern — \`%\` = any run of characters, \`_\` = exactly one
- Runs before \`SELECT\`, so it **can't see a SELECT alias**

### NULL — the third truth value
- SQL logic is **three-valued**: \`TRUE\`, \`FALSE\`, and **\`UNKNOWN\`**
- Any comparison with \`NULL\` is \`UNKNOWN\` — \`total = NULL\` is *never* true
- \`WHERE\` keeps a row only when the condition is **exactly TRUE**, so those rows vanish
- Test with **\`IS NULL\`** / **\`IS NOT NULL\`**, never \`= NULL\`

**WHERE** filters individual **rows**, early — **HAVING** filters **groups**, later.`,
  narration:
    'After the rows are gathered and joined, WHERE is where you filter them down. It tests every row against a condition — total greater than zero, status equals paid — and keeps only the rows where that condition is true. You build up conditions with AND, OR, and NOT, and reach for IN to test a set of values and BETWEEN for a range. And when you need to match text by shape rather than exactly, that\'s LIKE: the pattern \'A percent\' finds every name starting with A, where percent stands for any run of characters and underscore for exactly one character. NOT LIKE inverts it, and Postgres adds ILIKE for a case-insensitive match. Remember from the pipeline that WHERE runs early — before SELECT — which is why you can\'t refer to a column alias you invented in SELECT; that stage simply hasn\'t happened yet. Now the part that trips everyone up: NULL. SQL logic isn\'t two-valued, it\'s three-valued — a condition can be true, false, or unknown. And the moment NULL is involved, you get unknown. total equals NULL is not false, it\'s unknown, so the row is dropped — and crucially, total equals NULL is never true even when the value really is null. That\'s why you never write equals NULL; you write IS NULL or IS NOT NULL, which are the only operators that actually test for it. Finally, keep WHERE and HAVING straight: WHERE filters individual rows here, near the start, while HAVING filters whole groups much later, after grouping. Speaking of which — with our rows filtered, the next stage collapses them into groups: GROUP BY.',
}
