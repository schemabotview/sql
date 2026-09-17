import type { Scene } from '@graphlearning/flow'

// §9 derived-objects — views and indexes are the two catalog objects DERIVED from the tables, and
// the section's honest framing is that neither is new data. A view is a query with a name; an index
// is a second way in to rows that already exist. Each gets its nuance as a second card: the
// materialized exception for views, the write-side cost for indexes.
//
// Composition: BT — the base tables are the FOUNDATION, so the arrows climb out of them into what is
// built on top. Drawing tables producing their own indexes downward would invert the dependency.
// The exact identifiers (`active_customers`, `idx_orders_customer_id`) live on the SLIDE: both blow
// the card's unbreakable-token budget, and the card's job is the concept anyway.
export const derivedObjects: Scene = {
  id: 'derived-objects',
  padding: 0.16,
  flow: 'BT',
  nodes: [
    {
      id: 'view',
      label: 'View — a saved query',
      pattern: 'group',
      children: [
        { id: 'view-plain', label: 'Re-runs each time', pattern: 'user', icon: 'scroll', sub: 'stores no data' },
        { id: 'view-mat', label: 'Materialized', pattern: 'user', icon: 'copy', sub: 'caches the results' },
      ],
    },
    {
      id: 'index',
      label: 'Index — an access path',
      pattern: 'group',
      children: [
        { id: 'index-btree', label: 'A B-tree lookup', pattern: 'service', icon: 'gitbranch', sub: 'find rows, no scan' },
        { id: 'index-cost', label: 'Faster reads', pattern: 'warn', sub: 'slower writes, more disk' },
      ],
    },
    { id: 'base', label: 'The base tables', pattern: 'storage', icon: 'table', sub: 'customers + orders' },
  ],
  edges: [
    { source: 'base', target: 'view', label: 'named, not stored' },
    { source: 'base', target: 'index', label: 'another way in' },
  ],
}
