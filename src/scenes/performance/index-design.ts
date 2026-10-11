import type { Scene } from '@graphlearning/flow'
import { grid, planPair } from '../pair'

// §4 index-design — CREATE INDEX on customer_id turns the 20 000-row scan into an index lookup (actual
// rows 10). A composite index serves the queries that match its leading column: (status, order_date)
// serves "pending AND date range"; for a date range alone it is a cost decision — the 2-day range shown
// falls back to a sequential scan (110 rows kept of 20 000) while a 7-day range still uses the index
// (it reads the whole index); (order_date, status) is the mirror image. The table summarises the four plans; each cell is asserted
// in db/verify/ch07-performance.sql.
export const indexDesign: Scene = {
  id: 'index-design',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Choose columns for the queries that matter', 2, [
      planPair({
        id: 'single',
        title: 'single-column index',
        file: 'index-single.sql',
        sql: ['CREATE INDEX big_orders_customer_idx', '  ON perf.big_orders (customer_id);', '', 'EXPLAIN (ANALYZE, COSTS OFF,', '         TIMING OFF, SUMMARY OFF)', 'SELECT * FROM perf.big_orders', 'WHERE customer_id = 42;'],
        plans: [{ file: 'plan-index.txt', lines: ['Bitmap Heap Scan on big_orders', '  (actual rows=10 loops=1)', '  ->  Bitmap Index Scan on', '        big_orders_customer_idx', '        (actual rows=10 loops=1)'] }],
      }),
      planPair({
        id: 'comp',
        title: 'composite: lead with the filter',
        file: 'index-composite.sql',
        sql: ['CREATE INDEX big_orders_status_date_idx', '  ON perf.big_orders (status, order_date);', '', 'EXPLAIN (ANALYZE, COSTS OFF,', '         TIMING OFF, SUMMARY OFF)', 'SELECT * FROM perf.big_orders', "WHERE order_date BETWEEN '2025-03-01'", "                    AND '2025-03-02';"],
        plans: [{ file: 'plan-composite.txt', lines: ['Seq Scan on big_orders', '  (actual rows=110 loops=1)', '  Rows Removed by Filter: 19890'] }],
      }),
      {
        id: 'matrix',
        kind: 'table',
        label: 'plan for each index and query shape',
        pattern: 'service',
        headers: ['index', 'status + date range', 'date range only', 'status only'],
        values: [['(status, order_date)', 'index', 'planner decides', 'index'], ['(order_date, status)', 'index', 'index', 'planner decides']],
      },
      { id: 'rule', label: 'lead with the filter', sub: 'later column: check', pattern: 'service', icon: 'none' },
    ]),
  ],
}
