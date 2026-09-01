import type { Section } from '../types'

export const deleteMerge: Section = {
  id: 'delete-merge',
  title: 'DELETE & MERGE: removing and upserting',
  scene: 'delete-and-merge',
  slide: `## DELETE & MERGE

DELETE removes rows; MERGE combines all three verbs into one conditional statement.

### DELETE — remove rows
- \`DELETE FROM t WHERE …\` — the same \`WHERE\` rule: **no \`WHERE\` empties the table**
- \`TRUNCATE\` empties a table *fast* — but it's DDL: no per-row \`WHERE\`, and it resets it
- Foreign keys guard deletes too — \`ON DELETE CASCADE\` / \`RESTRICT\` decides the children

### MERGE — the conditional upsert
- Match a source against a target, then act per row:
- \`WHEN MATCHED\` → \`UPDATE\` (or \`DELETE\`) · \`WHEN NOT MATCHED\` → \`INSERT\`
- One statement to sync a table to new data — insert the new, update the changed

That's all four verbs. But a single verb is rarely the whole story — they run inside a transaction.`,
  narration:
    'DELETE removes rows, and it carries the exact same warning as UPDATE, only sharper: DELETE FROM a table with a WHERE clause removes the matching rows, but a DELETE with no WHERE removes every row in the table. Same discipline applies — check it with a SELECT first. If what you actually want is to empty a table completely and quickly, there\'s a purpose-built tool: TRUNCATE. It wipes all rows far faster than DELETE because it doesn\'t process them one at a time, but it\'s a different kind of statement — it\'s DDL, it can\'t take a WHERE to remove just some rows, and it typically resets things like auto-increment counters. And remember foreign keys from course one: they guard deletion too, so deleting a customer who still has orders is either blocked or cascades down to those orders, depending on the ON DELETE rule you chose. Now MERGE, which is the power tool of the group. MERGE takes a source of incoming data and matches it against a target table, and then it acts row by row based on whether a match was found. WHEN MATCHED, it can UPDATE or even DELETE the existing row; WHEN NOT MATCHED, it INSERTs a new one. In a single statement it can insert the brand-new records, update the ones that changed, and leave the rest — exactly what you need to sync a table to a fresh batch of data. That completes all four write verbs. But you almost never run just one in isolation — real changes are groups of writes that must all succeed or all fail together, and that\'s the transaction.',
}
