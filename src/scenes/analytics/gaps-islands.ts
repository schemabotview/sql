import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §8 gaps-islands — consecutive dates share a constant "date minus row number": 03-01..03-03 all give
// 02-28, 03-06..03-07 give 03-02, 03-12 gives 03-06. Grouping by that constant yields the islands
// (3 days, 2 days, 1 day). The gaps (the six missing days) come from a generated calendar that is
// anti-joined to the data. Order dates form exactly these three islands in the seed.
export const gapsIslands: Scene = {
  id: 'gaps-islands',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Consecutive days share one anchor date', 2, [
      pair({
        id: 'anchor',
        title: 'step 1: date minus row number',
        file: 'islands-anchor.sql',
        sql: [
          'SELECT order_date,',
          '  order_date - (row_number() OVER (',
          '    ORDER BY order_date))::int AS anchor',
          'FROM (SELECT DISTINCT order_date',
          '      FROM orders) d',
          'ORDER BY order_date;',
        ],
        outs: [{ label: 'a run shares one anchor', headers: ['order_date', 'anchor'], values: [['2025-03-01', '2025-02-28'], ['2025-03-02', '2025-02-28'], ['2025-03-03', '2025-02-28'], ['2025-03-06', '2025-03-02'], ['2025-03-07', '2025-03-02'], ['2025-03-12', '2025-03-06']] }],
      }),
      pair({
        id: 'islands',
        title: 'step 2: group by the anchor',
        file: 'islands.sql',
        sql: [
          'WITH n AS (',
          '  SELECT order_date,',
          '    order_date - (row_number() OVER (',
          '      ORDER BY order_date))::int AS anchor',
          '  FROM (SELECT DISTINCT order_date',
          '        FROM orders) d)',
          'SELECT min(order_date) AS first_day,',
          '       max(order_date) AS last_day,',
          '       count(*) AS days',
          'FROM n GROUP BY anchor ORDER BY 1;',
        ],
        outs: [{ label: '3 islands', headers: ['first_day', 'last_day', 'days'], values: [['2025-03-01', '2025-03-03', '3'], ['2025-03-06', '2025-03-07', '2'], ['2025-03-12', '2025-03-12', '1']] }],
      }),
      pair({
        id: 'gaps',
        title: 'the gaps: days with no order',
        file: 'gaps.sql',
        sql: [
          'SELECT d::date AS missing',
          'FROM generate_series(',
          "  '2025-03-01'::date, '2025-03-12',",
          "  '1 day') AS g(d)",
          'WHERE d::date NOT IN (',
          '  SELECT order_date FROM orders)',
          'ORDER BY missing;',
        ],
        outs: [{ label: '6 missing days', headers: ['missing'], values: [['2025-03-04'], ['2025-03-05'], ['2025-03-08'], ['2025-03-09'], ['2025-03-10'], ['2025-03-11']] }],
      }),
    ]),
  ],
}
