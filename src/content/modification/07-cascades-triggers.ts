import type { Section } from '../types'

export const cascadesTriggers: Section = {
  id: 'cascades-triggers',
  title: 'Understand cascades, triggers, and bulk-change side effects',
  scene: 'cascades-triggers',
  slide: `## Cascades, triggers, and side effects

A change can do **more than the statement says**.

### Mental model
- \`ON DELETE CASCADE\`: deleting a parent deletes its **children**
- A **row trigger** runs for **each** affected row
- \`UPDATE OF price\` fires whenever \`price\` is in \`SET\`

### Worked example
- Delete customer 8 → its **2** wishlist rows go; customer 7's stays
- Update 2 products → **2** audit rows
- \`SET price = price\` on 10 rows → **+10** audit rows (**12**)
- A stock-only update → **no** new rows

### Misconception
- "The tag lists every change" — it counts **target rows only**

### Explanation summary
- Know a table's cascades and triggers **before** a bulk change`,
  narration:
    "Some changes do more than the statement says. With on delete cascade, deleting a parent deletes its children. In the first card, deleting customer eight also removes that customer's two wishlist rows, while customer seven's row stays. The second card shows a row trigger that writes an audit row for each changed price. Updating two products leaves two audit rows, and the command tag says only update two. The trigger fires for each affected row, and it fires whenever price appears in the set list, even when the value does not change: setting price equal to price on ten rows adds ten more audit rows, twelve in total. A stock-only update over all ten rows adds none, because the trigger is declared on price. So the command tag counts target rows only, not side effects. Know the cascades and triggers on a table before a bulk change, and expect them to multiply the work. Stored procedures in general stay outside this course.",
}
