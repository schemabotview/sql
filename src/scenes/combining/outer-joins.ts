import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §3 outer-joins — LEFT JOIN keeps every left row, padding with NULL when nothing matches (customers
// 7 and 8). Testing the right side's key IS NULL after the join finds the unmatched rows (anti-join).
// Predicate placement is the lesson: a filter on the right table inside ON keeps the left rows (10 rows,
// 5 matched); the same filter in WHERE removes the NULL-padded rows and silently undoes the outer
// join (5 rows). Counts are real output.
export const outerJoins: Scene = {
  id: 'outer-joins',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'LEFT JOIN: keep the left side, pad the right with NULL', 2, [
      pair({
        id: 'pad',
        title: 'unmatched rows survive',
        file: 'left-join.sql',
        sql: ['SELECT c.customer_id, c.first_name, o.order_id', 'FROM customers c', 'LEFT JOIN orders o', '  ON o.customer_id = c.customer_id', 'WHERE c.customer_id >= 6', 'ORDER BY c.customer_id, o.order_id;'],
        outs: [{ label: 'NULL shows as blank', headers: ['customer_id', 'first_name', 'order_id'], values: [['6', 'Farid', '8'], ['7', 'Grace', 'NULL'], ['8', 'Hiro', 'NULL'], ['9', 'Chloe', '11']] }],
      }),
      pair({
        id: 'anti',
        title: 'anti-join: who never ordered?',
        file: 'anti-join.sql',
        sql: ['SELECT c.customer_id, c.first_name', 'FROM customers c', 'LEFT JOIN orders o', '  ON o.customer_id = c.customer_id', 'WHERE o.order_id IS NULL', 'ORDER BY c.customer_id;'],
        outs: [{ label: 'the unmatched rows', headers: ['customer_id', 'first_name'], values: [['7', 'Grace'], ['8', 'Hiro']] }],
      }),
      pair({
        id: 'on',
        title: 'filter in ON: left rows kept',
        file: 'filter-on.sql',
        sql: ['SELECT count(*) AS rows,', '       count(o.order_id) AS matched', 'FROM customers c', 'LEFT JOIN orders o', '  ON o.customer_id = c.customer_id', " AND o.status = 'delivered';"],
        outs: [{ label: '10 rows: all 9 customers + 1 extra match', headers: ['rows', 'matched'], values: [['10', '5']] }],
      }),
      pair({
        id: 'where',
        title: 'filter in WHERE: outer join undone',
        file: 'filter-where.sql',
        sql: ['SELECT count(*) AS rows,', '       count(o.order_id) AS matched', 'FROM customers c', 'LEFT JOIN orders o', '  ON o.customer_id = c.customer_id', "WHERE o.status = 'delivered';"],
        outs: [{ label: 'only matches remain', headers: ['rows', 'matched'], values: [['5', '5']], pattern: 'warn' }],
      }),
    ]),
  ],
}
