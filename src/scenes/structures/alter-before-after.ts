import type { Scene } from '@graphlearning/flow'

// §8 alter-before-after — the table as it was, the ALTERs, the table as it is. Three changes show in
// the after-shape — a new column, a renamed one, a changed type — so the reader can diff the two
// boards by eye. Beneath, the trap that catches everyone once: adding a NOT NULL column to a table
// that already has rows fails, because those rows would have no value; a DEFAULT gives them one.
// Both snippets run for real.
export const alterBeforeAfter: Scene = {
  id: 'alter-before-after',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'story',
      label: 'Change the structure — rows survive',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-alter',
          kind: 'code',
          filename: 'alter.sql',
          hug: true,
          label: [
            'CREATE TABLE wishlist (',
            '  customer_id integer,',
            '  product_id  integer,',
            '  added_on    date,',
            '  priority    integer);',
            '',
            'ALTER TABLE wishlist',
            '  ADD COLUMN owner integer',
            '  NOT NULL DEFAULT 1;',
            'ALTER TABLE wishlist',
            '  RENAME COLUMN added_on TO added;',
            'ALTER TABLE wishlist',
            '  ALTER COLUMN priority TYPE bigint;',
          ].join('\n'),
        },
        {
          id: 'shapes',
          label: 'before → after',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'before',
              kind: 'table',
              label: 'before',
              pattern: 'storage',
              columns: [
                { name: 'customer_id', type: 'integer' },
                { name: 'product_id', type: 'integer' },
                { name: 'added_on', type: 'date' },
                { name: 'priority', type: 'integer' },
              ],
            },
            {
              id: 'after',
              kind: 'table',
              label: 'after',
              pattern: 'service',
              columns: [
                { name: 'customer_id', type: 'integer' },
                { name: 'product_id', type: 'integer' },
                { name: 'added', type: 'date' },
                { name: 'priority', type: 'bigint' },
                { name: 'owner', type: 'integer' },
              ],
            },
          ],
          edges: [{ source: 'before', target: 'after' }],
        },
      ],
      edges: [{ source: 'q-alter', target: 'shapes' }],
    },
    {
      id: 'trap',
      label: 'The trap: NOT NULL on a table that has rows',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-trap',
          kind: 'code',
          filename: 'not-null-trap.sql',
          hug: true,
          label: [
            '-- expect-error: old rows would be NULL',
            'CREATE TABLE wishlist (customer_id integer);',
            'INSERT INTO wishlist VALUES (1);',
            'ALTER TABLE wishlist',
            '  ADD COLUMN owner integer NOT NULL;',
          ].join('\n'),
        },
        {
          id: 'e-trap',
          label: 'contains null values',
          pattern: 'warn',
          icon: 'triangleAlert',
          sub: 'add a DEFAULT, or fill first',
        },
      ],
      edges: [{ source: 'q-trap', target: 'e-trap' }],
    },
  ],
  edges: [{ source: 'story', target: 'trap' }],
}
