import type { Section } from '../types'

export const joinCardinality: Section = {
  id: 'join-cardinality',
  title: 'Join relationships, cardinality, and result grain',
  scene: 'join-cardinality',
  slide: `## Joins, cardinality, and grain

A join **pairs rows**, so how many rows come out depends on the relationship.

### Mental model
- A foreign key links a **"many"** row to its **"one"** row
- **One-to-many:** one customer, many orders
- The result has **one row per "many"-side match**

### Worked example
- \`orders\`: **11** rows
- orders ⋈ order lines: **16** rows (one per line)
- customers ⋈ orders: **11** rows (an order has one customer)

### Misconception
- "Joining adds columns, not rows" — it can **multiply rows**

### Explanation summary
- Before joining, name the **grain** you expect after it
- Then compare it with the **row count** that comes back`,
  narration:
    "Combining tables starts with a question: how many rows will come out? A join pairs rows, so the answer depends on the relationship between the tables. A foreign key links a many row to its one row. One customer has many orders, one order has many lines, and each line points to one product. The board shows the four tables with their row counts. Now read the three cards. Counting orders alone gives eleven: the grain is one order. Joining orders to their lines gives sixteen, because each order now appears once for every line it has, so the grain became one line. Joining orders to their customer gives eleven again, because each order has exactly one customer and nothing is repeated. This is the misconception to avoid: joining does not just add columns, it can multiply rows. The assumption is a foreign key that matches the direction you expect; the limitation is that the counts here describe this small dataset only. Before writing any join, state the grain you expect afterwards, and compare it with what comes back.",
}
