import type { Scene } from '@graphlearning/flow'

// §3 explain-plan — a CODE card, and this one is REQUIRED rather than chosen: the slide says "the
// plan above" and the narration reads the Index Cond line aloud, so the scene has to be an actual
// plan. It is the same query §6 will use to argue about scan choice, so the two sections share one
// worked example.
//
// Lines ≤76 cols (CODE_MIN_COLS); no `sub` on a SQL card — codeLines() would append it as a `#`
// comment, which is Python's syntax, not SQL's.
export const explainPlan: Scene = {
  id: 'explain-plan',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'plan-code',
      kind: 'code',
      filename: 'explain.sql',
      label: [
        'EXPLAIN ANALYZE',
        'SELECT * FROM orders WHERE customer_id = 42;',
        '',
        'Index Scan using idx_orders_customer',
        '  on orders (cost=0.29..8.31 rows=3 width=44)',
        '  Index Cond: (customer_id = 42)',
        '  actual time=0.021..0.024 rows=3 loops=1',
        'Planning Time: 0.104 ms',
        'Execution Time: 0.041 ms',
      ].join('\n'),
    },
    {
      id: 'tells',
      label: 'What to look for — read the tree bottom-up',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'tell-seqscan', label: 'Seq Scan, big table', pattern: 'warn', sub: 'a missing index' },
        { id: 'tell-rowgap', label: 'Estimated ≠ actual', pattern: 'warn', sub: 'stale statistics' },
      ],
    },
  ],
  edges: [{ source: 'plan-code', target: 'tells', label: 'EXPLAIN alone shows the plan — ANALYZE runs it and adds the real numbers' }],
}
