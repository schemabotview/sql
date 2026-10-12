import type { Scene } from '@graphlearning/flow'
import { grid, pair, tag } from '../pair'

// §4 insert-select — INSERT ... SELECT feeds a table from a query: columns map by position. Archiving the
// 5 delivered orders gives INSERT 0 5 (orders 1-5). Summarising non-cancelled orders into
// customer_totals gives 6 rows (customers 1, 2, 3, 4, 5, 9). Running the same insert twice hits the
// primary key: INSERT ... SELECT is not idempotent. Real output.
export const insertSelect: Scene = {
  id: 'insert-select',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Rows from a query, not from literals', 2, [
      pair({
        id: 'copy',
        title: 'copy rows (an archive)',
        file: 'insert-select-copy.sql',
        sql: ['CREATE TABLE orders_archive', '  (LIKE orders INCLUDING ALL);', '', 'INSERT INTO orders_archive', 'SELECT * FROM orders', "WHERE status = 'delivered';", '', 'SELECT count(*) AS archived,', '  min(order_id), max(order_id)', 'FROM orders_archive;'],
        outs: [tag('five delivered orders', 'INSERT 0 5'), { label: 'verify the copy', headers: ['archived', 'min', 'max'], values: [['5', '1', '5']] }],
      }),
      pair({
        id: 'summary',
        title: 'summarise into a table',
        file: 'insert-select-summary.sql',
        sql: [
          'CREATE TABLE customer_totals (',
          '  customer_id integer PRIMARY KEY,',
          '  orders integer NOT NULL,',
          '  spend numeric(9, 2) NOT NULL);',
          '',
          'INSERT INTO customer_totals',
          'SELECT o.customer_id,',
          '  count(DISTINCT o.order_id),',
          '  sum(i.quantity * i.unit_price)',
          'FROM orders o JOIN order_items i USING (order_id)',
          "WHERE o.status <> 'cancelled'",
          'GROUP BY o.customer_id;',
          '',
          'SELECT * FROM customer_totals ORDER BY 1;',
        ],
        outs: [{ label: '6 customers with a live order', headers: ['customer_id', 'orders', 'spend'], values: [['1', '3', '460.80'], ['2', '2', '1017.00'], ['3', '1', '159.00'], ['4', '2', '1205.00'], ['5', '1', '73.90'], ['9', '1', '102.00']] }],
      }),
      pair({
        id: 'twice',
        title: 'running it twice',
        file: 'insert-select-twice.sql',
        sql: ['-- expect-error: second run collides', 'CREATE TABLE orders_archive', '  (LIKE orders INCLUDING ALL);', 'INSERT INTO orders_archive', "  SELECT * FROM orders WHERE status = 'delivered';", 'INSERT INTO orders_archive', "  SELECT * FROM orders WHERE status = 'delivered';"],
        err: { label: 'duplicate key value', sub: 'orders_archive_pkey' },
      }),
      {
        id: 'rules',
        kind: 'table',
        label: 'habits for INSERT … SELECT',
        pattern: 'service',
        headers: ['habit', 'because'],
        values: [['run the SELECT first', 'preview the rows'], ['name the columns', 'position decides the mapping'], ['expect the tag', 'INSERT 0 5 = 5 rows'], ['plan for a re-run', 'it is not idempotent']],
      },
    ]),
  ],
}
