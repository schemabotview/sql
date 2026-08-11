import { type SceneSpec, ORANGE, RED, BLUE, GREEN, TEAL, PURPLE } from 'reveal-engine'

// The `capstone` scene — the spine of Course 5 ("End-to-end project"). Unlike the earlier course
// spines (concept diagrams), this one is the PROJECT itself: a build-flow across the top
// (Model → Secure → Load → Analyze → Report → Optimize) and, below, the actual SQL as six code
// cards. Each flow step + card is coloured by the course it reuses — ORANGE·DDL (C1),
// RED·DCL (C3), BLUE·txn (C3), GREEN·query (C2), TEAL·window (C2), PURPLE·engine (C4) — so the
// reuse is visible without leaving the scene. Sections frame each code card (the SQL is
// readable) while lighting the matching flow step (the spine is a live progress tracker).
//
// Top grid is 3 cols × 3 rows: the flow spine spans the whole top row; the six code cards fill
// the two rows below (model·secure·load, then analyze·report·optimize).
export const capstone: SceneSpec = {
  id: 'capstone',
  title: 'End-to-end project',
  canvas: { width: 1060, height: 800 },
  grid: { cols: 3, rows: [0.5, 1.05, 1.05], gap: 0.1, padding: 0.35 },
  nodes: [
    // ── the build flow · the project as a pipeline of steps (the spine), spanning the top row ──
    {
      id: 'cap-flow', label: 'The build · an e-commerce database, end to end', kind: 'container', color: GREEN, cell: [0, 0, 3, 1],
      layout: { cols: 6, rows: 1, gap: 0.1, padding: 0.1 },
      children: [
        { id: 'cap-model', label: 'Model', sub: 'design schema', kind: 'symbol', color: ORANGE, cell: [0, 0] },
        { id: 'cap-secure', label: 'Secure', sub: 'grant access', kind: 'symbol', color: RED, cell: [1, 0] },
        { id: 'cap-load', label: 'Load', sub: 'seed in a txn', kind: 'symbol', color: BLUE, cell: [2, 0] },
        { id: 'cap-analyze', label: 'Analyze', sub: 'join + group', kind: 'symbol', color: GREEN, cell: [3, 0] },
        { id: 'cap-report', label: 'Report', sub: 'window fns', kind: 'symbol', color: TEAL, cell: [4, 0] },
        { id: 'cap-optimize', label: 'Optimize', sub: 'index + EXPLAIN', kind: 'symbol', color: PURPLE, cell: [5, 0] },
      ],
    },

    // ── row 1: model · secure · load ──
    {
      id: 'cap-c1', kind: 'code', filename: '01_model.sql', color: ORANGE, cell: [0, 1],
      label: [
        'CREATE TABLE customers (',
        '  id    bigint PRIMARY KEY,',
        '  name  text NOT NULL,',
        '  email text UNIQUE);',
        '',
        'CREATE TABLE orders (',
        '  id          bigint PRIMARY KEY,',
        '  customer_id bigint REFERENCES customers(id),',
        '  total       numeric CHECK (total >= 0),',
        '  created_at  timestamptz DEFAULT now());',
      ].join('\n'),
    },
    {
      id: 'cap-c2', kind: 'code', filename: '02_secure.sql', color: RED, cell: [1, 1],
      label: [
        'CREATE ROLE app_rw;',
        'CREATE ROLE analyst_ro;',
        '',
        '-- app writes; analysts only read',
        'GRANT SELECT, INSERT, UPDATE',
        '  ON customers, orders TO app_rw;',
        'GRANT SELECT',
        '  ON customers, orders TO analyst_ro;',
      ].join('\n'),
    },
    {
      id: 'cap-c3', kind: 'code', filename: '03_load.sql', color: BLUE, cell: [2, 1],
      label: [
        'BEGIN;',
        '  INSERT INTO customers (id, name, email)',
        "  VALUES (1,'Ann','ann@shop.io'),",
        "         (2,'Bob','bob@shop.io');",
        '',
        '  INSERT INTO orders (id, customer_id, total)',
        '  VALUES (101,1,40), (102,1,25), (103,2,60);',
        'COMMIT;',
      ].join('\n'),
    },

    // ── row 2: analyze · report · optimize ──
    {
      id: 'cap-c4', kind: 'code', filename: '04_analyze.sql', color: GREEN, cell: [0, 2],
      label: [
        '-- revenue per customer',
        'SELECT c.name,',
        '       count(*)      AS orders,',
        '       sum(o.total)  AS revenue',
        'FROM customers c',
        'JOIN orders o ON o.customer_id = c.id',
        'GROUP BY c.name',
        'HAVING sum(o.total) > 50',
        'ORDER BY revenue DESC;',
      ].join('\n'),
    },
    {
      id: 'cap-c5', kind: 'code', filename: '05_report.sql', color: TEAL, cell: [1, 2],
      label: [
        '-- rank customers, running revenue',
        'SELECT name, revenue,',
        '  RANK() OVER (ORDER BY revenue DESC)',
        '    AS rank,',
        '  SUM(revenue) OVER (ORDER BY revenue DESC)',
        '    AS running_total',
        'FROM customer_revenue;',
      ].join('\n'),
    },
    {
      id: 'cap-c6', kind: 'code', filename: '06_optimize.sql', color: PURPLE, cell: [2, 2],
      label: [
        'CREATE INDEX idx_orders_customer_id',
        '  ON orders (customer_id);',
        '',
        'EXPLAIN',
        'SELECT * FROM orders',
        'WHERE customer_id = 42;',
        '-- Seq Scan  ->  Index Scan  ✓',
      ].join('\n'),
    },
  ],
  edges: [
    // the build flow, left to right
    { from: 'cap-model', to: 'cap-secure' },
    { from: 'cap-secure', to: 'cap-load' },
    { from: 'cap-load', to: 'cap-analyze' },
    { from: 'cap-analyze', to: 'cap-report' },
    { from: 'cap-report', to: 'cap-optimize' },
  ],
}
