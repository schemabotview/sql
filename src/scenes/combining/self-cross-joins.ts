import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §4 self-cross-joins — one table can be joined to itself under two aliases: employees e (the worker)
// and m (the same table read as the manager). A LEFT JOIN keeps the CEO, whose manager_id is NULL. A
// cross join has no condition and returns every pairing: 9 customers x 10 products = 90 — useful
// deliberately, a disaster by accident (employees joined to themselves with no real condition: 7x7 = 49).
export const selfCrossJoins: Scene = {
  id: 'self-cross-joins',
  padding: 0.1,
  flow: 'LR',
  nodes: [
    pair({
      id: 'self',
      title: 'self-join: two aliases, one table',
      file: 'self-join.sql',
      sql: ['SELECT e.name AS employee,', '       m.name AS manager', 'FROM employees e', 'LEFT JOIN employees m', '  ON m.employee_id = e.manager_id', 'ORDER BY e.employee_id;'],
      outs: [
        {
          label: 'the CEO has no manager',
          headers: ['employee', 'manager'],
          values: [['Nora Quinn', 'NULL'], ['Omar Haddad', 'Nora Quinn'], ['Priya Nair', 'Nora Quinn'], ['Quinn Moore', 'Omar Haddad'], ['Rafael Diaz', 'Omar Haddad'], ['Sana Iqbal', 'Priya Nair'], ['Tom Becker', 'Sana Iqbal']],
        },
      ],
    }),
    grid('cross', 'Cross join: every pairing', 1, [
      pair({
        id: 'cross',
        title: 'on purpose: 9 x 10',
        file: 'cross-join.sql',
        sql: ['SELECT count(*) AS pairs', 'FROM customers', 'CROSS JOIN products;'],
        outs: [{ label: 'every customer with every product', headers: ['pairs'], values: [['90']] }],
      }),
      pair({
        id: 'oops',
        title: 'by accident: 7 x 7',
        file: 'cross-oops.sql',
        sql: ['SELECT count(*) AS pairs', 'FROM employees e', 'JOIN employees m ON true;'],
        outs: [{ label: 'a condition that is always true', headers: ['pairs'], values: [['49']], pattern: 'warn' }],
      }),
    ]),
  ],
  edges: [{ source: 'g-self', target: 'cross' }],
}
