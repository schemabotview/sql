import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §2 grant-revoke — privileges are granted per object and per action. After GRANT USAGE on the schema, SELECT on orders and
// customers and INSERT on orders, role analyst reads the 11 orders. The matrix (has_table_privilege) is the
// full picture: orders SELECT+INSERT, customers SELECT, payments nothing. An UPDATE was never granted, so it
// is refused; after REVOKE SELECT the same role can no longer read orders. The runner is a superuser, so
// SET ROLE is what makes the privilege checks real.
export const grantRevoke: Scene = {
  id: 'grant-revoke',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'GRANT gives, REVOKE takes back, the matrix shows both', 2, [
      pair({
        id: 'grant',
        title: 'grant, then use',
        file: 'grant.sql',
        sql: ['CREATE ROLE analyst NOLOGIN;', 'GRANT USAGE ON SCHEMA shop TO analyst;', 'GRANT SELECT ON orders, customers', '  TO analyst;', 'GRANT INSERT ON orders TO analyst;', '', 'SET ROLE analyst;', 'SELECT count(*) AS orders FROM orders;'],
        outs: [{ label: 'SELECT was granted', headers: ['orders'], values: [['11']] }],
      }),
      pair({
        id: 'matrix',
        title: 'the permission matrix',
        file: 'matrix.sql',
        sql: [
          'CREATE ROLE analyst NOLOGIN;',
          'GRANT USAGE ON SCHEMA shop TO analyst;',
          'GRANT SELECT ON orders, customers TO analyst;',
          'GRANT INSERT ON orders TO analyst;',
          '',
          "SELECT t AS table_name,",
          "  has_table_privilege('analyst', 'shop.' || t, 'SELECT') AS sel,",
          "  has_table_privilege('analyst', 'shop.' || t, 'INSERT') AS ins,",
          "  has_table_privilege('analyst', 'shop.' || t, 'UPDATE') AS upd,",
          "  has_table_privilege('analyst', 'shop.' || t, 'DELETE') AS del",
          "FROM (VALUES ('orders'), ('customers'), ('payments')) AS v(t);",
        ],
        outs: [{ label: 'analyst: t = allowed, f = not', headers: ['table_name', 'sel', 'ins', 'upd', 'del'], values: [['orders', 't', 't', 'f', 'f'], ['customers', 't', 'f', 'f', 'f'], ['payments', 'f', 'f', 'f', 'f']] }],
      }),
      pair({
        id: 'denied',
        title: 'what was not granted',
        file: 'not-granted.sql',
        sql: ['-- expect-error: UPDATE was never granted', 'CREATE ROLE analyst NOLOGIN;', 'GRANT USAGE ON SCHEMA shop TO analyst;', 'GRANT SELECT ON orders TO analyst;', 'SET ROLE analyst;', '', "UPDATE orders SET status = 'shipped'", 'WHERE order_id = 9;'],
        err: { label: 'permission denied', sub: 'for table orders' },
      }),
      pair({
        id: 'revoke',
        title: 'take it back with REVOKE',
        file: 'revoke.sql',
        sql: ['-- expect-error: SELECT was revoked', 'CREATE ROLE analyst NOLOGIN;', 'GRANT USAGE ON SCHEMA shop TO analyst;', 'GRANT SELECT ON orders TO analyst;', 'REVOKE SELECT ON orders FROM analyst;', 'SET ROLE analyst;', '', 'SELECT count(*) FROM orders;'],
        err: { label: 'permission denied', sub: 'for table orders' },
      }),
    ]),
  ],
}
