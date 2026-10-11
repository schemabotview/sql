import type { Scene } from '@graphlearning/flow'

// §7 metadata-queries — the database describing itself, three questions and their real answers. The
// first lists the tables with their column counts (the shop is 8 tables); the second reads one table's
// columns with type and nullability (employee_id is the only nullable one in orders); the third reads
// its key constraints by name — the very names that appear in error messages. information_schema is
// the SQL-standard view; the tile says the system catalogue behind it is product-specific, and names
// PostgreSQL's only because that is the one engine this course runs.
export const metadataQueries: Scene = {
  id: 'metadata-queries',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'ask',
      label: 'Ask the database about itself',
      pattern: 'group',
      icon: 'none',
      cols: 2,
      children: [
        {
          id: 'g-tables',
          label: '1 · which tables?',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-tables',
              kind: 'code',
              filename: 'tables.sql',
              hug: true,
              label: [
                'SELECT table_name, count(*) AS columns',
                'FROM information_schema.columns',
                "WHERE table_schema = 'shop'",
                'GROUP BY table_name',
                'ORDER BY table_name;',
              ].join('\n'),
            },
            {
              id: 'r-tables',
              kind: 'table',
              label: '8 tables',
              pattern: 'service',
              headers: ['table_name', 'columns'],
              values: [
                ['categories', '3'],
                ['customers', '8'],
                ['employees', '6'],
                ['order_items', '5'],
                ['orders', '5'],
                ['payments', '5'],
                ['products', '6'],
                ['reviews', '6'],
              ],
            },
          ],
          edges: [{ source: 'q-tables', target: 'r-tables' }],
        },
        {
          id: 'g-cols',
          label: '2 · which columns?',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-cols',
              kind: 'code',
              filename: 'columns.sql',
              hug: true,
              label: [
                'SELECT column_name, data_type,',
                '       is_nullable',
                'FROM information_schema.columns',
                "WHERE table_schema = 'shop'",
                "  AND table_name = 'orders'",
                'ORDER BY ordinal_position;',
              ].join('\n'),
            },
            {
              id: 'r-cols',
              kind: 'table',
              label: 'orders — only employee_id may be NULL',
              pattern: 'service',
              headers: ['column_name', 'data_type', 'is_nullable'],
              values: [
                ['order_id', 'integer', 'NO'],
                ['customer_id', 'integer', 'NO'],
                ['employee_id', 'integer', 'YES'],
                ['order_date', 'date', 'NO'],
                ['status', 'text', 'NO'],
              ],
            },
          ],
          edges: [{ source: 'q-cols', target: 'r-cols' }],
        },
      ],
    },
    {
      id: 'keys',
      label: '3 · which keys? — the names that appear in errors',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-keys',
          kind: 'code',
          filename: 'constraints.sql',
          hug: true,
          label: [
            'SELECT constraint_name, constraint_type',
            'FROM information_schema.table_constraints',
            "WHERE table_schema = 'shop'",
            "  AND table_name = 'orders'",
            "  AND constraint_type IN ('PRIMARY KEY',",
            "    'FOREIGN KEY', 'UNIQUE')",
            'ORDER BY constraint_name;',
          ].join('\n'),
        },
        {
          id: 'r-keys',
          kind: 'table',
          label: 'result — 3 constraints',
          pattern: 'service',
          headers: ['constraint_name', 'constraint_type'],
          values: [
            ['orders_customer_id_fkey', 'FOREIGN KEY'],
            ['orders_employee_id_fkey', 'FOREIGN KEY'],
            ['orders_pkey', 'PRIMARY KEY'],
          ],
        },
        { id: 'note', label: 'standard view, product catalogue', variant: 'tile', pattern: 'network', icon: 'book', sub: 'PostgreSQL keeps its own in pg_catalog' },
      ],
      edges: [{ source: 'q-keys', target: 'r-keys' }],
    },
  ],
  edges: [{ source: 'ask', target: 'keys' }],
}
