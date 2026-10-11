import type { Section } from '../types'

export const indexFriendly: Section = {
  id: 'index-friendly',
  title: 'Recognise index-friendly predicates and unnecessary work',
  scene: 'index-friendly',
  slide: `## Index-friendly predicates

An index is sorted by the **column's value**, not by what you compute from it.

### Mental model
- \`WHERE col = value\` or a **range** on the bare column: usable
- \`WHERE f(col) = value\`: the index on \`col\` is **hidden**
- If most rows match, scanning beats an index

### Worked example
- \`extract(month FROM order_date) = 3\` → scans **20 000** rows
- The equivalent **range** → index, **1705** rows
- \`status = 'cancelled'\` (400) uses the index; \`'delivered'\` (16 800) does **not**

### Misconception
- "An index on the column is always used" — **shape and selectivity** decide

### Explanation summary
- Keep the column bare: **rewrite**`,
  narration:
    "Having an index does not guarantee it is used. An index is sorted by the column's value, so a condition that wraps the column in a function hides it. In the first card an index on order date exists, yet extract month equals three makes the planner read all twenty thousand rows. The equivalent range, from the first of March up to but not including the first of April, uses the index and touches only the seventeen hundred five March rows. Same answer, very different work. The second card is about selectivity. With an index on status, the rare value cancelled uses it, but delivered, which is most of the table, does not, because reading most rows through an index would be slower than scanning the table once. Unnecessary work also hides elsewhere, for example selecting every column when two are needed, or sorting rows nobody reads. The habit: keep the indexed column bare and rewrite conditions as ranges. These plans are PostgreSQL 16 choices on this generated data.",
}
