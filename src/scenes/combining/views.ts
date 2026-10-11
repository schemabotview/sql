import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §10 views — a view stores a QUERY, not rows: CREATE VIEW order_totals names the join+GROUP BY, and
// later queries use it like a table (6 spenders among non-cancelled orders). A simple one-table view
// can be updated: the UPDATE reaches orders. A view with GROUP BY cannot (error). Each card creates
// its view inside its own rolled-back transaction. That a view reflects later base-table changes is
// asserted in db/verify/ch05-combining.sql.
export const views: Scene = {
  id: 'views',
  padding: 0.08,
  flow: 'LR',
  nodes: [
    pair({
      id: 'define',
      title: 'define once, use like a table',
      file: 'view-define.sql',
      sql: [
        'CREATE VIEW order_totals AS',
        'SELECT o.order_id, o.customer_id, o.status,',
        '       sum(i.quantity * i.unit_price) AS total',
        'FROM orders o',
        'JOIN order_items i ON i.order_id = o.order_id',
        'GROUP BY o.order_id, o.customer_id, o.status;',
        '',
        'SELECT customer_id, sum(total) AS spend',
        'FROM order_totals',
        "WHERE status <> 'cancelled'",
        'GROUP BY customer_id ORDER BY customer_id;',
      ],
      outs: [{ label: 'the view’s query ran underneath', headers: ['customer_id', 'spend'], values: [['1', '460.80'], ['2', '1017.00'], ['3', '159.00'], ['4', '1205.00'], ['5', '73.90'], ['9', '102.00']] }],
    }),
    grid('limits', 'What can be changed through a view?', 1, [
      pair({
        id: 'simple',
        title: 'simple view: UPDATE passes through',
        file: 'view-update.sql',
        sql: ['CREATE VIEW live_orders AS', '  SELECT order_id, customer_id, status', '  FROM orders', "  WHERE status <> 'cancelled';", '', "UPDATE live_orders SET status = 'shipped'", 'WHERE order_id = 9;', '', 'SELECT status FROM orders WHERE order_id = 9;'],
        outs: [{ label: 'the base table changed', headers: ['status'], values: [['shipped']] }],
      }),
      pair({
        id: 'grouped',
        title: 'grouped view: refused',
        file: 'view-update-grouped.sql',
        sql: ['-- expect-error: GROUP BY view', 'CREATE VIEW t AS', '  SELECT order_id, count(*) AS n', '  FROM order_items GROUP BY order_id;', '', 'UPDATE t SET n = 0 WHERE order_id = 1;'],
        err: { label: 'cannot update view', sub: 'GROUP BY view' },
      }),
    ]),
  ],
  edges: [{ source: 'g-define', target: 'limits' }],
}
