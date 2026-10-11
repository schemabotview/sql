import type { Section } from '../types'

export const readPlans: Section = {
  id: 'read-plans',
  title: 'Read execution plans: scans, joins, sorts, and aggregates; EXPLAIN versus executing EXPLAIN ANALYZE',
  scene: 'read-plans',
  slide: `## Reading execution plans

A plan is a **tree**: leaves read tables, parents combine rows.

### Mental model
- Read from the **leaves** upward
- Common nodes: **scan**, **join**, **aggregate**, **sort**
- \`EXPLAIN\` shows the plan; \`EXPLAIN ANALYZE\` **runs** it

### Worked example
- Two scans → **Hash Join** → **HashAggregate** → **Sort**
- \`EXPLAIN ANALYZE\` on an \`UPDATE\` really changed **1** row
- It was wrapped in \`BEGIN … ROLLBACK\`, so nothing stayed changed
- Plan shapes depend on **data and version**: these are PostgreSQL 16's

### Misconception
- "\`EXPLAIN ANALYZE\` only measures" — for \`UPDATE\` and \`DELETE\` it **modifies data**

### Explanation summary
- Estimate with \`EXPLAIN\`; execute with \`ANALYZE\` — **in a transaction you roll back**`,
  narration:
    "An execution plan is a tree. Leaves read tables, and each parent combines the rows of its children. Read from the leaves upward. In the first card, two sequential scans feed a hash join, which feeds a hash aggregate, and a sort puts the result in order; indentation shows which node feeds which. Explain alone shows the plan without running the statement. Explain analyze runs the statement and adds actual row counts to every node. That difference has a consequence, shown in the second card. We explain analyze an update inside a transaction, and afterwards a count shows that one row really changed. The transaction was rolled back, so the data is safe. Remember that this applies to update and delete as well as select. So estimate with explain, and when you need actual numbers for a statement that modifies data, run it inside a transaction that you roll back. Plan shapes here are those PostgreSQL 16 chose on this data; other versions or data may choose differently.",
}
