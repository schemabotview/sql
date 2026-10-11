import type { Scene } from '@graphlearning/flow'
import { grid, pair, planPair } from '../pair'

// §1 baseline — before tuning: is the answer right, what is the workload, what does it cost today?
// Uses the perf schema (db/perf.sql: 20 000 generated orders, 2 000 customers). Customer 42 has exactly
// 10 orders totalling 1018.30; with no index on customer_id PostgreSQL reads all 20 000 rows to return
// them (Rows Removed by Filter 19 990). "Rows examined" is the baseline measure here — it is exact and
// repeatable, unlike timings.
export const baseline: Scene = {
  id: 'baseline',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Correct first, then measure', 2, [
      pair({
        id: 'right',
        title: 'step 1: the answer',
        file: 'baseline-correct.sql',
        sql: ['SELECT count(*) AS orders,', '       sum(total) AS revenue', 'FROM perf.big_orders', 'WHERE customer_id = 42;'],
        outs: [{ label: 'the expected result, known before tuning', headers: ['orders', 'revenue'], values: [['10', '1018.30']] }],
      }),
      planPair({
        id: 'cost',
        title: 'step 2: the baseline cost',
        file: 'baseline-plan.sql',
        sql: ['EXPLAIN (ANALYZE, COSTS OFF,', '         TIMING OFF, SUMMARY OFF)', 'SELECT * FROM perf.big_orders', 'WHERE customer_id = 42;'],
        plans: [{ file: 'plan-baseline.txt', lines: ['Seq Scan on big_orders', '  (actual rows=10 loops=1)', '  Filter: (customer_id = 42)', '  Rows Removed by Filter: 19990'] }],
      }),
      {
        id: 'workload',
        kind: 'table',
        label: 'a representative workload',
        pattern: 'service',
        headers: ['query', 'how often', 'matters because'],
        values: [['orders of one customer', 'every page view', 'latency'], ['pending orders this week', 'every few minutes', 'dashboard'], ['monthly revenue report', 'nightly', 'total runtime']],
      },
      {
        id: 'facts',
        kind: 'table',
        label: 'baseline for the first query',
        pattern: 'service',
        headers: ['measure', 'value'],
        values: [['rows returned', '10'], ['rows examined', '20 000'], ['useful share', '0.05 %'], ['plan', 'sequential scan']],
      },
    ]),
  ],
}
