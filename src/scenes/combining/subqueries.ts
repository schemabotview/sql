import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §6 subqueries — a query inside a query. Scalar: one row, one column, used like a value (average
// price 150.44, so only the Laptop is above it). Table-shaped: IN takes a list of ids (customers with a
// pending order), and a derived table in FROM is a result treated as a table. Contrast: a scalar
// subquery that returns several rows is an error. Real output (check:sql).
export const subqueries: Scene = {
  id: 'subqueries',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Scalar: one value. Table: a set of rows.', 2, [
      pair({
        id: 'scalar',
        title: 'scalar: compare with the average',
        file: 'scalar.sql',
        sql: ['SELECT name, price FROM products', 'WHERE price > (SELECT avg(price)', '                FROM products)', 'ORDER BY product_id;'],
        outs: [{ label: 'average is 150.44', headers: ['name', 'price'], values: [['Laptop 14"', '899.00']] }],
      }),
      pair({
        id: 'in',
        title: 'table: a list for IN',
        file: 'in-subquery.sql',
        sql: ['SELECT customer_id, first_name', 'FROM customers', 'WHERE customer_id IN (', '  SELECT customer_id FROM orders', "  WHERE status = 'pending')", 'ORDER BY customer_id;'],
        outs: [{ label: 'customers with a pending order', headers: ['customer_id', 'first_name'], values: [['1', 'Asha'], ['4', 'Dev'], ['9', 'Chloe']] }],
      }),
      pair({
        id: 'derived',
        title: 'table: a derived table in FROM',
        file: 'derived.sql',
        sql: ['SELECT t.customer_id, t.n', 'FROM (SELECT customer_id, count(*) AS n', '      FROM orders', '      GROUP BY customer_id) t', 'WHERE t.n > 1', 'ORDER BY t.customer_id;'],
        outs: [{ label: 'filter on an aggregate', headers: ['customer_id', 'n'], values: [['1', '3'], ['2', '2'], ['4', '2']] }],
      }),
      pair({
        id: 'many',
        title: 'scalar must be ONE row',
        file: 'scalar-many.sql',
        sql: ['-- expect-error: two rows', 'SELECT name FROM products', 'WHERE price = (SELECT price', '               FROM products', '               WHERE category_id = 6);'],
        err: { label: 'more than one row returned', sub: 'by a subquery used as an expression' },
      }),
    ]),
  ],
}
