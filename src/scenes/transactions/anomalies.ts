import type { Scene } from '@graphlearning/flow'
import { grid, timeline } from '../pair'

// §3 anomalies — three timelines, each run in two real sessions (scripts/timelines.mjs). Non-repeatable read: A reads
// 59.00, B commits 64.00, A's second read in the SAME transaction says 64.00 (READ COMMITTED, the default,
// takes a new snapshot per statement). Lost update: both read stock 120, both write 119 — two sales, one
// decrement. Write skew: both check "2 on duty", each takes a different person off, commit: 0 on duty.
export const anomalies: Scene = {
  id: 'anomalies',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'What goes wrong without a guarantee', 2, [
      timeline({
        id: 'nrr',
        title: 'non-repeatable read',
        steps: [
        { who: 'A', sql: ['BEGIN;'] },
        { who: 'A', sql: ['SELECT price FROM products', 'WHERE product_id = 1;'], out: '59.00' },
        { who: 'B', sql: ['UPDATE products SET price = 64.00', 'WHERE product_id = 1;'], out: 'UPDATE 1' },
        { who: 'A', sql: ['SELECT price FROM products', 'WHERE product_id = 1;'], out: '64.00' },
        { who: 'A', sql: ['COMMIT;'] },
        ],
      }),
      timeline({
        id: 'lost',
        title: 'lost update',
        steps: [
        { who: 'A', sql: ['BEGIN;'] },
        { who: 'A', sql: ['SELECT stock FROM products', 'WHERE product_id = 1;'], out: '120' },
        { who: 'B', sql: ['BEGIN;'] },
        { who: 'B', sql: ['SELECT stock FROM products', 'WHERE product_id = 1;'], out: '120' },
        { who: 'A', sql: ['UPDATE products SET stock = 119', 'WHERE product_id = 1;'], out: 'UPDATE 1' },
        { who: 'A', sql: ['COMMIT;'] },
        { who: 'B', sql: ['UPDATE products SET stock = 119', 'WHERE product_id = 1;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['COMMIT;'] },
        { who: 'A', sql: ['SELECT stock FROM products', 'WHERE product_id = 1;'], out: '119' },
        ],
      }),
      timeline({
        id: 'skew',
        title: 'write skew (REPEATABLE READ)',
        steps: [
        { who: 'A', sql: ['BEGIN ISOLATION LEVEL', '  REPEATABLE READ;'] },
        { who: 'B', sql: ['BEGIN ISOLATION LEVEL', '  REPEATABLE READ;'] },
        { who: 'A', sql: ['SELECT count(*) FROM duty', 'WHERE on_duty;'], out: '2' },
        { who: 'B', sql: ['SELECT count(*) FROM duty', 'WHERE on_duty;'], out: '2' },
        { who: 'A', sql: ['UPDATE duty SET on_duty = false', 'WHERE employee_id = 6;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['UPDATE duty SET on_duty = false', 'WHERE employee_id = 7;'], out: 'UPDATE 1' },
        { who: 'A', sql: ['COMMIT;'] },
        { who: 'B', sql: ['COMMIT;'] },
        { who: 'A', sql: ['SELECT count(*) FROM duty', 'WHERE on_duty;'], out: '0' },
        ],
      }),
      timeline({
        id: 'fix',
        title: 'the fix for the lost update',
        steps: [
        { who: 'A', sql: ['BEGIN;'] },
        { who: 'A', sql: ['UPDATE products', '  SET stock = stock - 1', 'WHERE product_id = 1;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['BEGIN;'] },
        { who: 'B', sql: ['UPDATE products', '  SET stock = stock - 1', 'WHERE product_id = 1;'], out: '(waits)' },
        { who: 'A', sql: ['COMMIT;'] },
        { who: 'B', sql: [], out: 'UPDATE 1' },
        { who: 'B', sql: ['COMMIT;'] },
        { who: 'A', sql: ['SELECT stock FROM products', 'WHERE product_id = 1;'], out: '118' },
        ],
      }),
    ]),
  ],
}
