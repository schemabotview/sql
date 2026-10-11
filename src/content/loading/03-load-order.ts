import type { Section } from '../types'

export const loadOrder: Section = {
  id: 'load-order',
  title: 'Understand constraint failures and load related tables in dependency order',
  scene: 'load-order',
  slide: `## Constraint failures and load order

Every row must pass **every** rule — and parents must exist first.

### Mental model
- A violation stops the statement with an error that **names the rule**
- A statement is **all or nothing**: no row is half-stored
- A foreign key means **parents before children**

### Worked example
- Two products in one \`INSERT\`; the second has price **-1**
- → *violates \`products_price_check\`*, and **neither** row is kept
- The shop loads in order: categories → products → customers → orders → lines → payments
- A line for order **14**, before it exists, is **refused**

### Misconception
- "An error leaves half the rows loaded" — it leaves **none**

### Explanation summary
- Read the constraint name; fix the row or the **order**`,
  narration:
    "Every row you insert must pass every rule, and the rules give loading a direction. When a row breaks a constraint, the statement stops with an error that names the rule that was broken. And a statement is all or nothing, so no row is ever half-stored. The first card shows it. We insert two products in one statement. The first is perfectly valid. The second has a negative price and breaks a check constraint. PostgreSQL rejects the whole statement, and the good row is not kept either. I confirmed that by checking the table afterwards, because a script stops at its first error and cannot show the aftermath itself. A common misconception is that an error leaves half the rows loaded. It leaves none. The second part is about order. Foreign keys mean a row cannot point at something that does not exist yet, so related tables must be loaded parents first. The chain on the board is the workable order for the shop: categories, products, customers, orders, order lines, and finally payments. The bottom card shows the same rule as an error. We try to add a line for order fourteen, which does not exist yet, and the foreign key refuses it. So when you see a constraint error, read the constraint name, and then decide whether the row is wrong or the order is.",
}
