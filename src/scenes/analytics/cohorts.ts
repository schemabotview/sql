import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §10 cohorts — a cohort analysis is three explicit definitions plus one query. Population: customers,
// grouped by signup month. Period: months since signup (order month minus signup month). Metric: distinct
// customers with a non-cancelled order in that period. Result: January's two customers are active in
// month 2, February's three in month 1, March and April show none. Customer 9 ordered in March but
// signed up in April (month -1): the definition excludes that row (period >= 0), a limitation stated
// on the slide. Counts are real output; the -1 row is asserted in db/verify/ch06-analytics.sql.
export const cohorts: Scene = {
  id: 'cohorts',
  padding: 0.1,
  flow: 'LR',
  nodes: [
    pair({
      id: 'cohort',
      title: 'signup-month cohorts',
      file: 'cohort.sql',
      sql: [
        'WITH size AS (',
        "  SELECT to_char(signup_date, 'YYYY-MM') AS cohort,",
        '         count(*) AS customers',
        '  FROM customers GROUP BY 1),',
        'act AS (',
        "  SELECT to_char(c.signup_date, 'YYYY-MM') AS cohort,",
        '    (extract(year FROM o.order_date) * 12',
        '     + extract(month FROM o.order_date)',
        '     - extract(year FROM c.signup_date) * 12',
        '     - extract(month FROM c.signup_date))::int AS m,',
        '    c.customer_id',
        '  FROM customers c JOIN orders o USING (customer_id)',
        "  WHERE o.status <> 'cancelled')",
        'SELECT s.cohort, s.customers, a.m AS month_no,',
        '       count(DISTINCT a.customer_id) AS active',
        'FROM size s',
        'LEFT JOIN act a ON a.cohort = s.cohort AND a.m >= 0',
        'GROUP BY 1, 2, 3 ORDER BY 1, 3;',
      ],
      outs: [{ label: 'active customers by months since signup', headers: ['cohort', 'customers', 'month_no', 'active'], values: [['2025-01', '2', '2', '2'], ['2025-02', '3', '1', '3'], ['2025-03', '2', 'NULL', '0'], ['2025-04', '2', 'NULL', '0']] }],
    }),
    grid('defs', 'Definitions first', 1, [
      {
        id: 'defs-table',
        kind: 'table',
        label: 'what the numbers mean',
        pattern: 'service',
        headers: ['term', 'definition'],
        values: [['population', 'all 9 customers'], ['cohort', 'month of signup_date'], ['period', 'order month - signup month'], ['metric', 'distinct customers with a live order'], ['excluded', 'orders before signup (period < 0)']],
      },
      {
        id: 'limit',
        label: 'customer 9: period -1',
        sub: 'ordered in March, signed up in April',
        pattern: 'warn',
        icon: 'triangleAlert',
      },
    ]),
  ],
  edges: [{ source: 'g-cohort', target: 'defs' }],
}
