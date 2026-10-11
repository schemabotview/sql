import type { Section } from '../types'

export const groupingSets: Section = {
  id: 'grouping-sets',
  title: 'Advanced summaries with GROUPING SETS, ROLLUP, and CUBE',
  scene: 'grouping-sets',
  slide: `## GROUPING SETS, ROLLUP, and CUBE

One query, **several levels** of summary.

### Mental model
- \`ROLLUP (a, b)\`: detail, subtotal per \`a\`, grand total
- \`CUBE (a, b)\`: every combination
- \`GROUPING SETS\`: **exactly** the groupings listed

### Worked example
- India and UK orders: **7** rows with \`ROLLUP\`
- \`GROUPING()\` is 0 for detail, 1 for a subtotal, **3** for the grand total
- \`GROUPING SETS ((country), (status))\` → **5** rows

### Misconception
- "A blank means the total" — it can also be a **real \`NULL\`**

### Explanation summary
- Use \`GROUPING()\` to label summary rows`,
  narration:
    "Reports often want detail, subtotals and a grand total together. Instead of several queries joined with union, one group by can compute several levels. Rollup of country and status returns the detail rows, a subtotal per country, and a grand total. In the first card, restricted to India and UK, there are seven rows: four details, two subtotals and one total of seven orders. A blank in a result could mean a rolled-up row, but it could also be a real null in the data. The grouping function removes the doubt: zero for a detail row, one when status was rolled up, three for the grand total. Grouping sets lets you list exactly the groupings you want, here one per country and one per status, giving five rows. Cube would produce every combination. The table shows what each shorthand expands to. The limitation is that the output is a mix of levels in one table, so label the levels clearly before anyone reads the numbers.",
}
