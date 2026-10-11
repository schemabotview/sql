import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §5 arithmetic-casts — expressions compute per row, and types decide the answer. The first card
// adds 18% tax to two real prices (round(…, 2) keeps money at two places). The second is the trap:
// integer division truncates (7 / 2 = 3) unless one side is exact (7 / 2.0). The third converts
// explicitly with CAST and `::`, and the last shows a conversion that cannot succeed — an error, not a
// guess. All run under check:sql; the failing one is behind -- expect-error.
export const arithmeticCasts: Scene = {
  id: 'arithmetic-casts',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    grid('cards', 'Expressions and conversions', 2, [
      pair({
        id: 'tax',
        title: 'arithmetic per row',
        file: 'tax.sql',
        sql: ['SELECT name, price,', '  round(price * 1.18, 2)', '    AS with_tax', 'FROM products', 'WHERE product_id IN (1, 6)', 'ORDER BY product_id;'],
        outs: [{ label: '2 rows', headers: ['name', 'price', 'with_tax'], values: [['Wireless Earbuds', '59.00', '69.62'], ['SQL for Beginners', '29.90', '35.28']] }],
      }),
      pair({
        id: 'intdiv',
        title: 'integer division truncates',
        file: 'division.sql',
        sql: ['SELECT 7 / 2   AS int_div,', '       7 / 2.0 AS exact_div,', '       7 % 2   AS remainder;'],
        outs: [{ label: '7 / 2 is 3, not 3.5', headers: ['int_div', 'exact_div', 'remainder'], values: [['3', '3.5000000000000000', '1']], pattern: 'warn' }],
      }),
      pair({
        id: 'cast',
        title: 'explicit conversion',
        file: 'cast.sql',
        sql: ["SELECT CAST('12' AS integer) + 1", '         AS n,', "       '2025-03-01'::date + 30", '         AS plus_30;'],
        outs: [{ label: 'text became a number and a date', headers: ['n', 'plus_30'], values: [['13', '2025-03-31']] }],
      }),
      pair({
        id: 'castfail',
        title: 'a conversion that cannot work',
        file: 'cast-fails.sql',
        sql: ['-- expect-error: not a number', "SELECT 'abc'::integer;"],
        err: { label: 'invalid input syntax', sub: 'for type integer: "abc"' },
      }),
    ]),
  ],
  edges: [],
}
