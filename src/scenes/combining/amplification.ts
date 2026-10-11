import type { Scene, SceneNode } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §5 amplification — joining one order to several lines AND several payments repeats the payment on
// every line. Order 1 has 2 lines and 1 payment (118.80): joined through the lines, that payment
// appears twice. Summed over the whole shop, payments 2248.70 become 3321.40 (+1072.70 from orders
// 1, 3, 5, 7 and 10 having two lines). The fix aggregates each side to the order grain BEFORE
// joining. All figures are real output (check:sql).
const chip = (id: string, label: string, warn = false): SceneNode => ({ id, label, variant: 'chip', pattern: warn ? 'warn' : 'service', icon: 'none' })

export const amplification: Scene = {
  id: 'amplification',
  padding: 0.08,
  flow: 'TB',
  nodes: [
    grid('top', 'Why the total grows', 2, [
      {
        id: 'order1',
        label: 'order 1: two lines, one payment',
        pattern: 'group',
        icon: 'none',
        cols: 3,
        children: [chip('l1', 'line 1'), chip('l2', 'line 2'), chip('p1', 'payment 118.80', true)],
        edges: [
          { source: 'l1', target: 'p1' },
          { source: 'l2', target: 'p1' },
        ],
      },
      pair({
        id: 'wrong',
        title: 'sum after joining lines',
        file: 'amplified.sql',
        sql: ['SELECT sum(p.amount) AS paid', 'FROM orders o', 'JOIN order_items i USING (order_id)', 'JOIN payments p USING (order_id);'],
        outs: [{ label: 'too high: 3321.40', headers: ['paid'], values: [['3321.40']], pattern: 'warn' }],
      }),
    ]),
    grid('bottom', 'Count it once', 2, [
      pair({
        id: 'truth',
        title: 'the payments table alone',
        file: 'payments-sum.sql',
        sql: ['SELECT sum(amount) AS paid', 'FROM payments;'],
        outs: [{ label: 'the real total', headers: ['paid'], values: [['2248.70']] }],
      }),
      pair({
        id: 'fix',
        title: 'aggregate, then join',
        file: 'aggregate-first.sql',
        sql: ['SELECT sum(paid) AS paid', 'FROM (SELECT order_id, sum(amount) AS paid', '      FROM payments GROUP BY order_id) p', 'JOIN (SELECT DISTINCT order_id', '      FROM order_items) i USING (order_id);'],
        outs: [{ label: 'matches again', headers: ['paid'], values: [['2248.70']] }],
      }),
    ]),
  ],
  edges: [{ source: 'top', target: 'bottom' }],
}
