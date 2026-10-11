import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §8 ordering-paging — a table has no order, so a result has none unless ORDER BY gives one, and a tie
// needs a tie-breaker: orders 1 and 2 share a date, so `ORDER BY order_date, order_id` is
// deterministic and `ORDER BY order_date` alone is not. Pagination: OFFSET and keyset both return page
// two (orders 4, 5, 6) here, but only because the order is total; the slide says what each costs.
// NULL placement is a dialect detail: PostgreSQL sorts NULLs last ascending, and NULLS FIRST flips it.
export const orderingPaging: Scene = {
  id: 'ordering-paging',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    grid('cards', 'Order, limit, and page', 2, [
      pair({
        id: 'tie',
        title: 'a tie-breaker makes it deterministic',
        file: 'tie-break.sql',
        sql: ['SELECT order_id, order_date', 'FROM orders', 'ORDER BY order_date, order_id', 'LIMIT 5;'],
        outs: [{ label: 'orders 1 and 2 tie on date', headers: ['order_id', 'order_date'], values: [['1', '2025-03-01'], ['2', '2025-03-01'], ['3', '2025-03-02'], ['4', '2025-03-03'], ['5', '2025-03-06']] }],
      }),
      pair({
        id: 'pages',
        title: 'page 2, two ways',
        file: 'paging.sql',
        sql: ['SELECT order_id FROM orders', 'ORDER BY order_id', 'LIMIT 3 OFFSET 3;', '', 'SELECT order_id FROM orders', 'WHERE order_id > 3', 'ORDER BY order_id', 'LIMIT 3;'],
        outs: [
          { label: 'OFFSET: skip 3, take 3', headers: ['order_id'], values: [['4'], ['5'], ['6']] },
          { label: 'keyset: after id 3', headers: ['order_id'], values: [['4'], ['5'], ['6']] },
        ],
      }),
      pair({
        id: 'nulls',
        title: 'where do NULLs sort?',
        file: 'nulls.sql',
        sql: ['SELECT order_id, employee_id', 'FROM orders', 'ORDER BY employee_id NULLS FIRST,', '         order_id', 'LIMIT 4;'],
        outs: [{ label: 'NULLS FIRST: no sales rep', headers: ['order_id', 'employee_id'], values: [['2', 'NULL'], ['4', 'NULL'], ['6', 'NULL'], ['8', 'NULL']] }],
      }),
    ]),
  ],
  edges: [],
}
