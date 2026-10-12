import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §1 roles-ownership — authentication asks WHO you are (password, certificate: configured outside SQL, stated here);
// authorisation asks WHAT that role may do. In PostgreSQL a "user" is just a role that may log in (rolcanlogin t);
// `analyst` cannot, `ana` can. A brand-new role has no privileges: without USAGE on the schema even the
// qualified name fails ("permission denied for schema shop"), and an unqualified name is "does not exist"
// (objects in a schema you may not use are invisible) — both checked in db/verify/ch10-access.sql. Roles are
// created inside the snippet's rolled-back transaction, so the cluster keeps none.
export const rolesOwnership: Scene = {
  id: 'roles-ownership',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Who you are, and what you may do', 2, [
      pair({
        id: 'login',
        title: 'a user is a role that can log in',
        file: 'roles-login.sql',
        sql: ['CREATE ROLE analyst NOLOGIN;', 'CREATE ROLE ana LOGIN;', '', 'SELECT rolname, rolcanlogin', 'FROM pg_roles', "WHERE rolname IN ('analyst', 'ana')", 'ORDER BY rolname;'],
        outs: [{ label: 'one attribute differs', headers: ['rolname', 'rolcanlogin'], values: [['ana', 't'], ['analyst', 'f']] }],
      }),
      pair({
        id: 'become',
        title: 'acting as a role',
        file: 'set-role.sql',
        sql: ['CREATE ROLE analyst NOLOGIN;', 'SET ROLE analyst;', '', 'SELECT current_user;'],
        outs: [{ label: 'the session now has analyst’s rights', headers: ['current_user'], values: [['analyst']] }],
      }),
      pair({
        id: 'nothing',
        title: 'a new role may do nothing',
        file: 'no-privileges.sql',
        sql: ['-- expect-error: no USAGE on schema shop', 'CREATE ROLE analyst NOLOGIN;', 'SET ROLE analyst;', '', 'SELECT count(*) FROM shop.orders;'],
        err: { label: 'permission denied', sub: 'schema shop' },
      }),
      {
        id: 'terms',
        kind: 'table',
        label: 'four words that are easy to confuse',
        pattern: 'service',
        headers: ['word', 'question it answers'],
        values: [['authentication', 'who are you? (not run here)'], ['authorisation', 'what may this role do?'], ['ownership', 'who created it? the owner may do all'], ['role', 'a named set of privileges']],
      },
    ]),
  ],
}
