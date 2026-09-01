import type { Scene } from '../../render-engine'

// §3 two-tables — what *relational* actually means. One table teaches nothing about relations, so
// this draws the pair and the link: a value in `orders` matching a value in `customers`.
//
// Both are real TABLE nodes (kind: 'table'), not containers of tiles. The earlier tile version gave
// every column a 46px glyph — a key for `id` read fine, a clock for `created_at` was noise — and the
// 2×2 grid said nothing about a table's shape. A relation drawn as a relation carries the section's
// claim for free: same columns on every row, types the database enforces, and `customer_id` sitting
// in `orders` holding the other table's key.
//
// Composition: LR, the ERD reading order — the ONE side on the left, the MANY side on the right.
export const twoTables: Scene = {
  id: 'two-tables',
  padding: 0.18,
  flow: 'LR',
  nodes: [
    {
      id: 'customers',
      kind: 'table',
      label: 'customers',
      pattern: 'storage',
      sub: 'one row per customer',
      columns: [
        { name: 'id', type: 'bigint', key: 'PK' },
        { name: 'name', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'created_at', type: 'timestamptz' },
      ],
    },
    {
      id: 'orders',
      kind: 'table',
      label: 'orders',
      pattern: 'network',
      sub: 'one row per order',
      columns: [
        { name: 'id', type: 'bigint', key: 'PK' },
        { name: 'customer_id', type: 'bigint', key: 'FK' },
        { name: 'total', type: 'numeric' },
        { name: 'placed_at', type: 'timestamptz' },
      ],
    },
  ],
  // Table → table: the cardinality is a claim about the two ENTITIES. §5 draws the column-to-column
  // version, which is where the finer claim belongs — and which this engine cannot draw here anyway,
  // since edges anchor to a node, never to one of its rows.
  edges: [{ source: 'customers', target: 'orders', label: 'one customer, many orders' }],
}
