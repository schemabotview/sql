import type { Section } from '../types'

export const dropTruncate: Section = {
  id: 'drop-truncate',
  title: 'Remove structures and data: DROP and TRUNCATE',
  scene: 'drop-truncate',
  slide: `## Removing structures and data

Three statements remove **different** things.

### Mental model
- \`DELETE\` removes chosen rows · \`TRUNCATE\` removes **all** rows
- \`DROP TABLE\` removes the rows **and** the table

### Worked example: three runs
- After \`TRUNCATE\`: \`count(*)\` = **0**, columns intact
- After \`DROP\`: *relation does not exist*
- \`DROP TABLE customers\` is **refused**: \`orders\` depends on it

### Safety
- \`IF EXISTS\` for re-runs; \`CASCADE\` — read the \`DETAIL\` first
- In PostgreSQL all three **roll back**; outside a transaction they are final

### Misconception
- "TRUNCATE is a faster DELETE" — and it is refused on referenced tables`,
  narration:
    "Three statements remove things, and each removes something different. Delete, which we meet in chapter eight, removes the rows you choose and leaves the table. Truncate empties all the rows of a table, and does it fast, but the table itself stays: its columns, constraints and indexes are still there. In the first card we put two rows in, truncate, and count zero. Drop table goes further: it removes the table and its rows. In the second card, a select after the drop fails, saying the relation does not exist. Now the protection that dependencies give you. Trying to drop the customers table is refused, because orders and reviews depend on it through foreign keys, and the error detail lists exactly which ones. You could add cascade to drop those constraints as well, but read the detail first and be sure that is what you want. Adding if exists makes a drop safe to re-run. And here is the reassuring part: in PostgreSQL all three can be rolled back inside a transaction. I checked that a rolled-back truncate brings the rows back and a rolled-back drop brings back the table. Outside a transaction, though, they are final, so take a backup first. A common misconception is that truncate is just a faster delete. It skips the per-row work, and it is refused on tables that other tables reference. The schema now expresses the business rules but holds no useful records. Next, we populate and validate it.",
}
