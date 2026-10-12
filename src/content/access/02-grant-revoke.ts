import type { Section } from '../types'

export const grantRevoke: Section = {
  id: 'grant-revoke',
  title: 'Manage privileges with GRANT and REVOKE',
  scene: 'grant-revoke',
  slide: `## GRANT and REVOKE

Privileges are granted **per object** and **per action**.

### Mental model
- \`GRANT SELECT ON orders TO analyst\`
- The schema needs \`USAGE\` too
- \`REVOKE\` takes a privilege back
- A **permission matrix** lists role × table × action

### Worked example
- Analyst may \`SELECT\` orders and customers, \`INSERT\` into orders
- Matrix: orders **t t f f**; customers **t f f f**; payments **f f f f**
- \`UPDATE\` was never granted → **permission denied**
- After \`REVOKE SELECT\` → **denied** again

### Misconception
- "Reading implies writing" — each action is a **separate** privilege

### Explanation summary
- Read the **matrix**, not the grants one by one`,
  narration:
    "Privileges are granted per object and per action. The first card creates the analyst role, grants usage on the schema, select on orders and customers, and insert on orders, then acts as the analyst: counting orders returns eleven. The second card is a permission matrix, built with the has table privilege function. For orders, the analyst may select and insert but not update or delete; for customers only select; for payments nothing at all. The matrix is the picture a reviewer needs, because individual grants are hard to add up. The third card shows an action that was never granted: updating an order is refused with permission denied for the table. The fourth card shows revoke: after the select privilege is taken back, even reading is refused. Reading does not imply writing, and every action is a separate privilege. The runner is a superuser, so acting as the role with set role is what makes these checks real. Everything is rolled back afterwards.",
}
