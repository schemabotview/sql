import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §2 where-filters — WHERE keeps a row only when its condition is TRUE. The first card combines two
// conditions with AND (3 of 11 orders pass). The second is the classic precedence trap: AND binds
// tighter than OR, so `pending OR shipped AND customer_id = 2` means pending-OR-(shipped-by-2) and
// returns FOUR orders, while the parenthesised reading returns ONE. The operator table is reference.
export const whereFilters: Scene = {
  id: 'where-filters',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    grid('cards', 'Filter rows, combine conditions', 2, [
      pair({
        id: 'and',
        title: 'AND: both must hold',
        file: 'and.sql',
        sql: ['SELECT order_id, customer_id, status', 'FROM orders', "WHERE status = 'delivered'", "  AND order_date >= '2025-03-02'", 'ORDER BY order_id;'],
        outs: [{ label: '3 of 11 orders pass', headers: ['order_id', 'customer_id', 'status'], values: [['3', '1', 'delivered'], ['4', '3', 'delivered'], ['5', '4', 'delivered']] }],
      }),
      pair({
        id: 'prec',
        title: 'AND binds tighter than OR',
        file: 'precedence.sql',
        sql: [
          'SELECT order_id FROM orders',
          "WHERE status = 'pending'",
          "   OR status = 'shipped'",
          '  AND customer_id = 2',
          'ORDER BY order_id;',
          '',
          'SELECT order_id FROM orders',
          "WHERE (status = 'pending'",
          "   OR status = 'shipped')",
          '  AND customer_id = 2',
          'ORDER BY order_id;',
        ],
        outs: [
          { label: 'without parentheses: 4 rows', headers: ['order_id'], values: [['6'], ['9'], ['10'], ['11']], pattern: 'warn' },
          { label: 'with parentheses: 1 row', headers: ['order_id'], values: [['6']] },
        ],
      }),
    ]),
    {
      id: 'ops',
      kind: 'table',
      label: 'Comparison and logical operators',
      pattern: 'storage',
      headers: ['operator', 'means'],
      values: [
        ['=  <>', 'equal · not equal'],
        ['<  <=  >  >=', 'less · greater, with or without equal'],
        ['AND  OR  NOT', 'both · either · flip'],
      ],
    },
  ],
  edges: [{ source: 'cards', target: 'ops' }],
}
