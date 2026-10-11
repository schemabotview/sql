import type { Scene } from '@graphlearning/flow'

// §4 types-defaults — one table definition, read four ways. The dictionary says what each column is;
// the first card shows an INSERT naming two columns and what is actually stored (defaults fill in,
// and `note`, which has none, is NULL); the second shows exact numeric against binary floating point
// and numeric(8,2) rounding half up (12.345 → 12.35); the third shows the precision limit refusing a
// value that does not fit; the fourth shows an IDENTITY column handing out ids 1 and 2.
// `added_on` defaults to current_date, so it is left out of the result (it changes every day).
export const typesDefaults: Scene = {
  id: 'types-defaults',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'dict',
      kind: 'table',
      label: 'wishlist — each column: a type, maybe a default',
      pattern: 'storage',
      headers: ['column', 'type', 'default'],
      values: [
        ['customer_id', 'integer', '—'],
        ['product_id', 'integer', '—'],
        ['added_on', 'date', 'current_date'],
        ['priority', 'integer', '3'],
        ['note', 'text', '—  (so NULL)'],
        ['gift', 'boolean', 'false'],
      ],
    },
    {
      id: 'cards',
      label: 'Read the definition four ways',
      pattern: 'group',
      icon: 'none',
      cols: 2,
      children: [
        {
          id: 'g-defaults',
          label: 'defaults fill the gaps',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-defaults',
              kind: 'code',
              filename: 'defaults.sql',
              hug: true,
              label: [
                'CREATE TABLE wishlist (',
                '  customer_id integer,',
                '  product_id  integer,',
                '  added_on date DEFAULT current_date,',
                '  priority integer DEFAULT 3,',
                '  note     text,',
                '  gift     boolean DEFAULT false);',
                'INSERT INTO wishlist',
                '  (customer_id, product_id)',
                '  VALUES (1, 4);',
                'SELECT customer_id, product_id,',
                '  priority, gift, note FROM wishlist;',
              ].join('\n'),
            },
            {
              id: 'r-defaults',
              kind: 'table',
              label: 'one row stored',
              pattern: 'service',
              headers: ['customer_id', 'product_id', 'priority', 'gift', 'note'],
              values: [['1', '4', '3', 'f', 'NULL']],
            },
          ],
          edges: [{ source: 'q-defaults', target: 'r-defaults' }],
        },
        {
          id: 'g-exact',
          label: 'precision and exactness',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-exact',
              kind: 'code',
              filename: 'exact.sql',
              hug: true,
              label: [
                'SELECT 0.1 + 0.2 = 0.3 AS numeric_eq,',
                '  0.1::double precision + 0.2 = 0.3',
                '    AS float_eq,',
                '  12.345::numeric(8,2) AS rounded;',
              ].join('\n'),
            },
            {
              id: 'r-exact',
              kind: 'table',
              label: 'money wants numeric',
              pattern: 'warn',
              headers: ['numeric_eq', 'float_eq', 'rounded'],
              values: [['t', 'f', '12.35']],
            },
            {
              id: 'q-overflow',
              kind: 'code',
              filename: 'overflow.sql',
              hug: true,
              label: ['-- expect-error: needs 7 digits before the point', 'SELECT 1234567.891::numeric(8,2);'].join('\n'),
            },
            { id: 'e-overflow', label: 'numeric field overflow', pattern: 'warn', icon: 'triangleAlert', sub: 'precision 8, scale 2' },
          ],
          edges: [
            { source: 'q-exact', target: 'r-exact' },
            { source: 'q-overflow', target: 'e-overflow' },
          ],
        },
        {
          id: 'g-ident',
          label: 'generated values',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-ident',
              kind: 'code',
              filename: 'identity.sql',
              hug: true,
              label: [
                'CREATE TABLE tag (',
                '  id integer GENERATED ALWAYS',
                '     AS IDENTITY PRIMARY KEY,',
                '  label text);',
                "INSERT INTO tag (label)",
                "  VALUES ('gift'), ('sale');",
                'SELECT * FROM tag ORDER BY id;',
              ].join('\n'),
            },
            {
              id: 'r-ident',
              kind: 'table',
              label: 'ids chosen by the database',
              pattern: 'service',
              headers: ['id', 'label'],
              values: [
                ['1', 'gift'],
                ['2', 'sale'],
              ],
            },
          ],
          edges: [{ source: 'q-ident', target: 'r-ident' }],
        },
      ],
    },
  ],
  edges: [{ source: 'dict', target: 'cards' }],
}
