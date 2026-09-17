import type { Scene } from '@graphlearning/flow'

// §8 arrange — the second CODE card, for the same reason as §7: `NULLS LAST` and `LIMIT … OFFSET`
// are syntax, and a diagram of them would just be the words in boxes. The statement shows the two
// final stages doing the only thing they do — arranging rows they never chose.
//
// The band below carries the two traps the narration calls out: LIMIT without ORDER BY is a
// non-deterministic "top N", and ranking WITHIN groups is a window function, not a LIMIT.
export const arrange: Scene = {
  id: 'arrange',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'arrange-code',
      kind: 'code',
      filename: 'paging.sql',
      label: [
        'SELECT name, total',
        'FROM orders',
        'ORDER BY total DESC NULLS LAST,',
        '         name ASC',
        'LIMIT 10 OFFSET 20;',
      ].join('\n'),
    },
    {
      id: 'arrange-traps',
      label: 'These two arrange the result — they never filter it',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'trap-nosort', label: 'LIMIT with no ORDER BY', pattern: 'warn', sub: 'the top 10 is arbitrary' },
        { id: 'trap-rank', label: 'Rank inside a group', pattern: 'user', icon: 'tag', sub: 'a window, not LIMIT' },
      ],
    },
  ],
  edges: [{ source: 'arrange-code', target: 'arrange-traps', label: 'the last two stages to run — the row set is already decided' }],
}
