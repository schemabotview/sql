import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §7 correlated — the inner query refers to a column of the OUTER row (q.category_id = p.category_id),
// so it is re-evaluated, logically, for every outer row. "Priced above its own category's average"
// keeps 5 of 10 products. The averages card verifies the inner results; the trace spells out one row
// (logical order only — the engine may plan it differently). A correlated subquery in the SELECT list
// gives customers 7 and 8 a count of 0, where a join+GROUP BY would drop them.
export const correlated: Scene = {
  id: 'correlated',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'The inner query depends on the outer row', 2, [
      pair({
        id: 'filter',
        title: 'above own category average',
        file: 'correlated.sql',
        sql: ['SELECT p.name, p.category_id, p.price', 'FROM products p', 'WHERE p.price > (', '  SELECT avg(q.price)', '  FROM products q', '  WHERE q.category_id = p.category_id)', 'ORDER BY p.product_id;'],
        outs: [{ label: '5 of 10 products', headers: ['name', 'category_id', 'price'], values: [['Studio Headphones', '6', '149.00'], ['Bluetooth Speaker', '2', '79.50'], ['Laptop 14"', '3', '899.00'], ['Database Design', '4', '44.00'], ['Coffee Grinder', '5', '52.00']] }],
      }),
      {
        id: 'trace',
        kind: 'table',
        label: 'logical trace for one outer row',
        pattern: 'service',
        headers: ['step', 'value'],
        values: [['outer row', 'Studio Headphones (category 6)'], ['inner query', 'avg price where category_id = 6'], ['inner result', '104.00'], ['test', '149.00 > 104.00, keep']],
      },
      pair({
        id: 'avgs',
        title: 'the inner results, by category',
        file: 'category-averages.sql',
        sql: ['SELECT category_id,', '       round(avg(price), 2) AS average', 'FROM products', 'GROUP BY category_id', 'ORDER BY category_id;'],
        outs: [{ label: 'what each outer row compares with', headers: ['category_id', 'average'], values: [['2', '59.25'], ['3', '509.00'], ['4', '36.95'], ['5', '43.00'], ['6', '104.00']] }],
      }),
      pair({
        id: 'select',
        title: 'in the SELECT list',
        file: 'correlated-select.sql',
        sql: ['SELECT c.customer_id, c.first_name,', '  (SELECT count(*) FROM orders o', '   WHERE o.customer_id = c.customer_id)', '   AS orders', 'FROM customers c', 'WHERE c.customer_id >= 6', 'ORDER BY c.customer_id;'],
        outs: [{ label: 'zero is kept', headers: ['customer_id', 'first_name', 'orders'], values: [['6', 'Farid', '1'], ['7', 'Grace', '0'], ['8', 'Hiro', '0'], ['9', 'Chloe', '1']] }],
      }),
    ]),
  ],
}
