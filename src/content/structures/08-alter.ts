import type { Section } from '../types'

export const alter: Section = {
  id: 'alter',
  title: 'Evolve structures with ALTER TABLE',
  scene: 'alter-before-after',
  slide: `## Evolving structures with ALTER TABLE

Structures change; **rows survive**.

### Mental model
- One \`ALTER TABLE\` per change: add, rename, retype, drop
- Existing rows are kept — unless a change cannot apply to them

### Worked example
- \`ADD COLUMN owner integer NOT NULL DEFAULT 1\`
- \`RENAME COLUMN added_on TO added\`
- \`ALTER COLUMN priority TYPE bigint\`
- \`DROP COLUMN\`: its data is **gone**

### The NOT NULL trap
- On a table with rows it **fails**: *contains null values*
- Add a \`DEFAULT\`, or fill first

### Safety
- Rehearse in a transaction; big tables may **lock**`,
  narration:
    "Structures change over time, and alter table is how you change them without losing the rows. The script on the left starts with the wishlist as we built it, then makes three changes. It adds an owner column that is not null with a default of one; it renames added on to added; and it changes the type of priority from integer to bigint. The two diagrams show the shape before and after, so you can compare them by eye: one new column, one new name, one new type, and every existing row is still there. Drop column is different, because the data in that column is gone for good. Now the trap that catches everyone once. If you add a not null column to a table that already has rows, PostgreSQL refuses, saying the column contains null values, because the existing rows would have nothing in it. There are two ways out: give the column a default, or add it as nullable, fill it in, and then set it not null. For safety, rehearse a structure change inside a transaction, because in PostgreSQL structure changes can be rolled back, and remember that on very large tables some changes lock or rewrite the whole table. A common misconception is that alter table only changes the definition. It can change every row.",
}
