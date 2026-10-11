import type { Scene } from '@graphlearning/flow'
import { grid, planPair } from '../pair'

// §5 index-friendly — an index on order_date exists in both cases. Wrapping the column in a function
// (extract(month FROM order_date) = 3) hides it, so all 20 000 rows are read; the equivalent range
// (>= 2025-03-01 AND < 2025-04-01) uses the index and touches only the 1705 March rows. Selectivity
// matters too: with an index on status, 'cancelled' (400 rows) uses it, 'delivered' (16 800 of
// 20 000) does not — reading most of the table by index would be slower than scanning it.
export const indexFriendly: Scene = {
  id: 'index-friendly',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Same answer, different work', 2, [
      planPair({
        id: 'func',
        title: 'function on the column',
        file: 'sargable.sql',
        sql: [
          'CREATE INDEX big_orders_date_idx',
          '  ON perf.big_orders (order_date);',
          '',
          'EXPLAIN (ANALYZE, COSTS OFF,',
          '         TIMING OFF, SUMMARY OFF)',
          'SELECT * FROM perf.big_orders',
          'WHERE extract(month FROM order_date) = 3;',
          '',
          'EXPLAIN (ANALYZE, COSTS OFF,',
          '         TIMING OFF, SUMMARY OFF)',
          'SELECT * FROM perf.big_orders',
          "WHERE order_date >= '2025-03-01'",
          "  AND order_date <  '2025-04-01';",
        ],
        plans: [
          { file: 'plan-function.txt', lines: ['Seq Scan on big_orders', '  (actual rows=1705 loops=1)', '  Rows Removed by Filter: 18295'] },
          { file: 'plan-range.txt', lines: ['Bitmap Heap Scan on big_orders', '  (actual rows=1705 loops=1)', '  ->  Bitmap Index Scan on', '        big_orders_date_idx', '        (actual rows=1705 loops=1)'] },
        ],
      }),
      planPair({
        id: 'sel',
        title: 'selectivity decides',
        file: 'selectivity.sql',
        sql: [
          'CREATE INDEX big_orders_status_idx',
          '  ON perf.big_orders (status);',
          '',
          'EXPLAIN (ANALYZE, COSTS OFF,',
          '         TIMING OFF, SUMMARY OFF)',
          'SELECT * FROM perf.big_orders',
          "WHERE status = 'cancelled';",
          '',
          'EXPLAIN (ANALYZE, COSTS OFF,',
          '         TIMING OFF, SUMMARY OFF)',
          'SELECT * FROM perf.big_orders',
          "WHERE status = 'delivered';",
        ],
        plans: [
          { file: 'plan-rare.txt', lines: ['Bitmap Heap Scan on big_orders', '  (actual rows=400 loops=1)', '  ->  Bitmap Index Scan on', '        big_orders_status_idx', '        (actual rows=400 loops=1)'] },
          { file: 'plan-common.txt', lines: ['Seq Scan on big_orders', '  (actual rows=16800 loops=1)', '  Rows Removed by Filter: 3200'] },
        ],
      }),
      planPair({
        id: 'cast',
        title: 'cast on the column',
        file: 'cast.sql',
        sql: [
          'CREATE INDEX big_orders_customer_idx',
          '  ON perf.big_orders (customer_id);',
          '',
          'EXPLAIN (ANALYZE, COSTS OFF,',
          '         TIMING OFF, SUMMARY OFF)',
          'SELECT * FROM perf.big_orders',
          "WHERE customer_id::text = '42';",
          '',
          'EXPLAIN (ANALYZE, COSTS OFF,',
          '         TIMING OFF, SUMMARY OFF)',
          'SELECT * FROM perf.big_orders',
          'WHERE customer_id = 42;',
        ],
        plans: [
          { file: 'plan-cast.txt', lines: ['Seq Scan on big_orders', '  (actual rows=10 loops=1)', '  Rows Removed by Filter: 19990'] },
          { file: 'plan-bare.txt', lines: ['Bitmap Heap Scan on big_orders', '  (actual rows=10 loops=1)', '  ->  Bitmap Index Scan on', '        big_orders_customer_idx', '        (actual rows=10 loops=1)'] },
        ],
      }),
      {
        id: 'rewrite',
        kind: 'table',
        label: 'keep the column bare: rewrites',
        pattern: 'service',
        headers: ['hides the index', 'index-friendly'],
        values: [['extract(month FROM d) = 3', 'd >= start AND d < next'], ['customer_id::text = \'42\'', 'customer_id = 42'], ['f(col) = value', 'col = inverse(value)'], ['most rows match', 'expect a scan']],
      },
    ]),
  ],
}
