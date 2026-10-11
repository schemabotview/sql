import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §6 compare-alternatives — one query (pending orders in 1-7 March, 54 rows) against five designs, each
// built in a rolled-back transaction. Measures: rows examined (rows returned + removed by filter),
// heap pages visited, index size in bytes. No timings: they vary by machine. The composite index
// examines exactly the 54 rows it returns; the cost is 180 224 bytes of index and one more structure to
// maintain on every INSERT, UPDATE of its columns and DELETE. Every figure is asserted (or bounded) in
// db/verify/ch07-performance.sql; sizes are PostgreSQL 16 on 8 kB pages.
export const compareAlternatives: Scene = {
  id: 'compare-alternatives',
  padding: 0.1,
  flow: 'TB',
  edges: [{ source: 'g-measure', target: 'result' }],
  nodes: [
    pair({
      id: 'measure',
      title: 'measure one alternative',
      file: 'measure.sql',
      sql: [
        'CREATE INDEX big_orders_status_date_idx',
        '  ON perf.big_orders (status, order_date);',
        '',
        'EXPLAIN (ANALYZE, COSTS OFF,',
        '         TIMING OFF, SUMMARY OFF)',
        'SELECT * FROM perf.big_orders',
        "WHERE status = 'pending'",
        "  AND order_date BETWEEN '2025-03-01'",
        "                    AND '2025-03-07';",
        '',
        "SELECT pg_relation_size(",
        "  'perf.big_orders_status_date_idx') AS index_bytes;",
      ],
      outs: [{ label: 'the cost of this design on disk', headers: ['index_bytes'], values: [['180224']] }],
    }),
    grid('result', 'Six designs, one query', 2, [
      {
        id: 'alts',
        kind: 'table',
        label: 'annotated measurements (54 rows returned)',
        pattern: 'service',
        headers: ['design', 'scan', 'rows examined', 'heap pages', 'index bytes'],
        values: [
          ['no index', 'sequential', '20 000', 'all 148', '0'],
          ['(status)', 'bitmap', '2 800', '148', '163 840'],
          ['(order_date)', 'bitmap', '385', '57', '163 840'],
          ['(status, order_date)', 'bitmap', '54', '54', '180 224'],
          ['(order_date, status)', 'bitmap', '54', '54', '180 224'],
          ['(order_date) + (status)', 'bitmap and', '54', '54', '327 680'],
        ],
      },
      { id: 'write', label: 'the price of every index', sub: 'extra storage, extra work on each write', pattern: 'warn', icon: 'triangleAlert' },
    ]),
  ],
}
