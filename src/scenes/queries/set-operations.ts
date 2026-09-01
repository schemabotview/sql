import type { Scene } from '../../render-engine'

// §9 set-operations — the axis contrast leads, because it is the clearest thing anyone can say about
// set ops and it lands against the join course section students just watched: a join grows the row
// SIDEWAYS, a set op grows the result DOWNWARD. (That framing is sql-ct's, and it is better than
// listing the four operators cold.) The closing card is the rule both sides must obey, which is
// where set ops actually bite in practice.
export const setOperations: Scene = {
  id: 'set-operations',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'axes',
      label: 'Two ways to combine — different axes',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'ax-join', label: 'JOIN — horizontal', pattern: 'network', icon: 'gitbranch', sub: 'match a key, wider row' },
        { id: 'ax-set', label: 'SET OP — vertical', pattern: 'service', icon: 'layers', sub: 'same shape, more rows' },
      ],
    },
    {
      id: 'operators',
      label: 'The four operators',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'op-union', label: 'UNION', pattern: 'service', icon: 'boxes', sub: 'both, deduplicated' },
        { id: 'op-unionall', label: 'UNION ALL', pattern: 'service', icon: 'copy', sub: 'both, kept — faster' },
        { id: 'op-intersect', label: 'INTERSECT', pattern: 'user', icon: 'circlecheck', sub: 'rows in both' },
        { id: 'op-except', label: 'EXCEPT', pattern: 'user', icon: 'circleslash', sub: 'in A, not in B' },
      ],
    },
    { id: 'shape-rule', label: 'Both sides must match', pattern: 'warn', sub: 'count, types, position' },
  ],
  edges: [
    { source: 'axes', target: 'operators' },
    { source: 'operators', target: 'shape-rule', label: 'names come from the first query — position is what matches' },
  ],
}
