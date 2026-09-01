import type { Scene } from '../../render-engine'

// §10 schema-recap — the bookend. The studio repo re-rode the §2 master map here and let the camera
// light the finished corner; with no camera that would just be §2 again, so this is a different
// board making the same claim: what you can now do, and what the map still holds. The bottom band
// is the syllabus ahead, with the next course named.
//
// Composition: TB. The done band is tiles (a checklist reads compactly) over cards for the courses
// ahead, which carry a line of explanation each.
export const schemaRecap: Scene = {
  id: 'schema-recap',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'done',
      label: 'Done — you can define a database, and the catalog records it',
      pattern: 'group',
      cols: 6,
      children: [
        { id: 'done-tables', label: 'Tables', variant: 'tile', pattern: 'storage', icon: 'table', sub: 'typed columns' },
        { id: 'done-keys', label: 'Keys', variant: 'tile', pattern: 'service', icon: 'key', sub: 'PK and FK' },
        { id: 'done-constraints', label: 'Constraints', variant: 'tile', pattern: 'service', icon: 'shieldcheck', sub: 'rules enforced' },
        { id: 'done-normal', label: 'Normal forms', variant: 'tile', pattern: 'user', icon: 'layers', sub: 'each fact once' },
        { id: 'done-ddl', label: 'DDL', variant: 'tile', pattern: 'network', icon: 'terminal', sub: 'build it' },
        { id: 'done-derived', label: 'Views + indexes', variant: 'tile', pattern: 'user', icon: 'scroll', sub: 'derived objects' },
      ],
    },
    {
      id: 'ahead',
      label: 'The rest of the map',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'next-select', label: 'The SELECT pipeline', pattern: 'service', icon: 'funnel', sub: 'the next course' },
        { id: 'next-txn', label: 'Transactions · DCL', pattern: 'network', icon: 'circlecheck', sub: 'change data safely' },
        { id: 'next-storage', label: 'Storage', pattern: 'storage', icon: 'database', sub: 'pages, rows, the WAL' },
        { id: 'next-prog', label: 'Procedures · triggers', pattern: 'user', icon: 'gears', sub: 'logic in the server' },
      ],
    },
  ],
  edges: [{ source: 'done', target: 'ahead', label: 'a schema exists — now read it back' }],
}
