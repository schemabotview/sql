import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §6 functions — three families of built-in function, each on real data. Strings: upper, length,
// position, left, and `||` to concatenate. Numbers: round to a place, ceil, floor, abs. Dates: a date
// plus an integer is a date n days later, extract pulls out a part, and subtracting two dates gives a
// number of DAYS. Function names and date arithmetic differ between products; these are PostgreSQL's,
// and the slide says so.
export const functions: Scene = {
  id: 'functions',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    grid('cards', 'Built-in functions, three families', 2, [
      pair({
        id: 'string',
        title: 'text',
        file: 'string.sql',
        sql: ['SELECT upper(last_name) AS shout,', '  length(email) AS chars,', "  left(email, position('@' in email) - 1)", '    AS handle,', "  first_name || ' ' || last_name", '    AS full_name', 'FROM customers WHERE customer_id = 1;'],
        outs: [{ label: 'one customer, four expressions', headers: ['shout', 'chars', 'handle', 'full_name'], values: [['RAO', '20', 'asha.rao', 'Asha Rao']] }],
      }),
      pair({
        id: 'numeric',
        title: 'numbers',
        file: 'numeric.sql',
        sql: ['SELECT round(29.90 * 1.18, 1) AS r1,', '       ceil(29.90)  AS up,', '       floor(29.90) AS down,', '       abs(-5)      AS absolute;'],
        outs: [{ label: 'rounding and sign', headers: ['r1', 'up', 'down', 'absolute'], values: [['35.3', '30', '29', '5']] }],
      }),
      pair({
        id: 'date',
        title: 'dates',
        file: 'dates.sql',
        sql: ['SELECT order_id, order_date,', '  order_date + 7 AS due,', '  extract(month FROM order_date)', '    AS month', 'FROM orders', 'WHERE order_id IN (1, 9)', 'ORDER BY order_id;', '', "SELECT DATE '2025-03-12'", "     - DATE '2025-03-01'", '       AS days_between;'],
        outs: [
          { label: 'a date plus 7 days', headers: ['order_id', 'order_date', 'due', 'month'], values: [['1', '2025-03-01', '2025-03-08', '3'], ['9', '2025-03-12', '2025-03-19', '3']] },
          { label: 'date minus date = days', headers: ['days_between'], values: [['11']] },
        ],
      }),
    ]),
  ],
  edges: [],
}
