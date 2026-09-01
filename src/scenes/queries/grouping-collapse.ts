import type { Scene } from '../../render-engine'

// §5 grouping-collapse — grouping is a COLLAPSE, so the board collapses, and now with real result
// sets: six rows become three grouped rows become two survivors. Drawing each stage as the table it
// actually is means the fold is VISIBLE — three cust-1 rows really do become the COUNT(*) = 3 row —
// instead of being asserted by a card sub.
//
// The three stages also put WHERE and HAVING in their real positions: HAVING is the arrow between
// stage two and stage three, which is exactly why it can see COUNT(*) and WHERE cannot.
export const groupingCollapse: Scene = {
  id: 'grouping-collapse',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'rows',
      kind: 'table',
      label: 'orders — many rows',
      pattern: 'storage',
      headers: ['id', 'customer_id', 'total'],
      values: [
        ['101', '1', '120.00'],
        ['102', '1', '80.00'],
        ['103', '1', '45.00'],
        ['104', '2', '210.00'],
        ['105', '2', '30.00'],
        ['106', '3', '15.00'],
      ],
    },
    {
      id: 'groups',
      kind: 'table',
      label: 'One row per group',
      pattern: 'network',
      sub: 'the detail is gone',
      headers: ['customer_id', 'COUNT(*)', 'SUM(total)'],
      values: [
        ['1', '3', '245.00'],
        ['2', '2', '240.00'],
        ['3', '1', '15.00'],
      ],
    },
    {
      id: 'survivors',
      kind: 'table',
      label: 'The groups that survive',
      pattern: 'service',
      sub: 'customer 3 filtered out',
      headers: ['customer_id', 'COUNT(*)', 'SUM(total)'],
      values: [
        ['1', '3', '245.00'],
        ['2', '2', '240.00'],
      ],
    },
  ],
  edges: [
    { source: 'rows', target: 'groups', label: 'GROUP BY customer_id' },
    { source: 'groups', target: 'survivors', label: 'HAVING COUNT(*) > 1 — filters GROUPS, not rows' },
  ],
}
