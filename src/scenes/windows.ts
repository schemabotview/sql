import { type SceneSpec, BLUE, PURPLE, YELLOW, TEAL } from 'reveal-engine'

// The `windows` scene — a mechanism detour from the query pipeline (§6). A labelled WINDOW box
// can't teach the one thing that makes window functions special: they compute across a set of
// rows WITHOUT collapsing them. So the headline is a side-by-side contrast that answers §5's
// closing hook ("grouping is lossy") —
//
//   ┌ GROUP BY collapses ┐   ┌ SUM() OVER (PARTITION BY customer) keeps every row ┐
//   │ 5 rows → 4 rows     │   │ 5 rows → 5 rows + a new running_total column        │
//
// — same input rows (the customers/orders from the `joins` scene, for continuity), two
// outcomes. Below: the anatomy of OVER(…) — PARTITION BY · ORDER BY · frame — and the window
// function family (ranking · offset · running aggregates). Accent = YELLOW (ties to the
// pipeline's yellow `rp-window` feeder); the two tables reuse BLUE/PURPLE.
export const windows: SceneSpec = {
  id: 'windows',
  title: 'Window functions',
  canvas: { width: 1560, height: 900 },
  grid: { cols: [1, 1.25], rows: [1.35, 0.85], gap: 0.4, padding: 0.45 },
  nodes: [
    // ── top-left: GROUP BY — collapses the rows (detail lost) ──
    {
      id: 'w-grouped', label: 'GROUP BY customer', kind: 'table', color: BLUE, icon: 'table', cell: [0, 0],
      columns: ['customer', 'SUM(amount)'],
      rows: [
        ['Ann', '$65'],
        ['Bob', '$60'],
        ['Dan', '$15'],
        ['Eve', '$30'],
      ],
    },

    // ── top-right: the SAME rows, but a window keeps every one and adds a computed column ──
    {
      id: 'w-windowed', label: 'SUM() OVER (PARTITION BY customer)', kind: 'table', color: PURPLE, icon: 'table', cell: [1, 0],
      columns: ['customer', 'order', 'amount', 'running_total'],
      rows: [
        ['Ann', '101', '$40', '$40'],
        ['Ann', '102', '$25', '$65'],
        ['Bob', '103', '$60', '$60'],
        ['Dan', '104', '$15', '$15'],
        ['Eve', '105', '$30', '$30'],
      ],
    },

    // ── bottom-left: the anatomy of the OVER(…) clause — the window itself ──
    {
      id: 'w-over', label: 'OVER( … ) — defines the window', kind: 'container', color: YELLOW, cell: [0, 1],
      layout: { cols: 3, rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 'w-part', label: 'PARTITION BY', sub: 'split into groups', kind: 'symbol', color: YELLOW, cell: [0, 0] },
        { id: 'w-order', label: 'ORDER BY', sub: 'sequence within', kind: 'symbol', color: YELLOW, cell: [1, 0] },
        { id: 'w-frame', label: 'frame', sub: 'ROWS BETWEEN …', kind: 'symbol', color: YELLOW, cell: [2, 0] },
      ],
    },

    // ── bottom-right: the window function family ──
    {
      id: 'w-funcs', label: 'the window function family', kind: 'container', color: TEAL, cell: [1, 1],
      layout: { cols: 3, rows: 2, gap: 0.28, padding: 0.5 },
      children: [
        { id: 'wf-rownum', label: 'ROW_NUMBER', sub: 'position', kind: 'symbol', color: TEAL, cell: [0, 0] },
        { id: 'wf-rank', label: 'RANK', sub: 'ties skip', kind: 'symbol', color: TEAL, cell: [1, 0] },
        { id: 'wf-denserank', label: 'DENSE_RANK', sub: 'ties don’t skip', kind: 'symbol', color: TEAL, cell: [2, 0] },
        { id: 'wf-lag', label: 'LAG / LEAD', sub: 'peek other rows', kind: 'symbol', color: TEAL, cell: [0, 1] },
        { id: 'wf-sumover', label: 'SUM() OVER', sub: 'running total', kind: 'symbol', color: TEAL, cell: [1, 1] },
        { id: 'wf-avgover', label: 'AVG() OVER', sub: 'moving average', kind: 'symbol', color: TEAL, cell: [2, 1] },
      ],
    },
  ],
  edges: [
    // same input rows, two outcomes — GROUP BY folds them, the window adds a column beside them
    { from: 'w-grouped', to: 'w-windowed', label: 'same rows, kept not folded', animated: false },
  ],
}
