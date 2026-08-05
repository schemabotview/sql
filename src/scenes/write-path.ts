import { type SceneSpec, ORANGE, BLUE, GREEN, RED, PURPLE, GRAY } from 'flow-engine'

// The `write-path` scene — the spine of Course 3 ("Changing data safely"). Its headline is the
// organizing idea of the whole course: every change rides inside a TRANSACTION. So the scene
// stacks four bands, toured stage by stage like the query-pipeline —
//
//   ┌ the four write verbs · DML ───────────────────────────────────────┐
//   │ INSERT      UPDATE      DELETE      MERGE                          │
//   ┌ the transaction · one atomic unit ────────────────────────────────┐
//   │ BEGIN → [ your writes… ] → COMMIT        (or ROLLBACK)             │
//   │              ↑ SAVEPOINT — partial rollback                       │
//   ┌ ACID · the four guarantees ───────────────────────────────────────┐
//   │ Atomicity   Consistency   Isolation   Durability                  │
//   ┌ who & what-else ──────────────────────────────────────────────────┐
//   │ GRANT / REVOKE (DCL)   ·   procedures · functions · triggers …    │
//
// — verbs=ORANGE, transaction=BLUE, ACID=GREEN, DCL=RED, programmatic=PURPLE. The course tours
// each band; only isolation (band 2's Isolation guarantee) detours to its own `isolation` scene.
export const writePath: SceneSpec = {
  id: 'write-path',
  title: 'Changing data safely',
  canvas: { width: 1900, height: 1180 },
  grid: { cols: 1, rows: [0.85, 1.2, 0.85, 0.95], gap: 0.32, padding: 0.35 },
  nodes: [
    // ── band: the four write verbs (DML) — what you change data with ──
    {
      id: 'wp-dml', label: 'The write verbs · DML', kind: 'container', color: ORANGE, cell: [0, 0],
      layout: { cols: 4, rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 'wp-insert', label: 'INSERT', sub: 'add new rows', kind: 'symbol', color: ORANGE, cell: [0, 0] },
        { id: 'wp-update', label: 'UPDATE', sub: 'modify rows', kind: 'symbol', color: ORANGE, cell: [1, 0] },
        { id: 'wp-delete', label: 'DELETE', sub: 'remove rows', kind: 'symbol', color: ORANGE, cell: [2, 0] },
        { id: 'wp-merge', label: 'MERGE', sub: 'upsert: insert | update | delete', kind: 'symbol', color: ORANGE, cell: [3, 0] },
      ],
    },

    // ── band: the transaction — the safe envelope every write rides inside ──
    {
      id: 'wp-txn', label: 'The transaction · one atomic unit (TCL)', kind: 'container', color: BLUE, cell: [0, 1],
      layout: { cols: 4, rows: [1, 0.7], gap: 0.35, padding: 0.5 },
      children: [
        { id: 'wp-begin', label: 'BEGIN', sub: 'start the unit', kind: 'symbol', color: BLUE, cell: [0, 0] },
        { id: 'wp-work', label: 'your writes…', sub: 'INSERT / UPDATE / DELETE', kind: 'symbol', color: BLUE, cell: [1, 0] },
        { id: 'wp-commit', label: 'COMMIT', sub: 'make it permanent', kind: 'symbol', color: GREEN, cell: [2, 0] },
        { id: 'wp-rollback', label: 'ROLLBACK', sub: 'undo it all', kind: 'symbol', color: RED, cell: [3, 0] },
        { id: 'wp-savepoint', label: 'SAVEPOINT', sub: 'partial rollback point', kind: 'symbol', color: GRAY, cell: [1, 1] },
      ],
    },

    // ── band: ACID — the four guarantees a transaction buys you ──
    {
      id: 'wp-acid', label: 'ACID · the guarantees', kind: 'container', color: GREEN, cell: [0, 2],
      layout: { cols: 4, rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 'wp-a', label: 'Atomicity', sub: 'all-or-nothing', kind: 'symbol', color: GREEN, cell: [0, 0] },
        { id: 'wp-c', label: 'Consistency', sub: 'rules always hold', kind: 'symbol', color: GREEN, cell: [1, 0] },
        { id: 'wp-i', label: 'Isolation', sub: 'concurrent txns don’t collide', kind: 'symbol', color: GREEN, cell: [2, 0] },
        { id: 'wp-d', label: 'Durability', sub: 'survives a crash', kind: 'symbol', color: GREEN, cell: [3, 0] },
      ],
    },

    // ── band: who & what-else — access control (DCL) + server-side logic (programmatic) ──
    {
      id: 'wp-control', label: 'Who may write · and server-side logic', kind: 'container', color: GRAY, cell: [0, 3],
      layout: { cols: [1, 1.6], rows: 1, gap: 0.4, padding: 0.5 },
      children: [
        {
          id: 'wp-dcl', label: 'Access control · DCL', kind: 'container', color: RED, cell: [0, 0],
          layout: { cols: 2, rows: 1, gap: 0.28, padding: 0.5 },
          children: [
            { id: 'wp-grant', label: 'GRANT', sub: 'give a privilege', kind: 'symbol', color: RED, cell: [0, 0] },
            { id: 'wp-revoke', label: 'REVOKE', sub: 'take it back', kind: 'symbol', color: RED, cell: [1, 0] },
          ],
        },
        {
          id: 'wp-prog', label: 'Programmatic SQL', kind: 'container', color: PURPLE, cell: [1, 0],
          layout: { cols: 4, rows: 1, gap: 0.26, padding: 0.5 },
          children: [
            { id: 'wp-procs', label: 'Procedures', sub: 'callable routines', kind: 'symbol', color: PURPLE, cell: [0, 0] },
            { id: 'wp-funcs', label: 'Functions', sub: 'return a value', kind: 'symbol', color: PURPLE, cell: [1, 0] },
            { id: 'wp-triggers', label: 'Triggers', sub: 'fire on a write', kind: 'symbol', color: PURPLE, cell: [2, 0] },
            { id: 'wp-cursors', label: 'Cursors', sub: 'walk rows one by one', kind: 'symbol', color: PURPLE, cell: [3, 0] },
          ],
        },
      ],
    },
  ],
  edges: [
    // the transaction flow: BEGIN → your writes → COMMIT, with ROLLBACK as the escape hatch
    { from: 'wp-begin', to: 'wp-work' },
    { from: 'wp-work', to: 'wp-commit' },
    { from: 'wp-work', to: 'wp-rollback', label: 'on error', animated: false },
  ],
}
