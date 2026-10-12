import type { Scene } from '@graphlearning/flow'
import { grid, pair, pairSide } from '../pair'

// §5 parameters-boundaries — a PARAMETER is data; text pasted into SQL becomes code. Input  x' OR '1'='1  pasted into the
// WHERE clause returns all 9 customers; passed as a parameter of a prepared statement it is just an email that
// matches nobody (0 rows), while a normal address finds customer 1. PREPARE/EXECUTE is the server-side
// equivalent of the placeholders drivers send. A parameter can only stand for a VALUE: PREPARE ... FROM $1
// is a syntax error, so an identifier from outside must be checked against a list or quoted with format(%I),
// which turns 'orders; DROP TABLE customers' into one quoted name. The application role is given only what the
// app needs: it may INSERT an order but not DELETE one (and cannot DROP the table: not the owner).
export const parametersBoundaries: Scene = {
  id: 'parameters-boundaries',
  padding: 0.15,
  flow: 'TB',
  edges: [],
  nodes: [
    grid('cards', 'Values are parameters; names are not; rights are narrow', 3, [
      pair({
        id: 'pasted',
        title: 'text pasted into SQL',
        file: 'injection.sql',
        sql: ['-- the application built this text from input', "--   x' OR '1'='1", 'SELECT customer_id, first_name', 'FROM customers', "WHERE email = 'x' OR '1'='1'", 'ORDER BY customer_id;'],
        outs: [{ label: 'the input became code: all 9 rows', headers: ['customer_id', 'first_name'], values: [['1', 'Asha'], ['2', 'Ben'], ['3', 'Chloe'], ['4', 'Dev'], ['5', 'Elena'], ['6', 'Farid'], ['7', 'Grace'], ['8', 'Hiro'], ['9', 'Chloe']], pattern: 'warn' }],
      }),
      pairSide({
        id: 'param',
        title: 'the same input as a parameter',
        file: 'prepared.sql',
        sql: [
          'PREPARE find_customer(text) AS',
          '  SELECT customer_id, first_name',
          '  FROM customers WHERE email = $1;',
          '',
          "EXECUTE find_customer('asha.rao@example.com');",
          "EXECUTE find_customer($$x' OR '1'='1$$);",
        ],
        outs: [
          { label: 'a normal value', headers: ['customer_id', 'first_name'], values: [['1', 'Asha']] },
          { label: 'the hostile text is just a value', headers: ['customer_id', 'first_name'], values: [], pattern: 'service' },
        ],
      }),
      pair({
        id: 'ident',
        title: 'a parameter is not an identifier',
        file: 'identifier-parameter.sql',
        sql: ['-- expect-error: $1 cannot name a table', 'PREPARE bad(text) AS', '  SELECT * FROM $1;'],
        err: { label: 'syntax error', sub: 'at or near $1' },
      }),
      pair({
        id: 'quote',
        title: 'quote names with format(%I)',
        file: 'format-identifier.sql',
        sql: ["SELECT format('SELECT * FROM %I',", "  'orders; DROP TABLE customers') AS built", 'UNION ALL', "SELECT format('SELECT * FROM %I', 'orders');"],
        outs: [{ label: 'one quoted name, not two statements', headers: ['built'], values: [['SELECT * FROM "orders; DROP TABLE customers"'], ['SELECT * FROM orders']] }],
      }),
      pair({
        id: 'app',
        title: 'an application role: only what it needs',
        file: 'app-privileges.sql',
        sql: ['-- expect-error: the app may not DELETE', 'CREATE ROLE app LOGIN;', 'GRANT USAGE ON SCHEMA shop TO app;', 'GRANT SELECT, INSERT ON orders TO app;', 'SET ROLE app;', '', 'INSERT INTO orders VALUES', "  (12, 2, NULL, '2025-03-13', 'pending');", 'DELETE FROM orders WHERE order_id = 12;'],
        outs: [{ label: 'insert allowed', headers: ['command tag'], values: [['INSERT 0 1']] }],
        err: { label: 'DELETE refused', sub: 'permission denied' },
      }),
      {
        id: 'rules',
        kind: 'table',
        label: 'what may be a parameter',
        pattern: 'service',
        headers: ['part of the query', 'how to take it from input'],
        values: [['a value', 'parameter ($1)'], ['a table or column name', 'allowlist, or format(%I)'], ['ASC / DESC, keywords', 'allowlist'], ['the whole statement', 'never from input']],
      },
    ]),
  ],
}
