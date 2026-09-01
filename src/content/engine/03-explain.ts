import type { Section } from '../types'

export const explain: Section = {
  id: 'explain',
  title: 'EXPLAIN: reading the plan',
  scene: 'explain-plan',
  slide: `## EXPLAIN: reading the plan

\`EXPLAIN\` prints the plan the optimizer chose — without running the query. \`EXPLAIN ANALYZE\` runs it and adds the *real* numbers.

### How to read it
- A **tree of nodes** — read **inside-out / bottom-up**; each node feeds its parent
- Each node shows a **cost** (\`startup..total\`) and an **estimated row count**

### What to look for
- **Seq Scan on a big table** where a filter is selective → a missing **index**
- Estimated rows **far** from actual (in \`ANALYZE\`) → **stale statistics**
- Join method — **Nested Loop** vs **Hash** vs **Merge** — the optimizer picks by size

### The plan above
- \`Index Scan … Index Cond: (customer_id = 42)\` — it jumped straight to customer 42's rows

The plan talks about scans and pages. Those are storage — where the rows actually live.`,
  narration:
    'EXPLAIN is how you see the plan, and learning to read it is the core skill of tuning. Put EXPLAIN in front of any query and, instead of running it, the database prints the plan the optimizer chose. Add the word ANALYZE and it actually runs the query too, so you also get the real execution times and the real row counts alongside the estimates — which is what you usually want. A plan is a tree of nodes, and the trick to reading it is to go inside-out, or bottom-up: the innermost, most-indented nodes run first and feed their results up to their parents. Each node tells you two key things — a cost, shown as a startup-dot-dot-total pair, and an estimated number of rows it will produce. Now, what are you actually looking for? A few tell-tale signs. The biggest one: a sequential scan on a large table when your query filters down to just a few rows — that\'s the classic signature of a missing index, the database reading the entire table because it has no faster path. Another: in an ANALYZE plan, if the estimated row count is wildly different from the actual, your statistics are stale and the optimizer is flying blind. And the join method — whether it chose a nested loop, a hash join, or a merge join — tells you how it\'s combining tables, a choice it makes based on their sizes. Look at the plan on the left: it chose an Index Scan with an index condition on customer_id equals forty-two, meaning it jumped straight to that customer\'s rows instead of scanning the table. Notice the plan keeps talking about scans and pages — and that\'s storage, where the rows physically live. Let\'s go there next.',
}
