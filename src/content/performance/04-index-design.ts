import type { Section } from '../types'

export const indexDesign: Section = {
  id: 'index-design',
  title: 'Design single-column and composite indexes',
  scene: 'index-design',
  slide: `## Single-column and composite indexes

An **index** is a sorted structure that lets the database find rows without reading everything.

### Mental model
- A **composite** index is sorted by its first column, then the next
- It helps most when the query filters on its **leading** column(s)

### Worked example
- Index on \`customer_id\`: 20 000 rows scanned → **10** found
- \`(status, order_date)\` serves **status + date range**
- A date range **alone**: a cost decision (2 days → scan)

### Misconception
- "Index every column" — each index has a **cost** (§6)

### Explanation summary
- Index the **measured queries**; lead with the filtered column`,
  narration:
    "An index is a sorted structure that lets the database find rows without reading the whole table. The first card creates one on customer id, and the plan changes from a scan of twenty thousand rows to an index lookup that finds exactly ten. A composite index covers several columns and is sorted by the first, then the second within it. So it works best when the query filters on its leading columns. The index on status and order date serves a query on both. For the date range alone, which is the later column, PostgreSQL decides by cost: it can read the whole index, and for this two-day range it falls back to a sequential scan, while a seven-day range still used the index. The table summarises the cases, and it says planner decides where we cannot promise either. The misconception is to index every column. Each index costs storage and slows writes, which the sixth section measures. Design indexes for the queries you measured, and lead with the column you filter on.",
}
