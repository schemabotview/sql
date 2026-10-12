import type { Section } from '../types'

export const locking: Section = {
  id: 'locking',
  title: 'Understand locking and blocking',
  scene: 'locking',
  slide: `## Locking and blocking

A writer holds a **row lock** until \`COMMIT\` or \`ROLLBACK\`.

### Mental model
- Another writer of the **same row** waits
- **Readers** are not blocked: they read the old version
- **Different rows** do not conflict
- \`NOWAIT\` turns waiting into an **immediate error**

### Worked example
- A updated product 1 and has not committed
- C's \`SELECT\` → **120**; C's update of product 2 → **fine**
- C's \`FOR UPDATE NOWAIT\` → **could not obtain lock**
- B's update **waits**, then runs after A commits → stock **118**

### Misconception
- "Reading blocks writing" — in PostgreSQL it does **not**

### Explanation summary
- Keep transactions **short** so locks are held briefly`,
  narration:
    "Locks are how concurrent writers take turns. When session A updates a row, it holds a lock on that row until it commits or rolls back. The timeline has three sessions. While A has an uncommitted update on product one, session C reads product one and sees one hundred twenty, the old version: readers are not blocked. C also updates product two without waiting, because different rows do not conflict. C then asks for a lock on product one with for update and no wait, and gets an immediate error instead of waiting. Session B updates product one and waits; the test runner confirmed B was waiting on a lock before A committed. When A commits, B's update runs, and the final stock is one eighteen. The table summarises what blocks what. The practical consequence is that a long transaction holds its locks for a long time, so other writers queue behind it; keep transactions short, and do not wait for a person's input inside one.",
}
