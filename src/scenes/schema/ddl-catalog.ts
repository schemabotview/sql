import type { Scene } from '@graphlearning/flow'

// §8 ddl-catalog — the course's one CODE card, and the right place for it: DDL is the section where
// the design finally becomes text you type. The card carries the whole story of §3–§7 in one
// statement — columns and types (§4), a PRIMARY KEY (§5), NOT NULL / UNIQUE / DEFAULT (§7) — then
// ALTER adds the FOREIGN KEY, showing the model evolving in place.
//
// Below it, what the statement actually WRITES TO. That is the section's real point: DDL does not
// move data, it edits the database's record of itself. Lines are kept ≤76 cols (CODE_MIN_COLS) —
// a wider card renders its type smaller once fitView scales the scene — and a SQL card carries no
// `sub`, which codeLines() would append as a `#` comment rather than `--`.
export const ddlCatalog: Scene = {
  id: 'ddl-catalog',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'ddl-code',
      kind: 'code',
      filename: 'schema.sql',
      label: [
        'CREATE TABLE customers (',
        '  id         bigserial   PRIMARY KEY,',
        '  name       text        NOT NULL,',
        '  email      text        UNIQUE,',
        '  created_at timestamptz DEFAULT now()',
        ');',
        '',
        'ALTER TABLE orders',
        '  ADD CONSTRAINT orders_customer_fk',
        '  FOREIGN KEY (customer_id) REFERENCES customers (id);',
      ].join('\n'),
    },
    {
      id: 'catalog',
      label: 'The catalog — what the statement actually changes',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'cat-tables', label: 'tables', variant: 'tile', pattern: 'storage', icon: 'table' },
        { id: 'cat-columns', label: 'columns', variant: 'tile', pattern: 'storage', icon: 'layers' },
        { id: 'cat-constraints', label: 'constraints', variant: 'tile', pattern: 'service', icon: 'shieldcheck' },
        { id: 'cat-views', label: 'views', variant: 'tile', pattern: 'user', icon: 'scroll' },
      ],
    },
  ],
  edges: [{ source: 'ddl-code', target: 'catalog', label: 'DDL writes METADATA — not a single row of data moves' }],
}
