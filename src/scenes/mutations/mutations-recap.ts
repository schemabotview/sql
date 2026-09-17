import type { Scene } from '@graphlearning/flow'

// §10 mutations-recap — the third bookend, same grammar as `schema-recap` and `queries-recap` so the
// three read as one running map. The difference this time is the bottom band: three of the four
// regions are now done, and Storage is the only one still dark — which is the handoff to course 4.
export const mutationsRecap: Scene = {
  id: 'mutations-recap',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'done',
      label: 'Done — changing data, safely',
      pattern: 'group',
      cols: 6,
      children: [
        { id: 'md-dml', label: 'DML', variant: 'tile', pattern: 'service', icon: 'wrench', sub: 'four verbs' },
        { id: 'md-txn', label: 'Transactions', variant: 'tile', pattern: 'network', icon: 'boxes', sub: 'all or none' },
        { id: 'md-acid', label: 'ACID', variant: 'tile', pattern: 'service', icon: 'shieldcheck', sub: 'the promises' },
        { id: 'md-iso', label: 'Isolation', variant: 'tile', pattern: 'user', icon: 'gauge', sub: 'the dial' },
        { id: 'md-dcl', label: 'DCL', variant: 'tile', pattern: 'user', icon: 'lock', sub: 'who may write' },
        { id: 'md-prog', label: 'Server-side', variant: 'tile', pattern: 'external', icon: 'gears', sub: 'procs, triggers' },
      ],
    },
    {
      id: 'map',
      label: 'The map so far',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'mp-ddl', label: 'DDL · catalog', pattern: 'storage', icon: 'table', sub: 'course 1 — done' },
        { id: 'mp-read', label: 'Query pipeline', pattern: 'storage', icon: 'funnel', sub: 'course 2 — done' },
        { id: 'mp-write', label: 'Transactions · DCL', pattern: 'storage', icon: 'circlecheck', sub: 'this course — done' },
        { id: 'mp-storage', label: 'Storage', pattern: 'warn', sub: 'the last dark region' },
      ],
    },
  ],
  edges: [{ source: 'done', target: 'map', label: 'design, read, change — next, how it all actually runs' }],
}
