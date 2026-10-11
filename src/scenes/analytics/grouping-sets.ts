import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §9 grouping-sets — one GROUP BY, several levels. ROLLUP (country, status) returns the detail rows,
// a subtotal per country and a grand total; GROUPING(country, status) says which columns a row
// summarised (0 detail, 1 status rolled up, 3 both), which a blank cannot — a blank could also be a
// real NULL. GROUPING SETS lists exactly the groupings wanted (per country, per status). Restricted to
// India and UK for size; every figure is real output.
export const groupingSets: Scene = {
  id: 'grouping-sets',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'One query, several levels of summary', 2, [
      pair({
        id: 'rollup',
        title: 'ROLLUP: detail, subtotal, total',
        file: 'rollup.sql',
        sql: [
          'SELECT c.country, o.status, count(*) AS orders,',
          '       GROUPING(c.country, o.status) AS g',
          'FROM orders o',
          'JOIN customers c USING (customer_id)',
          "WHERE c.country IN ('India', 'UK')",
          'GROUP BY ROLLUP (c.country, o.status)',
          'ORDER BY g, c.country, o.status;',
        ],
        outs: [{ label: 'blank = rolled up; g says which', headers: ['country', 'status', 'orders', 'g'], values: [['India', 'delivered', '3', '0'], ['India', 'pending', '2', '0'], ['UK', 'delivered', '1', '0'], ['UK', 'shipped', '1', '0'], ['India', 'NULL', '5', '1'], ['UK', 'NULL', '2', '1'], ['NULL', 'NULL', '7', '3']] }],
      }),
      pair({
        id: 'sets',
        title: 'GROUPING SETS: only what you list',
        file: 'grouping-sets.sql',
        sql: [
          'SELECT c.country, o.status, count(*) AS orders',
          'FROM orders o',
          'JOIN customers c USING (customer_id)',
          "WHERE c.country IN ('India', 'UK')",
          'GROUP BY GROUPING SETS ((c.country), (o.status))',
          'ORDER BY c.country, o.status;',
        ],
        outs: [{ label: 'per country, then per status', headers: ['country', 'status', 'orders'], values: [['India', 'NULL', '5'], ['UK', 'NULL', '2'], ['NULL', 'delivered', '4'], ['NULL', 'pending', '2'], ['NULL', 'shipped', '1']] }],
      }),
      {
        id: 'equiv',
        kind: 'table',
        label: 'what each shorthand expands to',
        pattern: 'service',
        headers: ['shorthand', 'groupings computed'],
        values: [['ROLLUP (a, b)', '(a, b), (a), ()'], ['CUBE (a, b)', '(a, b), (a), (b), ()'], ['GROUPING SETS (...)', 'exactly the list']],
      },
    ]),
  ],
}
