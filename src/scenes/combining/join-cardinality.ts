import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §1 join-cardinality — a join pairs rows, so the result's grain is decided by the relationship. The
// chain shows who is "one" and who is "many" (customers 9 → orders 11 → order lines 16 → products 10).
// Joining orders to their lines raises 11 rows to 16 (one per line); joining customers to orders keeps
// 11 (each order has exactly one customer). Counts are the output of the three cards (check:sql).
export const joinCardinality: Scene = {
  id: 'join-cardinality',
  padding: 0.08,
  flow: 'TB',
  nodes: [
    {
      id: 'chain',
      label: 'One-to-many relationships in the shop (rows in the seed)',
      pattern: 'group',
      icon: 'none',
      cols: 4,
      children: [
        { id: 't-customers', label: 'customers', sub: '9 rows · one per customer', pattern: 'storage', icon: 'none' },
        { id: 't-orders', label: 'orders', sub: '11 rows · one per order', pattern: 'storage', icon: 'none' },
        { id: 't-items', label: 'order_items', sub: '16 rows · one per line', pattern: 'storage', icon: 'none' },
        { id: 't-products', label: 'products', sub: '10 rows · one per product', pattern: 'storage', icon: 'none' },
      ],
      edges: [
        { source: 't-customers', target: 't-orders' },
        { source: 't-orders', target: 't-items' },
        { source: 't-products', target: 't-items' },
      ],
    },
    grid('cards', 'The grain follows the "many" side', 3, [
      pair({
        id: 'base',
        title: 'before joining',
        file: 'orders-count.sql',
        sql: ['SELECT count(*) AS orders', 'FROM orders;'],
        outs: [{ label: 'grain: one order', headers: ['orders'], values: [['11']] }],
      }),
      pair({
        id: 'lines',
        title: 'orders → their lines',
        file: 'orders-lines.sql',
        sql: ['SELECT count(*) AS rows', 'FROM orders o', 'JOIN order_items i', '  ON i.order_id = o.order_id;'],
        outs: [{ label: 'grain: one line', headers: ['rows'], values: [['16']], pattern: 'warn' }],
      }),
      pair({
        id: 'owner',
        title: 'orders → their customer',
        file: 'orders-customers.sql',
        sql: ['SELECT count(*) AS rows', 'FROM customers c', 'JOIN orders o', '  ON o.customer_id = c.customer_id;'],
        outs: [{ label: 'grain: still one order', headers: ['rows'], values: [['11']] }],
      }),
    ]),
  ],
  edges: [{ source: 'chain', target: 'cards' }],
}
