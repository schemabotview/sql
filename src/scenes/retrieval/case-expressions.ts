import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §7 case-expressions — a value that depends on a condition. CASE tests its WHEN branches IN ORDER and
// the first true one wins, so the same branches in a different order give a different answer: with
// `price < 100` first, "SQL for Beginners" (29.90) is 'mid', never 'budget'. The last card is the
// NULL-handling pair: COALESCE substitutes a fallback for a NULL. All three run under check:sql.
export const caseExpressions: Scene = {
  id: 'case-expressions',
  padding: 0.1,
  flow: 'TB',
  nodes: [
    grid('cards', 'A value that depends on a condition', 2, [
      pair({
        id: 'tier',
        title: 'first true branch wins',
        file: 'tier.sql',
        sql: ['SELECT name, price,', '  CASE', "    WHEN price < 30  THEN 'budget'", "    WHEN price < 100 THEN 'mid'", "    ELSE 'premium'", '  END AS tier', 'FROM products', 'WHERE product_id IN (1,2,4,6,8)', 'ORDER BY product_id;'],
        outs: [{ label: '5 products, 3 tiers', headers: ['name', 'price', 'tier'], values: [['Wireless Earbuds', '59.00', 'mid'], ['Studio Headphones', '149.00', 'premium'], ['Laptop 14"', '899.00', 'premium'], ['SQL for Beginners', '29.90', 'budget'], ['Desk Lamp', '34.00', 'mid']] }],
      }),
      pair({
        id: 'order',
        title: 'the same branches, reordered',
        file: 'case-order.sql',
        sql: ['SELECT name,', '  CASE', "    WHEN price < 100 THEN 'mid'", "    WHEN price < 30  THEN 'budget'", "    ELSE 'premium'", '  END AS tier', 'FROM products', 'WHERE product_id = 6;'],
        outs: [{ label: 'budget became unreachable', headers: ['name', 'tier'], values: [['SQL for Beginners', 'mid']], pattern: 'warn' }],
      }),
      pair({
        id: 'coalesce',
        title: 'a fallback for NULL',
        file: 'coalesce.sql',
        sql: ['SELECT first_name,', "  coalesce(phone, 'no phone')", '    AS phone', 'FROM customers', 'WHERE customer_id IN (1, 5)', 'ORDER BY customer_id;'],
        outs: [{ label: "Elena's NULL is replaced", headers: ['first_name', 'phone'], values: [['Asha', '+91-98450-11111'], ['Elena', 'no phone']] }],
      }),
    ]),
  ],
  edges: [],
}
