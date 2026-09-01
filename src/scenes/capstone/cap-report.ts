import type { Scene } from '../../render-engine'
import { projectSteps } from './steps'

// §6 cap-report — step 5, and the payoff for two earlier sections at once. The CTE is the first
// working `WITH` in the concept (queries §2 introduced them and never showed one), and the window
// functions do what queries §6 argued: same aggregate, computed BESIDE the rows instead of
// collapsing them.
//
// Deliberately the same two customers and the same revenue as §5, so the contrast is exact — §5
// returned two summary rows, this returns the same two rows plus a rank and a running total. The
// running column (210 then 375) is the thing that shows a window looking at more than its own row.
export const capReport: Scene = {
  id: 'cap-report',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    projectSteps(),
    {
      id: 'report-code',
      kind: 'code',
      filename: '05_report.sql',
      label: [
        'WITH per_customer AS (',
        '  SELECT c.name, sum(o.total) AS revenue',
        '  FROM orders o',
        '  JOIN customers c ON c.id = o.customer_id',
        '  GROUP BY c.name',
        ')',
        'SELECT name, revenue,',
        '  RANK() OVER (ORDER BY revenue DESC) AS pos,',
        '  SUM(revenue) OVER (ORDER BY revenue DESC)',
        '    AS running',
        'FROM per_customer;',
      ].join('\n'),
    },
    {
      id: 'report-result',
      kind: 'table',
      label: 'result',
      pattern: 'service',
      sub: 'every row kept — two columns added beside them',
      headers: ['name', 'revenue', 'pos', 'running'],
      values: [
        ['Ravi', '210.00', '1', '210.00'],
        ['Ada', '165.00', '2', '375.00'],
      ],
    },
  ],
  edges: [
    { source: 'plan', target: 'report-code' },
    { source: 'report-code', target: 'report-result', label: 'OVER( … ) is the whole difference from §5' },
  ],
}
