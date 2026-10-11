import type { Scene } from '@graphlearning/flow'
import { grid, pair } from '../pair'

// §2 recursive — an anchor row, then a step that joins the previous iteration's rows back to the table
// until a step adds nothing. employees (manager_id -> employee_id) reaches depth 4; the trace table
// counts the rows each iteration adds (1, 2, 3, 1, then 0: termination). categories use the same shape to
// build a path string. A cycle (1 -> 2 -> 3 -> 1) would never end, so the third card keeps the ids
// already visited and refuses to revisit one (PostgreSQL 14+ also has a CYCLE clause).
export const recursive: Scene = {
  id: 'recursive',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Anchor, step, termination', 2, [
      pair({
        id: 'org',
        title: 'walk the management chain',
        file: 'recursive-org.sql',
        sql: [
          'WITH RECURSIVE chain AS (',
          '  SELECT employee_id, name, 1 AS depth',
          '  FROM employees WHERE manager_id IS NULL',
          '  UNION ALL',
          '  SELECT e.employee_id, e.name, c.depth + 1',
          '  FROM employees e',
          '  JOIN chain c ON e.manager_id = c.employee_id)',
          'SELECT employee_id, name, depth FROM chain',
          'ORDER BY depth, employee_id;',
        ],
        outs: [{ label: '7 employees, 4 levels', headers: ['employee_id', 'name', 'depth'], values: [['1', 'Nora Quinn', '1'], ['2', 'Omar Haddad', '2'], ['3', 'Priya Nair', '2'], ['4', 'Quinn Moore', '3'], ['5', 'Rafael Diaz', '3'], ['6', 'Sana Iqbal', '3'], ['7', 'Tom Becker', '4']] }],
      }),
      {
        id: 'trace',
        kind: 'table',
        label: 'rows added by each iteration',
        pattern: 'service',
        headers: ['iteration', 'new rows'],
        values: [['anchor (depth 1)', '1'], ['step 1 (depth 2)', '2'], ['step 2 (depth 3)', '3'], ['step 3 (depth 4)', '1'], ['step 4', '0, stop']],
      },
      pair({
        id: 'path',
        title: 'same shape: a category path',
        file: 'recursive-path.sql',
        sql: [
          'WITH RECURSIVE path AS (',
          '  SELECT category_id, name::text AS trail',
          '  FROM categories WHERE parent_id IS NULL',
          '  UNION ALL',
          "  SELECT c.category_id, p.trail || ' > ' || c.name",
          '  FROM categories c',
          '  JOIN path p ON c.parent_id = p.category_id)',
          'SELECT trail FROM path ORDER BY trail;',
        ],
        outs: [{ label: '6 categories', headers: ['trail'], values: [['Books'], ['Electronics'], ['Electronics > Audio'], ['Electronics > Audio > Headphones'], ['Electronics > Computers'], ['Home']] }],
      }),
      pair({
        id: 'cycle',
        title: 'a cycle needs a guard',
        file: 'recursive-cycle.sql',
        sql: [
          'WITH RECURSIVE edges(id, nxt) AS (',
          '  VALUES (1, 2), (2, 3), (3, 1)),',
          'walk(id, nxt, seen) AS (',
          '  SELECT id, nxt, ARRAY[id]',
          '  FROM edges WHERE id = 1',
          '  UNION ALL',
          '  SELECT e.id, e.nxt, w.seen || e.id',
          '  FROM edges e JOIN walk w ON e.id = w.nxt',
          '  WHERE NOT e.id = ANY (w.seen))',
          'SELECT id, nxt, seen FROM walk;',
        ],
        outs: [{ label: 'edges 1→2, 2→3, 3→1 stop at 3 steps', headers: ['id', 'nxt', 'seen'], values: [['1', '2', '{1}'], ['2', '3', '{1,2}'], ['3', '1', '{1,2,3}']] }],
      }),
    ]),
  ],
}
