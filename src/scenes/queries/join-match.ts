import type { Scene } from '../../render-engine'

// §3 join-match — the worked example the narration actually speaks, now drawn as the two relations
// it is talking about rather than described in card subs. Ann has two orders, Bob one, Cat none:
// with both tables on screen as data, the reader can DO the match themselves — customer 3 appears in
// `customers` and nowhere in `orders`, which is the whole lesson.
//
// Cat is the lesson, so the band below is framed as what each join type does to her. That beats
// listing six join types as trivia.
export const joinMatch: Scene = {
  id: 'join-match',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'match',
      label: 'The match — customers.id lined up with orders.customer_id',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'jm-customers',
          kind: 'table',
          label: 'customers',
          pattern: 'storage',
          headers: ['id', 'name'],
          values: [
            ['1', 'Ann'],
            ['2', 'Bob'],
            ['3', 'Cat'],
          ],
        },
        {
          id: 'jm-orders',
          kind: 'table',
          label: 'orders',
          pattern: 'network',
          sub: 'no row carries customer 3',
          headers: ['id', 'customer_id'],
          values: [
            ['101', '1'],
            ['102', '1'],
            ['103', '2'],
          ],
        },
      ],
    },
    {
      id: 'types',
      label: 'The type decides which UNMATCHED rows survive',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'inner', label: 'INNER', pattern: 'service', icon: 'circlecheck', sub: 'Cat drops out' },
        { id: 'leftright', label: 'LEFT / RIGHT', pattern: 'network', icon: 'dooropen', sub: 'Cat stays, with NULLs' },
        { id: 'fullouter', label: 'FULL OUTER', pattern: 'network', icon: 'boxes', sub: 'everything, both sides' },
        { id: 'cross', label: 'CROSS', pattern: 'external', icon: 'waves', sub: 'every pairing' },
        { id: 'self', label: 'SELF', pattern: 'user', icon: 'repeat', sub: 'the table to itself' },
      ],
    },
  ],
  edges: [{ source: 'match', target: 'types', label: 'the mechanics never change — only what happens to Cat' }],
}
