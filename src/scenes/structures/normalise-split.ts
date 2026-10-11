import type { Scene } from '@graphlearning/flow'

// §2 normalise-split — one wide sheet, the failure it invites, and the cure. The failure is real: the
// sheet is built from orders joined to customers, one row is updated, and Asha is then in TWO cities
// (Bengaluru on 2 rows, Mysuru on 1). Both the result and the claim that the normalised design does
// not have the problem are asserted by db/verify/ch02-structures.sql. The cure is to split by WHO each
// fact is about, so a city lives on the customer row and an order refers to the customer.
export const normaliseSplit: Scene = {
  id: 'normalise-split',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'sheet',
      kind: 'table',
      label: 'order_sheet — one wide table (Asha: 3 of 11 rows)',
      pattern: 'warn',
      headers: ['order_id', 'customer', 'city', 'status'],
      values: [
        ['1', 'Asha Rao', 'Bengaluru', 'delivered'],
        ['3', 'Asha Rao', 'Bengaluru', 'delivered'],
        ['9', 'Asha Rao', 'Bengaluru', 'pending'],
      ],
    },
    {
      id: 'anomaly',
      label: 'Asha moves — but only one row is updated',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-anomaly',
          kind: 'code',
          filename: 'update-anomaly.sql',
          hug: true,
          label: [
            'CREATE TEMP TABLE order_sheet AS',
            '  SELECT o.order_id,',
            "    c.first_name || ' ' || c.last_name",
            '      AS customer, c.city, o.status',
            '  FROM orders o JOIN customers c',
            '    USING (customer_id);',
            '',
            "UPDATE order_sheet SET city = 'Mysuru'",
            '  WHERE order_id = 1;',
            '',
            'SELECT customer, city, count(*) AS rows',
            '  FROM order_sheet',
            "  WHERE customer = 'Asha Rao'",
            '  GROUP BY customer, city ORDER BY city;',
          ].join('\n'),
        },
        {
          id: 'r-anomaly',
          kind: 'table',
          label: 'two truths about one person',
          pattern: 'warn',
          headers: ['customer', 'city', 'rows'],
          values: [
            ['Asha Rao', 'Bengaluru', '2'],
            ['Asha Rao', 'Mysuru', '1'],
          ],
        },
      ],
      edges: [{ source: 'q-anomaly', target: 'r-anomaly' }],
    },
    {
      id: 'split',
      label: 'Split by who each fact is about',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'n-cust',
          kind: 'table',
          label: 'customers — one row per person',
          pattern: 'user',
          headers: ['customer_id', 'name', 'city'],
          values: [['1', 'Asha Rao', 'Bengaluru']],
        },
        {
          id: 'n-ord',
          kind: 'table',
          label: 'orders — one row per order',
          pattern: 'service',
          headers: ['order_id', 'customer_id', 'status'],
          values: [
            ['1', '1', 'delivered'],
            ['3', '1', 'delivered'],
            ['9', '1', 'pending'],
          ],
        },
      ],
      edges: [{ source: 'n-cust', target: 'n-ord' }],
    },
  ],
  edges: [
    { source: 'sheet', target: 'anomaly' },
    { source: 'anomaly', target: 'split' },
  ],
}
