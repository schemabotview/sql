import type { Section } from '../types'

export const insertSelect: Section = {
  id: 'insert-select',
  title: 'Insert query results with INSERT … SELECT',
  scene: 'insert-select',
  slide: `## INSERT … SELECT

Feed a table from **a query** instead of literal values.

### Mental model
- The \`SELECT\` list maps to the target columns **by position**
- Preview the \`SELECT\` first; the tag counts the rows
- Useful for **archives**, **summaries**, and **copies**
- The target can be a **new table** or an existing one

### Worked example
- Archive delivered orders: \`INSERT 0 5\` (orders 1–5)
- Summarise live orders per customer: **6** rows
- Run it twice → **duplicate key** error (the rows exist)
- Check with a **count** and a min/max afterwards

### Misconception
- "Running it again is harmless" — it is **not idempotent**

### Explanation summary
- Name the columns, check the count, **plan for a re-run**
- Use \`ON CONFLICT\` (section 6) when re-runs are expected`,
  narration:
    "Insert select fills a table from a query, so one statement can copy, archive or summarise many rows. The select list maps to the target columns by position, so naming the columns explicitly is safer than relying on order. The first card creates an archive table shaped like orders and copies the delivered orders into it. The tag says insert zero five, and a follow-up count with minimum and maximum confirms five rows, orders one to five. The second card inserts a summary: orders and spend per customer, excluding the cancelled order, giving six rows. The third card shows the failure to expect. Running the same insert a second time collides with the primary key, because the rows already exist. So an insert select is not idempotent: if the job may run twice, plan for it with a key, a conflict clause, or by clearing the target first. The table lists the habits: preview, name columns, expect the tag.",
}
