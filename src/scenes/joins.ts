import { type SceneSpec, BLUE, PURPLE, TEAL } from 'reveal-engine'

// The `joins` scene — a mechanism detour from the query pipeline (§3). A labelled JOIN box
// can't teach how rows *match*, so this scene shows two real tables with sample rows and draws
// the match: `customers.id = orders.customer_id`. Ann has two orders, Bob one, Cat none — so
// Cat is the row that survives only under LEFT/FULL. Below, the six join types, each with a
// one-line rule. customers=blue, orders=purple (same hues as the ERD scene, for continuity).
export const joins: SceneSpec = {
  id: 'joins',
  title: 'Joining tables',
  canvas: { width: 1560, height: 880 },
  grid: { cols: [1, 1], rows: [1.35, 0.7], gap: 0.4, padding: 0.45 },
  nodes: [
    // ── the two tables (real data grids), with the customer_id column carrying the match ──
    {
      id: 'j-customers', label: 'customers', kind: 'table', color: BLUE, icon: 'table', cell: [0, 0],
      columns: ['id', 'name', 'city', 'email'],
      rows: [
        ['1', 'Ann', 'NYC', 'ann@shop.io'],
        ['2', 'Bob', 'LA', 'bob@shop.io'],
        ['3', 'Cat', 'SF', 'cat@shop.io'],
        ['4', 'Dan', 'Rome', 'dan@shop.io'],
        ['5', 'Eve', 'Oslo', 'eve@shop.io'],
      ],
    },
    {
      id: 'j-orders', label: 'orders', kind: 'table', color: PURPLE, icon: 'table', cell: [1, 0],
      columns: ['id', 'customer_id', 'total'],
      rows: [
        ['101', '1', '$40'],
        ['102', '1', '$25'],
        ['103', '2', '$60'],
        ['104', '4', '$15'],
        ['105', '5', '$30'],
      ],
    },

    // ── the six join types — same rows, different survivors ──
    {
      id: 'j-types', label: 'the six join types', kind: 'container', color: TEAL, cell: [0, 1, 2, 1],
      layout: { cols: 6, rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 'jt-inner', label: 'INNER', sub: 'only matches', kind: 'symbol', color: TEAL, cell: [0, 0] },
        { id: 'jt-left', label: 'LEFT', sub: 'all left + matches', kind: 'symbol', color: TEAL, cell: [1, 0] },
        { id: 'jt-right', label: 'RIGHT', sub: 'all right + matches', kind: 'symbol', color: TEAL, cell: [2, 0] },
        { id: 'jt-full', label: 'FULL OUTER', sub: 'everything', kind: 'symbol', color: TEAL, cell: [3, 0] },
        { id: 'jt-cross', label: 'CROSS', sub: 'every pair', kind: 'symbol', color: TEAL, cell: [4, 0] },
        { id: 'jt-self', label: 'SELF', sub: 'to itself', kind: 'symbol', color: TEAL, cell: [5, 0] },
      ],
    },
  ],
  edges: [
    // The match: customers.id = orders.customer_id. Orders carry customer_ids 1,1,2,4,5 — so
    // Cat (id 3) never appears, the row that survives only under LEFT / FULL.
    { from: 'j-customers', to: 'j-orders', label: 'id = customer_id', animated: false },
  ],
}
