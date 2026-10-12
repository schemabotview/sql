import type { Scene } from '@graphlearning/flow'
import { grid, timeline } from '../pair'

// §8 purchase-timelines — one laptop (product 4, stock set to 1) and two buyers. Naive: both read stock 1; A
// decrements and commits; B's decrement waits, then is refused by CHECK (stock >= 0) — the database is the last
// guard. Guarded: the stock test is part of the UPDATE (AND stock >= 1); B waits for A and, after A commits,
// re-checks its WHERE: stock is 0, so UPDATE 0 — the application reads that as "sold out" and creates no order.
// Both timelines are run in two real sessions (scripts/timelines.mjs). The pseudocode is the application's shape.
export const purchaseTimelines: Scene = {
  id: 'purchase-timelines',
  padding: 0.1,
  flow: 'LR',
  edges: [],
  nodes: [
    grid('left', 'The last laptop', 1, [
      timeline({
        id: 'naive',
        title: 'naive: read, decide, write',
        steps: [
        { who: 'A', sql: ['BEGIN;'] },
        { who: 'B', sql: ['BEGIN;'] },
        { who: 'A', sql: ['SELECT stock FROM products', 'WHERE product_id = 4;'], out: '1' },
        { who: 'B', sql: ['SELECT stock FROM products', 'WHERE product_id = 4;'], out: '1' },
        { who: 'A', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 4;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 4;'], out: '(waits)' },
        { who: 'A', sql: ['COMMIT;'] },
        { who: 'B', sql: [], out: 'ERROR:  … violates check constraint' },
        { who: 'B', sql: ['ROLLBACK;'] },
        ],
      }),
      timeline({
        id: 'guarded',
        title: 'guarded: the test is the update',
        steps: [
        { who: 'A', sql: ['BEGIN;'] },
        { who: 'B', sql: ['BEGIN;'] },
        { who: 'A', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 4', '  AND stock >= 1;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 4', '  AND stock >= 1;'], out: '(waits)' },
        { who: 'A', sql: ['COMMIT;'] },
        { who: 'B', sql: [], out: 'UPDATE 0' },
        { who: 'B', sql: ['COMMIT;'] },
        { who: 'A', sql: ['SELECT stock FROM products', 'WHERE product_id = 4;'], out: '0' },
        ],
      }),
    ]),
    grid('right', 'Making it safe', 1, [
      {
        id: 'buy',
        kind: 'code',
        filename: 'purchase-pseudocode.txt',
        hug: true,
        label: ['BEGIN', 'UPDATE products SET stock = stock - 1', '  WHERE product_id = :p AND stock >= 1', 'if no row was updated:', '  ROLLBACK; tell the buyer: sold out', 'else:', '  INSERT the order and its line', '  COMMIT', '', 'retry the whole block on 40P01 / 40001'].join('\n'),
      },
      {
        id: 'outcome',
        kind: 'table',
        label: 'outcome of the guarded run',
        pattern: 'service',
        headers: ['buyer', 'result', 'stock after'],
        values: [['A', 'order created', '0'], ['B', 'sold out, no order', '0']],
      },
    ]),
  ],
}
