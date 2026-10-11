import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §7 lag-lead — LAG(x) reads the previous row in the window's order, LEAD(x) the next. The first row
// has no previous value (NULL), the last has no next. "Previous" means previous ROW, not previous day:
// 2025-03-06 follows 2025-03-03 after a two-day gap, so the "change" compares non-adjacent dates. A
// named WINDOW clause avoids repeating the definition.
export const lagLead: Scene = {
  id: 'lag-lead',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Compare a row with its neighbours', 2, [
      pair({
        id: 'lag',
        title: 'previous and next row',
        file: 'lag-lead.sql',
        sql: [
          'WITH d AS (',
          '  SELECT o.order_date,',
          '         sum(i.quantity * i.unit_price) AS rev',
          '  FROM orders o JOIN order_items i USING (order_id)',
          "  WHERE o.status <> 'cancelled' GROUP BY 1)",
          'SELECT order_date, rev,',
          '  lag(rev) OVER w AS prev,',
          '  rev - lag(rev) OVER w AS change,',
          '  lead(order_date) OVER w AS next_day',
          'FROM d WINDOW w AS (ORDER BY order_date)',
          'ORDER BY order_date;',
        ],
        outs: [{ label: 'NULL at the edges', headers: ['order_date', 'rev', 'prev', 'change', 'next_day'], values: [['2025-03-01', '1017.80', 'NULL', 'NULL', '2025-03-02'], ['2025-03-02', '193.00', '1017.80', '-824.80', '2025-03-03'], ['2025-03-03', '159.00', '193.00', '-34.00', '2025-03-06'], ['2025-03-06', '305.00', '159.00', '146.00', '2025-03-07'], ['2025-03-07', '73.90', '305.00', '-231.10', '2025-03-12'], ['2025-03-12', '1269.00', '73.90', '1195.10', 'NULL']] }],
      }),
      {
        id: 'args',
        kind: 'table',
        label: 'LAG and LEAD, in short',
        pattern: 'service',
        headers: ['call', 'reads'],
        values: [['lag(x)', 'x from the previous row'], ['lead(x)', 'x from the next row'], ['lag(x, 2)', 'two rows back'], ['lag(x, 1, 0)', 'default 0 instead of NULL']],
      },
      {
        id: 'gap',
        label: 'previous row ≠ yesterday',
        sub: '03-03 → 03-06 skips days',
        pattern: 'warn',
        icon: 'triangleAlert',
      },
    ]),
  ],
}
