import type { Scene } from '@graphlearning/flow'
import { grid, timeline } from '../pair'

// §6 mvcc — an UPDATE writes a NEW row version; readers see the version that was current for their snapshot.
// A (REPEATABLE READ, snapshot taken at its first read) keeps seeing 59.00 even after B commits 64.00; C,
// a fresh reader, sees 59.00 while B is uncommitted and 64.00 afterwards; B sees its own change at once.
// After A commits, a new statement sees 64.00. The versions table is symbolic (T1, T2 stand for transaction
// ids); that an update creates a new version is asserted via xmin/ctid in db/verify/ch09-transactions.sql.
export const mvcc: Scene = {
  id: 'mvcc',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Same row, three viewers', 1, [
      timeline({
        id: 'vis',
        title: 'who sees which version', sessions: ['A', 'B', 'C'],
        steps: [
        { who: 'A', sql: ['BEGIN ISOLATION LEVEL', '  REPEATABLE READ;'] },
        { who: 'A', sql: ['SELECT price FROM products', 'WHERE product_id = 1;'], out: '59.00' },
        { who: 'B', sql: ['BEGIN;'] },
        { who: 'B', sql: ['UPDATE products SET price = 64.00', 'WHERE product_id = 1;'], out: 'UPDATE 1' },
        { who: 'B', sql: ['SELECT price FROM products', 'WHERE product_id = 1;'], out: '64.00' },
        { who: 'C', sql: ['SELECT price FROM products', 'WHERE product_id = 1;'], out: '59.00' },
        { who: 'B', sql: ['COMMIT;'] },
        { who: 'C', sql: ['SELECT price FROM products', 'WHERE product_id = 1;'], out: '64.00' },
        { who: 'A', sql: ['SELECT price FROM products', 'WHERE product_id = 1;'], out: '59.00' },
        { who: 'A', sql: ['COMMIT;'] },
        { who: 'A', sql: ['SELECT price FROM products', 'WHERE product_id = 1;'], out: '64.00' },
        ],
      }),
      {
        id: 'versions',
        kind: 'table',
        label: 'two versions of one row (symbolic ids)',
        pattern: 'service',
        headers: ['version', 'price', 'created by', 'replaced by'],
        values: [['v1', '59.00', 'T1', 'T2'], ['v2', '64.00', 'T2', 'still current']],
      },
      {
        id: 'rule',
        kind: 'table',
        label: 'which version is visible',
        pattern: 'service',
        headers: ['viewer', 'sees'],
        values: [['B, before commit', 'its own v2'], ['others, before commit', 'v1'], ['snapshot taken earlier', 'v1, until it ends'], ['snapshot taken later', 'v2']],
      },
      { id: 'vacuum', label: 'old versions pile up', sub: 'VACUUM reclaims them (not shown)', pattern: 'service', icon: 'none' },
    ]),
  ],
}
