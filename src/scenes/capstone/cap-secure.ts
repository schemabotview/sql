import type { Scene } from '../../render-engine'
import { projectSteps } from './steps'

// §3 cap-secure — step 2, and deliberately BEFORE any data exists. Two roles, each granted only what
// its job needs: the application runs the shop, the reporting login can only read. The band makes the
// least-privilege point concrete rather than abstract — analyst_ro cannot delete an order even by
// accident, because the right was never granted.
export const capSecure: Scene = {
  id: 'cap-secure',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    projectSteps(),
    {
      id: 'secure-code',
      kind: 'code',
      filename: '02_secure.sql',
      label: [
        'CREATE ROLE app_rw;',
        'CREATE ROLE analyst_ro;',
        '',
        'GRANT SELECT, INSERT, UPDATE',
        '  ON customers, orders TO app_rw;',
        '',
        'GRANT SELECT',
        '  ON customers, orders TO analyst_ro;',
      ].join('\n'),
    },
    {
      id: 'roles',
      label: 'Least privilege, decided before a single row exists',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'r-app', label: 'app_rw', pattern: 'network', icon: 'usercheck', sub: 'it runs the shop' },
        { id: 'r-analyst', label: 'analyst_ro', pattern: 'storage', icon: 'usercheck', sub: 'it can only read' },
      ],
    },
  ],
  edges: [
    { source: 'plan', target: 'secure-code' },
    { source: 'secure-code', target: 'roles', label: 'the analyst cannot delete an order — the right was never granted' },
  ],
}
