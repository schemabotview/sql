import type { Scene } from '@graphlearning/flow'

// §2 row-sources — FROM is where rows COME FROM, so the four sources are the foundation and the
// working set is what gets built on them. Subqueries and CTEs belong here rather than in a course of
// their own on this spine, so the board gives them equal billing with a plain table.
//
// Composition: BT — the sources sit at the bottom and the arrow climbs into the working set. Drawing
// it downward would say the working set produces its sources, which is backwards.
export const rowSources: Scene = {
  id: 'row-sources',
  padding: 0.17,
  flow: 'BT',
  nodes: [
    { id: 'working-set', label: 'The working set', pattern: 'service', icon: 'table', sub: 'every later stage shapes it' },
    {
      id: 'sources',
      label: 'Where rows come from',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'src-table', label: 'A table', pattern: 'storage', icon: 'table', sub: 'the base source' },
        { id: 'src-subquery', label: 'A subquery', pattern: 'network', icon: 'braces', sub: 'a result used in FROM' },
        { id: 'src-cte', label: 'A CTE', pattern: 'user', icon: 'scroll', sub: 'WITH name AS ( … )' },
        { id: 'src-recursive', label: 'WITH RECURSIVE', pattern: 'user', icon: 'repeat', sub: 'walks a hierarchy' },
      ],
    },
  ],
  edges: [{ source: 'sources', target: 'working-set', label: 'FROM names the source — a table, or anything table-shaped' }],
}
