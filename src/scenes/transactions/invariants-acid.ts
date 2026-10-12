import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §1 invariants-acid — a business invariant is a rule that must hold every time ("stock is never negative",
// "an order never exists without its lines"). Placing an order for product 9 (stock 0) takes three statements:
// insert the order, insert its line, decrement stock. The third is refused by CHECK (stock >= 0), and the
// transaction boundary is what undoes the first two as well — asserted in db/verify/ch09-transactions.sql.
// The ACID table maps each letter onto this example; durability is stated, not demonstrated.
export const invariantsAcid: Scene = {
  id: 'invariants-acid',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'An invariant, a mechanism, a boundary', 2, [
      {
        id: 'invariants',
        kind: 'table',
        label: 'business invariants and what enforces them',
        pattern: 'service',
        headers: ['invariant', 'enforced by'],
        values: [['stock is never negative', 'CHECK constraint'], ['a line belongs to a real order', 'foreign key'], ['an order never exists without its lines', 'transaction boundary']],
      },
      pair({
        id: 'place',
        title: 'placing an order: three steps',
        file: 'place-order.sql',
        sql: ['-- expect-error: product 9 has stock 0', "INSERT INTO orders VALUES", "  (12, 2, NULL, '2025-03-13', 'pending');", 'INSERT INTO order_items VALUES', '  (12, 1, 9, 1, 52.00);', 'UPDATE products SET stock = stock - 1', 'WHERE product_id = 9;'],
        err: { label: 'step 3 refused', sub: 'stock would be negative' },
      }),
      {
        id: 'acid',
        kind: 'table',
        label: 'ACID in this example',
        pattern: 'service',
        headers: ['letter', 'what it means here'],
        values: [['Atomicity', 'order, line and stock all happen, or none'], ['Consistency', 'constraints hold before and after'], ['Isolation', 'others never see a half-done order'], ['Durability', 'committed work survives a crash (not shown)']],
      },
      { id: 'allornothing', label: 'all-or-nothing', sub: 'steps 1 and 2 are undone too', pattern: 'warn', icon: 'triangleAlert' },
    ]),
  ],
}
