import type { Section } from '../types'

export const updateSafely: Section = {
  id: 'update-safely',
  title: 'Update records safely',
  scene: 'update-safely',
  slide: `## Updating records safely

An \`UPDATE\` is **a predicate plus new values**; get both right.

### Mental model
- \`SET\` can use the **old** values: \`stock = stock - 20\`
- Target by **primary key** when you mean one row
- \`RETURNING\` shows the rows **as changed**
- Constraints are the **last** safety net

### Worked example
- Product 1: price **59.00 → 64.00**, stock **120 → 100**
- \`status = 'pending'\` matches orders **9, 10, 11**
- \`price = 0\` is **refused** by a check constraint

### Misconception
- "A valid predicate is the right predicate" — 10 is part paid, 11 unpaid

### Explanation summary
- Narrow the target, **return** the result, let constraints catch the rest`,
  narration:
    "An update is a predicate that chooses rows plus new values for them, and both parts must be right. In the first card, the set clause uses the old value, stock minus twenty, and the where clause targets one product by its primary key. Returning shows the row as changed: price sixty-four, stock one hundred, and the table beside it shows the before and after. The second card shows a predicate that is valid but too broad. Status equals pending matches three orders: nine, ten and eleven. But order ten is only part paid and eleven is unpaid, so shipping all pending orders would be a business mistake, not an SQL error. The third card shows the last safety net: a check constraint refuses a price of zero, and the row stays unchanged. Constraints catch some mistakes, but only the ones you declared. So narrow the target, return the result, and compare it with what you expected.",
}
