import { type SceneSpec, BLUE, GREEN, ORANGE, PURPLE, TEAL, GRAY } from 'reveal-engine'

// The `schema-erd` scene — a spacious, legible ERD for Course 1's design deep-dive. Where the
// master map's Catalog band has one abstract "Table" box, *relational* means tables related by
// keys — which needs two real tables and the link between them. So this scene draws an
// e-commerce pair (the capstone's domain, for continuity).
//
// LANDSCAPE layout (aspect ~1.29) so it fills the scene pane instead of leaving side margins,
// and — crucially — so each table row is WIDE enough for its `type` tag (e.g. `email … text ·
// UNIQUE`) to sit right-aligned without clipping the column name:
//
//   ┌ DDL ─┐  ┌ customers ──┐      ┌ orders ─────┐
//   │verbs │  │ id … PK     │ ──<  │ id … PK     │   FK: orders.customer_id → customers.id
//   │      │  │ name/email… │      │ customer_id │
//   ├──────┤  └──────┬──────┘      └──────┬──────┘
//   │Constr│  ┌ view ─┴──┐         ┌ index┴──┐
//   └──────┘  └──────────┘         └─────────┘
//
// Tables are `table` nodes (header + grid rows) whose rows are the SCHEMA — column · type · key —
// so the ERD reads as a real table while still teaching types + keys. The `schema` course tours it:
// whole ERD → one table → keys+FK →
// constraints → DDL → views/indexes. Reveal is solid-tour (solidified on entry; focus lights a
// band, dims the rest). The two tables get distinct hues (customers=blue, orders=purple) so the
// FK reads as crossing between two entities.
export const schemaErd: SceneSpec = {
  id: 'schema-erd',
  title: 'Modeling data — an ERD',
  canvas: { width: 1080, height: 800 },
  // 3 rows so the two tables get a SHORT row (0.9) and hug their content, while DDL keeps its
  // height by spanning rows 0–1; row 1 is the edge-routing gap down to the view/index in row 2.
  grid: { cols: [0.9, 1.15, 1.15], rows: [0.9, 0.5, 0.65], gap: 0.1, padding: 0.5 },
  nodes: [
    // ── DDL — the verbs that build the schema (tall, left) ──
    {
      id: 'erd-ddl', label: 'DDL · build it', kind: 'container', color: ORANGE, cell: [0, 0, 1, 2],
      layout: { cols: [1, 1], rows: [1, 1, 1, 1], gap: 0.3, padding: 0.5 },
      children: [
        { id: 'erd-create-table', label: 'CREATE TABLE', kind: 'symbol', color: ORANGE, icon: 'table', cell: [0, 0] },
        { id: 'erd-alter-table', label: 'ALTER TABLE', kind: 'symbol', color: ORANGE, cell: [1, 0] },
        { id: 'erd-drop-table', label: 'DROP TABLE', kind: 'symbol', color: ORANGE, cell: [0, 1] },
        { id: 'erd-truncate', label: 'TRUNCATE', kind: 'symbol', color: ORANGE, cell: [1, 1] },
        { id: 'erd-create-index', label: 'CREATE INDEX', kind: 'symbol', color: ORANGE, cell: [0, 2] },
        { id: 'erd-create-view', label: 'CREATE VIEW', kind: 'symbol', color: ORANGE, cell: [1, 2] },
        { id: 'erd-rename', label: 'RENAME', kind: 'symbol', color: ORANGE, cell: [0, 3, 2, 1] },
      ],
    },

    // ── customers — the parent table (center). A `table` node: header + grid rows. Unlike the
    //    `joins` scene (which fills the grid with sample DATA), the rows here are the SCHEMA —
    //    column · type · key — so the ERD still teaches types + keys, in the polished table look. ──
    {
      id: 'customers', label: 'customers', kind: 'table', color: BLUE, icon: 'table', cell: [1, 0],
      columns: ['column', 'type', 'key'],
      rows: [
        ['id', 'bigint', 'PK'],
        ['name', 'text', 'NOT NULL'],
        ['email', 'text', 'UNIQUE'],
        ['created_at', 'timestamptz', ''],
      ],
    },

    // ── orders — the child table, FK → customers (right) ──
    {
      id: 'orders', label: 'orders', kind: 'table', color: PURPLE, icon: 'table', cell: [2, 0],
      columns: ['column', 'type', 'key'],
      rows: [
        ['id', 'bigint', 'PK'],
        ['customer_id', 'bigint', 'FK'],
        ['total', 'numeric', 'CHECK'],
        ['status', 'text', 'CHECK'],
        ['created_at', 'timestamptz', ''],
      ],
    },

    // ── Constraints — a `constraints.sql` cheatsheet card (each rule + a short comment), below
    //    DDL. A code card (vs six empty name-boxes) reads as real SQL and stays informative when
    //    §7 zooms it; the slide carries the fuller explanation. ──
    {
      id: 'constraints', kind: 'code', color: TEAL, filename: 'constraints.sql', cell: [0, 2],
      label: [
        'PRIMARY KEY   -- unique + not null',
        'FOREIGN KEY   -- matches a parent row',
        'NOT NULL      -- value required',
        'UNIQUE        -- no duplicates',
        'CHECK         -- a rule per row',
        'DEFAULT       -- auto-filled value',
      ].join('\n'),
    },

    // ── derived catalog objects: a view (under customers) + an index (under orders) ──
    { id: 'view', label: 'active_customers', sub: 'VIEW · a saved query', kind: 'symbol', color: GREEN, icon: 'layers', cell: [1, 2] },
    { id: 'index', label: 'idx_orders_customer_id', sub: 'INDEX · an access path', kind: 'symbol', color: GRAY, icon: 'key', cell: [2, 2] },
  ],
  edges: [
    // The foreign key: every order points at one customer (one → many), left → right.
    { from: 'customers', to: 'orders', label: '1 ──< * · customer_id' },
    // The view is derived from customers; the index sits on orders.customer_id.
    { from: 'view', to: 'customers', label: 'derived from', animated: false },
    { from: 'index', to: 'orders', label: 'on customer_id', animated: false },
  ],
}
