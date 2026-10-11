import type { Section } from '../types'

export const keysAndIntegrity: Section = {
  id: 'keys-and-integrity',
  title: 'Keys and relational integrity',
  scene: 'key-integrity',
  slide: `## Keys and relational integrity

A key is a **promise**, and the database enforces it.

### Mental model
- **Primary key** — identifies one row, never \`NULL\`
- **Foreign key** — holds another table's key
- A key may span columns: \`order_items\` uses \`(order_id, line_no)\`
- **Integrity** — rows that break either promise are refused

### Worked example: three refusals
- Order for customer **99** → *not present in "customers"*
- Delete customer **1** → *still referenced from "orders"*
- Line \`(1, 1)\` again → *duplicate key*

### Misconception
- "The application will check" — the database sees **every** writer

### Explanation summary
- Primary key: **uniqueness** · foreign key: **existence**`,
  narration:
    "A table on its own is just a list. Keys are what turn a set of tables into a database. A primary key identifies exactly one row, and it can never be null. In the orders table that is order I D. A key can also span several columns: an order line is identified by its order and its position within the order, so order items uses the pair, order I D and line number. A foreign key is a column that holds another table's key. Orders has a customer I D column, and every value in it must be the key of a real customer. Integrity means the database refuses rows that break these promises, and the three cards on the board show it happening. We try to create an order for customer ninety-nine, who does not exist, and the foreign key refuses. We try to delete customer one, but orders one, three and nine still point at them, so that is refused too. And we try to add order line one-one a second time, which breaks the primary key. The statements themselves are explained in chapters three and eight; for now, read the errors, because they name exactly which rule was broken. A common misconception is that the application will check these things. But then every program, every script and every person would have to check, and the database is the one place that sees all writers. So remember: a primary key promises uniqueness, and a foreign key promises existence.",
}
