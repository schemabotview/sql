import type { Section } from '../types'

export const tablesAndRelationships: Section = {
  id: 'tables-and-relationships',
  title: 'Tables, rows, columns, schemas, and relationships',
  scene: 'table-relationships',
  slide: `## Tables, rows, columns, and relationships

A relational database stores **tables** that refer to each other.

### Mental model
- **Column** — one attribute, **one type**
- **Row** — one record; **cell** — one value, or \`NULL\`
- **Schema** — a named folder of tables: \`shop\`

### Worked example
- \`orders.customer_id\` holds a customer's id: a **relationship**
- Asha is on orders **1** and **3**: one customer, **many** orders
- Orders and products: **many-to-many**, via order items

### Misconception
- "Rows are ordered, columns are positions" — rows are a **set**; columns have **names**

### Explanation summary
- A relationship is a column holding another row's identifier`,
  narration:
    "A relational database stores everything in tables, and the tables refer to one another. Let's name the parts using the two real tables on the board. A column is one attribute, such as city, and every value in it has the same type. A row is one record: one customer, or one order. A cell is where a row meets a column, and it holds one value, or no value at all. And a schema is a named folder of tables; ours is called shop, so the customers table is written shop dot customers. Now the idea that makes it relational. Look at the orders table: it has a customer I D column, and that number is the identifier of a row in the customers table. That link is a relationship. Asha is customer one, and she appears on orders one and three, so one customer can have many orders. Orders and products are related many-to-many, because an order has many products and a product appears on many orders, and a third table, order items, sits between them to record each pairing. Notice also Elena's phone cell, which says null. That means unknown, which is different from blank. A common misconception is that rows are kept in some order and columns are found by position. In fact, rows are a set, with no built-in order, and you find a column by its name. So a relationship is simply a column that holds another row's identifier.",
}
