import type { Section } from '../types'

export const existsNotIn: Section = {
  id: 'exists-not-in',
  title: 'EXISTS, NOT EXISTS, and NULL pitfalls',
  scene: 'exists-not-in',
  slide: `## EXISTS, NOT EXISTS, and NULL pitfalls

\`EXISTS\` asks only: **is there at least one matching row?**

### Mental model
- \`EXISTS\` → TRUE/FALSE; the selected columns do not matter
- \`x NOT IN (…, NULL)\` is **never TRUE** — it is \`NULL\`

### Worked example
- Employees with no order, \`NOT EXISTS\`: **5** (1, 2, 3, 6, 7)
- Same question with \`NOT IN\`: **0 rows**
- Cause: \`orders.employee_id\` contains \`NULL\` (online orders)

### Misconception
- "\`NOT IN\` and \`NOT EXISTS\` are the same" — not when the list has \`NULL\`

### Explanation summary
- For "has no match", prefer \`NOT EXISTS\``,
  narration:
    "Exists asks one question: is there at least one matching row? It returns true or false, so the columns inside the subquery do not matter, and it never duplicates the outer row. The last card finds customers with a pending order: one, four and nine. Now the pitfall. We want the employees who handled no order. Not exists answers correctly: five employees. Not in gives zero rows, with no error. Why? The orders table contains nulls in employee id, because online orders have no sales representative. A value tested against a list containing null cannot be proven absent. The third card shows it in miniature: one not in four, five is true, but one not in four, null is null, and where keeps only true. So the two operators are only equivalent when the list can never contain null. Use not exists for the question has no match, or filter the nulls out of the list explicitly. This is the null logic from chapter four, now causing a real query to return nothing.",
}
