import type { Section } from '../types'

export const recursive: Section = {
  id: 'recursive',
  title: 'Recursive CTEs: hierarchy traversal, termination, and cycles',
  scene: 'recursive',
  slide: `## Recursive CTEs

A recursive CTE **repeats a step** until it adds no new rows.

### Mental model
- **Anchor:** the starting rows (the CEO)
- **Step:** join the previous round's rows back to the table
- **Termination:** a round that adds **nothing**

### Worked example
- Employees: rounds add **1, 2, 3, 1, 0** rows → **7** people, depth **4**
- Categories: the same shape builds the path \`Electronics > Audio > Headphones\`
- A **cycle** (1→2→3→1) never ends unless the step **remembers visited ids**

### Misconception
- "Recursion always stops by itself" — only if the data has **no cycle**

### Explanation summary
- Anchor + step + a **guard**; PostgreSQL 14+ also offers \`CYCLE\``,
  narration:
    "Some data is a hierarchy of unknown depth: employees and their managers, or categories inside categories. A recursive CTE handles it with three parts. The anchor supplies the starting rows, here the chief executive. The step joins the rows found in the previous round back to the table, here employees whose manager is in that round. Termination happens when a round adds nothing. The trace table counts the rows each round adds: one, two, three, one, then zero, so seven people over four levels. The categories card uses the same shape to build a readable path string, from electronics through audio to headphones. The danger is a cycle. If the data says one reports to two, two to three and three to one, the step would run forever. The last card keeps an array of the ids already visited and refuses to revisit one, so the walk stops after three steps. PostgreSQL also offers a cycle clause from version fourteen. Recursion stops by itself only when the data has no cycle, so keep a guard whenever you cannot prove that.",
}
