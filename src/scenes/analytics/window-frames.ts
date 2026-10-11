import type { Scene } from '@graphlearning/flow'
import { pair } from '../pair'

// §4 window-frames — with ORDER BY, the default frame stops at the CURRENT ROW *and its peers*
// (RANGE). ROWS stops at the row itself. Orders 1 and 2 share 2025-03-01, 5 and 6 share 03-06, and
// 9, 10, 11 share 03-12: rows_sum differs from range_sum exactly on tied dates. The window result is
// the real output of one query; the dictionary defines the frame words.
export const windowFrames: Scene = {
  id: 'window-frames',
  padding: 0.1,
  flow: 'LR',
  nodes: [
    pair({
      id: 'frames',
      title: 'ROWS versus RANGE',
      file: 'window-frames.sql',
      sql: [
        'WITH d AS (',
        '  SELECT o.order_id, o.order_date,',
        '    sum(i.quantity * i.unit_price) AS total',
        '  FROM orders o JOIN order_items i USING (order_id)',
        "  WHERE o.status <> 'cancelled' GROUP BY 1, 2)",
        'SELECT order_id, order_date, total,',
        '  sum(total) OVER (ORDER BY order_date',
        '    ROWS BETWEEN UNBOUNDED PRECEDING',
        '    AND CURRENT ROW) AS rows_sum,',
        '  sum(total) OVER (ORDER BY order_date',
        '    RANGE BETWEEN UNBOUNDED PRECEDING',
        '    AND CURRENT ROW) AS range_sum',
        'FROM d ORDER BY order_date, order_id;',
      ],
      outs: [
        {
          label: 'they differ only on tied dates',
          headers: ['order_id', 'order_date', 'total', 'rows_sum', 'range_sum'],
          values: [
            ['1', '2025-03-01', '118.80', '118.80', '1017.80'],
            ['2', '2025-03-01', '899.00', '1017.80', '1017.80'],
            ['3', '2025-03-02', '193.00', '1210.80', '1210.80'],
            ['4', '2025-03-03', '159.00', '1369.80', '1369.80'],
            ['5', '2025-03-06', '187.00', '1556.80', '1674.80'],
            ['6', '2025-03-06', '118.00', '1674.80', '1674.80'],
            ['7', '2025-03-07', '73.90', '1748.70', '1748.70'],
            ['9', '2025-03-12', '149.00', '1897.70', '3017.70'],
            ['10', '2025-03-12', '1018.00', '2915.70', '3017.70'],
            ['11', '2025-03-12', '102.00', '3017.70', '3017.70'],
          ],
        },
      ],
    }),
    {
      id: 'words',
      kind: 'table',
      label: 'frame vocabulary',
      pattern: 'service',
      headers: ['word', 'meaning'],
      values: [['ROWS', 'count physical rows'], ['RANGE', 'include peers with equal ORDER BY value'], ['CURRENT ROW', 'this row (RANGE: and its peers)'], ['UNBOUNDED PRECEDING', 'from the first row of the partition']],
    },
  ],
  edges: [{ source: 'g-frames', target: 'words' }],
}
