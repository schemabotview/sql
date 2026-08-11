import { type SceneSpec, GREEN, BLUE, ORANGE, PURPLE } from 'reveal-engine'

// The `engine-path` scene — the spine of Course 4 ("Under the hood"). It traces the physical
// life of a query, top to bottom, in four bands —
//
//   ┌ EXPLAIN — the plan the engine chose  (a real plan, as a code card) ┐
//   ┌ The planner · SQL → an execution plan ─────────────────────────────┐
//   │ Parse → Analyze → Rewrite → Optimize → Execute                     │
//   ┌ Access + storage · how rows are physically read ───────────────────┐
//   │ ⟨access⟩ Seq Scan · Index Scan   ⟨storage⟩ Tablespace→Heap→Page→Tuple · WAL │
//   ┌ MVCC · concurrency without blocking reads ─────────────────────────┐
//
// — EXPLAIN=GREEN (the tuning read-out), planner=BLUE, access+storage=ORANGE (the I/O), MVCC=
// PURPLE (a slim overview band; §7 detours to the full `mvcc` scene). Two stages detour to their
// own mechanism scenes: indexes → `btree`, MVCC → `mvcc`.
export const enginePath: SceneSpec = {
  id: 'engine-path',
  title: 'Under the hood',
  // The code font is fitted to the code node's BOX (SceneNode → fitCodePx), so a code card reads
  // bigger when its cell is taller — not wider (its lines leave horizontal slack, so height is the
  // binding dimension). §3 frames the EXPLAIN card alone; giving its row (row 0) more weight makes
  // that SQL large. Canvas height is raised in step so the other bands keep their absolute size
  // (each is framed in its own section). To make the EXPLAIN code bigger/smaller, tune rows[0].
  canvas: { width: 1400, height: 1200 },
  grid: { cols: 1, rows: [1.7, 0.8, 0.56, 0.68, 0.6], gap: 0.3, padding: 0.35 },
  nodes: [
    // ── band: EXPLAIN — a real plan the optimizer chose, as a multi-line code card ──
    {
      id: 'ep-explain', kind: 'code', filename: 'EXPLAIN', color: GREEN, cell: [0, 0],
      label: [
        'EXPLAIN SELECT * FROM orders WHERE customer_id = 42 LIMIT 10;',
        '',
        'Limit  (cost=0.29..8.40 rows=10 width=64)',
        '  ->  Index Scan using idx_orders_customer_id on orders',
        '        (cost=0.29..41.2 rows=57)   Index Cond: (customer_id = 42)',
        '        -- a Seq Scan would read every page of the table instead',
      ].join('\n'),
    },

    // ── band: the planner — SQL becomes a plan, cost-based ──
    {
      id: 'ep-planner', label: 'The planner · SQL → an execution plan', kind: 'container', color: BLUE, cell: [0, 1],
      layout: { cols: 5, rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 'ep-parse', label: 'Parse', sub: 'SQL → syntax tree', kind: 'symbol', color: BLUE, cell: [0, 0] },
        { id: 'ep-analyze', label: 'Analyze', sub: 'resolve names & types', kind: 'symbol', color: BLUE, cell: [1, 0] },
        { id: 'ep-rewrite', label: 'Rewrite', sub: 'apply views & rules', kind: 'symbol', color: BLUE, cell: [2, 0] },
        { id: 'ep-optimize', label: 'Optimize', sub: 'cost paths, pick cheapest', kind: 'symbol', color: BLUE, cell: [3, 0] },
        { id: 'ep-execute', label: 'Execute', sub: 'run the chosen plan', kind: 'symbol', color: BLUE, cell: [4, 0] },
      ],
    },

    // ── band: access methods — how the executor reads rows (full-width, roomy; §6 frames it) ──
    {
      id: 'ep-access', label: 'Access methods · how the executor reads rows', kind: 'container', color: ORANGE, cell: [0, 2],
      layout: { cols: 2, rows: 1, gap: 0.35, padding: 0.5 },
      children: [
        { id: 'ep-seqscan', label: 'Seq Scan', sub: 'read every page of the table', kind: 'symbol', color: ORANGE, cell: [0, 0] },
        { id: 'ep-idxscan', label: 'Index Scan', sub: 'descend an index, jump to the rows', kind: 'symbol', color: ORANGE, cell: [1, 0] },
      ],
    },

    // ── band: storage — where rows physically live (full-width; §4 frames it) ──
    {
      id: 'ep-storage', label: 'Storage · where rows physically live', kind: 'container', color: ORANGE, cell: [0, 3],
      layout: { cols: 5, rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 'ep-tablespace', label: 'Tablespace', sub: 'where files live', kind: 'symbol', color: ORANGE, cell: [0, 0] },
        { id: 'ep-heap', label: 'Heap file', sub: 'the table’s rows', kind: 'symbol', color: ORANGE, cell: [1, 0] },
        { id: 'ep-page', label: 'Page · 8 KB', sub: 'unit of I/O', kind: 'symbol', color: ORANGE, cell: [2, 0] },
        { id: 'ep-tuple', label: 'Tuple', sub: 'one stored row', kind: 'symbol', color: ORANGE, cell: [3, 0] },
        { id: 'ep-wal', label: 'WAL', sub: 'write-ahead log', kind: 'symbol', color: ORANGE, cell: [4, 0] },
      ],
    },

    // ── band: MVCC — a slim overview strip; §7 detours to the full `mvcc` scene ──
    {
      id: 'ep-mvcc', label: 'MVCC · concurrency without blocking reads', kind: 'container', color: PURPLE, cell: [0, 4],
      layout: { cols: 3, rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 'ep-versions', label: 'Row versions', sub: 'xmin / xmax', kind: 'symbol', color: PURPLE, cell: [0, 0] },
        { id: 'ep-snapshot', label: 'Snapshot', sub: 'a reader’s consistent view', kind: 'symbol', color: PURPLE, cell: [1, 0] },
        { id: 'ep-vacuum', label: 'VACUUM', sub: 'reclaim dead versions', kind: 'symbol', color: PURPLE, cell: [2, 0] },
      ],
    },
  ],
  edges: [
    // the planner pipeline, in order
    { from: 'ep-parse', to: 'ep-analyze' },
    { from: 'ep-analyze', to: 'ep-rewrite' },
    { from: 'ep-rewrite', to: 'ep-optimize' },
    { from: 'ep-optimize', to: 'ep-execute' },
    // the storage hierarchy: a tablespace holds heap files, made of pages, made of tuples
    { from: 'ep-tablespace', to: 'ep-heap' },
    { from: 'ep-heap', to: 'ep-page' },
    { from: 'ep-page', to: 'ep-tuple' },
  ],
}
