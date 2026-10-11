import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §9 set-operations — stack two result sets with the same column count and compatible types. Inputs:
// customer_id of the 11 orders and of the 9 reviews. UNION ALL keeps every row (20); UNION removes
// duplicates (7 distinct ids, 1..6 and 9); INTERSECT keeps ids in both (1..5); EXCEPT keeps ids only in
// the first (6, 9). INTERSECT ALL / EXCEPT ALL (PostgreSQL supports them) count multiplicity:
// INTERSECT ALL keeps min(count) of each id, 9 rows here. A different column count is an error.
export const setOperations: Scene = {
  id: 'set-operations',
  padding: 0.06,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'orders.customer_id (11 rows) against reviews.customer_id (9 rows)', 3, [
      pair({
        id: 'unionall',
        title: 'UNION ALL: keep every row',
        file: 'union-all.sql',
        sql: ['SELECT count(*) AS rows FROM (', '  SELECT customer_id FROM orders', '  UNION ALL', '  SELECT customer_id FROM reviews) t;'],
        outs: [{ label: '11 + 9', headers: ['rows'], values: [['20']] }],
      }),
      pair({
        id: 'union',
        title: 'UNION: remove duplicates',
        file: 'union.sql',
        sql: ['SELECT customer_id FROM orders', 'UNION', 'SELECT customer_id FROM reviews', 'ORDER BY customer_id;'],
        outs: [{ label: '7 distinct ids', headers: ['customer_id'], values: [['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['9']] }],
      }),
      pair({
        id: 'intersect',
        title: 'INTERSECT: in both',
        file: 'intersect.sql',
        sql: ['SELECT customer_id FROM orders', 'INTERSECT', 'SELECT customer_id FROM reviews', 'ORDER BY customer_id;'],
        outs: [{ label: 'ordered and reviewed', headers: ['customer_id'], values: [['1'], ['2'], ['3'], ['4'], ['5']] }],
      }),
      pair({
        id: 'except',
        title: 'EXCEPT: first minus second',
        file: 'except.sql',
        sql: ['SELECT customer_id FROM orders', 'EXCEPT', 'SELECT customer_id FROM reviews', 'ORDER BY customer_id;'],
        outs: [{ label: 'ordered, never reviewed', headers: ['customer_id'], values: [['6'], ['9']] }],
      }),
      pair({
        id: 'intersectall',
        title: 'INTERSECT ALL: counts matter',
        file: 'intersect-all.sql',
        sql: ['SELECT count(*) AS rows FROM (', '  SELECT customer_id FROM orders', '  INTERSECT ALL', '  SELECT customer_id FROM reviews) t;'],
        outs: [{ label: 'min of each id’s two counts', headers: ['rows'], values: [['9']] }],
      }),
      pair({
        id: 'shape',
        title: 'shapes must match',
        file: 'union-shape.sql',
        sql: ['-- expect-error: 2 columns vs 1', 'SELECT customer_id, order_id', 'FROM orders', 'UNION', 'SELECT customer_id FROM reviews;'],
        err: { label: 'each UNION query must have', sub: 'the same number of columns' },
      }),
    ]),
  ],
}
