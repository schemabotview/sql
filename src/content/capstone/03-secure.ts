import type { Section } from '../types'

export const secure: Section = {
  id: 'secure',
  title: 'Secure: grant access',
  scene: 'cap-secure',
  focus: 'step-secure', // lights this step in the shared strip
  slide: `## Secure: grant access

Before any data goes in, decide who may touch it — the DCL from Course 3.

### Two roles, least privilege
- **\`app_rw\`** — the application: \`SELECT, INSERT, UPDATE\` (it runs the shop)
- **\`analyst_ro\`** — reporting: \`SELECT\` only (it can never change data)
- Neither gets \`DELETE\` — nothing in this project needs it

### Grant to roles, not people
- Add users to a role and they inherit its rights — access managed in one place
- The analyst login **can't** delete an order even by accident — it was never granted the right
- Revoking someone's access is removing them from a role, not auditing every table

With access locked down, we can safely load the data — inside a transaction.`,
  narration:
    'Before we trust this database with any data, we set up who\'s allowed to do what — the access control from course three. We create two roles, each with exactly the privileges it needs and no more. The first, app_rw, is for the application itself: it gets SELECT, INSERT, and UPDATE, because it runs the shop and needs to read and write orders. The second, analyst_ro, is for reporting and analytics: it gets SELECT and nothing else, so an analyst or a dashboard can read every table but can never, under any circumstances, change or delete a row. This is the principle of least privilege made concrete. Notice we grant to roles, not to individual people — that way we add users into a role and they inherit its rights, and access lives in one place instead of being scattered across dozens of accounts. And think about what this buys us: the reporting login literally cannot drop an order table or delete a customer, even if its password leaked or someone fat-fingered a query, because that permission was never granted to it in the first place. The safest write is the one that was never allowed. With the doors locked and the right keys handed out, we can finally load our data — and we\'ll do it the safe way, wrapped in a transaction.',
}
