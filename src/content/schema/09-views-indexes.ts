import type { Section } from '../types'

export const viewsIndexes: Section = {
  id: 'views-indexes',
  title: 'Views & indexes',
  scene: 'derived-objects',
  slide: `## Views & indexes

Views and indexes are **catalog objects derived from your tables** — neither stores a new fact.

### Views — a saved query
- **CREATE VIEW** names a query so you can \`SELECT\` from it like a table
- \`active_customers\` = customers with a recent order — complexity hidden, reused everywhere
- A plain view stores **no data**; it re-runs its query each time, so results are always fresh
- A **materialized** view caches the computed result, and must be refreshed

### Indexes — an access path
- **CREATE INDEX** builds a lookup structure (usually a **B-tree**) on a column
- \`idx_orders_customer_id\` makes *"find this customer's orders"* fast
- The trade-off: faster reads, slightly slower writes, more disk`,
  narration:
    'Two catalog objects deserve a closer look, because they\'re both derived from your tables rather than storing new facts of their own. First, views. A view is simply a saved query: you write a SELECT once, give it a name with CREATE VIEW, and from then on you can query that name as if it were a table. Our active_customers view might be defined as customers who\'ve placed a recent order — so instead of rewriting that logic everywhere, everyone just selects from active_customers. A plain view stores no data at all; it re-runs its underlying query every time you read it, always giving fresh results. If that query is expensive and you\'d rather cache the answer, a materialized view stores the computed rows and you refresh them on a schedule. Second, indexes. An index is an access path — a separate lookup structure, usually a B-tree, built on one or more columns. Our idx_orders_customer_id index makes the question find all orders for this customer fast, because the database can jump straight to the matching rows instead of scanning the whole table. Indexes aren\'t free, though: they speed up reads but slightly slow down writes, since every insert has to update the index too, and they take extra disk. That\'s the whole design toolkit — tables, types, keys, constraints, DDL, views, and indexes. Next, we\'ll start querying the data these tables hold.',
}
