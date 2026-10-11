import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §2 inner-joins — an inner join keeps only rows with a match. The correct condition pairs each order
// with its customer (11 pairs; customers 7 and 8 have no order so they vanish). The plausible-but-wrong
// condition compares customer_id with order_id: it still runs, returns 9 rows, and pairs order 3
// (Asha's) with Chloe. The 9-row count is asserted in db/verify/ch05-combining.sql.
export const innerJoins: Scene = {
  id: 'inner-joins',
  padding: 0.1,
  flow: 'TB',
  nodes: [
    grid('cards', 'Match on the key; unmatched rows disappear', 2, [
      pair({
        id: 'good',
        title: 'ON the foreign key',
        file: 'inner-join.sql',
        sql: [
          'SELECT c.customer_id, c.first_name,',
          '       o.order_id, o.status',
          'FROM customers c',
          'JOIN orders o',
          '  ON o.customer_id = c.customer_id',
          'ORDER BY o.order_id',
          'LIMIT 4;',
        ],
        outs: [{ label: 'first 4 of 11 pairs', headers: ['customer_id', 'first_name', 'order_id', 'status'], values: [['1', 'Asha', '1', 'delivered'], ['2', 'Ben', '2', 'delivered'], ['1', 'Asha', '3', 'delivered'], ['3', 'Chloe', '4', 'delivered']] }],
      }),
      pair({
        id: 'bad',
        title: 'ON the wrong columns',
        file: 'wrong-key.sql',
        sql: [
          'SELECT c.customer_id, c.first_name,',
          '       o.order_id',
          'FROM customers c',
          'JOIN orders o',
          '  ON c.customer_id = o.order_id',
          'ORDER BY o.order_id',
          'LIMIT 3;',
        ],
        outs: [{ label: 'runs, 9 rows — order 3 is Asha’s, not Chloe’s', headers: ['customer_id', 'first_name', 'order_id'], values: [['1', 'Asha', '1'], ['2', 'Ben', '2'], ['3', 'Chloe', '3']], pattern: 'warn' }],
      }),
    ]),
    grid('facts', 'Reading the 11-row result', 3, [
      { id: 'f-pairs', label: '11 matched pairs', sub: 'one per order', pattern: 'service', icon: 'none' },
      { id: 'f-lost', label: 'customers 7, 8 absent', sub: 'no order to match', pattern: 'warn', icon: 'none' },
      { id: 'f-kept', label: 'no order dropped', sub: 'every order has a customer', pattern: 'service', icon: 'none' },
    ]),
  ],
  edges: [{ source: 'cards', target: 'facts' }],
}
