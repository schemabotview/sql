import type { Scene } from '@graphlearning/flow'
import { grid, timeline } from '../pair'

// §7 deadlocks — A locks product 1, B locks product 2; A then asks for 2 and B for 1: each waits for the other.
// After deadlock_timeout (1 s by default) PostgreSQL aborts one transaction; here A waited first, so A is
// the victim ("deadlock detected") and B proceeds. Locking in one agreed order (lowest id first) means B simply
// waits for A and nothing is aborted. The pseudocode is the retry loop — not run, it is the shape of the application code.
export const deadlocks: Scene = {
  id: 'deadlocks',
  padding: 0.1,
  flow: 'LR',
  edges: [],
  nodes: [
    grid('left', 'Opposite orders deadlock; one order does not', 1, [
      timeline({
        id: 'dl',
        title: 'a deadlock',
        steps: [
        { who: 'A', sql: ['BEGIN;'] },
        { who: 'B', sql: ['BEGIN;'] },
        { who: 'A', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 1;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 2;'], out: 'UPDATE 1' },
        { who: 'A', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 2;'], out: '(waits)' },
        { who: 'B', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 1;'], out: '(waits for A)' },
        { who: 'A', sql: [], out: 'ERROR:  deadlock detected' },
        { who: 'B', sql: [], out: 'UPDATE 1' },
        ],
      }),
      timeline({
        id: 'order',
        title: 'the same work, one lock order',
        steps: [
        { who: 'A', sql: ['BEGIN;'] },
        { who: 'B', sql: ['BEGIN;'] },
        { who: 'A', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 1;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 1;'], out: '(waits)' },
        { who: 'A', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 2;'], out: 'UPDATE 1' },
        { who: 'A', sql: ['COMMIT;'] },
        { who: 'B', sql: [], out: 'UPDATE 1' },
        { who: 'B', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 2;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['COMMIT;'] },
        ],
      }),
    ]),
    grid('right', 'Handling it', 1, [
      {
        id: 'retry',
        kind: 'code',
        filename: 'retry-pseudocode.txt',
        hug: true,
        label: ['repeat at most 3 times:', '  BEGIN', '  ... the inventory changes ...', '  COMMIT', '  if it succeeded: stop', '', '  on deadlock (40P01) or', '  serialization failure (40001):', '    ROLLBACK, wait briefly, repeat', '  on any other error:', '    ROLLBACK, report it'].join('\n'),
      },
      { id: 'why', label: 'retries are normal', sub: 'the database chose to abort one side', pattern: 'warn', icon: 'triangleAlert' },
    ]),
  ],
}
