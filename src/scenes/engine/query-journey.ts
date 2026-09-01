import type { Scene } from '../../render-engine'

// §1 query-journey — the course's orientation board. Three courses in, the reader can design, read
// and change data; this one answers what the database DOES with a statement, and the three bands are
// the three answers the rest of the course expands: the path a query takes, the place rows live, and
// the two mechanisms that make it fast and concurrent.
export const queryJourney: Scene = {
  id: 'query-journey',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'journey',
      label: 'The journey of a query',
      pattern: 'group',
      flow: 'LR',
      children: [
        { id: 'jr-sql', label: 'Your SQL', pattern: 'external', icon: 'terminal', sub: 'what you want' },
        { id: 'jr-planner', label: 'The planner', pattern: 'service', icon: 'brain', sub: 'decides the how' },
        { id: 'jr-plan', label: 'A plan', pattern: 'network', icon: 'workflow', sub: 'a tree of steps' },
        { id: 'jr-exec', label: 'Execution', pattern: 'storage', icon: 'zap', sub: 'rows come back' },
      ],
      edges: [
        { source: 'jr-sql', target: 'jr-planner' },
        { source: 'jr-planner', target: 'jr-plan' },
        { source: 'jr-plan', target: 'jr-exec' },
      ],
    },
    {
      id: 'where-rows-live',
      label: 'Where the rows actually live',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'wr-heap', label: 'Heap, pages, tuples', pattern: 'storage', icon: 'database', sub: 'whole 8 KB pages' },
        { id: 'wr-wal', label: 'The WAL', pattern: 'storage', icon: 'scroll', sub: 'durability, ACID D' },
      ],
    },
    {
      id: 'mechanisms',
      label: 'The two big mechanisms',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'mech-index', label: 'B-tree indexes', pattern: 'service', icon: 'gitbranch', sub: 'jump, never scan' },
        { id: 'mech-mvcc', label: 'MVCC', pattern: 'user', icon: 'copy', sub: 'readers never block' },
      ],
    },
  ],
  edges: [
    { source: 'journey', target: 'where-rows-live', label: 'every plan is talking about pages on a disk' },
    { source: 'where-rows-live', target: 'mechanisms' },
  ],
}
