import type { Section } from '../types'

export const update: Section = {
  id: 'update',
  title: 'UPDATE: modifying rows',
  scene: 'update-before-after',
  slide: `## UPDATE: modifying rows

UPDATE changes values in rows that already exist.

### The shape
- \`UPDATE t SET col = value, col2 = value2 WHERE …\`
- The \`SET\` clause lists what to change; the \`WHERE\` clause decides **which rows**

### The one that bites everyone
- **No \`WHERE\` updates *every* row.** Forget it and you overwrite the whole table
- Always test the \`WHERE\` with a \`SELECT\` first — same predicate, no risk
- Inside a transaction you can check the row count and \`ROLLBACK\` if it looks wrong

### Beyond the basics
- \`SET total = total * 1.1\` — the new value computed from the old
- \`UPDATE t SET … FROM other WHERE …\` — pull values from a **joined** table (Postgres)

Adding and changing covered — the last, most dangerous verb removes rows: \`DELETE\`.`,
  narration:
    'Once rows exist, UPDATE is how you change them. The shape is straightforward: UPDATE the table, SET one or more columns to new values, and add a WHERE clause to say which rows. The SET clause is the what, and the WHERE clause is the which — and that WHERE clause is the most important habit in all of data modification. Here\'s why: if you leave the WHERE off, UPDATE doesn\'t error and it doesn\'t do nothing — it applies your change to every single row in the table. Set a status without a WHERE and you\'ve just marked the entire table with that status. This is the classic three-in-the-morning mistake, and the way you avoid it is a simple discipline: before you run an UPDATE, run a SELECT with the exact same WHERE clause and look at the rows it returns. If those are the rows you meant to change, swap SELECT for UPDATE and go. The values you set don\'t have to be constants — you can compute them from the existing data, like SET total equals total times one-point-one to raise every matching price by ten percent. And in Postgres you can even pull the new values from another table by adding a FROM clause, which is an update driven by a join. So we can add rows and change rows. That leaves the last verb, and the one to treat with the most respect, because it takes data away: DELETE.',
}
