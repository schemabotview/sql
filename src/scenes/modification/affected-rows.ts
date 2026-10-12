import type { Scene } from '@graphlearning/flow'
import { grid, pair, tag } from '../pair'

// §1 affected-rows — before a change, ask how many rows it should touch; after, compare with the
// command tag. Preview: 2 products are in category 5. The UPDATE returns the new prices and the tag
// UPDATE 2. Without WHERE the same statement says UPDATE 10 — the number that should stop you.
// ROLLBACK undoes it: the last card shows prices back at 34.00 / 52.00. Tags and rows are real output; that
// UPDATE with no WHERE touches 10 rows and a rollback restores prices is asserted in db/verify/ch08-modification.sql.
export const affectedRows: Scene = {
  id: 'affected-rows',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Predict the count, change, compare, undo', 2, [
      pair({
        id: 'preview',
        title: '1  preview with SELECT',
        file: 'preview.sql',
        sql: ['SELECT count(*) AS will_change', 'FROM products', 'WHERE category_id = 5;'],
        outs: [{ label: 'expected: 2 rows', headers: ['will_change'], values: [['2']] }],
      }),
      pair({
        id: 'change',
        title: '2  change and compare',
        file: 'update-returning.sql',
        sql: ['UPDATE products', '  SET price = round(price * 1.10, 2)', 'WHERE category_id = 5', 'RETURNING product_id, name, price;'],
        outs: [
          { label: 'the new values', headers: ['product_id', 'name', 'price'], values: [['8', 'Desk Lamp', '37.40'], ['9', 'Coffee Grinder', '57.20']] },
          tag('matches the preview', 'UPDATE 2'),
        ],
      }),
      pair({
        id: 'nowhere',
        title: 'the warning sign',
        file: 'update-no-where.sql',
        sql: ['UPDATE products', '  SET price = round(price * 1.10, 2);', '-- no WHERE: every row'],
        outs: [tag('10 is not the 2 you expected', 'UPDATE 10', true)],
      }),
      pair({
        id: 'undo',
        title: '3  undo: ROLLBACK TO',
        file: 'rollback.sql',
        sql: ['BEGIN;', 'SAVEPOINT before_update;', '', 'UPDATE products', '  SET price = round(price * 1.10, 2)', 'WHERE category_id = 5;', '', 'ROLLBACK TO before_update;', '', 'SELECT product_id, price FROM products', 'WHERE category_id = 5 ORDER BY product_id;'],
        outs: [{ label: 'prices are back', headers: ['product_id', 'price'], values: [['8', '34.00'], ['9', '52.00']] }],
      }),
    ]),
  ],
}
