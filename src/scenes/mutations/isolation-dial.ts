import type { Scene } from '@graphlearning/flow'

// §7 isolation-dial — anomalies only exist because transactions OVERLAP, so the board opens on the
// interleave the narration walks through: T1 reads 5, T2 commits 8, T1 reads again and gets 8. The
// same query, two answers. The middle band names the three ways that goes wrong, and the bottom band
// is the dial that trades each of them away for less concurrency.
//
// The interleave flows LR because it is a sequence in TIME, and time reads left to right.
export const isolationDial: Scene = {
  id: 'isolation-dial',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'interleave',
      label: 'Two transactions overlapping in time',
      pattern: 'group',
      flow: 'LR',
      children: [
        { id: 'il-1', label: 'T1 reads x', pattern: 'network', icon: 'funnel', sub: 'gets 5' },
        { id: 'il-2', label: 'T2 writes x = 8', pattern: 'user', icon: 'wrench', sub: 'and commits' },
        { id: 'il-3', label: 'T1 re-reads x', pattern: 'warn', sub: 'now gets 8' },
      ],
      edges: [
        { source: 'il-1', target: 'il-2' },
        { source: 'il-2', target: 'il-3' },
      ],
    },
    {
      id: 'anomalies',
      label: 'The three read anomalies',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'an-dirty', label: 'Dirty read', pattern: 'warn', sub: 'sees uncommitted work' },
        { id: 'an-nonrep', label: 'Non-repeatable', pattern: 'warn', sub: 'the value changed' },
        { id: 'an-phantom', label: 'Phantom', pattern: 'warn', sub: 'new rows appeared' },
      ],
    },
    {
      id: 'levels',
      label: 'The dial — each step forbids more, and allows less',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'lv-ru', label: 'READ UNCOMMITTED', pattern: 'external', sub: 'all three allowed' },
        { id: 'lv-rc', label: 'READ COMMITTED', pattern: 'network', icon: 'circlecheck', sub: 'Postgres default' },
        { id: 'lv-rr', label: 'REPEATABLE READ', pattern: 'service', icon: 'repeat', sub: 'rows stay stable' },
        { id: 'lv-ser', label: 'SERIALIZABLE', pattern: 'user', icon: 'lock', sub: 'as if one at a time' },
      ],
    },
  ],
  edges: [
    { source: 'interleave', target: 'anomalies', label: 'the same query, two different answers' },
    { source: 'anomalies', target: 'levels', label: 'pick the WEAKEST level that is still correct' },
  ],
}
