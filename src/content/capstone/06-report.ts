import type { Section } from '../types'

export const report: Section = {
  id: 'report',
  title: 'Report: rank with window functions',
  scene: 'cap-report',
  focus: 'step-report', // lights this step in the shared strip
  slide: `## Report: rank with window functions

The advanced report keeps every customer row **and** computes across them — window functions, from Course 2.

### Ranking & running totals
- A **CTE** (\`WITH per_customer AS …\`) names the summary once, so the outer query stays readable
- **\`RANK() OVER (ORDER BY revenue DESC)\`** — a leaderboard position on every row
- **\`SUM(revenue) OVER (ORDER BY revenue DESC)\`** — a **running total** down the list

### Why not GROUP BY
- The window **keeps every row** and adds the computed columns beside it — no collapse
- \`OVER(…)\` is the whole difference: same aggregate, but *alongside* the rows, not instead of them
- Compare the two results: same customers, same revenue — two extra columns

The report is perfect — but as the shop grows, is it *fast*?`,
  narration:
    'For the polished report, we reach for window functions — the tool from course two that computes across rows without collapsing them. Building on our revenue figures, we add two columns. RANK, over an ordering by revenue descending, stamps each customer with their leaderboard position — number one, number two, and so on. And SUM of revenue, over that same ordering, gives a running total: as you read down the list from the top spender, it accumulates the revenue, so you can see what fraction of your total comes from your top few customers. The magic word, as always, is OVER. Without it, SUM of revenue would collapse everything into a single grand total. With OVER, the sum is computed alongside every row instead of replacing them, so we keep every customer visible and just add these analytical columns beside them. That\'s the entire difference between an aggregate and a window function, and it\'s why windows are the right tool for rankings and running totals. Our reporting is now genuinely powerful — ranked customers, running revenue, all in one query. But there\'s one question left, and it\'s the one course four was all about: as this shop grows from two customers to two million, is this query still fast? Let\'s look under the hood and make sure.',
}
