import type { Scene } from '@graphlearning/flow'
import { grid, timeline } from '../pair'

// §5 locking — a writer holds a row lock until COMMIT/ROLLBACK. Session C's plain SELECT is NOT blocked (it
// sees 120, MVCC), C's UPDATE of a DIFFERENT row is not blocked, SELECT … FOR UPDATE NOWAIT fails
// immediately ("could not obtain lock on row"), and B's UPDATE of the same row waits until A commits;
// the runner confirms B is waiting on a lock (pg_stat_activity) before A commits. Afterwards stock is 118.
export const locking: Scene = {
  id: 'locking',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Who waits for whom', 1, [
      timeline({
        id: 'blk',
        title: 'writers wait; readers do not', sessions: ['A', 'B', 'C'],
        steps: [
        { who: 'A', sql: ['BEGIN;'] },
        { who: 'A', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 1;'], out: 'UPDATE 1' },
        { who: 'C', sql: ['SELECT stock FROM products', 'WHERE product_id = 1;'], out: '120' },
        { who: 'C', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 2;'], out: 'UPDATE 1' },
        { who: 'C', sql: ['SELECT stock FROM products', 'WHERE product_id = 1', 'FOR UPDATE NOWAIT;'], out: 'ERROR:  could not obtain lock on row' },
        { who: 'B', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 1;'], out: '(waits)' },
        { who: 'A', sql: ['COMMIT;'] },
        { who: 'B', sql: [], out: 'UPDATE 1' },
        { who: 'C', sql: ['SELECT stock FROM products', 'WHERE product_id = 1;'], out: '118' },
        ],
      }),
      {
        id: 'modes',
        kind: 'table',
        label: 'what blocks what',
        pattern: 'service',
        headers: ['holder', 'requester', 'result'],
        values: [['UPDATE a row', 'UPDATE the same row', 'waits for COMMIT'], ['UPDATE a row', 'SELECT the row', 'reads the old version'], ['UPDATE a row', 'UPDATE another row', 'no conflict'], ['UPDATE a row', 'FOR UPDATE NOWAIT', 'error at once']],
      },
      { id: 'long', label: 'long transactions hold locks', sub: 'keep them short', pattern: 'warn', icon: 'triangleAlert' },
    ]),
  ],
}
