import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §1 select-grain — three questions about what a SELECT returns. Aliases rename output columns only.
// DISTINCT changes the GRAIN — what one result row means: SELECT status returns one row per order
// (11), SELECT DISTINCT status one row per kind of status (4), and DISTINCT city one per city (8)
// although there are 9 customers, because customers 3 and 9 share Lyon. The counts are asserted in
// db/verify/ch04-retrieval.sql.
export const selectGrain: Scene = {
  id: 'select-grain',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    grid('cards', 'Choose columns, name them, and decide the grain', 2, [
      pair({
        id: 'alias',
        title: 'aliases rename the output',
        file: 'alias.sql',
        sql: ['SELECT first_name,', '       city AS home_city', 'FROM customers', 'WHERE customer_id <= 3', 'ORDER BY customer_id;'],
        outs: [{ label: '3 rows — one per customer', headers: ['first_name', 'home_city'], values: [['Asha', 'Bengaluru'], ['Ben', 'London'], ['Chloe', 'Lyon']] }],
      }),
      pair({
        id: 'distinct',
        title: 'DISTINCT changes the grain',
        file: 'distinct.sql',
        sql: ['SELECT DISTINCT status', 'FROM orders', 'ORDER BY status;'],
        outs: [{ label: '4 rows — one per status', headers: ['status'], values: [['cancelled'], ['delivered'], ['pending'], ['shipped']] }],
      }),
    ]),
    {
      id: 'grain',
      kind: 'table',
      label: 'Grain: what does ONE result row mean?',
      pattern: 'storage',
      headers: ['query', 'one row means', 'rows'],
      values: [
        ['SELECT status FROM orders', 'one order', '11'],
        ['SELECT DISTINCT status FROM orders', 'one kind of status', '4'],
        ['SELECT DISTINCT city FROM customers', 'one city (9 customers)', '8'],
      ],
    },
  ],
  edges: [{ source: 'cards', target: 'grain' }],
}
