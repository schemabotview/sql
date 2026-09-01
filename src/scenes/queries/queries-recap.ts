import type { Scene } from '../../render-engine'

// §10 queries-recap — the bookend, deliberately built to the same grammar as `schema-recap`: a tile
// band of what is now done over a card band of what the map still holds. The two courses rhyme, so
// the viewer reads the second recap without re-learning the picture.
export const queriesRecap: Scene = {
  id: 'queries-recap',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'done',
      label: 'Done — the read path, end to end',
      pattern: 'group',
      cols: 6,
      children: [
        { id: 'rd-pipeline', label: 'Pipeline', variant: 'tile', pattern: 'service', icon: 'workflow', sub: 'the run order' },
        { id: 'rd-joins', label: 'Joins', variant: 'tile', pattern: 'network', icon: 'gitbranch', sub: 'across tables' },
        { id: 'rd-filters', label: 'Filters', variant: 'tile', pattern: 'network', icon: 'funnel', sub: 'minding NULL' },
        { id: 'rd-groups', label: 'Groups', variant: 'tile', pattern: 'user', icon: 'layers', sub: 'and aggregates' },
        { id: 'rd-windows', label: 'Windows', variant: 'tile', pattern: 'user', icon: 'copy', sub: 'rows kept' },
        { id: 'rd-setops', label: 'Set ops', variant: 'tile', pattern: 'external', icon: 'boxes', sub: 'stacked results' },
      ],
    },
    {
      id: 'ahead',
      label: 'The rest of the map',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'map-ddl', label: 'DDL · catalog', pattern: 'storage', icon: 'table', sub: 'done — course 1' },
        { id: 'map-txn', label: 'Transactions · DCL', pattern: 'service', icon: 'circlecheck', sub: 'the next course' },
        { id: 'map-prog', label: 'Procedures · triggers', pattern: 'user', icon: 'gears', sub: 'logic in the server' },
        { id: 'map-storage', label: 'Storage', pattern: 'external', icon: 'database', sub: 'where the rows live' },
      ],
    },
  ],
  edges: [{ source: 'done', target: 'ahead', label: 'you can design a database and read it — next, change it safely' }],
}
