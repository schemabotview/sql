import type { Scene } from '../../render-engine'
import { projectSteps } from './steps'

// §7 cap-optimize — step 6, and the section's point is the PROOF, not the index. Both EXPLAINs sit
// in one card so the before and after are read together: the same query, the same predicate, and a
// plan that flips from Seq Scan to Index Scan once the B-tree exists.
//
// This closes the loop opened in engine §3, which read exactly this plan shape on exactly this
// query — the capstone earns it rather than asserting it.
export const capOptimize: Scene = {
  id: 'cap-optimize',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    projectSteps(),
    {
      id: 'optimize-code',
      kind: 'code',
      filename: '06_optimize.sql',
      label: [
        'EXPLAIN SELECT * FROM orders',
        'WHERE customer_id = 2;',
        '-- Seq Scan on orders  (cost=0.00..18.10)',
        '',
        'CREATE INDEX idx_orders_customer',
        '  ON orders (customer_id);',
        '',
        'EXPLAIN SELECT * FROM orders',
        'WHERE customer_id = 2;',
        '-- Index Scan using idx_orders_customer',
      ].join('\n'),
    },
    {
      id: 'flip',
      label: 'The plan flipped — that is the proof',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'fl-before', label: 'Before — Seq Scan', pattern: 'warn', sub: 'reads every page' },
        { id: 'fl-after', label: 'After — Index Scan', pattern: 'service', icon: 'zap', sub: 'three or four hops' },
      ],
    },
  ],
  edges: [
    { source: 'plan', target: 'optimize-code' },
    { source: 'optimize-code', target: 'flip', label: "don't guess at performance — read the plan and confirm it" },
  ],
}
