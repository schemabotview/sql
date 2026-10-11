import type { Section } from '../types'

export const aggregatesGroups: Section = {
  id: 'aggregates-groups',
  title: 'Aggregate functions, GROUP BY, and HAVING',
  scene: 'aggregates-groups',
  slide: `## Aggregates, GROUP BY, and HAVING

Aggregates turn **many rows into one**; \`GROUP BY\` into **one per group**.

### Mental model
- \`count\`, \`sum\`, \`avg\`, \`min\`, \`max\`; they **skip \`NULL\`**
- \`GROUP BY\` makes one **bucket** per value
- \`WHERE\` filters **rows**; \`HAVING\` filters **groups**

### Worked example
- 8 payments → **2248.70** total, average **281.09**
- 10 live orders → **6** groups → **3** have more than one
- \`WHERE count(*) > 1\` → *not allowed in WHERE*

### Misconception
- "\`HAVING\` is just \`WHERE\` for groups" — it runs **later**, on groups

### Explanation summary
- A condition on a **column** goes in \`WHERE\`; on an **aggregate**, in \`HAVING\``,
  narration:
    "Aggregate functions turn many rows into one: count, sum, average, minimum and maximum. They skip nulls, as we saw in chapter one. The first card summarises the eight payments in a single row: a total of twenty-two forty-eight seventy, an average of two eighty-one oh nine, a smallest of seventy-three ninety and a largest of eight ninety-nine. Group by goes further and makes one bucket per value, so you get one summary row per group. Follow the lower board. The where clause runs first and drops the cancelled order. Group by customer then gathers the ten remaining orders into six buckets. Having now judges each bucket: only those whose count is above one survive, which are customers one, two and four. The contrast is on the second card. Putting count in a where clause is an error, because at that step the groups do not exist yet. A common misconception is that having is just where for groups. It runs later, on groups. So a condition on a column belongs in where, and a condition on an aggregate belongs in having. Reading the result correctly also depends on the grain: each row here is one customer.",
}
