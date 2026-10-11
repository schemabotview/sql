import type { Section } from '../types'

export const estimates: Section = {
  id: 'estimates',
  title: 'Understand estimated versus actual cardinality and statistics',
  scene: 'estimates',
  slide: `## Estimated versus actual cardinality

The planner chooses with **estimated** row counts.

### Mental model
- **Statistics** summarise each column: counts, common values, histogram
- Estimates come from statistics, **not from the data itself**
- \`ANALYZE\` (or autovacuum) **refreshes** them

### Worked example
- Fresh: estimate **2800**, actual **2800**
- After an \`UPDATE\` of 8229 rows: estimate **3675**, actual **11029**
- After \`ANALYZE\`: **11029** and **11029**

### Misconception
- "The plan is always right for the data" — it is right for its **statistics**

### Explanation summary
- A large gap between estimated and actual rows is the **first clue**`,
  narration:
    "The planner has to choose a plan before it has read the data, so it works with estimated row counts taken from statistics: the number of rows, the most common values, and a histogram of the rest. The card builds a copy of the table so the original stays untouched. With fresh statistics, the estimate for pending orders is twenty-eight hundred and the actual is twenty-eight hundred. Then an update turns eighty-two hundred rows into pending, and the statistics are stale: the planner expects thirty-six seventy-five rows but finds eleven thousand twenty-nine. After analyze, both numbers agree again. A wrong estimate matters because it can lead to a wrong plan, such as choosing a scan or a join method that suits a much smaller result. So when you read a plan, compare estimated and actual rows node by node; a big gap is the first clue. Autovacuum normally refreshes statistics, but not instantly. The exact estimate in the middle row is what PostgreSQL 16 produced here; the point is the gap.",
}
