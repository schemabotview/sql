import type { Scene } from '@graphlearning/flow'
import { grid, pair, timeline } from '../pair'

// §2 begin-commit-savepoints — BEGIN opens a transaction, COMMIT keeps it, ROLLBACK discards it. After an error
// inside a transaction every later statement fails with "current transaction is aborted" until ROLLBACK;
// the transcript below was run in a real session (scripts/timelines.mjs). A SAVEPOINT marks a point to return to without
// abandoning the transaction: the line for product 9 is undone, the line for product 6 is kept.
export const beginCommitSavepoints: Scene = {
  id: 'begin-commit-savepoints',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Boundaries, errors, savepoints', 2, [
      timeline({
        id: 'abort',
        title: 'after an error: a real transcript', sessions: ['A'],
        steps: [
        { who: 'A', sql: ['BEGIN;'] },
        { who: 'A', sql: ['INSERT INTO orders VALUES', '  (12, 2, NULL, \'2025-03-13\', \'pending\');'], out: 'INSERT 0 1' },
        { who: 'A', sql: ['INSERT INTO order_items VALUES', '  (12, 1, 9, 1, 52.00);'], out: 'INSERT 0 1' },
        { who: 'A', sql: ['UPDATE products SET stock = stock - 1', 'WHERE product_id = 9;'], out: 'ERROR:  new row … violates check constraint' },
        { who: 'A', sql: ['SELECT count(*) FROM orders;'], out: 'ERROR:  current transaction is aborted, …' },
        { who: 'A', sql: ['ROLLBACK;'], out: 'ROLLBACK' },
        { who: 'A', sql: ['SELECT count(*) FROM orders', 'WHERE order_id = 12;'], out: '0' },
        ],
      }),
      pair({
        id: 'sp',
        title: 'a savepoint: undo part',
        file: 'savepoint.sql',
        sql: ['BEGIN;', "INSERT INTO orders VALUES", "  (12, 2, NULL, '2025-03-13', 'pending');", 'SAVEPOINT first_line;', 'INSERT INTO order_items VALUES', '  (12, 1, 9, 1, 52.00);', 'ROLLBACK TO first_line;', 'INSERT INTO order_items VALUES', '  (12, 1, 6, 1, 29.90);', '', 'SELECT order_id, product_id', 'FROM order_items WHERE order_id = 12;'],
        outs: [{ label: 'only the second line is kept', headers: ['order_id', 'product_id'], values: [['12', '6']] }],
      }),
      {
        id: 'commands',
        kind: 'table',
        label: 'transaction commands',
        pattern: 'service',
        headers: ['command', 'effect'],
        values: [['BEGIN', 'open a transaction'], ['COMMIT', 'make every change permanent'], ['ROLLBACK', 'discard every change'], ['SAVEPOINT x', 'mark a point inside it'], ['ROLLBACK TO x', 'undo back to the mark, stay open']],
      },
      { id: 'aborted', label: 'after an error', sub: 'only ROLLBACK (or ROLLBACK TO) works', pattern: 'warn', icon: 'triangleAlert' },
    ]),
  ],
}
