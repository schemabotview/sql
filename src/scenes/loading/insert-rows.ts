import type { Scene } from '@graphlearning/flow'

// §1 insert-rows — three ways to add rows, against the REAL products table (six columns: product_id,
// name, category_id, price, stock, discontinued). The column-list form names what it supplies and lets
// defaults fill the rest — RETURNING shows stock 0 and discontinued f arriving by default. The positional
// form must supply all six in table order and breaks the day a column is added. The multi-row form adds
// three rows in ONE statement (tag INSERT 0 3). Each snippet runs under check:sql.
export const insertRows: Scene = {
  id: 'insert-rows',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'forms',
      label: 'Three ways to add rows',
      pattern: 'group',
      icon: 'none',
      cols: 2,
      children: [
        {
          id: 'g-named',
          label: 'name the columns',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-named',
              kind: 'code',
              filename: 'column-list.sql',
              hug: true,
              label: [
                'INSERT INTO products',
                '  (product_id, name,',
                '   category_id, price)',
                "  VALUES (11, 'USB Cable', 3, 7.50)",
                '  RETURNING product_id, name,',
                '            stock, discontinued;',
              ].join('\n'),
            },
            {
              id: 'r-named',
              kind: 'table',
              label: 'INSERT 0 1 — the row as stored',
              pattern: 'service',
              headers: ['product_id', 'name', 'stock', 'discontinued'],
              values: [['11', 'USB Cable', '0', 'f']],
            },
          ],
          edges: [{ source: 'q-named', target: 'r-named' }],
        },
        {
          id: 'g-pos',
          label: 'positional: all six, in order',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-pos',
              kind: 'code',
              filename: 'positional.sql',
              hug: true,
              label: [
                'INSERT INTO products VALUES',
                "  (12, 'Phone Stand', 3,",
                '   12.00, 25, false);',
                '',
                'SELECT * FROM products',
                '  WHERE product_id = 12;',
              ].join('\n'),
            },
            {
              id: 'r-pos',
              kind: 'table',
              label: 'works — until a column is added',
              pattern: 'warn',
              headers: ['product_id', 'name', 'category_id', 'price', 'stock', 'discontinued'],
              values: [['12', 'Phone Stand', '3', '12.00', '25', 'f']],
            },
          ],
          edges: [{ source: 'q-pos', target: 'r-pos' }],
        },
        {
          id: 'g-many',
          label: 'many rows, one statement',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-many',
              kind: 'code',
              filename: 'multi-row.sql',
              hug: true,
              label: [
                'INSERT INTO products',
                '  (product_id, name, category_id,',
                '   price, stock)',
                'VALUES',
                "  (11, 'USB Cable',   3,  7.50, 40),",
                "  (12, 'Phone Stand', 3, 12.00, 25),",
                "  (13, 'Notebook',    4,  4.50, 90);",
                '',
                'SELECT count(*) AS products FROM products;',
              ].join('\n'),
            },
            {
              id: 'r-many',
              kind: 'table',
              label: 'INSERT 0 3 — then 10 + 3',
              pattern: 'service',
              headers: ['products'],
              values: [['13']],
            },
          ],
          edges: [{ source: 'q-many', target: 'r-many' }],
        },
      ],
    },
  ],
  edges: [],
}
