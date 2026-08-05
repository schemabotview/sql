import { type SceneSpec, GRAY, RED } from 'flow-engine'

// The `why-relational` scene — Course 1's cold open (§1). Before the SQL map, motivate WHY a
// relational database exists at all: the naive "just keep it in one big spreadsheet" approach
// rots. The left is one flat `orders` sheet where the customer's details are COPIED onto every
// order row (Ann three times) — and already drifting (row 102 has a typo'd email). The right is
// the panel of pains that duplication causes. The relational fix (each fact stored once, tables
// related by keys, constraints the DB enforces) is what the rest of the course builds — so §2
// switches to the `sql-landscape` map: "here's the language that solves this."
//
//   ┌ orders — one flat file ─────────┐   ┌ THE PAINS (red) ────────────┐
//   │ 101 Ann NYC ann@shop.io  $40    │──▶│ ⚠ Duplication                │
//   │ 102 Ann NYC ann@shp.io   $25 ✗  │   │ ⚠ Update anomaly             │
//   │ 103 Bob LA  bob@shop.io  $60    │   │ ⚠ Inconsistency              │
//   │ 104 Ann NYC ann@shop.io  $15    │   │ ⚠ No integrity               │
//   └─────────────────────────────────┘   │ ⚠ Can't relate               │
//        the "same" customer, copied       └──────────────────────────────┘
//        & drifting — nothing enforces it
//
// Solid-tour: one beat solidifies the whole scene (focus: [], all bright).
export const whyRelational: SceneSpec = {
  id: 'why-relational',
  title: 'Why a relational database?',
  canvas: { width: 1560, height: 820 },
  grid: { cols: [1.3, 1.35], rows: 1, gap: 0.4, padding: 0.45 },
  nodes: [
    // ── the naive approach: one flat sheet with the customer copied onto every order row ──
    {
      id: 'wr-sheet', label: 'orders — one flat file', kind: 'table', color: GRAY, icon: 'file', cell: [0, 0],
      columns: ['order', 'customer', 'city', 'email', 'total'],
      rows: [
        ['101', 'Ann', 'NYC', 'ann@shop.io', '$40'],
        ['102', 'Ann', 'NYC', 'ann@shp.io ✗', '$25'],
        ['103', 'Bob', 'LA', 'bob@shop.io', '$60'],
        ['104', 'Ann', 'NYC', 'ann@shop.io', '$15'],
      ],
    },

    // ── the pains that copying every fact causes (term rows: pain + short consequence) ──
    {
      id: 'wr-pains', label: 'The pains · one big sheet', kind: 'container', color: RED, cell: [1, 0],
      layout: { cols: 1, rows: [1, 1, 1, 1, 1], gap: 0.28, padding: 0.1 },
      // label-only (no `type` tag — `type` right-aligns and is for short tags like `bigint · PK`;
      // a long phrase there clips the label). The pain + its consequence read as one left line.
      children: [
        { id: 'wr-dup', label: 'Duplication — copied on every row', kind: 'term', color: RED, cell: [0, 0] },
        { id: 'wr-anomaly', label: 'Update anomaly — change one, hunt many', kind: 'term', color: RED, cell: [0, 1] },
        { id: 'wr-inconsistent', label: "Inconsistency — one typo, two 'Anns'", kind: 'term', color: RED, cell: [0, 2] },
        { id: 'wr-integrity', label: 'No integrity — bad / orphan rows slip in', kind: 'term', color: RED, cell: [0, 3] },
        { id: 'wr-relate', label: "Can't relate — 'all NYC orders?' is painful", kind: 'term', color: RED, cell: [0, 4] },
      ],
    },
  ],
  edges: [
    // one sheet → many problems.
    { from: 'wr-sheet', to: 'wr-pains', label: 'one sheet → many problems', animated: false },
  ],
}
