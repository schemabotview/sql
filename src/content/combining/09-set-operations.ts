import type { Section } from '../types'

export const setOperations: Section = {
  id: 'set-operations',
  title: 'UNION, INTERSECT, and EXCEPT: duplicate handling and ALL variants where supported',
  scene: 'set-operations',
  slide: `## UNION, INTERSECT, and EXCEPT

Set operators **stack result sets** that have the same shape.

### Mental model
- Same **number of columns**, compatible types
- Plain forms **remove duplicates**; \`ALL\` keeps them

### Worked example
Order customers (11 rows) against reviewers (9 rows):
- \`UNION ALL\` → **20**; \`UNION\` → **7** distinct ids
- \`INTERSECT\` → 1–5; \`EXCEPT\` → **6, 9**
- \`INTERSECT ALL\` → **9** rows (PostgreSQL supports it)
- A different column count → **error**

### Misconception
- "\`UNION\` just appends" — it also **de-duplicates**, at a cost

### Explanation summary
- \`UNION ALL\` unless duplicates must go
- Set operators compare **whole rows**, so column order matters
- \`ORDER BY\` applies to the **final** combined result`,
  narration:
    "Set operators combine whole result sets instead of joining rows side by side. Both queries must have the same number of columns and compatible types. By default, they remove duplicates; the all variants keep them. Our inputs are the customer numbers from eleven orders and from nine reviews. Union all simply stacks them: twenty rows. Union removes duplicates, leaving seven distinct customers, one to six and nine. Intersect keeps those in both: one to five, the customers who ordered and also reviewed. Except keeps those only in the first query: six and nine, who ordered but never reviewed. The all variants of intersect and except exist in PostgreSQL, though not in every database, and they count multiplicity: intersect all returns nine rows here. The last card shows the shape rule being enforced: a different number of columns is an error. The common misconception is that union only appends. It also sorts or hashes to remove duplicates, so use union all when duplicates are impossible or acceptable.",
}
