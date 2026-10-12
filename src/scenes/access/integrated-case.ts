import type { Scene, SceneNode } from '@graphlearning/flow'
import { grid, pair, pairSide, tag } from '../pair'

// §6 integrated-case — one shop, ten chapters. Top: where each chapter shows up in this case. Below, three
// cards that pull the course together: (1) place order 12 for Ben — insert the order and its line (ch 3, 8),
// decrement stock with a guarded UPDATE (ch 9), read the order back through a join (ch 5): total 59.80;
// (2) rank customers by spend with a CTE and a window (ch 4, 6): Dev 1205.00, Ben 1017.00, Asha 460.80;
// (3) let a support role see orders by status through a view but not read customer emails (ch 10). All figures
// are real output (check:sql). It narrates reasoning; it does not claim the learner is competent.
const chip = (id: string, label: string): SceneNode => ({ id, label, variant: 'chip', pattern: 'service', icon: 'none' })

export const integratedCase: Scene = {
  id: 'integrated-case',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    {
      id: 'chain',
      label: 'the shop, chapter by chapter',
      pattern: 'group',
      icon: 'none',
      cols: 5,
      children: [
        chip('c1', '1 tables, keys'),
        chip('c2', '2 structures'),
        chip('c3', '3 loading'),
        chip('c4', '4 retrieval'),
        chip('c5', '5 combining'),
        chip('c6', '6 analytics'),
        chip('c7', '7 performance'),
        chip('c8', '8 changes'),
        chip('c9', '9 transactions'),
        chip('c10', '10 access'),
      ],
    },
    grid('cards', 'One order, one ranking, one controlled view', 3, [
      pairSide({
        id: 'place',
        title: 'place and read an order',
        file: 'case-place.sql',
        sql: [
          'INSERT INTO orders VALUES',
          "  (12, 2, NULL, '2025-03-13', 'pending');",
          'INSERT INTO order_items VALUES',
          '  (12, 1, 6, 2, 29.90);',
          'UPDATE products SET stock = stock - 2',
          'WHERE product_id = 6 AND stock >= 2;',
          '',
          'SELECT o.order_id, c.first_name,',
          '  sum(i.quantity * i.unit_price) AS total',
          'FROM orders o',
          'JOIN customers c USING (customer_id)',
          'JOIN order_items i USING (order_id)',
          'WHERE o.order_id = 12',
          'GROUP BY o.order_id, c.first_name;',
        ],
        outs: [{ label: 'the order, joined', headers: ['order_id', 'first_name', 'total'], values: [['12', 'Ben', '59.80']] }, tag('stock decremented once', 'UPDATE 1')],
      }),
      pair({
        id: 'rank',
        title: 'rank customers by spend',
        file: 'case-rank.sql',
        sql: [
          'WITH spend AS (',
          '  SELECT o.customer_id,',
          '    sum(i.quantity * i.unit_price) AS spend',
          '  FROM orders o',
          '  JOIN order_items i USING (order_id)',
          "  WHERE o.status <> 'cancelled'",
          '  GROUP BY o.customer_id)',
          'SELECT c.first_name, s.spend,',
          '  rank() OVER (ORDER BY s.spend DESC) AS rank',
          'FROM spend s',
          'JOIN customers c USING (customer_id)',
          'ORDER BY rank LIMIT 3;',
        ],
        outs: [{ label: 'top three', headers: ['first_name', 'spend', 'rank'], values: [['Dev', '1205.00', '1'], ['Ben', '1017.00', '2'], ['Asha', '460.80', '3']] }],
      }),
      pair({
        id: 'access',
        title: 'a support role, narrowly',
        file: 'case-access.sql',
        sql: [
          '-- expect-error: support may not read emails',
          'CREATE ROLE support NOLOGIN;',
          'GRANT USAGE ON SCHEMA shop TO support;',
          'CREATE VIEW order_overview AS',
          '  SELECT o.order_id, o.status, c.city',
          '  FROM orders o',
          '  JOIN customers c USING (customer_id);',
          'GRANT SELECT ON order_overview TO support;',
          'SET ROLE support;',
          '',
          'SELECT status, count(*) AS orders',
          'FROM order_overview GROUP BY status',
          'ORDER BY status;',
          'SELECT email FROM customers;',
        ],
        outs: [{ label: 'what support may see', headers: ['status', 'orders'], values: [['cancelled', '1'], ['delivered', '5'], ['pending', '3'], ['shipped', '2']] }],
        err: { label: 'emails stay closed', sub: 'permission denied' },
      }),
    ]),
  ],
}
