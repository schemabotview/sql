import type { Section } from '../types'

export const deleteSafely: Section = {
  id: 'delete-safely',
  title: 'Delete records safely',
  scene: 'delete-safely',
  slide: `## Deleting records safely

A \`DELETE\` removes rows you **cannot read back**; be able to name them first.

### Mental model
- Preview with \`SELECT\`, delete by **key**, use \`RETURNING\`
- A **foreign key** protects rows that others still reference
- **Soft delete:** keep the row, change a flag

### Worked example
- Product 10 (never ordered): \`DELETE 1\`, returned and named
- Customer 1 has orders → **foreign key violation**
- \`DELETE FROM payments\` with no \`WHERE\` → **\`DELETE 8\`**
- Soft delete: **8** products remain active

### Misconception
- "A delete is just the opposite of an insert" — it **cannot be previewed** after

### Explanation summary
- Delete **what you can name**; keep history when you may need it`,
  narration:
    "A delete removes rows you cannot read back afterwards, so you should be able to name them first. The first card deletes product ten, which was never ordered, by its key, and returning prints exactly what went. The second card shows the database protecting a row: customer one still has orders, so the foreign key refuses the delete. That refusal is a feature, because it prevents orphaned orders. The third card is the alarm: a delete with no where clause removes all eight payments, and the only sign is the command tag, delete eight. Everything here runs inside a transaction that is rolled back, so nothing is lost. The fourth card shows an alternative, the soft delete. The row stays, a flag marks it as discontinued, and queries filter on the flag; history is kept, at the cost of remembering to filter. Delete what you can name, and keep history when you may need it.",
}
