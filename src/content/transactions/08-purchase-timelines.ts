import type { Section } from '../types'

export const purchaseTimelines: Section = {
  id: 'purchase-timelines',
  title: 'Worked timelines: concurrent purchases and inventory consistency',
  scene: 'purchase-timelines',
  slide: `## Worked timelines: concurrent purchases

One laptop left, two buyers. The **database** must decide.

### Mental model
- The stock row is the **single point of contention**
- Assumption: \`READ COMMITTED\`, one stock row per product
- Put the **test inside the \`UPDATE\`**; read the **row count**

### Worked example
- Naive: both read **1**; B's update waits, then the **check refuses** it
- Guarded: B waits, **re-checks** its \`WHERE\`, gets \`UPDATE 0\`
- Result: A has the order, B is told **sold out**, stock **0**

### Misconception
- "Check stock, then update" is safe — another session can **change it between**

### Explanation summary
- Make the test and the change **one statement**; retry on aborts`,
  narration:
    "This worked case puts the chapter together: one laptop left and two buyers. We assume the default read committed level and a single stock row per product, which is the point of contention. In the naive timeline both sessions read a stock of one and decide there is enough. A decrements and commits. B's decrement waits, and then the check constraint refuses it, so the database is the last line of defence, but B gets an error, not a friendly message. In the guarded timeline the test is part of the update: stock minus one where stock is at least one. B waits for A, and after A commits, PostgreSQL re-checks B's where clause against the new row. Stock is now zero, so the update affects zero rows. The application reads update zero as sold out, creates no order, and the final stock is zero with exactly one order. The pseudocode shows that structure. Make the test and the change one statement, and retry on aborts. Operations now have explicit consistency guarantees; next we control who may perform them and integrate the full lifecycle.",
}
