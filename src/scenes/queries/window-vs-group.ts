import type { Scene } from '../../render-engine'

// §6 window-vs-group — the section is defined by a contrast, so the contrast leads, and now it is
// SHOWN rather than claimed: the same four orders, aggregated two ways. The GROUP BY table has two
// rows and the window table has four — the boards are literally different heights, which is the
// whole difference. `SUM() OVER` repeating 245.00 down three rows is the thing that makes a window
// function click.
//
// Everything below is mechanism: what goes inside OVER(), and the three families that ride it.
export const windowVsGroup: Scene = {
  id: 'window-vs-group',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'contrast',
      label: 'The same arithmetic over the same four orders, two different results',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'wc-group',
          kind: 'table',
          label: 'GROUP BY',
          pattern: 'user',
          sub: '4 rows in, 2 out — detail gone',
          headers: ['customer_id', 'SUM(total)'],
          values: [
            ['1', '245.00'],
            ['2', '210.00'],
          ],
        },
        {
          id: 'wc-window',
          kind: 'table',
          label: 'SUM() OVER (PARTITION BY …)',
          pattern: 'service',
          sub: '4 rows in, 4 out — a column added',
          headers: ['id', 'total', 'per_customer'],
          values: [
            ['101', '120.00', '245.00'],
            ['102', '80.00', '245.00'],
            ['103', '45.00', '245.00'],
            ['104', '210.00', '210.00'],
          ],
        },
      ],
    },
    {
      id: 'over',
      label: 'OVER( … ) — what the function is allowed to see',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'ov-partition', label: 'PARTITION BY', pattern: 'network', icon: 'boxes', sub: 'split, rows stay' },
        { id: 'ov-order', label: 'ORDER BY', pattern: 'network', icon: 'scale', sub: 'sequence within' },
        { id: 'ov-frame', label: 'The frame', pattern: 'network', icon: 'waves', sub: 'which neighbours count' },
      ],
    },
    {
      id: 'families',
      label: 'The three families',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'fam-rank', label: 'Ranking', pattern: 'service', icon: 'tag', sub: 'ROW_NUMBER, RANK' },
        { id: 'fam-offset', label: 'Offset', pattern: 'service', icon: 'gitbranch', sub: 'LAG / LEAD' },
        { id: 'fam-running', label: 'Running', pattern: 'service', icon: 'waves', sub: 'SUM() OVER' },
      ],
    },
  ],
  edges: [
    { source: 'contrast', target: 'over', label: 'the window is the set of rows the function looks at' },
    { source: 'over', target: 'families' },
  ],
}
