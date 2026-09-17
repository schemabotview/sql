import type { Scene } from '@graphlearning/flow'
import { projectSteps } from './steps'

// §4 cap-load — step 3. The inserts are ordinary; the BEGIN/COMMIT around them is the lesson. Orders
// reference customers, so a half-finished load is not merely incomplete — it is invalid, and the
// band below says why the envelope is not optional here.
export const capLoad: Scene = {
  id: 'cap-load',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    projectSteps(),
    {
      id: 'load-code',
      kind: 'code',
      filename: '03_load.sql',
      label: [
        'BEGIN;',
        '',
        'INSERT INTO customers (name, email) VALUES',
        "  ('Ada',  'ada@shop.io'),",
        "  ('Ravi', 'ravi@shop.io');",
        '',
        'INSERT INTO orders (customer_id, total) VALUES',
        '  (1, 120.00),',
        '  (1,  45.00),',
        '  (2, 210.00);',
        '',
        'COMMIT;',
      ].join('\n'),
    },
    {
      id: 'why-envelope',
      label: 'Why this one has to be atomic',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'we-fk', label: 'Orders need customers', pattern: 'network', icon: 'gitbranch', sub: 'the FK from step 1' },
        { id: 'we-half', label: 'A half-done load', pattern: 'warn', sub: 'orphans, or errors' },
      ],
    },
  ],
  edges: [
    { source: 'plan', target: 'load-code' },
    { source: 'load-code', target: 'why-envelope', label: 'seen only BEFORE or AFTER — never mid-load' },
  ],
}
