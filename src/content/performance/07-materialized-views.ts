import type { Section } from '../types'

export const materializedViews: Section = {
  id: 'materialized-views',
  title: 'Materialized views: stored results, refresh, and freshness/performance trade-offs',
  scene: 'materialized-views',
  slide: `## Materialized views

A **materialized view** stores the **result** of its query.

### Mental model
- Reads scan the stored rows: **cheap**
- The stored result is as fresh as the **last \`REFRESH\`**
- A plain view always runs its query on current data

### Worked example
- Add pending order 12: live query says **4** orders, **1328.80**
- The stored row still says **3**, **1269.00**: **stale**
- After \`REFRESH MATERIALIZED VIEW\` it says **4**, **1328.80**

### Misconception
- "A materialized view updates itself" — **only when you refresh it**

### Explanation summary
- Choose it when reads are **frequent**, the query is **expensive**, and **some staleness** is acceptable`,
  narration:
    "A view stores a query. A materialized view stores the result of its query, so reading it means scanning a few stored rows instead of repeating a join and a grouping. The price is freshness. The card creates a revenue by status summary, then adds a new pending order. The stored summary still reports three pending orders and twelve sixty-nine, because nothing has refreshed it, while the live query would say four orders and thirteen twenty-eight eighty. After refresh materialized view, the stored result is current again. The table compares a plain view with a materialized one. The gap between refreshes is the freshness gap, and you have to decide whether your readers can tolerate it. A materialized view fits when reads are frequent, the query is expensive, and some staleness is acceptable; it also needs a refresh schedule, which is extra work to own. That ends this chapter. We can retrieve and analyse data efficiently; next we use those findings to correct and synchronise stored records.",
}
