import type { Section } from '../types'

export const selfCrossJoins: Section = {
  id: 'self-cross-joins',
  title: 'Self-joins and cross joins',
  scene: 'self-cross-joins',
  slide: `## Self-joins and cross joins

One table can play **two roles**; or two tables can be paired **without a condition**.

### Mental model
- **Self-join:** same table, two aliases (\`e\` employee, \`m\` manager)
- **Cross join:** every row with every row → **rows × rows**

### Worked example
- \`manager_id\` points to \`employee_id\`; \`LEFT JOIN\` keeps the CEO
- 9 customers × 10 products = **90** pairs
- An always-true condition on employees: 7 × 7 = **49**

### Misconception
- "A forgotten condition returns an error" — it returns **too many rows**

### Explanation summary
- Aliases make self-joins readable; a cross join must be **intentional**`,
  narration:
    "Sometimes the two sides of a join are the same table. Employees have a manager id that points at another employee. To read it, we use the table twice under two aliases: e for the employee and m for the same table read as the manager. A left join keeps the chief executive, whose manager is null. Aliases are what make this readable. The opposite case is the cross join, which has no condition and returns every pairing. Nine customers with ten products give ninety rows. That can be useful on purpose, for example to build every combination, but it is a trap by accident. The second card joins employees to themselves on a condition that is always true, and returns forty-nine rows, seven times seven, with no error at all. The misconception is that a forgotten condition produces an error; it produces far too many rows. The assumption in a self-join is a key that points back into the same table, and the limitation is that a single self-join reads only one level of the hierarchy, a point we return to with recursion later.",
}
