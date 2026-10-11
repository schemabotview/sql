import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §8 exists-not-in — EXISTS asks "is there at least one matching row?" and only TRUE/FALSE matters.
// NOT IN against a list that contains a NULL can never be TRUE (x NOT IN (4, NULL) is NULL), so
// employees NOT IN (SELECT employee_id FROM orders) returns 0 rows because orders.employee_id has NULLs
// (online orders), while NOT EXISTS correctly returns the 5 employees who handled no order. Real output.
export const existsNotIn: Scene = {
  id: 'exists-not-in',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Same question, different answers', 2, [
      pair({
        id: 'notexists',
        title: 'NOT EXISTS: who handled no order?',
        file: 'not-exists.sql',
        sql: ['SELECT e.employee_id, e.name', 'FROM employees e', 'WHERE NOT EXISTS (', '  SELECT 1 FROM orders o', '  WHERE o.employee_id = e.employee_id)', 'ORDER BY e.employee_id;'],
        outs: [{ label: '5 employees', headers: ['employee_id', 'name'], values: [['1', 'Nora Quinn'], ['2', 'Omar Haddad'], ['3', 'Priya Nair'], ['6', 'Sana Iqbal'], ['7', 'Tom Becker']] }],
      }),
      pair({
        id: 'notin',
        title: 'NOT IN: the same question',
        file: 'not-in.sql',
        sql: ['SELECT employee_id, name', 'FROM employees', 'WHERE employee_id NOT IN (', '  SELECT employee_id FROM orders)', 'ORDER BY employee_id;'],
        outs: [{ label: 'orders.employee_id has NULLs: 0 rows', headers: ['employee_id', 'name'], values: [], pattern: 'warn' }],
      }),
      pair({
        id: 'why',
        title: 'why: NULL poisons the list',
        file: 'not-in-null.sql',
        sql: ['SELECT 1 NOT IN (4, 5)    AS clean,', '       1 NOT IN (4, NULL) AS with_null;'],
        outs: [{ label: 'NULL shows as blank', headers: ['clean', 'with_null'], values: [['t', 'NULL']], pattern: 'warn' }],
      }),
      pair({
        id: 'exists',
        title: 'EXISTS: at least one match',
        file: 'exists.sql',
        sql: ['SELECT c.customer_id, c.first_name', 'FROM customers c', 'WHERE EXISTS (', '  SELECT 1 FROM orders o', '  WHERE o.customer_id = c.customer_id', "    AND o.status = 'pending')", 'ORDER BY c.customer_id;'],
        outs: [{ label: 'no duplicates from the match', headers: ['customer_id', 'first_name'], values: [['1', 'Asha'], ['4', 'Dev'], ['9', 'Chloe']] }],
      }),
    ]),
  ],
}
