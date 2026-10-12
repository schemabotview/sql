import type { Scene } from '@graphlearning/flow'
import { grid, pair, tag } from '../pair'

// §5 modify-joins — three ways to aim a change with other data. UPDATE ... FROM takes new values from a
// subquery (order 11's 3 desk lamps: stock 75 -> 72). A subquery in WHERE chooses the rows: only product 10
// has no order line and no review. A CTE with DELETE ... RETURNING moves a row atomically (payment 8
// to an archive; 7 payments left). If several source rows match one target row, only one is used and
// which is not defined (asserted in db/verify/ch08-modification.sql).
export const modifyJoins: Scene = {
  id: 'modify-joins',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Aim a change with other data', 2, [
      pair({
        id: 'from',
        title: 'UPDATE … FROM a subquery',
        file: 'update-from.sql',
        sql: ['UPDATE products p', '  SET stock = p.stock - s.qty', 'FROM (SELECT product_id,', '        sum(quantity) AS qty', '      FROM order_items', '      WHERE order_id = 11', '      GROUP BY product_id) s', 'WHERE p.product_id = s.product_id', 'RETURNING p.product_id, p.stock;'],
        outs: [{ label: 'stock 75 minus 3 lamps', headers: ['product_id', 'stock'], values: [['8', '72']] }, tag('one product matched', 'UPDATE 1')],
      }),
      pair({
        id: 'exists',
        title: 'DELETE with NOT EXISTS',
        file: 'delete-not-exists.sql',
        sql: ['DELETE FROM products p', 'WHERE NOT EXISTS (', '  SELECT 1 FROM order_items i', '  WHERE i.product_id = p.product_id)', 'AND NOT EXISTS (', '  SELECT 1 FROM reviews r', '  WHERE r.product_id = p.product_id)', 'RETURNING p.product_id, p.name;'],
        outs: [{ label: 'never ordered, never reviewed', headers: ['product_id', 'name'], values: [['10', 'Retro Cassette Player']] }],
      }),
      pair({
        id: 'cte',
        title: 'a CTE that moves a row',
        file: 'cte-move.sql',
        sql: ['CREATE TABLE payments_archive', '  (LIKE payments);', '', 'WITH removed AS (', '  DELETE FROM payments', '  WHERE order_id = 10', '  RETURNING *)', 'INSERT INTO payments_archive', 'SELECT * FROM removed;', '', 'SELECT count(*) AS left FROM payments;'],
        outs: [tag('one row moved', 'INSERT 0 1'), { label: 'payments left', headers: ['left'], values: [['7']] }],
      }),
      {
        id: 'which',
        kind: 'table',
        label: 'which form for which job',
        pattern: 'service',
        headers: ['need', 'use'],
        values: [['new values from another table', 'UPDATE … FROM'], ['choose rows by existence', 'subquery in WHERE'], ['move rows in one step', 'CTE + RETURNING'], ['several source matches', 'one is used, unpredictably']],
      },
    ]),
  ],
}
