import type { Scene, SceneNode } from '@graphlearning/flow'

// §3 key-integrity — the four core tables of the shop with their keys, and three real refusals.
// Only key columns are drawn (the board says so): chapter 2 shows each table in full. The PK/FK
// badges are the whole subject; the edges run parent → child, so one customer, MANY orders is read
// by following a line down. Each refusal is a real PostgreSQL error from db/seed.sql, kept honest by
// an `-- expect-error` snippet. The statements are explained in chapters 3 and 8; here the reader
// is meant to read the ERRORS, which is why the slide says so.
const table = (node: Pick<SceneNode, 'id' | 'label' | 'columns'>): SceneNode => ({ kind: 'table', pattern: 'storage', ...node })

export const keyIntegrity: Scene = {
  id: 'key-integrity',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'core',
      label: 'The four core tables — key columns only',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        table({ id: 'customers', label: 'customers', columns: [{ name: 'customer_id', type: 'integer', key: 'PK' }, { name: 'email', type: 'text' }] }),
        {
          id: 'middle',
          label: 'orders and products',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            table({
              id: 'orders',
              label: 'orders',
              columns: [
                { name: 'order_id', type: 'integer', key: 'PK' },
                { name: 'customer_id', type: 'integer', key: 'FK' },
              ],
            }),
            table({ id: 'products', label: 'products', columns: [{ name: 'product_id', type: 'integer', key: 'PK' }, { name: 'price', type: 'numeric' }] }),
          ],
        },
        table({
          id: 'order_items',
          label: 'order_items',
          columns: [
            { name: 'order_id', type: 'integer', key: 'PK' },
            { name: 'line_no', type: 'integer', key: 'PK' },
            { name: 'product_id', type: 'integer', key: 'FK' },
          ],
        }),
      ],
      edges: [
        { source: 'customers', target: 'orders' },
        { source: 'orders', target: 'order_items' },
        { source: 'products', target: 'order_items' },
      ],
    },
    {
      id: 'refusals',
      label: 'Three refusals — read the errors, not the syntax',
      pattern: 'group',
      icon: 'none',
      cols: 3,
      children: [
        {
          id: 'g-fk',
          label: 'a foreign key needs a parent',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-fk',
              kind: 'code',
              filename: 'no-parent.sql',
              hug: true,
              label: [
                '-- expect-error: no customer 99',
                'INSERT INTO orders',
                '  (order_id, customer_id,',
                '   order_date, status)',
                "  VALUES (99, 99,",
                "   '2025-04-01', 'pending');",
              ].join('\n'),
            },
            { id: 'e-fk', label: 'no customer 99', pattern: 'warn', icon: 'triangleAlert', sub: 'foreign key refuses' },
          ],
          edges: [{ source: 'q-fk', target: 'e-fk' }],
        },
        {
          id: 'g-ref',
          label: 'a parent in use stays',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-ref',
              kind: 'code',
              filename: 'still-referenced.sql',
              hug: true,
              label: [
                '-- expect-error: orders use 1',
                'DELETE FROM customers',
                '  WHERE customer_id = 1;',
              ].join('\n'),
            },
            { id: 'e-ref', label: 'still referenced', pattern: 'warn', icon: 'lock', sub: 'by orders 1, 3, 9' },
          ],
          edges: [{ source: 'q-ref', target: 'e-ref' }],
        },
        {
          id: 'g-pk',
          label: 'a primary key is unique',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-pk',
              kind: 'code',
              filename: 'duplicate-key.sql',
              hug: true,
              label: [
                '-- expect-error: (1, 1) exists',
                'INSERT INTO order_items',
                '  VALUES (1, 1, 2, 1, 149.00);',
              ].join('\n'),
            },
            { id: 'e-pk', label: 'duplicate key', pattern: 'warn', icon: 'triangleAlert', sub: 'order_items_pkey' },
          ],
          edges: [{ source: 'q-pk', target: 'e-pk' }],
        },
      ],
    },
  ],
  edges: [{ source: 'core', target: 'refusals' }],
}
