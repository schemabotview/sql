import type { Scene } from '@graphlearning/flow'
import { grid, pair, tag } from '../pair'

// §8 cleaning-case — the worked case: customers 3 and 9 are one person (Chloe Martin, Lyon). Evidence:
// the same name and city, 2 rows. Decision: keep customer 3 (earlier signup), move order 11 to it, delete 9.
// Repair, in one transaction: UPDATE 1, DELETE 1. Reconciliation: customers 9 -> 8, orders 11 -> 11,
// orders of customer 3: 1 -> 2, orphans 0 -> 0. The step order matters: deleting 9 first would fail
// on the foreign key from order 11. Counts are real output; db/verify/ch08-modification.sql asserts them.
export const cleaningCase: Scene = {
  id: 'cleaning-case',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Evidence, decision, repair, reconciliation', 2, [
      pair({
        id: 'evidence',
        title: '1  evidence',
        file: 'duplicate-evidence.sql',
        sql: ['SELECT customer_id, first_name, last_name,', '  city, signup_date,', '  count(*) OVER (PARTITION BY first_name,', '    last_name, city) AS same_person', 'FROM customers', "WHERE last_name = 'Martin'", 'ORDER BY customer_id;'],
        outs: [{ label: 'one person, two records', headers: ['customer_id', 'first_name', 'last_name', 'city', 'signup_date', 'same_person'], values: [['3', 'Chloe', 'Martin', 'Lyon', '2025-02-03', '2'], ['9', 'Chloe', 'Martin', 'Lyon', '2025-04-20', '2']] }],
      }),
      {
        id: 'decide',
        kind: 'table',
        label: '2  decisions, written down',
        pattern: 'service',
        headers: ['question', 'decision'],
        values: [['which record survives', '3: earliest signup'], ['what happens to orders', 'order 11 moves to 3'], ['what happens to 9', 'deleted, after its orders move'], ['how is it undone', 'ROLLBACK before COMMIT']],
      },
      pair({
        id: 'repair',
        title: '3  repair, in order',
        file: 'merge-duplicate.sql',
        sql: ['BEGIN;', 'UPDATE orders SET customer_id = 3', 'WHERE customer_id = 9;', '', 'DELETE FROM customers', 'WHERE customer_id = 9;', '', '-- check, then COMMIT or ROLLBACK'],
        outs: [tag('order 11 moved', 'UPDATE 1'), tag('duplicate removed', 'DELETE 1')],
      }),
      {
        id: 'recon',
        kind: 'table',
        label: '4  reconciliation',
        pattern: 'service',
        headers: ['measure', 'before', 'after'],
        values: [['customers', '9', '8'], ['orders', '11', '11'], ['orders of customer 3', '1', '2'], ['orders with no customer', '0', '0']],
      },
    ]),
  ],
}
