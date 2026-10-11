import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §5 ranking-top-n — three ranking functions disagree only on ties. Order lines priced 899.00 (two),
// 149.00 (two) and 119.00 (two): row_number never repeats (ties broken by the extra ORDER BY keys),
// rank repeats and skips (1,1,3,3,5,5), dense_rank repeats without skipping (1,1,2,2,3,3). Top-N per
// group filters on the rank in an outer query, and the same pattern with row_number keeps one row per
// duplicate group (customers 3 and 9: rn 1 stays, rn 2 is the duplicate).
export const rankingTopN: Scene = {
  id: 'ranking-top-n',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Rank, then filter in an outer query', 2, [
      pair({
        id: 'ranks',
        title: 'three functions, one tie',
        file: 'ranking.sql',
        sql: [
          'SELECT order_id, line_no, unit_price,',
          '  row_number() OVER (ORDER BY unit_price DESC,',
          '                     order_id, line_no) AS rn,',
          '  rank() OVER w AS rk,',
          '  dense_rank() OVER w AS dr',
          'FROM order_items',
          'WINDOW w AS (ORDER BY unit_price DESC)',
          'ORDER BY rn LIMIT 6;',
        ],
        outs: [{ label: 'ties: rank skips, dense_rank does not', headers: ['order_id', 'line_no', 'unit_price', 'rn', 'rk', 'dr'], values: [['2', '1', '899.00', '1', '1', '1'], ['10', '1', '899.00', '2', '1', '1'], ['3', '1', '149.00', '3', '3', '2'], ['9', '1', '149.00', '4', '3', '2'], ['5', '1', '119.00', '5', '5', '3'], ['10', '2', '119.00', '6', '5', '3']] }],
      }),
      pair({
        id: 'topn',
        title: 'top 1 per category',
        file: 'top-per-group.sql',
        sql: [
          'SELECT name, category_id, price',
          'FROM (SELECT *, row_number() OVER (',
          '        PARTITION BY category_id',
          '        ORDER BY price DESC) AS rn',
          '      FROM products) t',
          'WHERE rn = 1',
          'ORDER BY category_id;',
        ],
        outs: [{ label: 'the priciest in each category', headers: ['name', 'category_id', 'price'], values: [['Bluetooth Speaker', '2', '79.50'], ['Laptop 14"', '3', '899.00'], ['Database Design', '4', '44.00'], ['Coffee Grinder', '5', '52.00'], ['Studio Headphones', '6', '149.00']] }],
      }),
      pair({
        id: 'dedupe',
        title: 'deduplicate: keep rn = 1',
        file: 'dedupe.sql',
        sql: [
          'SELECT customer_id, first_name, last_name,',
          '  row_number() OVER (',
          '    PARTITION BY first_name, last_name, city',
          '    ORDER BY signup_date) AS rn',
          'FROM customers',
          "WHERE last_name = 'Martin'",
          'ORDER BY customer_id;',
        ],
        outs: [{ label: 'rn 2 is the duplicate to drop', headers: ['customer_id', 'first_name', 'last_name', 'rn'], values: [['3', 'Chloe', 'Martin', '1'], ['9', 'Chloe', 'Martin', '2']] }],
      }),
    ]),
  ],
}
