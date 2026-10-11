import type { Scene } from '@graphlearning/flow'

// §6 constraint-guards — the finished table, and a verdict on six candidate records. The verdict
// table is the chapter's outcome made visible: given the schema, PREDICT whether a record is
// accepted. Every verdict is asserted in db/verify/ch02-structures.sql (two accepted, four rejected,
// each by the named rule and no other). Beneath, the decision a foreign key forces: what happens to
// the children when the parent goes. ON DELETE CASCADE, run on customer 7 (who has no orders, so the
// delete is legal), removes her wishlist rows with her.
export const constraintGuards: Scene = {
  id: 'constraint-guards',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'guards',
      label: 'The finished table — and six candidate records',
      pattern: 'group',
      icon: 'none',
      flow: 'TB',
      children: [
        {
          id: 'q-final',
          kind: 'code',
          filename: 'wishlist-final.sql',
          hug: true,
          label: [
            'CREATE TABLE wishlist (',
            '  customer_id integer NOT NULL',
            '    REFERENCES customers (customer_id),',
            '  product_id  integer NOT NULL',
            '    REFERENCES products (product_id),',
            '  priority    integer NOT NULL DEFAULT 3',
            '    CHECK (priority BETWEEN 1 AND 5),',
            '  added_on    date NOT NULL',
            '    DEFAULT current_date,',
            '  PRIMARY KEY (customer_id, product_id));',
          ].join('\n'),
        },
        {
          id: 'verdicts',
          kind: 'table',
          label: 'predict, then read the verdict',
          pattern: 'warn',
          headers: ['customer', 'product', 'priority', 'verdict', 'rule'],
          values: [
            ['1', '4', '3', 'accepted', '—'],
            ['3', '5', '1', 'accepted', '—'],
            ['1', '4', '2', 'rejected', 'PRIMARY KEY: pair exists'],
            ['99', '4', '3', 'rejected', 'FOREIGN KEY: no customer 99'],
            ['2', '5', '9', 'rejected', 'CHECK: priority 1–5'],
            ['NULL', '4', '3', 'rejected', 'NOT NULL: customer_id'],
          ],
        },
      ],
      edges: [{ source: 'q-final', target: 'verdicts' }],
    },
    {
      id: 'cascade',
      label: 'When the parent goes, what happens to the children?',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-cascade',
          kind: 'code',
          filename: 'cascade.sql',
          hug: true,
          label: [
            'CREATE TABLE wishlist (',
            '  customer_id integer REFERENCES customers',
            '    ON DELETE CASCADE,',
            '  product_id integer REFERENCES products,',
            '  PRIMARY KEY (customer_id, product_id));',
            'INSERT INTO wishlist VALUES (7, 4), (7, 5);',
            'DELETE FROM customers WHERE customer_id = 7;',
            'SELECT count(*) AS left_over FROM wishlist;',
          ].join('\n'),
        },
        {
          id: 'r-cascade',
          kind: 'table',
          label: 'her wishes went with her',
          pattern: 'service',
          headers: ['left_over'],
          values: [['0']],
        },
      ],
      edges: [{ source: 'q-cascade', target: 'r-cascade' }],
    },
  ],
  edges: [{ source: 'guards', target: 'cascade' }],
}
