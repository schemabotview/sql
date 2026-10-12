import type { Section } from '../types'

export const cleaningCase: Section = {
  id: 'cleaning-case',
  title: 'Worked case: explain cleaning and synchronisation decisions',
  scene: 'cleaning-case',
  slide: `## Worked case: cleaning and synchronisation

Customers 3 and 9 are **one person**. Decide, then repair.

### Mental model
- **Evidence:** same name and city, 2 records
- **Decision:** survivor, what moves, what is removed, how to undo
- **Order matters:** move the orders **before** deleting

### Worked example
- Keep customer **3** (earliest signup)
- \`UPDATE orders\` → \`UPDATE 1\`; \`DELETE\` customer 9 → \`DELETE 1\`
- Customers **9 → 8**, orders **11 → 11**, orders of 3: **1 → 2**

### Misconception
- "Deleting the duplicate first is fine" — the **foreign key** would refuse it

### Explanation summary
- Write the decisions down, then **reconcile the counts**`,
  narration:
    "This worked case puts the chapter together. Customers three and nine are the same person, Chloe Martin in Lyon. The evidence card finds both records by name and city. The decisions table writes down what we will do and why: keep customer three, who signed up first, move order eleven to that customer, delete customer nine afterwards, and keep the option to roll back until we have checked. The order of the steps matters. Deleting customer nine first would be refused by the foreign key, because order eleven still points at it. So the repair updates the order, then deletes the duplicate: update one, delete one. Finally we reconcile. Customers fall from nine to eight, orders stay at eleven, customer three now has two orders, and no order is left without a customer. Those are the counts a reviewer would check. Notice also that merging fixes a data quirk from chapter six, an order that predated its customer's signup. A change can be correct in isolation yet fail as part of a larger operation or race another user; next we study transaction boundaries and concurrency.",
}
