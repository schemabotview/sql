import type { Scene } from '@graphlearning/flow'

// §5 the-transfer — the example the narration actually speaks, with the numbers on screen. A
// transaction is invisible when it works, so what makes it teachable is the pair of states either
// side of it: 500/200 becomes 400/300, and the two writes that got it there are indivisible.
//
// The warn band is the counterfactual — a crash BETWEEN the debit and the credit — which is the only
// reason any of this machinery exists.
export const theTransfer: Scene = {
  id: 'the-transfer',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'transfer',
      label: 'Move $100 from A to B — two writes, one truth',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'acct-before',
          kind: 'table',
          label: 'accounts — before',
          pattern: 'storage',
          headers: ['id', 'balance'],
          values: [
            ['A', '500.00'],
            ['B', '200.00'],
          ],
        },
        {
          id: 'acct-after',
          kind: 'table',
          label: 'accounts — after COMMIT',
          pattern: 'service',
          sub: 'both writes, or neither',
          headers: ['id', 'balance'],
          values: [
            ['A', '400.00'],
            ['B', '300.00'],
          ],
        },
      ],
    },
    {
      id: 'lifecycle',
      label: 'The lifecycle',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'lc-begin', label: 'BEGIN', pattern: 'network', icon: 'dooropen', sub: 'open it' },
        { id: 'lc-debit', label: 'debit A', pattern: 'network', icon: 'wrench', sub: '500 → 400' },
        { id: 'lc-credit', label: 'credit B', pattern: 'network', icon: 'wrench', sub: '200 → 300' },
        { id: 'lc-commit', label: 'COMMIT', pattern: 'storage', icon: 'circlecheck', sub: 'both land at once' },
      ],
    },
    { id: 'crash', label: 'A crash between them', pattern: 'warn', sub: 'ROLLBACK undoes both' },
  ],
  edges: [
    { source: 'transfer', target: 'lifecycle' },
    { source: 'lifecycle', target: 'crash', label: 'without the envelope, $100 simply vanishes' },
  ],
}
