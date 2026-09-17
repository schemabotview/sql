import type { Scene } from '@graphlearning/flow'
import { projectSteps } from './steps'

// §5 cap-analyze — step 4, and the first scene in the concept to pair a query with the rows it
// ACTUALLY returns. The whole pipeline from course 2 is in one statement — join, group, aggregate,
// filter the groups, sort — and the result table underneath is what those five clauses produced.
//
// Ada has two orders totalling 165 and Ravi one of 210, which is the data loaded in §4: the numbers
// carry across the course rather than being invented per scene.
export const capAnalyze: Scene = {
  id: 'cap-analyze',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    projectSteps(),
    {
      id: 'analyze-code',
      kind: 'code',
      filename: '04_analyze.sql',
      label: [
        'SELECT c.name,',
        '       count(*)     AS orders,',
        '       sum(o.total) AS revenue',
        'FROM orders o',
        'JOIN customers c ON c.id = o.customer_id',
        'GROUP BY c.name',
        'HAVING sum(o.total) > 50',
        'ORDER BY revenue DESC;',
      ].join('\n'),
    },
    {
      id: 'analyze-result',
      kind: 'table',
      label: 'result',
      pattern: 'storage',
      sub: 'one row per customer — the detail is gone',
      headers: ['name', 'orders', 'revenue'],
      values: [
        ['Ravi', '1', '210.00'],
        ['Ada', '2', '165.00'],
      ],
    },
  ],
  edges: [
    { source: 'plan', target: 'analyze-code' },
    { source: 'analyze-code', target: 'analyze-result', label: 'join, group, aggregate, filter the groups, sort' },
  ],
}
