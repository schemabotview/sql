import type { Section } from '../types'

export const analyze: Section = {
  id: 'analyze',
  title: 'Analyze: join & aggregate',
  scene: 'cap-analyze',
  focus: 'step-analyze', // lights this step in the shared strip
  slide: `## Analyze: join & aggregate

With data loaded, we ask a real business question — the query pipeline from Course 2.

### Revenue per customer
- **\`JOIN\`** stitches each order to its customer on the key
- **\`GROUP BY c.name\`** collapses each customer's orders into one row
- **\`count(*)\`** and **\`sum(o.total)\`** aggregate — orders and revenue per customer

### Filter groups, then sort
- **\`HAVING sum(o.total) > 50\`** keeps only the valuable customers (groups, not rows)
- **\`ORDER BY revenue DESC\`** puts the biggest spenders on top
- Five clauses, and the result beneath the query is exactly what they produced

That's the summary. But a summary loses the detail — for ranking *and* rows, we need a window.`,
  narration:
    'Now the payoff — we ask the database a real business question, using the query pipeline from course two. The question is: who are our most valuable customers, by revenue? Read the query as the pipeline runs it. FROM and JOIN come first, stitching each order to its customer by matching customer_id to the customer\'s id. Then GROUP BY c.name collapses all of a single customer\'s orders down into one row per customer. On those groups we run our aggregates — count star for how many orders they placed, and sum of o.total for their total revenue. Then HAVING filters the groups, keeping only customers whose revenue tops fifty dollars — remember, HAVING filters groups after aggregation, where WHERE would have filtered individual rows before it. And finally ORDER BY revenue descending puts the biggest spenders right at the top. In one statement we\'ve turned a pile of raw orders into a ranked revenue report. But notice what grouping did: it collapsed the orders away, giving us the summary but throwing out the detail. When you want the summary and the individual rows together — a rank, a running total — grouping can\'t do it. For that, course two gave us one more tool: the window function.',
}
