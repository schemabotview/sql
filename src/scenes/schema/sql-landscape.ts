import type { Scene } from '@graphlearning/flow'

// §2 sql-landscape — the whole language on one board, before any syntax. The studio repo drew this
// as a ~60-node master map that a camera toured; with no camera every node must be legible at once,
// so this keeps the claim (five sub-languages over a catalog and a store) and drops the inventory —
// the individual verbs belong to the sections that teach them.
//
// Composition: BT. The catalog and the storage are what the five sub-languages ACT ON, so they are
// the foundation and the arrow climbs out of them — never drawn as the sub-languages producing them.
export const sqlLandscape: Scene = {
  id: 'sql-landscape',
  padding: 0.16,
  flow: 'BT',
  nodes: [
    {
      id: 'sublangs',
      label: 'SQL — one language, five sub-tongues',
      pattern: 'group',
      cols: 5,
      children: [
        { id: 'ddl', label: 'DDL', variant: 'tile', pattern: 'service', icon: 'table', sub: 'define structure' },
        { id: 'dql', label: 'DQL', variant: 'tile', pattern: 'storage', icon: 'funnel', sub: 'query it' },
        { id: 'dml', label: 'DML', variant: 'tile', pattern: 'network', icon: 'wrench', sub: 'change rows' },
        { id: 'tcl', label: 'TCL', variant: 'tile', pattern: 'user', icon: 'circlecheck', sub: 'commit / rollback' },
        { id: 'dcl', label: 'DCL', variant: 'tile', pattern: 'external', icon: 'lock', sub: 'grant / revoke' },
      ],
    },
    {
      id: 'underneath',
      label: 'What all five act on',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'catalog', label: 'The catalog', pattern: 'service', icon: 'scroll', sub: 'the DB about itself' },
        { id: 'store', label: 'The storage', pattern: 'storage', icon: 'database', sub: 'pages, rows, the WAL' },
      ],
    },
  ],
  edges: [{ source: 'underneath', target: 'sublangs', label: 'metadata + data — every statement lands on one of these' }],
}
