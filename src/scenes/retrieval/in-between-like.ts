import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §3 in-between-like — three shorthands for conditions you could write longhand. IN is a list of OR
// equalities (4 customers live in London, Lyon or Milan). BETWEEN is INCLUSIVE at both ends — the
// 29.90 and 44.00 rows are in the result, which is the surprise. LIKE matches patterns, and is case
// SENSITIVE: 'c%' finds two emails, 'C%' finds none, with no error to say so.
export const inBetweenLike: Scene = {
  id: 'in-between-like',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    grid('cards', 'Shorthand for common conditions', 2, [
      pair({
        id: 'in',
        title: 'IN: one of a list',
        file: 'in.sql',
        sql: ['SELECT first_name, city', 'FROM customers', "WHERE city IN ('London', 'Lyon', 'Milan')", 'ORDER BY customer_id;'],
        outs: [{ label: '4 rows (Lyon twice)', headers: ['first_name', 'city'], values: [['Ben', 'London'], ['Chloe', 'Lyon'], ['Elena', 'Milan'], ['Chloe', 'Lyon']] }],
      }),
      pair({
        id: 'between',
        title: 'BETWEEN includes both ends',
        file: 'between.sql',
        sql: ['SELECT name, price', 'FROM products', 'WHERE price BETWEEN 29.90 AND 44.00', 'ORDER BY price;'],
        outs: [{ label: '4 rows — both ends are in', headers: ['name', 'price'], values: [['SQL for Beginners', '29.90'], ['Desk Lamp', '34.00'], ['Retro Cassette Player', '39.00'], ['Database Design', '44.00']] }],
      }),
      pair({
        id: 'like',
        title: 'LIKE is case sensitive',
        file: 'like.sql',
        sql: [
          'SELECT customer_id, email',
          'FROM customers',
          "WHERE email LIKE 'c%'",
          'ORDER BY customer_id;',
          '',
          'SELECT customer_id FROM customers',
          "WHERE email LIKE 'C%';",
        ],
        outs: [
          { label: "'c%': 2 rows", headers: ['customer_id', 'email'], values: [['3', 'chloe.martin@example.com'], ['9', 'c.martin@example.org']] },
          { label: "'C%': 0 rows, no error", headers: ['customer_id'], values: [], pattern: 'warn' },
        ],
      }),
    ]),
  ],
  edges: [],
}
