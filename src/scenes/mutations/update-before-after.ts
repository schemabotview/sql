import type { Scene } from '@graphlearning/flow'

// §3 update-before-after — the clearest use of the table node in the whole concept: the same relation
// twice, one cell different. UPDATE is defined by what it does to state, so showing the state is the
// explanation; a card saying "modifies rows" is not.
//
// The warn band carries the mistake the narration calls "the one that bites everyone". It sits below
// the tables deliberately — you see what a WHERE-scoped update does first, so the cost of forgetting
// the WHERE is obvious rather than abstract.
export const updateBeforeAfter: Scene = {
  id: 'update-before-after',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'change',
      label: "UPDATE orders SET status = 'paid' WHERE id = 101",
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'before',
          kind: 'table',
          label: 'orders — before',
          pattern: 'storage',
          headers: ['id', 'status', 'total'],
          values: [
            ['101', 'pending', '120.00'],
            ['102', 'pending', '80.00'],
          ],
        },
        {
          id: 'after',
          kind: 'table',
          label: 'orders — after',
          pattern: 'service',
          sub: 'one row touched',
          headers: ['id', 'status', 'total'],
          values: [
            ['101', 'paid', '120.00'],
            ['102', 'pending', '80.00'],
          ],
        },
      ],
    },
    {
      id: 'the-bite',
      label: 'The one that bites everyone',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'no-where', label: 'No WHERE, every row', pattern: 'warn', sub: 'the whole table changes' },
        { id: 'test-first', label: 'Test with SELECT', pattern: 'service', icon: 'funnel', sub: 'same predicate, no risk' },
      ],
    },
  ],
  edges: [{ source: 'change', target: 'the-bite', label: 'the WHERE is what kept row 102 alone' }],
}
