import type { Scene } from '@graphlearning/flow'

// §4 types-and-null — the type table is drawn from the real schema (each example column is a real
// column in db/schema.sql), and the two queries beneath it are the whole NULL lesson: the same
// question asked two ways, and only one of them is a question SQL can answer. `= NULL` is not an
// error, it is an empty result, which is exactly why it bites. The third card shows the
// consequence on counting: count(*) is 9 but count(phone) is 8, because aggregates skip NULL.
export const typesAndNull: Scene = {
  id: 'types-and-null',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'types',
      kind: 'table',
      label: 'A column has ONE type — every row obeys it',
      pattern: 'storage',
      headers: ['type', 'holds', 'a real column'],
      values: [
        ['integer', 'whole numbers', 'customers.customer_id'],
        ['numeric(8,2)', 'exact decimals', 'products.price'],
        ['text', 'strings', 'customers.email'],
        ['date', 'calendar days', 'orders.order_date'],
        ['boolean', 'true / false', 'products.discontinued'],
      ],
    },
    {
      id: 'ask',
      label: 'Which customers have no phone? Same question, two spellings',
      pattern: 'group',
      icon: 'none',
      cols: 2,
      children: [
        {
          id: 'good',
          label: 'IS NULL',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-is',
              kind: 'code',
              filename: 'is-null.sql',
              hug: true,
              label: ['SELECT customer_id, first_name', 'FROM customers', 'WHERE phone IS NULL;'].join('\n'),
            },
            {
              id: 'r-is',
              kind: 'table',
              label: 'result — 1 row',
              pattern: 'service',
              headers: ['customer_id', 'first_name'],
              values: [['5', 'Elena']],
            },
          ],
          edges: [{ source: 'q-is', target: 'r-is' }],
        },
        {
          id: 'bad',
          label: '= NULL',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-eq',
              kind: 'code',
              filename: 'equals-null.sql',
              hug: true,
              label: ['SELECT customer_id, first_name', 'FROM customers', 'WHERE phone = NULL;'].join('\n'),
            },
            {
              id: 'r-eq',
              kind: 'table',
              label: 'result — 0 rows',
              pattern: 'warn',
              headers: ['customer_id', 'first_name'],
              values: [],
            },
          ],
          edges: [{ source: 'q-eq', target: 'r-eq' }],
        },
        {
          id: 'cnt',
          label: 'count()',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-cnt',
              kind: 'code',
              filename: 'count-null.sql',
              hug: true,
              label: ['SELECT count(*) AS all_rows,', '  count(phone) AS with_phone', 'FROM customers;'].join('\n'),
            },
            {
              id: 'r-cnt',
              kind: 'table',
              label: 'NULL is skipped',
              pattern: 'warn',
              headers: ['all_rows', 'with_phone'],
              values: [['9', '8']],
            },
          ],
          edges: [{ source: 'q-cnt', target: 'r-cnt' }],
        },
      ],
    },
  ],
  edges: [{ source: 'types', target: 'ask' }],
}
