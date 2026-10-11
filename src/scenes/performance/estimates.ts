import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §3 estimates — the planner chooses with ESTIMATED row counts taken from statistics. A copy of the
// table (so the original is not bloated) starts with fresh statistics: estimate 2800 = actual 2800. After
// an UPDATE turns 8229 rows into 'pending' the statistics are stale: estimate 3675, actual 11029. ANALYZE
// refreshes them: 11029 = 11029. Estimates and actuals are read from EXPLAIN by db/verify/ch07-performance.sql.
export const estimates: Scene = {
  id: 'estimates',
  padding: 0.04,
  flow: 'LR',
  edges: [{ source: 'g-est', target: 'side' }],
  nodes: [
    pair({
      id: 'est',
      title: 'estimate versus actual',
      file: 'estimates.sql',
      sql: [
        'CREATE TABLE perf.orders_copy AS',
        '  SELECT * FROM perf.big_orders;',
        'ANALYZE perf.orders_copy;',
        'EXPLAIN (ANALYZE) SELECT * FROM perf.orders_copy',
        "  WHERE status = 'pending';          -- stage 1",
        '',
        "UPDATE perf.orders_copy SET status = 'pending'",
        "  WHERE order_id % 2 = 0 AND status = 'delivered';",
        'EXPLAIN (ANALYZE) SELECT * FROM perf.orders_copy',
        "  WHERE status = 'pending';          -- stage 2",
        '',
        'ANALYZE perf.orders_copy;',
        'EXPLAIN (ANALYZE) SELECT * FROM perf.orders_copy',
        "  WHERE status = 'pending';          -- stage 3",
      ],
      outs: [
        {
          label: 'the planner’s guess drifts, then ANALYZE repairs it',
          headers: ['stage', 'estimated rows', 'actual rows'],
          values: [['1  fresh statistics', '2800', '2800'], ['2  after the UPDATE', '3675', '11029'], ['3  after ANALYZE', '11029', '11029']],
        },
      ],
    }),
    grid('side', 'Where estimates come from', 1, [
      {
        id: 'stats',
        kind: 'table',
        label: 'statistics the planner keeps',
        pattern: 'service',
        headers: ['statistic', 'used for'],
        values: [['row count', 'size of every scan'], ['common values', 'selectivity of = tests'], ['histogram', 'selectivity of ranges'], ['refreshed by', 'ANALYZE, autovacuum']],
      },
      { id: 'risk', label: 'stale statistics', sub: 'a wrong estimate can mean a wrong plan', pattern: 'warn', icon: 'triangleAlert' },
    ]),
  ],
}
