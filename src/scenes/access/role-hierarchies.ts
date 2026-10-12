import type { Scene, SceneNode } from '@graphlearning/flow'
import { grid, pair, tag } from '../pair'

// §3 role-hierarchies — grant privileges to GROUP roles (readers, writers) and make people members: ana is a member of
// readers; clerk of readers and writers. Membership inherits privileges (pg_has_role member/usage both t). The
// matrix for orders: ana SELECT only; clerk SELECT, INSERT, UPDATE but no DELETE. Least privilege: nobody gets
// DELETE because nobody needs it; the clerk's DELETE is refused after an allowed UPDATE.
const role = (id: string, label: string, sub: string, pattern: 'user' | 'service'): SceneNode => ({ id, label, sub, pattern, icon: 'none' })

export const roleHierarchies: Scene = {
  id: 'role-hierarchies',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Privileges to groups, people into groups', 2, [
      {
        id: 'graph',
        label: 'the role hierarchy',
        pattern: 'group',
        icon: 'none',
        cols: 2,
        children: [
          role('u-ana', 'ana', 'login', 'user'),
          role('u-clerk', 'clerk', 'login', 'user'),
          role('g-readers', 'readers', 'SELECT on all tables', 'service'),
          role('g-writers', 'writers', 'INSERT, UPDATE on orders', 'service'),
        ],
        edges: [
          { source: 'u-ana', target: 'g-readers' },
          { source: 'u-clerk', target: 'g-readers' },
          { source: 'u-clerk', target: 'g-writers' },
        ],
      },
      pair({
        id: 'matrix',
        title: 'the matrix for orders',
        file: 'hierarchy-matrix.sql',
        sql: [
          'CREATE ROLE readers NOLOGIN;',
          'CREATE ROLE writers NOLOGIN;',
          'CREATE ROLE ana LOGIN;',
          'CREATE ROLE clerk LOGIN;',
          'GRANT USAGE ON SCHEMA shop TO readers;',
          'GRANT SELECT ON ALL TABLES IN SCHEMA shop TO readers;',
          'GRANT INSERT, UPDATE ON orders TO writers;',
          'GRANT readers TO ana;',
          'GRANT readers, writers TO clerk;',
          '',
          'SELECT r AS role,',
          "  has_table_privilege(r, 'shop.orders', 'SELECT') AS sel,",
          "  has_table_privilege(r, 'shop.orders', 'INSERT') AS ins,",
          "  has_table_privilege(r, 'shop.orders', 'UPDATE') AS upd,",
          "  has_table_privilege(r, 'shop.orders', 'DELETE') AS del",
          "FROM (VALUES ('ana'), ('clerk')) AS v(r);",
        ],
        outs: [{ label: 'inherited through membership', headers: ['role', 'sel', 'ins', 'upd', 'del'], values: [['ana', 't', 'f', 'f', 'f'], ['clerk', 't', 't', 't', 'f']] }],
      }),
      pair({
        id: 'least',
        title: 'least privilege in action',
        file: 'least-privilege.sql',
        sql: ['-- expect-error: nobody was given DELETE', 'CREATE ROLE writers NOLOGIN;', 'CREATE ROLE clerk LOGIN;', 'GRANT USAGE ON SCHEMA shop TO writers;', 'GRANT SELECT, UPDATE ON orders TO writers;', 'GRANT writers TO clerk;', 'SET ROLE clerk;', '', "UPDATE orders SET status = 'shipped'", 'WHERE order_id = 9;', 'DELETE FROM orders WHERE order_id = 9;'],
        outs: [tag('the clerk may update', 'UPDATE 1')],
        err: { label: 'DELETE refused', sub: 'permission denied' },
      }),
      {
        id: 'design',
        kind: 'table',
        label: 'designing the roles',
        pattern: 'service',
        headers: ['rule', 'why'],
        values: [['grant to roles, not people', 'one change updates everyone'], ['one role per job', 'readers, writers'], ['grant only what the job needs', 'a mistake reaches less'], ['review the matrix', 'privileges accumulate']],
      },
    ]),
  ],
}
