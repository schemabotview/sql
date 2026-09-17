import type { Scene } from '@graphlearning/flow'

// §2 insert-forms — a CODE card, because the section's claim IS the forms: one row, many rows, and
// the result of a query. A diagram of INSERT would be a box labelled INSERT. The band below carries
// the two things the narration adds beyond syntax — the upsert, and the fact that everything the
// schema course built still stands guard on the way in.
//
// Lines are kept ≤76 cols (CODE_MIN_COLS) and the card takes no `sub` — codeLines() would append it
// as a `#` comment, which is Python's syntax, not SQL's.
export const insertForms: Scene = {
  id: 'insert-forms',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'insert-code',
      kind: 'code',
      filename: 'insert.sql',
      label: [
        'INSERT INTO customers (name, email)',
        "VALUES ('Mei', 'mei@shop.io');",
        '',
        'INSERT INTO customers (name, email) VALUES',
        "  ('Ivan', 'ivan@shop.io'),",
        "  ('Sara', 'sara@shop.io');",
        '',
        'INSERT INTO archive_orders',
        "SELECT * FROM orders WHERE placed_at < '2025-01-01'",
        'RETURNING id;',
      ].join('\n'),
    },
    {
      id: 'on-the-way-in',
      label: 'Still checked on the way in',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'ins-upsert', label: 'ON CONFLICT', pattern: 'network', icon: 'gitbranch', sub: 'insert, or update it' },
        { id: 'ins-reject', label: 'A bad row is rejected', pattern: 'warn', sub: 'type, NOT NULL, key' },
      ],
    },
  ],
  edges: [{ source: 'insert-code', target: 'on-the-way-in', label: 'the constraints from course 1 are still standing' }],
}
