import type { Section } from '../types'

export const optimize: Section = {
  id: 'optimize',
  title: 'Optimize: index & EXPLAIN',
  scene: 'cap-optimize',
  focus: 'step-optimize', // lights this step in the shared strip
  slide: `## Optimize: index & EXPLAIN

The final step makes it fast — and *proves* it — with Course 4's tools.

### Add the index
- Lookups filter on \`orders.customer_id\`, so **\`CREATE INDEX\`** on that column
- The B-tree turns a full-table scan into a **3–4-hop** jump to the matching rows

### Prove it with EXPLAIN
- Run **\`EXPLAIN\`** before and after — the plan flips from **\`Seq Scan\`** to **\`Index Scan\`**
- Don't guess at performance; **read the plan** and confirm the optimizer uses the index
- If it doesn't flip, the query isn't selective enough — or the statistics are stale

Modeled, secured, loaded, queried, and tuned — the project is shipped.`,
  narration:
    'The last step is to make it fast, and — just as importantly — to prove that it is, using the tools from course four. Our queries constantly filter and join on orders.customer_id, and right now, finding a given customer\'s orders means a sequential scan: reading every page of the orders table. So we create an index on customer_id. Behind that one line, the database builds a B-tree, which turns that full-table scan into a jump of just three or four hops straight to the matching rows, no matter how large the table grows. But here\'s the discipline course four drilled in: don\'t just assume the index helped — prove it. We run EXPLAIN on our query, and we read the plan. Before the index, the plan said Seq Scan on orders. After, it says Index Scan using our new index. That flip, from Seq Scan to Index Scan, is the optimizer telling us, in its own words, that it\'s now using the fast path. We didn\'t guess; we measured. And with that, look at what we\'ve done: we modeled the schema, secured it with roles, loaded data safely in a transaction, analyzed it with joins and windows, and tuned it with an index we verified. The project is built, and it\'s shipped.',
}
