import type { Scene, SceneNode } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §9 aggregates-groups — many rows into one, then one per group. Aggregates collapse rows (8 payments
// become one summary row; avg is rounded for display). GROUP BY makes one bucket per customer from the
// ten live orders; HAVING then judges each BUCKET (count > 1 keeps customers 1, 2 and 4), while WHERE
// ran first and already dropped the cancelled order. The contrast is the error: WHERE cannot use an
// aggregate, because at that step no group exists yet.
const order = (id: number, keep: boolean): SceneNode => ({
  id: `o${id}`,
  label: `#${id}`,
  variant: 'chip',
  pattern: keep ? 'service' : 'warn',
  icon: 'none',
})
const bucket = (customer: number, orders: number[]): SceneNode => ({
  id: `c${customer}`,
  label: `${customer}`,
  sub: `n = ${orders.length}${orders.length > 1 ? ' ✓' : ' ✗'}`,
  pattern: 'group',
  icon: 'none',
  cols: 3,
  children: orders.map((o) => order(o, orders.length > 1)),
})

export const aggregatesGroups: Scene = {
  id: 'aggregates-groups',
  padding: 0.1,
  flow: 'TB',
  nodes: [
    grid('top', 'Collapse rows', 2, [
      pair({
        id: 'agg',
        title: 'aggregates: 8 rows → 1',
        file: 'aggregates.sql',
        sql: ['SELECT count(*) AS payments,', '  sum(amount) AS total,', '  round(avg(amount), 2) AS average,', '  min(amount) AS smallest,', '  max(amount) AS largest', 'FROM payments;'],
        outs: [{ label: 'one summary row', headers: ['payments', 'total', 'average', 'smallest', 'largest'], values: [['8', '2248.70', '281.09', '73.90', '899.00']] }],
      }),
      pair({
        id: 'wherecount',
        title: 'WHERE cannot see a group',
        file: 'where-count.sql',
        sql: ['-- expect-error: no groups exist yet', 'SELECT customer_id', 'FROM orders', 'WHERE count(*) > 1', 'GROUP BY customer_id;'],
        err: { label: 'not allowed in WHERE', sub: 'aggregate functions' },
      }),
    ]),
    {
      id: 'flow',
      label: 'GROUP BY then HAVING: WHERE already dropped cancelled order 8',
      pattern: 'group',
      icon: 'none',
      cols: 1,
      children: [
        {
          id: 'q-having',
          kind: 'code',
          filename: 'repeat-buyers.sql',
          hug: true,
          label: ['SELECT customer_id, count(*) AS orders', 'FROM orders', "WHERE status <> 'cancelled'", 'GROUP BY customer_id', 'HAVING count(*) > 1', 'ORDER BY customer_id;'].join('\n'),
        },
        {
          id: 'groups',
          label: '10 rows become 6 groups — bucket = customer_id, n = count(*)',
          pattern: 'group',
          icon: 'none',
          cols: 6,
          children: [bucket(1, [1, 3, 9]), bucket(2, [2, 6]), bucket(3, [4]), bucket(4, [5, 10]), bucket(5, [7]), bucket(9, [11])],
        },
        {
          id: 'r-having',
          kind: 'table',
          label: '3 groups survive HAVING',
          pattern: 'service',
          headers: ['customer_id', 'orders'],
          values: [['1', '3'], ['2', '2'], ['4', '2']],
        },
      ],
      edges: [
        { source: 'q-having', target: 'groups' },
        { source: 'groups', target: 'r-having' },
      ],
    },
  ],
  edges: [{ source: 'top', target: 'flow' }],
}
