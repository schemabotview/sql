import type { Section } from '../types'

export const views: Section = {
  id: 'views',
  title: 'Views as reusable query interfaces: definition, abstraction, and updateability limits',
  scene: 'views',
  slide: `## Views as reusable query interfaces

A **view** stores a **query**, not rows.

### Mental model
- \`CREATE VIEW name AS SELECT …\` gives a query a name
- Using the view re-runs its query on the **current** data
- It hides the join; it does not make it cheaper

### Worked example
- \`order_totals\` joins and groups once; reports select from it
- A simple view of \`orders\`: \`UPDATE\` passes through to the table
- A view with \`GROUP BY\`: **cannot update view**

### Misconception
- "A view is a copy of the data" — it is a **saved query**

### Explanation summary
- Views abstract queries; **updateability depends on the definition**`,
  narration:
    "A view gives a query a name. The first card defines order totals as a join of orders with their lines, grouped per order, and then queries it like a table. Only the definition is stored, not the rows; each use runs the underlying query on the current data. So a view hides the join and the grouping behind a simple name, and a change to the base tables shows up in the next read; that behaviour is checked in a hidden test. The cost is not hidden, though, because the join still runs. Updates are the limitation. The second card creates a simple view over orders and updates a row through it; the base table changes. The third card tries to update a view that contains group by, and PostgreSQL refuses, because one view row stands for many base rows. Whether a view is updatable depends on its definition, and the rules vary between databases. A view is not a copy of the data but a saved query, and comparing it with the underlying query is the test of whether you understood it. We can connect the necessary evidence; next we express sequences, comparisons, and multi-step analytical questions.",
}
