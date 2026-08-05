import { type SceneSpec, BLUE, TEAL, GREEN, RED } from 'flow-engine'

// The `btree` scene — a mechanism detour from the engine-path (§5). A labelled "index" box can't
// show WHY a lookup is O(log n), so this scene draws the B-tree itself: a Root that routes by
// key, a level of Branch nodes, and the Leaf level that holds the sorted keys + pointers to heap
// rows. The leaves are linked left-to-right, which is what makes range scans cheap (walk
// sideways). Below: why it's fast (GREEN) and the trade-off (RED). Tree = BLUE, leaves = TEAL.
//
//                 [ Root ]                 descend root → leaf, 3–4 hops
//                /        \
//        [ Branch ]      [ Branch ]
//        /       \        /       \
//    [Leaf]—[Leaf]—[Leaf]—[Leaf]   sorted & linked → range scans walk sideways
export const btree: SceneSpec = {
  id: 'btree',
  title: 'Inside a B-tree index',
  canvas: { width: 1680, height: 1080 },
  grid: { cols: 1, rows: [1.5, 0.5, 0.5], gap: 0.36, padding: 0.4 },
  nodes: [
    // ── the tree: Root → Branch → Leaf, three levels on a 4-column grid ──
    {
      id: 'bt-tree', label: 'The B-tree · descend from root to leaf', kind: 'container', color: BLUE, cell: [0, 0],
      layout: { cols: 4, rows: [1, 1, 1], gap: 0.4, padding: 0.5 },
      children: [
        // root spans the two centre columns
        { id: 'bt-root', label: 'Root', sub: 'key < 40 ? left : right', kind: 'symbol', color: BLUE, cell: [1, 0, 2, 1] },
        // two branch nodes, each above two leaves
        { id: 'bt-n1', label: 'Branch', sub: 'keys 10 · 25', kind: 'symbol', color: BLUE, cell: [0, 1, 2, 1] },
        { id: 'bt-n2', label: 'Branch', sub: 'keys 55 · 80', kind: 'symbol', color: BLUE, cell: [2, 1, 2, 1] },
        // the leaf level — sorted keys, each pointing at heap rows
        { id: 'bt-l1', label: 'Leaf', sub: '1 · 5 · 9 → rows', kind: 'symbol', color: TEAL, cell: [0, 2] },
        { id: 'bt-l2', label: 'Leaf', sub: '10 · 25 · 33 → rows', kind: 'symbol', color: TEAL, cell: [1, 2] },
        { id: 'bt-l3', label: 'Leaf', sub: '41 · 55 → rows', kind: 'symbol', color: TEAL, cell: [2, 2] },
        { id: 'bt-l4', label: 'Leaf', sub: '61 · 80 · 99 → rows', kind: 'symbol', color: TEAL, cell: [3, 2] },
      ],
    },

    // ── why it's fast (full-width, 2 items) ──
    {
      id: 'bt-why', label: 'Why it’s fast', kind: 'container', color: GREEN, cell: [0, 1],
      layout: { cols: 2, rows: 1, gap: 0.35, padding: 0.5 },
      children: [
        { id: 'bt-log', label: 'O(log n)', sub: '3–4 hops over millions of rows', kind: 'symbol', color: GREEN, cell: [0, 0] },
        { id: 'bt-range', label: 'Sorted + linked leaves', sub: 'range scans walk sideways', kind: 'symbol', color: GREEN, cell: [1, 0] },
      ],
    },

    // ── the trade-off (full-width, 2 items) ──
    {
      id: 'bt-trade', label: 'The trade-off', kind: 'container', color: RED, cell: [0, 2],
      layout: { cols: 2, rows: 1, gap: 0.35, padding: 0.5 },
      children: [
        { id: 'bt-writes', label: 'Slows writes', sub: 'every INSERT updates the index', kind: 'symbol', color: RED, cell: [0, 0] },
        { id: 'bt-disk', label: 'Costs disk', sub: 'only index what you query', kind: 'symbol', color: RED, cell: [1, 0] },
      ],
    },
  ],
  edges: [
    // descend: root → branch → leaf
    { from: 'bt-root', to: 'bt-n1' },
    { from: 'bt-root', to: 'bt-n2' },
    { from: 'bt-n1', to: 'bt-l1' },
    { from: 'bt-n1', to: 'bt-l2' },
    { from: 'bt-n2', to: 'bt-l3' },
    { from: 'bt-n2', to: 'bt-l4' },
    // leaves linked in sorted order → range scans walk sideways
    { from: 'bt-l1', to: 'bt-l2', label: 'linked in sorted order → range scans', animated: false },
    { from: 'bt-l2', to: 'bt-l3', animated: false },
    { from: 'bt-l3', to: 'bt-l4', animated: false },
  ],
}
