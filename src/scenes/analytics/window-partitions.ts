import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §3 window-partitions — an aggregate GROUP BY collapses rows; a window function computes over a
// partition but keeps every row. Both cards use categories 2 and 3 (4 products): the window card keeps
// 4 rows and adds the category average and a rank inside the category; the GROUP BY card returns 2.
// The dictionary names the three parts of OVER.
export const windowPartitions: Scene = {
  id: 'window-partitions',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Same average, two shapes', 2, [
      pair({
        id: 'win',
        title: 'window: rows kept',
        file: 'window-partition.sql',
        sql: [
          'SELECT name, price,',
          '  round(avg(price) OVER (',
          '    PARTITION BY category_id), 2) AS cat_avg,',
          '  row_number() OVER (',
          '    PARTITION BY category_id',
          '    ORDER BY price DESC) AS rn',
          'FROM products WHERE category_id IN (2, 3)',
          'ORDER BY category_id, rn;',
        ],
        outs: [{ label: '4 rows in, 4 rows out', headers: ['name', 'price', 'cat_avg', 'rn'], values: [['Bluetooth Speaker', '79.50', '59.25', '1'], ['Retro Cassette Player', '39.00', '59.25', '2'], ['Laptop 14"', '899.00', '509.00', '1'], ['Mechanical Keyboard', '119.00', '509.00', '2']] }],
      }),
      pair({
        id: 'grp',
        title: 'GROUP BY: rows collapsed',
        file: 'group-by-contrast.sql',
        sql: ['SELECT category_id,', '       round(avg(price), 2) AS cat_avg', 'FROM products', 'WHERE category_id IN (2, 3)', 'GROUP BY category_id', 'ORDER BY category_id;'],
        outs: [{ label: '4 rows in, 2 rows out', headers: ['category_id', 'cat_avg'], values: [['2', '59.25'], ['3', '509.00']], pattern: 'warn' }],
      }),
      {
        id: 'parts',
        kind: 'table',
        label: 'the parts of OVER (...)',
        pattern: 'service',
        headers: ['part', 'decides'],
        values: [['PARTITION BY', 'which rows form one group'], ['ORDER BY', 'the order inside the group'], ['frame', 'which rows the function sees']],
      },
    ]),
  ],
}
