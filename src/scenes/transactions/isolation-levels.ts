import type { Scene } from '@graphlearning/flow'
import { grid, timeline } from '../pair'

// §4 isolation-levels — PostgreSQL's three working levels (READ UNCOMMITTED behaves as READ COMMITTED; there
// are no dirty reads). REPEATABLE READ gives A a stable snapshot: the price stays 59.00 and the pending
// count stays 3 (no phantom) after B commits, and A's own UPDATE of the row B changed is refused (SQLSTATE
// 40001). SERIALIZABLE refuses the second commit of the write-skew pair. Both refusals mean "run the whole
// transaction again". The table is PostgreSQL-specific; the SQL standard allows more anomalies at each level.
export const isolationLevels: Scene = {
  id: 'isolation-levels',
  padding: 0.1,
  flow: 'LR',
  edges: [],
  nodes: [
    grid('left', 'Choose the weakest level that protects the invariant', 1, [
      timeline({
        id: 'rr',
        title: 'REPEATABLE READ: a stable snapshot',
        steps: [
        { who: 'A', sql: ['BEGIN ISOLATION LEVEL', '  REPEATABLE READ;'] },
        { who: 'A', sql: ['SELECT price FROM products', 'WHERE product_id = 1;'], out: '59.00' },
        { who: 'A', sql: ['SELECT count(*) FROM orders', 'WHERE status = \'pending\';'], out: '3' },
        { who: 'B', sql: ['UPDATE products SET price = 64.00', 'WHERE product_id = 1;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['INSERT INTO orders VALUES', '  (12, 2, NULL, \'2025-03-13\',', '   \'pending\');'], out: 'INSERT 0 1' },
        { who: 'A', sql: ['SELECT price FROM products', 'WHERE product_id = 1;'], out: '59.00' },
        { who: 'A', sql: ['SELECT count(*) FROM orders', 'WHERE status = \'pending\';'], out: '3' },
        { who: 'A', sql: ['UPDATE products', '  SET price = price * 1.1', 'WHERE product_id = 1;'], out: 'ERROR:  could not serialize … concurrent update' },
        { who: 'A', sql: ['ROLLBACK;'] },
        ],
      }),
      timeline({
        id: 'ser',
        title: 'SERIALIZABLE: write skew refused',
        steps: [
        { who: 'A', sql: ['BEGIN ISOLATION LEVEL', '  SERIALIZABLE;'] },
        { who: 'B', sql: ['BEGIN ISOLATION LEVEL', '  SERIALIZABLE;'] },
        { who: 'A', sql: ['SELECT count(*) FROM duty', 'WHERE on_duty;'], out: '2' },
        { who: 'B', sql: ['SELECT count(*) FROM duty', 'WHERE on_duty;'], out: '2' },
        { who: 'A', sql: ['UPDATE duty SET on_duty = false', 'WHERE employee_id = 6;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['UPDATE duty SET on_duty = false', 'WHERE employee_id = 7;'], out: 'UPDATE 1' },
        { who: 'A', sql: ['COMMIT;'] },
        { who: 'B', sql: ['COMMIT;'], out: 'ERROR:  could not serialize … dependencies' },
        { who: 'A', sql: ['SELECT count(*) FROM duty', 'WHERE on_duty;'], out: '1' },
        ],
      }),
    ]),
    grid('right', 'Reading the result', 1, [
      {
        id: 'levels',
        kind: 'table',
        label: 'what each PostgreSQL level prevents',
        pattern: 'service',
        headers: ['', 'dirty read', 'non-repeatable', 'phantom', 'write skew'],
        values: [['READ COMMITTED', 'prevented', 'possible', 'possible', 'possible'], ['REPEATABLE READ', 'prevented', 'prevented', 'prevented', 'possible'], ['SERIALIZABLE', 'prevented', 'prevented', 'prevented', 'prevented']],
      },
      { id: 'retry', label: 'a refusal is an order', sub: '40001: run it again', pattern: 'warn', icon: 'triangleAlert' },
    ]),
  ],
}
