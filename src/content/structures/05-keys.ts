import type { Section } from '../types'

export const keys: Section = {
  id: 'keys',
  title: 'Define primary, unique, and composite keys',
  scene: 'keys-wishlist',
  slide: `## Primary, unique, and composite keys

A key is a **promise**, and the database enforces it.

### Mental model
- **PRIMARY KEY** — unique, never \`NULL\`; **one** per table
- **UNIQUE** — unique; **many** per table; \`NULL\`s do not clash
- **Composite** — the *pair* is unique

### Worked example
- A second \`(1, 4)\` fails: *duplicate key … "wishlist_pkey"*
- A second email fails: *"customers_email_key"*
- Surrogate: \`customer_id\` · composite: \`(order_id, line_no)\`

### Misconception
- "Unique and primary are the same" — a row identifier vs a rule
- Email is unique, but people change it: a poor key

### Explanation summary
- Primary key: **which row** · unique: **which values never repeat**`,
  narration:
    "A key is a promise about uniqueness, and the database refuses to let you break it. A primary key identifies exactly one row. It is unique, it can never be null, and a table can have only one. Our wishlist uses a composite primary key, made of customer I D and product I D together, which means a customer may wish for a given product only once. In the first card we insert the pair one and four, then insert it again. The second insert fails with a duplicate key error that names the constraint, wishlist underscore pkey. A unique constraint is similar, but a table may have many of them, and unlike a primary key it allows nulls, because unknown is not considered equal to unknown. The customers table has one on email, so inserting a second customer with an existing email is refused, and the error names customers email key. Both errors name the constraint, and those are the names we will read from the database's own metadata shortly. How do you choose a key? A surrogate key is a number with no meaning, such as customer I D. A natural key is data that identifies the row by itself, like our pair. Email is unique, but people change their email, which makes it a poor primary key. A common misconception is that unique and primary key are the same thing. One identifies the row; the other is a rule about a column.",
}
