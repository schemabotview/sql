import type { Scene } from '@graphlearning/flow'

// §5 keys-wishlist — keys as promises, each shown refusing the thing it exists to refuse. A composite
// PRIMARY KEY (a customer may wish for a product once) and a UNIQUE constraint on the REAL
// customers.email column. The two failures are real PostgreSQL errors, kept honest by `-- expect-error`
// snippets. The table beneath answers the design question — natural, composite or surrogate? — with
// keys the shop already uses.
export const keysWishlist: Scene = {
  id: 'keys-wishlist',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'composite',
      label: 'A composite PRIMARY KEY — one wish per customer per product',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-pk',
          kind: 'code',
          filename: 'composite-key.sql',
          hug: true,
          label: [
            '-- expect-error: 2nd insert repeats the pair',
            'CREATE TABLE wishlist (',
            '  customer_id integer,',
            '  product_id  integer,',
            '  PRIMARY KEY (customer_id, product_id));',
            'INSERT INTO wishlist VALUES (1, 4);',
            'INSERT INTO wishlist VALUES (1, 4);',
          ].join('\n'),
        },
        {
          id: 'pk-out',
          label: 'what PostgreSQL does',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'wishlist',
              kind: 'table',
              label: 'wishlist',
              pattern: 'storage',
              columns: [
                { name: 'customer_id', type: 'integer', key: 'PK' },
                { name: 'product_id', type: 'integer', key: 'PK' },
              ],
            },
            { id: 'e-pk', label: 'duplicate key value', pattern: 'warn', icon: 'triangleAlert', sub: 'violates "wishlist_pkey"' },
          ],
        },
      ],
      edges: [{ source: 'q-pk', target: 'pk-out' }],
    },
    {
      id: 'unique',
      label: 'UNIQUE — not the key, but still one of a kind',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-uq',
          kind: 'code',
          filename: 'unique.sql',
          hug: true,
          label: [
            '-- expect-error: that email is taken',
            'INSERT INTO customers',
            '  (customer_id, first_name, last_name,',
            '   email, city, country, signup_date)',
            "VALUES (50, 'A', 'B',",
            "  'asha.rao@example.com',",
            "  'X', 'Y', '2025-01-01');",
          ].join('\n'),
        },
        { id: 'e-uq', label: 'email is taken', pattern: 'warn', icon: 'triangleAlert', sub: 'customers_email_key' },
      ],
      edges: [{ source: 'q-uq', target: 'e-uq' }],
    },
    {
      id: 'choice',
      kind: 'table',
      label: 'Which kind of key? — three the shop already uses',
      pattern: 'storage',
      headers: ['key', 'kind', 'why'],
      values: [
        ['customers.customer_id', 'surrogate', 'no stable natural column'],
        ['order_items (order_id, line_no)', 'composite', 'a line exists only within an order'],
        ['customers.email', 'unique, not PK', 'unique, but people change it'],
      ],
    },
  ],
  edges: [
    { source: 'composite', target: 'unique' },
    { source: 'unique', target: 'choice' },
  ],
}
