import type { Scene } from '../../render-engine'

// §4 where-filter — the predicates are the easy half; the narration spends most of its length on
// NULL, so the board does too. The second band is the actual rule that catches people: WHERE keeps a
// row only when the condition is exactly TRUE, and every NULL comparison lands on UNKNOWN, which is
// not TRUE — so those rows vanish without anyone writing a filter for them.
export const whereFilter: Scene = {
  id: 'where-filter',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'predicates',
      label: 'Test every row — keep only the ones that come out TRUE',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'p-compare', label: 'Comparison', pattern: 'service', icon: 'scale', sub: 'total > 0' },
        { id: 'p-logic', label: 'AND / OR / NOT', pattern: 'service', icon: 'gitbranch', sub: 'combine predicates' },
        { id: 'p-sets', label: 'IN · BETWEEN', pattern: 'network', icon: 'boxes', sub: 'a set · a range' },
        { id: 'p-like', label: 'LIKE', pattern: 'network', icon: 'funnel', sub: 'a text pattern' },
      ],
    },
    {
      id: 'three-valued',
      label: 'NULL — SQL logic has a THIRD truth value',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'tv-true', label: 'TRUE', pattern: 'storage', icon: 'circlecheck', sub: 'the row is kept' },
        { id: 'tv-false', label: 'FALSE', pattern: 'external', icon: 'circleslash', sub: 'the row is dropped' },
        { id: 'tv-unknown', label: 'UNKNOWN', pattern: 'user', icon: 'ban', sub: 'dropped as well' },
        { id: 'tv-trap', label: 'Never write = NULL', pattern: 'warn', sub: 'IS NULL is the test' },
      ],
    },
  ],
  edges: [{ source: 'predicates', target: 'three-valued', label: 'any comparison with NULL is UNKNOWN — and UNKNOWN is not TRUE' }],
}
