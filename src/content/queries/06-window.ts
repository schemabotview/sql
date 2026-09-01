import type { Section } from '../types'

export const window: Section = {
  id: 'window',
  title: 'Window functions: compute across rows, keep them',
  scene: 'window-vs-group',
  slide: `## Window functions

A window function computes across a set of rows **without collapsing them** — the exact thing \`GROUP BY\` can't do.

### GROUP BY vs a window
- \`GROUP BY\` folds many rows into **one row per group** — the detail is gone
- A window keeps **every original row** and adds a **computed column** beside it

### \`OVER( … )\` — the window
- **\`PARTITION BY\`** — split rows into groups (like \`GROUP BY\`, but rows stay)
- **\`ORDER BY\`** — sequence rows *within* each partition (for ranks and running totals)
- **frame** (\`ROWS BETWEEN …\`) — which nearby rows it sees
- Empty \`OVER ()\` means *every* row — a grand total on each row

### The function family
- **Ranking** — \`ROW_NUMBER\`, \`RANK\`, \`DENSE_RANK\` (ties skip or not)
- **Offset** — \`LAG\` / \`LEAD\` peek at the previous / next row
- **Running** — \`SUM() OVER\`, \`AVG() OVER\` — totals and moving averages`,
  narration:
    'GROUP BY had one big limitation: it\'s lossy. To give you a total per customer it collapses all of Ann\'s orders into a single row, and the individual orders are gone. A window function solves exactly that. Look at the two sides here: on the left, GROUP BY folds five orders down to four summary rows. On the right, the very same rows go in — but the window keeps all five and adds a new column beside them, a running total that climbs from forty to sixty-five across Ann\'s two orders. Same computation, but nothing is thrown away. The magic word is OVER. Any aggregate, or a special ranking function, followed by OVER and a set of parentheses, becomes a window function. Inside those parentheses you describe the window — the set of rows each row gets to see. PARTITION BY splits the rows into groups, just like GROUP BY, except the rows survive: here we partition by customer, so Ann\'s running total restarts independently of Bob\'s. ORDER BY sequences the rows within each partition, which is what lets you rank them or accumulate a running total in a defined order. And the frame — ROWS BETWEEN — narrows the window further to just the nearby rows, which is how you get a moving average over, say, the last three rows. As for what you can compute: there\'s a ranking family — ROW_NUMBER gives each row a position, RANK and DENSE_RANK handle ties, differing only in whether they skip numbers after a tie. There\'s an offset family — LAG and LEAD let a row peek at the previous or next row, perfect for period-over-period comparisons. And there are the running aggregates — SUM OVER for running totals, AVG OVER for moving averages. Windows are the tool for ranking, running totals, and comparisons — any time you need the summary and the detail together. Now back to the pipeline: with the rows fully shaped, SELECT finally chooses the columns, and DISTINCT drops any duplicates.',
}
