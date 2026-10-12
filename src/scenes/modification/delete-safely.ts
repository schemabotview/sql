import type { Scene } from '@graphlearning/flow'
import { grid, pair, tag } from '../pair'

// §3 delete-safely — a DELETE is an UPDATE you cannot read back, so preview, RETURNING and a key are
// the habits. Product 10 (never ordered) deletes cleanly and RETURNING shows what went. Customer 1 cannot
// be deleted while orders reference it (foreign key). DELETE with no WHERE removes all 8 payments —
// the tag is the alarm. Soft delete keeps the row and flips a flag instead (8 products stay active).
// All of it is rolled back by the snippet runner; refusal and counts are asserted in db/verify/ch08-modification.sql.
export const deleteSafely: Scene = {
  id: 'delete-safely',
  padding: 0.1,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Delete only what you can name', 2, [
      pair({
        id: 'one',
        title: 'by key, with RETURNING',
        file: 'delete-key.sql',
        sql: ['DELETE FROM products', 'WHERE product_id = 10', 'RETURNING product_id, name;'],
        outs: [{ label: 'what was removed', headers: ['product_id', 'name'], values: [['10', 'Retro Cassette Player']] }, tag('one row', 'DELETE 1')],
      }),
      pair({
        id: 'fk',
        title: 'referenced rows are protected',
        file: 'delete-fk.sql',
        sql: ['-- expect-error: customer 1 has orders', 'DELETE FROM customers', 'WHERE customer_id = 1;'],
        err: { label: 'foreign key violation', sub: 'still referenced by orders' },
      }),
      pair({
        id: 'all',
        title: 'no WHERE: every row',
        file: 'delete-all.sql',
        sql: ['DELETE FROM payments;', '-- no WHERE: the table is emptied'],
        outs: [tag('all 8 payments', 'DELETE 8', true)],
      }),
      pair({
        id: 'soft',
        title: 'soft delete: keep the row',
        file: 'soft-delete.sql',
        sql: ['UPDATE products SET discontinued = true', 'WHERE product_id = 9;', '', 'SELECT count(*) AS active', 'FROM products WHERE NOT discontinued;'],
        outs: [{ label: 'row kept, flagged out of the catalogue', headers: ['active'], values: [['8']] }],
      }),
    ]),
  ],
}
