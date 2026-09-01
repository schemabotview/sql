import type { Section } from '../types'

export const selectDistinct: Section = {
  id: 'select-distinct',
  title: 'SELECT & DISTINCT: choosing the columns',
  scene: 'projection',
  slide: `## SELECT & DISTINCT

It's written first, but \`SELECT\` runs *late* — once the rows are gathered, filtered and grouped.

### SELECT — choose the output
- Pick **columns**, compute **expressions** (\`price * qty\`), call functions
- **\`COALESCE(phone, '—')\`** returns the first non-NULL, left → right
- \`SELECT *\` takes every column; name them explicitly in real queries
- An **alias** (\`AS total\`) is *created here* — so \`WHERE\` can't see it, but \`ORDER BY\` can

### DISTINCT — drop duplicate rows
- Removes rows that are **identical across all selected columns**
- Runs *after* \`SELECT\`, on the projected rows — so it dedupes what you actually chose
- Postgres adds **\`DISTINCT ON (col)\`** — the first row per value of \`col\`

Window functions are computed at this stage too — which is why \`WHERE\` can't filter on one.`,
  narration:
    'SELECT is the word you write first, but by now you know it runs almost last — only after FROM gathered the rows, WHERE filtered them, and GROUP BY collapsed them does SELECT finally get to choose what comes out. Its job is projection: picking which columns to return, and computing expressions from them — price times quantity, a concatenated name, a function call. SELECT star is the shortcut that grabs every column, which is fine when you\'re exploring but something you\'ll almost always spell out explicitly in real queries. This is also the natural place to clean up NULLs in the output: COALESCE walks a list of values left to right and returns the first one that isn\'t null, so COALESCE of phone comma a dash shows the phone number when it exists and a dash when it doesn\'t. This is also where aliases are born: when you write AS total, that name total comes into existence right here, at the SELECT stage. And that single fact explains the alias rule that trips people up — WHERE ran earlier, so it can\'t see total, but ORDER BY runs later, so it can. The stage is the whole explanation. Once SELECT has produced its columns, DISTINCT steps in to remove duplicate rows — rows that are identical across every column you selected. Notice the ordering: DISTINCT runs after SELECT, so it dedupes the projected result, not the original rows — change which columns you select and you change what counts as a duplicate. Postgres adds a sharper tool, DISTINCT ON, which keeps just the first row for each value of a column you name — handy for grabbing the latest order per customer. So SELECT chooses the columns and DISTINCT removes the repeats. All that\'s left is to arrange the result: sorting it, and taking the top few — ORDER BY and LIMIT.',
}
