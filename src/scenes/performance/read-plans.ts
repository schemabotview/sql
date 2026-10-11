import type { Scene } from '@graphlearning/flow'
import { grid, planPair } from '../pair'

// §2 read-plans — a plan is a tree: leaves read tables, parents combine rows. This one reads, bottom
// up: two sequential scans (the orders filtered to 'pending'), a hash join, a hash aggregate, a sort.
// EXPLAIN shows the plan without running the statement; EXPLAIN ANALYZE RUNS it — the second card wraps
// an UPDATE in a transaction that is rolled back, and a follow-up count proves 1 row really changed.
export const readPlans: Scene = {
  id: 'read-plans',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'EXPLAIN reads the plan; ANALYZE runs the query', 2, [
      planPair({
        id: 'tree',
        title: 'a plan tree (not executed)',
        file: 'explain-tree.sql',
        sql: [
          'EXPLAIN (COSTS OFF)',
          'SELECT c.country, count(*) AS pending',
          'FROM perf.big_orders o',
          'JOIN perf.big_customers c USING (customer_id)',
          "WHERE o.status = 'pending'",
          'GROUP BY c.country',
          'ORDER BY pending DESC;',
        ],
        plans: [
          {
            file: 'plan-tree.txt',
            lines: ['Sort', '  ->  HashAggregate', '    ->  Hash Join', '      ->  Seq Scan on big_orders o', "            Filter: (status = 'pending'::text)", '      ->  Hash', '        ->  Seq Scan on big_customers c'],
          },
        ],
      }),
      {
        id: 'read',
        kind: 'table',
        label: 'how to read it',
        pattern: 'service',
        headers: ['step', 'look at'],
        values: [['start at the leaves', 'which scan reads each table'], ['move upwards', 'join, aggregate, sort'], ['indentation', 'child feeds parent'], ['ANALYZE adds', 'actual rows per node']],
      },
      planPair({
        id: 'run',
        title: 'ANALYZE really executes',
        file: 'explain-analyze-update.sql',
        sql: [
          'BEGIN;',
          'EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF)',
          "UPDATE perf.big_customers SET country = 'x'",
          'WHERE customer_id = 42;',
          "SELECT count(*) AS changed FROM perf.big_customers",
          "WHERE country = 'x';",
          'ROLLBACK;',
        ],
        plans: [{ file: 'plan-update.txt', lines: ['Update on big_customers', '  (actual rows=0 loops=1)', '  ->  Index Scan using', '      big_customers_pkey', '        (actual rows=1 loops=1)'] }],
        outs: [{ label: 'the row really changed', headers: ['changed'], values: [['1']], pattern: 'warn' }],
      }),
    ]),
  ],
}
