import { type SceneSpec, BLUE, GREEN, ORANGE, PURPLE, TEAL, RED, GRAY, YELLOW } from 'reveal-engine'

// The `sql-landscape` scene — the concept's SIGNATURE MAP: the whole of SQL on one canvas,
// reproduced from the owner's own mental-model diagram and completed to the five SQL
// sub-languages. Laid out as clean horizontal BANDS — a top operations row over three
// full-width foundation bands — so the "life of data" flows straight down through it:
//
//   ┌ DDL ┐ ┌ CATALOG  ┐ ┌ TRANSACTIONS ┐ ┌ PROGRAMMATIC ┐   the operations
//   ┌ DCL ┘ └(metadata)┘ └    (TCL)     ┘ └              ┘   (define·control·write·logic)
//   ┌──────────────── STORAGE · data ────────────────────┐   the foundation
//   ┌──────────────── QUERY PIPELINE (DQL) ───────────────┐   read it back
//   ┌──────────────── SET OPERATIONS ─────────────────────┐   combine results
//
// Colors follow the owner's diagram: DDL=orange · Catalog=blue · Storage=gray ·
// Transactions=purple · Query=green · Set-ops=teal; the two added bands DCL and
// Programmatic take red (the guard rail — writes/grants demand care) and yellow (server
// logic). This scene is built once here and reused as the "you are here" opener by every
// later course; Course 1 frames it whole (the overview) then hands off to a spacious ERD.
//
// The catalog band nests Database→Schema→Table→(columns · indexes · constraints · views)
// and the query band nests the JOIN family — faithful to the diagram. That detail is only
// ever seen in the whole-map overview here; each concept gets a legible, roomy scene of its
// own in its course, so tiny text on this map is fine (the camera never dwells on it).
export const sqlLandscape: SceneSpec = {
  id: 'sql-landscape',
  title: 'The shape of SQL',
  canvas: { width: 860, height: 800 },
  // Clean horizontal bands: a top OPERATIONS row (DDL/DCL stacked left, then Catalog,
  // Transactions, Programmatic as full-height columns), then three full-width foundation
  // bands — STORAGE, QUERY PIPELINE, SET OPERATIONS — stacked below. The "life of data"
  // backbone threads straight down: ops → storage → query → set ops.
  grid: { cols: [1, 1.3, 1.2, 1], rows: [1.3, 0.9, 0.7, 1.0, 0.45], gap: 0.3, padding: 0.42 },
  nodes: [
    // ── band: DDL — the verbs that DEFINE structure ──
    {
      id: 'ddl', label: 'DDL · define', kind: 'container', color: ORANGE, cell: [0, 0],
      layout: { cols: [1, 1], rows: [1, 1, 1, 1], gap: 0.3, padding: 0.5 },
      children: [
        { id: 'ddl-create-table', label: 'CREATE TABLE', kind: 'symbol', color: ORANGE, icon: 'table', cell: [0, 0] },
        { id: 'ddl-alter-table', label: 'ALTER TABLE', kind: 'symbol', color: ORANGE, cell: [1, 0] },
        { id: 'ddl-drop-table', label: 'DROP TABLE', kind: 'symbol', color: ORANGE, cell: [0, 1] },
        { id: 'ddl-truncate', label: 'TRUNCATE', kind: 'symbol', color: ORANGE, cell: [1, 1] },
        { id: 'ddl-create-index', label: 'CREATE INDEX', kind: 'symbol', color: ORANGE, cell: [0, 2] },
        { id: 'ddl-create-view', label: 'CREATE VIEW', kind: 'symbol', color: ORANGE, cell: [1, 2] },
        { id: 'ddl-rename', label: 'RENAME', kind: 'symbol', color: ORANGE, cell: [0, 3, 2, 1] },
      ],
    },

    // ── band: CATALOG — the metadata the DB keeps about itself ──
    {
      id: 'catalog', label: 'Catalog · metadata', kind: 'container', color: BLUE, cell: [1, 0, 1, 2],
      layout: { cols: [1, 1], rows: [0.5, 0.5, 2.6], gap: 0.28, padding: 0.5 },
      children: [
        { id: 'cat-database', label: 'Database', kind: 'symbol', color: BLUE, icon: 'database', cell: [0, 0, 2, 1] },
        { id: 'cat-schema', label: 'Schema', kind: 'symbol', color: BLUE, cell: [0, 1, 2, 1] },
        {
          id: 'cat-table', label: 'Table', kind: 'container', color: BLUE, icon: 'table', cell: [0, 2, 2, 1],
          layout: { cols: [1, 1], rows: [0.8, 1.5, 0.8], gap: 0.28, padding: 0.5 },
          children: [
            { id: 'tbl-columns', label: 'Columns', kind: 'symbol', color: BLUE, cell: [0, 0] },
            { id: 'tbl-indexes', label: 'Indexes', kind: 'symbol', color: BLUE, cell: [1, 0] },
            {
              id: 'tbl-constraints', label: 'Constraints', kind: 'container', color: BLUE, cell: [0, 1, 2, 1],
              layout: { cols: [1, 1, 1, 1, 1], rows: 1, gap: 0.2, padding: 0.42 },
              children: [
                { id: 'con-pk', label: 'PK', kind: 'term', color: BLUE, cell: [0, 0] },
                { id: 'con-fk', label: 'FK', kind: 'term', color: BLUE, cell: [1, 0] },
                { id: 'con-notnull', label: 'NOT NULL', kind: 'term', color: BLUE, cell: [2, 0] },
                { id: 'con-unique', label: 'UNIQUE', kind: 'term', color: BLUE, cell: [3, 0] },
                { id: 'con-check', label: 'CHECK', kind: 'term', color: BLUE, cell: [4, 0] },
              ],
            },
            { id: 'tbl-views', label: 'Views', kind: 'symbol', color: BLUE, cell: [0, 2, 2, 1] },
          ],
        },
      ],
    },

    // ── band: TRANSACTIONS — DML writes wrapped in ACID (TCL) ──
    {
      id: 'transactions', label: 'Transactions · TCL', kind: 'container', color: PURPLE, cell: [2, 0, 1, 2],
      layout: { cols: [1, 1], rows: [0.55, 1.5, 0.7, 1.0], gap: 0.28, padding: 0.5 },
      children: [
        { id: 'txn-begin', label: 'BEGIN', kind: 'symbol', color: PURPLE, cell: [0, 0, 2, 1] },
        {
          id: 'txn-writedml', label: 'Write DML', kind: 'container', color: RED, cell: [0, 1, 2, 1],
          layout: { cols: [1, 1], rows: [1, 1], gap: 0.28, padding: 0.5 },
          children: [
            { id: 'dml-insert', label: 'INSERT', kind: 'symbol', color: RED, cell: [0, 0] },
            { id: 'dml-update', label: 'UPDATE', kind: 'symbol', color: RED, cell: [1, 0] },
            { id: 'dml-delete', label: 'DELETE', kind: 'symbol', color: RED, cell: [0, 1] },
            { id: 'dml-merge', label: 'MERGE', kind: 'symbol', color: RED, cell: [1, 1] },
          ],
        },
        { id: 'txn-commit', label: 'COMMIT', kind: 'symbol', color: PURPLE, cell: [0, 2] },
        { id: 'txn-rollback', label: 'ROLLBACK', kind: 'symbol', color: PURPLE, cell: [1, 2] },
        {
          id: 'txn-isolation', label: 'Isolation levels', kind: 'container', color: PURPLE, cell: [0, 3, 2, 1],
          layout: { cols: [1, 1], rows: [1, 1], gap: 0.22, padding: 0.45 },
          children: [
            { id: 'iso-ru', label: 'READ UNCOMMITTED', kind: 'term', color: PURPLE, cell: [0, 0] },
            { id: 'iso-rc', label: 'READ COMMITTED', kind: 'term', color: PURPLE, cell: [1, 0] },
            { id: 'iso-rr', label: 'REPEATABLE READ', kind: 'term', color: PURPLE, cell: [0, 1] },
            { id: 'iso-ser', label: 'SERIALIZABLE', kind: 'term', color: PURPLE, cell: [1, 1] },
          ],
        },
      ],
    },

    // ── band: DCL — access control (the guard rail) ──
    {
      id: 'dcl', label: 'DCL · control', kind: 'container', color: RED, cell: [0, 1],
      layout: { cols: [1, 1], rows: [1, 1], gap: 0.3, padding: 0.5 },
      children: [
        { id: 'dcl-grant', label: 'GRANT', kind: 'symbol', color: RED, icon: 'shield', cell: [0, 0] },
        { id: 'dcl-revoke', label: 'REVOKE', kind: 'symbol', color: RED, cell: [1, 0] },
        { id: 'dcl-roles', label: 'Roles & privileges', kind: 'symbol', color: RED, icon: 'users', cell: [0, 1, 2, 1] },
      ],
    },

    // ── band: STORAGE — where the data actually lives ──
    {
      id: 'storage', label: 'Storage · data', kind: 'container', color: GRAY, cell: [0, 2, 4, 1],
      layout: { cols: [1, 1, 1, 1], rows: 1, gap: 0.28, padding: 0.5 },
      children: [
        { id: 'st-tablespace', label: 'Tablespace', kind: 'symbol', color: GRAY, icon: 'disk', cell: [0, 0] },
        { id: 'st-pages', label: 'Pages', kind: 'symbol', color: GRAY, cell: [1, 0] },
        { id: 'st-rows', label: 'Rows', kind: 'symbol', color: GRAY, cell: [2, 0] },
        { id: 'st-wal', label: 'WAL', sub: 'write-ahead log', kind: 'symbol', color: GRAY, cell: [3, 0] },
      ],
    },

    // ── band: PROGRAMMATIC — server-side logic ──
    {
      id: 'programmatic', label: 'Programmatic', kind: 'container', color: YELLOW, cell: [3, 0, 1, 2],
      layout: { cols: [1, 1], rows: [1, 1, 0.8], gap: 0.28, padding: 0.5 },
      children: [
        { id: 'prog-procs', label: 'Stored Procedures', kind: 'symbol', color: YELLOW, icon: 'gears', cell: [0, 0, 2, 1] },
        { id: 'prog-funcs', label: 'Functions', kind: 'symbol', color: YELLOW, cell: [0, 1] },
        { id: 'prog-triggers', label: 'Triggers', kind: 'symbol', color: YELLOW, cell: [1, 1] },
        { id: 'prog-cursors', label: 'Cursors', kind: 'symbol', color: YELLOW, cell: [0, 2, 2, 1] },
      ],
    },

    // ── band: QUERY PIPELINE — DQL, in logical execution order ──
    {
      id: 'query-pipeline', label: 'Query pipeline · DQL — logical execution order', kind: 'container', color: GREEN, cell: [0, 3, 4, 1],
      layout: { cols: [0.9, 1.5, 1, 1.15, 1.05, 1, 1, 1.1, 0.9], rows: [0.7, 1.6], gap: 0.3, padding: 0.5 },
      children: [
        { id: 'qp-cte', label: 'CTE / Subquery', sub: 'reusable step', kind: 'symbol', color: YELLOW, cell: [0, 0] },
        { id: 'qp-window', label: 'Window Functions', kind: 'symbol', color: YELLOW, cell: [5, 0] },
        { id: 'qp-from', label: 'FROM', kind: 'symbol', color: GREEN, cell: [0, 1] },
        {
          id: 'qp-join', label: 'JOIN', kind: 'container', color: TEAL, cell: [1, 1],
          layout: { cols: [1, 1, 1], rows: [1, 1], gap: 0.22, padding: 0.42 },
          children: [
            { id: 'join-inner', label: 'INNER', kind: 'term', color: TEAL, cell: [0, 0] },
            { id: 'join-left', label: 'LEFT', kind: 'term', color: TEAL, cell: [1, 0] },
            { id: 'join-right', label: 'RIGHT', kind: 'term', color: TEAL, cell: [2, 0] },
            { id: 'join-full', label: 'FULL OUTER', kind: 'term', color: TEAL, cell: [0, 1] },
            { id: 'join-cross', label: 'CROSS', kind: 'term', color: TEAL, cell: [1, 1] },
            { id: 'join-self', label: 'SELF', kind: 'term', color: TEAL, cell: [2, 1] },
          ],
        },
        { id: 'qp-where', label: 'WHERE', kind: 'symbol', color: GREEN, cell: [2, 1] },
        { id: 'qp-groupby', label: 'GROUP BY', kind: 'symbol', color: GREEN, cell: [3, 1] },
        { id: 'qp-having', label: 'HAVING', kind: 'symbol', color: GREEN, cell: [4, 1] },
        { id: 'qp-select', label: 'SELECT', kind: 'symbol', color: GREEN, cell: [5, 1] },
        { id: 'qp-distinct', label: 'DISTINCT', kind: 'symbol', color: GREEN, cell: [6, 1] },
        { id: 'qp-orderby', label: 'ORDER BY', kind: 'symbol', color: GREEN, cell: [7, 1] },
        { id: 'qp-limit', label: 'LIMIT', kind: 'symbol', color: GREEN, cell: [8, 1] },
      ],
    },

    // ── band: SET OPERATIONS — combine query results ──
    {
      id: 'set-operations', label: 'Set operations', kind: 'container', color: TEAL, cell: [0, 4, 4, 1],
      layout: { cols: [1, 1, 1, 1], rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 'set-union', label: 'UNION', kind: 'symbol', color: TEAL, cell: [0, 0] },
        { id: 'set-unionall', label: 'UNION ALL', kind: 'symbol', color: TEAL, cell: [1, 0] },
        { id: 'set-intersect', label: 'INTERSECT', kind: 'symbol', color: TEAL, cell: [2, 0] },
        { id: 'set-except', label: 'EXCEPT', kind: 'symbol', color: TEAL, cell: [3, 0] },
      ],
    },
  ],
  edges: [
    // The query pipeline, left→right in logical execution order (the flow WITHIN the DQL band).
    { from: 'qp-cte', to: 'qp-from' },
    { from: 'qp-from', to: 'qp-join' },
    { from: 'qp-join', to: 'qp-where' },
    { from: 'qp-where', to: 'qp-groupby' },
    { from: 'qp-groupby', to: 'qp-having' },
    { from: 'qp-having', to: 'qp-select' },
    { from: 'qp-select', to: 'qp-distinct' },
    { from: 'qp-distinct', to: 'qp-orderby' },
    { from: 'qp-orderby', to: 'qp-limit' },
    { from: 'qp-window', to: 'qp-select' },

    // ── THE LIFE OF DATA — the labeled backbone that turns the 8 bands from a grid into a
    //    system. It threads top→bottom down the map: you DEFINE structure, which populates the
    //    CATALOG, describing data that lives in STORAGE; you WRITE to storage via TRANSACTIONS,
    //    then READ it back through the QUERY pipeline, whose results are COMBINED by set ops.
    //    All chosen to route downward (the scene is vertical → top/bottom edge handles, so
    //    downward hops read clean; DCL/Programmatic are cross-cutting and left to narration). ──
    { from: 'ddl-create-table', to: 'cat-table', label: 'defines' },
    { from: 'cat-table', to: 'st-rows', label: 'stored as rows' },
    { from: 'dml-insert', to: 'st-rows', label: 'writes' },
    { from: 'storage', to: 'query-pipeline', label: 'read by' },
    { from: 'query-pipeline', to: 'set-operations', label: 'combined' },

    // ── CONTROL & LOGIC (cross-cutting) — drawn without the travelling dot (animated:false)
    //    so they read as control, not data movement. The engine's floating edges route these
    //    to the facing border, so even the sideways/upward hops stay clean. ──
    { from: 'dcl', to: 'catalog', label: 'controls access', animated: false },
    { from: 'programmatic', to: 'transactions', label: 'runs', animated: false },
  ],
}
