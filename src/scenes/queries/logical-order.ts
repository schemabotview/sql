import type { Scene } from '../../render-engine'

// §1 logical-order — the gap between the order you WRITE and the order the database RUNS is the
// section's whole claim, so both orders are drawn as rows: scanning down the two bands, the
// mismatch is the picture. Every later section in this course is one stage of the second row.
//
// Composition: TB, three bands. The stages are tiles because seven cards in a row would be 1600px
// wide and render tiny once fitView scales it; tiles pack to ~1000 and stay legible.
export const logicalOrder: Scene = {
  id: 'logical-order',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'written',
      label: 'How you WRITE it',
      pattern: 'group',
      cols: 7,
      children: [
        { id: 'w-select', label: 'SELECT', variant: 'tile', pattern: 'service', icon: 'braces' },
        { id: 'w-from', label: 'FROM', variant: 'tile', pattern: 'storage', icon: 'table' },
        { id: 'w-where', label: 'WHERE', variant: 'tile', pattern: 'network', icon: 'funnel' },
        { id: 'w-group', label: 'GROUP BY', variant: 'tile', pattern: 'user', icon: 'layers' },
        { id: 'w-having', label: 'HAVING', variant: 'tile', pattern: 'user', icon: 'funnel' },
        { id: 'w-order', label: 'ORDER BY', variant: 'tile', pattern: 'external', icon: 'scale' },
        { id: 'w-limit', label: 'LIMIT', variant: 'tile', pattern: 'external', icon: 'ban' },
      ],
    },
    {
      id: 'runs',
      label: 'How it actually RUNS',
      pattern: 'group',
      cols: 7,
      children: [
        { id: 'r-from', label: 'FROM', variant: 'tile', pattern: 'storage', icon: 'table', sub: 'get the rows' },
        { id: 'r-where', label: 'WHERE', variant: 'tile', pattern: 'network', icon: 'funnel', sub: 'filter rows' },
        { id: 'r-group', label: 'GROUP BY', variant: 'tile', pattern: 'user', icon: 'layers', sub: 'collapse' },
        { id: 'r-having', label: 'HAVING', variant: 'tile', pattern: 'user', icon: 'funnel', sub: 'filter groups' },
        { id: 'r-select', label: 'SELECT', variant: 'tile', pattern: 'service', icon: 'braces', sub: 'choose columns' },
        { id: 'r-distinct', label: 'DISTINCT', variant: 'tile', pattern: 'service', icon: 'copy', sub: 'dedupe' },
        { id: 'r-order', label: 'ORDER · LIMIT', variant: 'tile', pattern: 'external', icon: 'scale', sub: 'sort & trim' },
      ],
    },
    {
      id: 'consequences',
      label: 'Why the gap bites',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'gap-alias', label: 'Alias born in SELECT', pattern: 'warn', sub: "WHERE can't see it" },
        { id: 'gap-having', label: 'WHERE filters rows', pattern: 'service', icon: 'funnel', sub: 'HAVING filters groups' },
      ],
    },
  ],
  edges: [
    { source: 'written', target: 'runs', label: 'SELECT is written first and runs fifth' },
    { source: 'runs', target: 'consequences' },
  ],
}
