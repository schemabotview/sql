import type { Scene } from '@graphlearning/flow'
import { grid, pair, pairSide } from '../pair'

// §4 views-policies — two ways to restrict exposure. A VIEW restricts COLUMNS: analyst may read customer_contacts
// (no email, no phone) but not the customers table (permission denied). A row-level security POLICY restricts
// ROWS: role sales sees only orders whose employee_id equals app.employee_id — employee 4 sees 3 orders
// (1, 5, 10), employee 5 sees 2 (3, 7), and the superuser still sees all 11. The 6 online orders (employee_id
// NULL) match no rep at all. Default views run with the OWNER's rights; a security_invoker view (PostgreSQL 15+)
// runs with the caller's — verified in db/verify/ch10-access.sql.
export const viewsPolicies: Scene = {
  id: 'views-policies',
  padding: 0.12,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Hide columns with a view, hide rows with a policy', 2, [
      pair({
        id: 'view',
        title: 'a view hides columns',
        file: 'view-columns.sql',
        sql: ['-- expect-error: the table itself stays closed', 'CREATE ROLE analyst NOLOGIN;', 'GRANT USAGE ON SCHEMA shop TO analyst;', 'CREATE VIEW customer_contacts AS', '  SELECT customer_id, first_name,', '         last_name, city', '  FROM customers;', 'GRANT SELECT ON customer_contacts TO analyst;', 'SET ROLE analyst;', '', 'SELECT * FROM customer_contacts', 'WHERE customer_id <= 2 ORDER BY 1;', 'SELECT email FROM customers;'],
        outs: [{ label: 'no email, no phone', headers: ['customer_id', 'first_name', 'last_name', 'city'], values: [['1', 'Asha', 'Rao', 'Bengaluru'], ['2', 'Ben', 'Carter', 'London']] }],
        err: { label: 'the table is refused', sub: 'permission denied' },
      }),
      pairSide({
        id: 'policy',
        title: 'a policy hides rows',
        file: 'row-policy.sql',
        sql: [
          'CREATE ROLE sales NOLOGIN;',
          'GRANT USAGE ON SCHEMA shop TO sales;',
          'GRANT SELECT ON orders TO sales;',
          'ALTER TABLE orders ENABLE ROW LEVEL SECURITY;',
          'CREATE POLICY own_orders ON orders',
          '  FOR SELECT TO sales',
          "  USING (employee_id =",
          "    current_setting('app.employee_id', true)::int);",
          '',
          'SET ROLE sales;',
          "SET app.employee_id = '4';",
          'SELECT order_id FROM orders ORDER BY 1;',
          "SET app.employee_id = '5';",
          'SELECT order_id FROM orders ORDER BY 1;',
          'RESET ROLE;',
          'SELECT count(*) AS all_rows FROM orders;',
        ],
        outs: [
          { label: 'employee 4', headers: ['order_id'], values: [['1'], ['5'], ['10']] },
          { label: 'employee 5', headers: ['order_id'], values: [['3'], ['7']] },
          { label: 'the owner sees every row', headers: ['all_rows'], values: [['11']] },
        ],
      }),
      {
        id: 'compare',
        kind: 'table',
        label: 'view versus row policy',
        pattern: 'service',
        headers: ['', 'view', 'row policy'],
        values: [['restricts', 'columns, derived values', 'rows'], ['set up on', 'a new object', 'the table itself'], ['owner and superuser', 'see the base table', 'bypass the policy'], ['watch out', 'runs with owner rights', 'rows matching no one']],
      },
      { id: 'null', label: '6 online orders', sub: 'employee_id is NULL: no rep sees them', pattern: 'warn', icon: 'triangleAlert' },
    ]),
  ],
}
