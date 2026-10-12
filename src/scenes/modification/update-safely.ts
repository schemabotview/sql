import type { Scene } from '@graphlearning/flow'
import { grid, pair, tag } from '../pair'

// §2 update-safely — target by key, return before/after, and let constraints be the net. Product 1:
// price 59.00 -> 64.00 and stock 120 -> 100 (stock = stock - 20 computed from the old value). A predicate
// can be broader than intended: status = 'pending' matches orders 9, 10 AND 11 — including 10 (part
// paid) and 11 (unpaid), so "ship pending orders" is a business bug, not a SQL error. A CHECK
// constraint refuses price = 0, leaving the row unchanged.
export const updateSafely: Scene = {
  id: 'update-safely',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Narrow the target, check the result', 2, [
      pair({
        id: 'key',
        title: 'by primary key',
        file: 'update-key.sql',
        sql: ['UPDATE products', '  SET price = 64.00,', '      stock = stock - 20', 'WHERE product_id = 1', 'RETURNING product_id, price, stock;'],
        outs: [{ label: 'stock uses the old value', headers: ['product_id', 'price', 'stock'], values: [['1', '64.00', '100']] }],
      }),
      {
        id: 'beforeafter',
        kind: 'table',
        label: 'before and after, product 1',
        pattern: 'service',
        headers: ['column', 'before', 'after'],
        values: [['price', '59.00', '64.00'], ['stock', '120', '100']],
      },
      pair({
        id: 'broad',
        title: 'a predicate wider than intended',
        file: 'update-broad.sql',
        sql: ['UPDATE orders', "  SET status = 'shipped'", "WHERE status = 'pending'", 'RETURNING order_id;'],
        outs: [{ label: 'orders 10 (part paid) and 11 (unpaid) too', headers: ['order_id'], values: [['9'], ['10'], ['11']], pattern: 'warn' }, tag('three rows, not one', 'UPDATE 3', true)],
      }),
      pair({
        id: 'check',
        title: 'constraints are the safety net',
        file: 'update-check.sql',
        sql: ['-- expect-error: price must be > 0', 'UPDATE products SET price = 0', 'WHERE product_id = 1;'],
        err: { label: 'check constraint refused it', sub: 'row stays unchanged' },
      }),
    ]),
  ],
}
