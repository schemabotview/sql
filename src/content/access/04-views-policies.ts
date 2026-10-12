import type { Section } from '../types'

export const viewsPolicies: Section = {
  id: 'views-policies',
  title: 'Restrict data exposure with views and row-level policies',
  scene: 'views-policies',
  slide: `## Views and row-level policies

Restrict exposure by **column** or by **row**.

### Mental model
- **View:** a new object exposing chosen columns; grant the view, not the table
- **Row policy:** a rule on the table itself; owners **bypass** it
- Default views run with the **owner's** rights

### Worked example
- Analyst reads \`customer_contacts\` (no email) but not \`customers\`
- Employee 4 sees orders **1, 5, 10**; employee 5 sees **3, 7**
- The owner sees all **11**
- The **6** online orders (NULL employee) match nobody

### Misconception
- "Rows returned means correct" — check who it **hides**

### Explanation summary
- View for **columns**, policy for **rows**; test as the restricted role`,
  narration:
    "There are two common ways to limit what a role can see. A view restricts columns. The first card creates a view of customer contacts without email or phone, grants it to the analyst, and the analyst can read the view but is refused on the customers table itself. By default a view runs with the rights of its owner, which is why this works; a security invoker option, from PostgreSQL fifteen, makes it use the caller's rights instead. A row-level policy restricts rows, and it is declared on the table. In the second card, a policy says a sales role sees only the orders whose employee matches a session setting. Employee four sees orders one, five and ten; employee five sees three and seven; and the owner still sees all eleven, because owners and superusers bypass policies. The warning tile is a lesson: the six online orders have no employee, so they match nobody. A policy that returns rows is not proof it is correct; check who it hides, and always test as the restricted role.",
}
