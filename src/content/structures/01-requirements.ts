import type { Section } from '../types'

export const requirements: Section = {
  id: 'requirements',
  title: 'Translate business requirements into entities and relationships',
  scene: 'requirements-structures',
  slide: `## Requirements to entities and relationships

A schema starts as **sentences** about the business.

### Mental model
- **Nouns** → entities (tables); **verbs** → relationships
- Ask: how many on **each** side? — the **cardinality**
- One-to-many → a **foreign key** on the "many" side

### Worked example: six sentences
- "A customer places many orders" → \`orders.customer_id\`
- Orders and products are **many-to-many** → a **table**, \`order_items\`
- A fact about the pairing (price paid) lives on that table

### Misconception
- "One table per noun is enough" — **relationships** need homes too

### Explanation summary
- A schema is only as right as the sentences it came from`,
  narration:
    "A database design starts as sentences about the business, so the first skill is reading them carefully. Nouns, such as customer, order and product, become entities, and each entity becomes a table. Verbs, such as places or contains, describe relationships between entities. For every relationship, ask how many are on each side. That is its cardinality. The table on the board turns six real sentences about our shop into structure. A customer places many orders: that is one-to-many, and it becomes a foreign key on the many side, the customer I D column in orders. An online order has no sales rep: that is an optional relationship, so the employee I D column is allowed to be null. Now the sentence that surprises beginners: an order has many products, and a product appears on many orders. That is many-to-many, and a relationship like that cannot be stored in a single column on either side. It needs a table of its own. In the drawing, orders one and three are paired with four real products through the order items table, one row per pairing. And a fact about the pairing, such as the price actually paid, belongs on that table, not on the product. A common misconception is that one table per noun is enough. The relationships need homes too. And remember the limitation: a schema is only as right as the sentences it was built from.",
}
