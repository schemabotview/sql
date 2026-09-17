import type { Scene } from '@graphlearning/flow'

// §8 engine-recap — the fourth bookend, same grammar as the other three, and the one where the map
// finally has no dark region left. The third band is the handoff: the capstone is a different KIND of
// course, so it gets its own band rather than sitting as a fifth tile among the four regions.
export const engineRecap: Scene = {
  id: 'engine-recap',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'done',
      label: 'Done — the foundation everything else sits on',
      pattern: 'group',
      cols: 6,
      children: [
        { id: 'ed-planner', label: 'Planner', variant: 'tile', pattern: 'service', icon: 'brain', sub: 'cost-based' },
        { id: 'ed-explain', label: 'EXPLAIN', variant: 'tile', pattern: 'service', icon: 'scanface', sub: 'read the plan' },
        { id: 'ed-storage', label: 'Storage', variant: 'tile', pattern: 'storage', icon: 'database', sub: 'pages, tuples' },
        { id: 'ed-btree', label: 'B-trees', variant: 'tile', pattern: 'network', icon: 'gitbranch', sub: 'jump, not scan' },
        { id: 'ed-scans', label: 'Scans', variant: 'tile', pattern: 'network', icon: 'funnel', sub: 'selectivity' },
        { id: 'ed-mvcc', label: 'MVCC', variant: 'tile', pattern: 'user', icon: 'copy', sub: 'versions' },
      ],
    },
    {
      id: 'map',
      label: 'The whole map — every region now lit',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'rg-design', label: 'Design', pattern: 'storage', icon: 'table', sub: 'course 1' },
        { id: 'rg-read', label: 'Read', pattern: 'storage', icon: 'funnel', sub: 'course 2' },
        { id: 'rg-change', label: 'Change', pattern: 'storage', icon: 'wrench', sub: 'course 3' },
        { id: 'rg-tune', label: 'Tune', pattern: 'service', icon: 'gauge', sub: 'this course' },
      ],
    },
    { id: 'capstone', label: 'One course remains', pattern: 'user', icon: 'boxes', sub: 'all of it, one project' },
  ],
  edges: [
    { source: 'done', target: 'map', label: 'from the query down to the disk' },
    { source: 'map', target: 'capstone' },
  ],
}
