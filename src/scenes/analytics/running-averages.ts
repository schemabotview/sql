import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §6 running-averages — daily revenue (non-cancelled orders) over the six dates that have orders. A
// running total is sum() with the default frame; a moving average needs an explicit frame, here ROWS
// BETWEEN 2 PRECEDING AND CURRENT ROW. Limitation, visible in the data: it averages three ROWS, and
// 2025-03-12 follows 2025-03-07 after a five-day gap, so "3-day" would be a false description.
export const runningAverages: Scene = {
  id: 'running-averages',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Running totals and moving averages', 2, [
      pair({
        id: 'run',
        title: 'running total and 3-row average',
        file: 'running.sql',
        sql: [
          'WITH d AS (',
          '  SELECT o.order_date,',
          '         sum(i.quantity * i.unit_price) AS rev',
          '  FROM orders o JOIN order_items i USING (order_id)',
          "  WHERE o.status <> 'cancelled' GROUP BY 1)",
          'SELECT order_date, rev,',
          '  sum(rev) OVER (ORDER BY order_date) AS running,',
          '  round(avg(rev) OVER (ORDER BY order_date',
          '    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW),',
          '    2) AS avg3',
          'FROM d ORDER BY order_date;',
        ],
        outs: [{ label: 'six dates with orders', headers: ['order_date', 'rev', 'running', 'avg3'], values: [['2025-03-01', '1017.80', '1017.80', '1017.80'], ['2025-03-02', '193.00', '1210.80', '605.40'], ['2025-03-03', '159.00', '1369.80', '456.60'], ['2025-03-06', '305.00', '1674.80', '219.00'], ['2025-03-07', '73.90', '1748.70', '179.30'], ['2025-03-12', '1269.00', '3017.70', '549.30']] }],
      }),
      {
        id: 'how',
        kind: 'table',
        label: 'reading the two columns',
        pattern: 'service',
        headers: ['column', 'frame', 'meaning'],
        values: [['running', 'start to current', 'everything so far'], ['avg3', '2 before to current', 'the last 3 rows'], ['row 1', 'only 1 row exists', 'avg3 = rev'], ['03-12', 'rows 03-06, 03-07, 03-12', 'spans a 5-day gap']],
      },
    ]),
  ],
}
