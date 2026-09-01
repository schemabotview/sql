import type { Section } from '../types'

export const keys: Section = {
  id: 'keys',
  title: 'Keys: identity & relationships',
  scene: 'keys-pk-fk',
  slide: `## Keys: identity & relationships

Keys turn a pile of separate tables into one connected model.

### Primary key — identity
- The column(s) that uniquely identify a row (\`customers.id\`) — **UNIQUE + NOT NULL**
- One per table. A **surrogate** key is auto-generated (\`bigserial\`); a **composite** key
  is a pair unique *together*

### Foreign key — the relationship
- A column holding another table's key: \`orders.customer_id → customers.id\`
- It states the rule *every order belongs to a real customer*

### Referential integrity
- The database **refuses** an order whose \`customer_id\` matches no customer
- On delete: \`RESTRICT\` blocks it, \`CASCADE\` removes the children, \`SET NULL\` blanks them
- ⚠ \`CASCADE\` deletes silently — choose it deliberately`,
  narration:
    'Keys are what turn a pile of separate tables into a single connected model, and there are two of them. The first is the primary key. It\'s the column — or set of columns — that uniquely identifies each row; for customers, that\'s id. A primary key is both unique and never null, because it\'s the handle every other table will grab onto to refer to this row. The second is the foreign key, and this is the actual relationship. Look at orders: it has a column called customer_id, and that column is a foreign key pointing at customers.id. That single declaration encodes a real business rule — every order must belong to a real customer — and because one customer can appear in many orders, it captures a one-to-many relationship. Best of all, the database enforces it for you: this is referential integrity. If you try to insert an order whose customer_id doesn\'t match any existing customer, it\'s rejected. And you decide what happens when a parent is deleted — cascade the delete down to its orders, or restrict it and refuse. That one link, a value in one table matching a key in another, is the very heart of what relational means.',
}
