import { type SceneSpec, PURPLE, GREEN, TEAL, GRAY } from 'reveal-engine'

// The `mvcc` scene — a mechanism detour from the engine-path (§7). A labelled "MVCC" box can't
// show how one row can hold many truths at once, so this scene draws the version chain: row 42's
// UPDATE writes a NEW version (v2) and marks the old one (v1) dead — each stamped with xmin/xmax.
// Then two transactions, on two snapshots, see DIFFERENT versions of the same row without
// blocking. This is the machinery behind isolation (Course 3). Bottom: what MVCC buys + VACUUM.
//
//   row 42:  v1 (xmin100 xmax180, dead) ── UPDATE ─→ v2 (xmin180, current)
//   Txn A @150 → sees v1   ·   Txn B @200 → sees v2      (same row, two truths)
export const mvcc: SceneSpec = {
  id: 'mvcc',
  title: 'MVCC · versions & snapshots',
  canvas: { width: 1640, height: 1000 },
  grid: { cols: 1, rows: [0.85, 0.8, 0.72], gap: 0.4, padding: 0.4 },
  nodes: [
    // ── the version chain: one logical row, two physical versions ──
    {
      id: 'mv-chain', label: 'Row id = 42 · one logical row, many physical versions', kind: 'container', color: PURPLE, cell: [0, 0],
      layout: { cols: 2, rows: 1, gap: 0.5, padding: 0.5 },
      children: [
        { id: 'mv-v1', label: 'v1 · dead', sub: 'xmin 100 · xmax 180 · total=$40', kind: 'symbol', color: GRAY, cell: [0, 0] },
        { id: 'mv-v2', label: 'v2 · current', sub: 'xmin 180 · xmax ∞ · total=$55', kind: 'symbol', color: GREEN, cell: [1, 0] },
      ],
    },

    // ── two readers on two snapshots see different versions — no blocking ──
    {
      id: 'mv-snap', label: 'Two readers · two snapshots · same row, different truth', kind: 'container', color: TEAL, cell: [0, 1],
      layout: { cols: 2, rows: 1, gap: 0.5, padding: 0.5 },
      children: [
        { id: 'mv-txa', label: 'Txn A · started @150', sub: 'sees v1 → $40', kind: 'symbol', color: TEAL, cell: [0, 0] },
        { id: 'mv-txb', label: 'Txn B · started @200', sub: 'sees v2 → $55', kind: 'symbol', color: TEAL, cell: [1, 0] },
      ],
    },

    // ── what MVCC buys, and the cleanup it requires ──
    {
      id: 'mv-buys', label: 'What MVCC buys · and its one chore', kind: 'container', color: GREEN, cell: [0, 2],
      layout: { cols: 3, rows: 1, gap: 0.35, padding: 0.5 },
      children: [
        { id: 'mv-rw', label: 'Readers don’t block writers', sub: 'reads use a snapshot', kind: 'symbol', color: GREEN, cell: [0, 0] },
        { id: 'mv-wr', label: 'Writers don’t block readers', sub: 'writes add a version', kind: 'symbol', color: GREEN, cell: [1, 0] },
        { id: 'mv-vac', label: 'VACUUM', sub: 'reclaims dead versions', kind: 'symbol', color: PURPLE, cell: [2, 0] },
      ],
    },
  ],
  edges: [
    // the UPDATE that forks the version chain
    { from: 'mv-v1', to: 'mv-v2', label: 'UPDATE adds a new version', animated: false },
    // which version each snapshot resolves to
    { from: 'mv-txa', to: 'mv-v1', label: 'snapshot @150', animated: false },
    { from: 'mv-txb', to: 'mv-v2', label: 'snapshot @200', animated: false },
  ],
}
