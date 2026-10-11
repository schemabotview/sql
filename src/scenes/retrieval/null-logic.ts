import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §4 null-logic — three-valued logic made visible. A comparison with NULL is UNKNOWN, and WHERE keeps
// only TRUE, so a NULL row quietly vanishes. The truth table shows AND/OR over TRUE, FALSE and UNKNOWN;
// the live card checks four of its cells against the server. The last card is the consequence on a real
// column: `phone <> '+91-…'` returns 7 customers — Elena, whose phone is NULL, is dropped, not kept —
// while IS DISTINCT FROM treats NULL as an ordinary value and returns 8.
export const nullLogic: Scene = {
  id: 'null-logic',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'truth',
      kind: 'table',
      label: 'Three-valued logic: TRUE, FALSE, UNKNOWN (NULL)',
      pattern: 'storage',
      headers: ['A', 'B', 'A AND B', 'A OR B'],
      values: [
        ['TRUE', 'TRUE', 'TRUE', 'TRUE'],
        ['TRUE', 'FALSE', 'FALSE', 'TRUE'],
        ['TRUE', 'UNKNOWN', 'UNKNOWN', 'TRUE'],
        ['FALSE', 'UNKNOWN', 'FALSE', 'UNKNOWN'],
        ['UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN'],
      ],
    },
    grid('cards', 'Check it, then watch it drop a row', 2, [
      pair({
        id: 'tvl',
        title: 'the server agrees',
        file: 'tvl.sql',
        sql: ['SELECT NULL AND true  AS n_and_t,', '       NULL AND false AS n_and_f,', '       NULL OR  true  AS n_or_t,', '       NULL OR  false AS n_or_f,', '       NOT NULL       AS not_n;'],
        outs: [{ label: 'NULL shows as blank', headers: ['n_and_t', 'n_and_f', 'n_or_t', 'n_or_f', 'not_n'], values: [['NULL', 'f', 't', 'NULL', 'NULL']] }],
      }),
      pair({
        id: 'neq',
        title: 'a NULL row disappears',
        file: 'not-equal.sql',
        sql: ['SELECT count(*) AS n', 'FROM customers', "WHERE phone <> '+91-98450-11111';", '', 'SELECT count(*) AS n', 'FROM customers', "WHERE phone IS DISTINCT FROM", "      '+91-98450-11111';"],
        outs: [
          { label: '<> : 7 (Elena dropped)', headers: ['n'], values: [['7']], pattern: 'warn' },
          { label: 'IS DISTINCT FROM: 8', headers: ['n'], values: [['8']] },
        ],
      }),
    ]),
  ],
  edges: [{ source: 'truth', target: 'cards' }],
}
