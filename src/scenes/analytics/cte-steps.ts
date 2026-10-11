import type { Scene, SceneNode } from '@graphlearning/flow'
import { pair } from '../pair'

// §1 cte-steps — WITH names an intermediate result so a multi-step question reads top to bottom:
// line_totals (one row per order, 11) -> live (cancelled order 8 dropped, 10) -> the final grouped
// filter (customers 2 and 4 spend over 500). The chain tiles carry the row counts of each stage; the
// card is the whole query and its real result.
const stage = (id: string, label: string, sub: string, warn = false): SceneNode => ({ id, label, sub, pattern: warn ? 'warn' : 'storage', icon: 'none' })

export const cteSteps: Scene = {
  id: 'cte-steps',
  padding: 0.1,
  flow: 'LR',
  nodes: [
    {
      id: 'stages',
      label: 'Three named stages, read top to bottom',
      pattern: 'group',
      icon: 'none',
      cols: 1,
      children: [
        stage('s1', 'line_totals', '11 rows: one per order'),
        stage('s2', 'live', '10 rows: order 8 dropped'),
        stage('s3', 'final', '2 rows: customers over 500'),
      ],
      edges: [
        { source: 's1', target: 's2' },
        { source: 's2', target: 's3' },
      ],
    },
    pair({
      id: 'cte',
      title: 'WITH … SELECT',
      file: 'cte-steps.sql',
      sql: [
        'WITH line_totals AS (',
        '  SELECT order_id,',
        '         sum(quantity * unit_price) AS total',
        '  FROM order_items GROUP BY order_id),',
        'live AS (',
        '  SELECT o.order_id, o.customer_id, t.total',
        '  FROM orders o',
        '  JOIN line_totals t USING (order_id)',
        "  WHERE o.status <> 'cancelled')",
        'SELECT customer_id, count(*) AS orders,',
        '       sum(total) AS spend',
        'FROM live',
        'GROUP BY customer_id',
        'HAVING sum(total) > 500',
        'ORDER BY customer_id;',
      ],
      outs: [{ label: 'the final stage', headers: ['customer_id', 'orders', 'spend'], values: [['2', '2', '1017.00'], ['4', '2', '1205.00']] }],
    }),
  ],
  edges: [{ source: 'stages', target: 'g-cte' }],
}
