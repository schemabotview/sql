import type { Scene } from '@graphlearning/flow'
import { grid, planPair } from '../pair'

// §7 materialized-views — a materialized view stores the RESULT of its query. After a new pending order
// (12) is added, the stored row still says 3 pending orders / 1269.00 (stale) while the live query
// says 4 / 1328.80; REFRESH MATERIALIZED VIEW recomputes the stored result and the two agree again.
// Cost trade: reads are cheap (a scan of 4 stored rows) but the answer is only as fresh as the last refresh.
export const materializedViews: Scene = {
  id: 'materialized-views',
  padding: 0.12,
  flow: 'LR',
  edges: [{ source: 'g-mv', target: 'side' }],
  nodes: [
    {
      id: 'g-mv',
      label: 'store, go stale, refresh',
      pattern: 'group',
      icon: 'none',
      cols: 2,
      children: [
        {
          id: 'q-mv',
          kind: 'code',
          filename: 'materialized-view.sql',
          hug: true,
          label: [
        'CREATE MATERIALIZED VIEW revenue_by_status AS',
        'SELECT o.status,',
        '  count(DISTINCT o.order_id) AS orders,',
        '  sum(i.quantity * i.unit_price) AS revenue',
        'FROM orders o',
        'JOIN order_items i USING (order_id)',
        'GROUP BY o.status;',
        '',
        'SELECT * FROM revenue_by_status',
        'ORDER BY status;                   -- first state',
        '',
        "INSERT INTO orders VALUES",
        "  (12, 2, NULL, '2025-03-13', 'pending');",
        'INSERT INTO order_items VALUES (12, 1, 6, 2, 29.90);',
        '',
        "SELECT * FROM revenue_by_status",
        "WHERE status = 'pending';          -- stored",
        '',
        "SELECT o.status, count(DISTINCT o.order_id) AS orders,",
        "  sum(i.quantity * i.unit_price) AS revenue",
        "FROM orders o JOIN order_items i USING (order_id)",
        "WHERE o.status = 'pending' GROUP BY o.status;  -- live",
        '',
        'REFRESH MATERIALIZED VIEW revenue_by_status;',
        "SELECT * FROM revenue_by_status",
        "WHERE status = 'pending';          -- refreshed",
          ].join('\n'),
        },
        {
          id: 'results',
          label: 'what each SELECT returned',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            { id: 'r-created', kind: 'table', label: 'just created: 4 rows', pattern: 'service', headers: ['status', 'orders', 'revenue'], values: [['cancelled', '1', '52.00'], ['delivered', '5', '1556.80'], ['pending', '3', '1269.00'], ['shipped', '2', '191.90']] },
            { id: 'r-stale', kind: 'table', label: 'before REFRESH: stale', pattern: 'warn', headers: ['status', 'orders', 'revenue'], values: [['pending', '3', '1269.00']] },
            { id: 'r-live', kind: 'table', label: 'the live query: current', pattern: 'service', headers: ['status', 'orders', 'revenue'], values: [['pending', '4', '1328.80']] },
            { id: 'r-fresh', kind: 'table', label: 'after REFRESH: current', pattern: 'service', headers: ['status', 'orders', 'revenue'], values: [['pending', '4', '1328.80']] },
          ],
        },
      ],
      edges: [{ source: 'q-mv', target: 'results' }],
    },
    grid('side', 'View or materialized view?', 1, [
      {
        id: 'cmp',
        kind: 'table',
        label: 'the trade-off',
        pattern: 'service',
        headers: ['', 'view', 'materialized view'],
        values: [['stores', 'the query', 'the result'], ['freshness', 'always current', 'as of last refresh'], ['read cost', 'runs the query', 'reads stored rows'], ['upkeep', 'none', 'REFRESH'], ['indexable', 'no', 'yes']],
      },
      planPair({
        id: 'read',
        title: 'what a read costs',
        file: 'mv-read.sql',
        sql: ['CREATE MATERIALIZED VIEW revenue_by_status AS', '  SELECT status, count(*) AS orders', '  FROM orders GROUP BY status;', '', 'EXPLAIN (ANALYZE, COSTS OFF,', '         TIMING OFF, SUMMARY OFF)', 'SELECT * FROM revenue_by_status;'],
        plans: [{ file: 'plan-mv.txt', lines: ['Seq Scan on revenue_by_status', '  (actual rows=4 loops=1)'] }],
      }),
      { id: 'gap', label: 'freshness gap', sub: 'time since the last REFRESH', pattern: 'warn', icon: 'triangleAlert' },
    ]),
  ],
}
