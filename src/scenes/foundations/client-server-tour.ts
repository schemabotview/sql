import type { Scene } from '@graphlearning/flow'

// §6 client-server-tour — three illustrations of one idea: SQL is a conversation, and the server does
// the work. (1) The conversation: a client sends statement text, the server parses, plans and
// executes it, and returns rows plus a command tag. (2) A dialect, shown without leaving PostgreSQL:
// the same request in two spellings, both accepted here (LIMIT, and the standard FETCH FIRST); other
// products may accept only one, which is a documentation question, not something this board asserts.
// (3) An annotated tour of the four core tables with their real row counts, from one query.
export const clientServerTour: Scene = {
  id: 'client-server-tour',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'conversation',
      label: 'A statement travels to the server; rows come back',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        { id: 'client', label: 'Client', variant: 'tile', pattern: 'user', icon: 'terminal', sub: 'psql · an app · a notebook' },
        {
          id: 'server',
          label: 'Server — PostgreSQL',
          pattern: 'service',
          icon: 'none',
          flow: 'LR',
          children: [
            { id: 's-parse', label: 'parse', variant: 'chip', pattern: 'service', icon: 'none' },
            { id: 's-plan', label: 'plan', variant: 'chip', pattern: 'service', icon: 'none' },
            { id: 's-run', label: 'execute', variant: 'chip', pattern: 'service', icon: 'none' },
          ],
          edges: [
            { source: 's-parse', target: 's-plan' },
            { source: 's-plan', target: 's-run' },
          ],
        },
      ],
      edges: [{ source: 'client', target: 'server', bidirectional: true }],
    },
    {
      id: 'dialects',
      label: 'One request, two spellings — a dialect is a product\'s variant of SQL',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'both',
          label: 'both accepted by PostgreSQL',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-limit',
              kind: 'code',
              filename: 'limit.sql',
              hug: true,
              label: ['SELECT customer_id, first_name', 'FROM customers', 'ORDER BY customer_id', 'LIMIT 3;'].join('\n'),
            },
            {
              id: 'q-fetch',
              kind: 'code',
              filename: 'fetch-first.sql',
              hug: true,
              label: ['SELECT customer_id, first_name', 'FROM customers', 'ORDER BY customer_id', 'FETCH FIRST 3 ROWS ONLY;'].join('\n'),
            },
          ],
        },
        {
          id: 'r-dialect',
          kind: 'table',
          label: 'the same 3 rows',
          pattern: 'service',
          headers: ['customer_id', 'first_name'],
          values: [
            ['1', 'Asha'],
            ['2', 'Ben'],
            ['3', 'Chloe'],
          ],
        },
      ],
      edges: [{ source: 'both', target: 'r-dialect' }],
    },
    {
      id: 'tour',
      label: 'An annotated tour: how big is each core table?',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-tour',
          kind: 'code',
          filename: 'tour.sql',
          hug: true,
          label: [
            "SELECT 'customers' AS table_name, count(*) AS rows",
            '  FROM customers',
            "UNION ALL SELECT 'products', count(*) FROM products",
            "UNION ALL SELECT 'orders', count(*) FROM orders",
            "UNION ALL SELECT 'order_items', count(*)",
            '  FROM order_items;',
          ].join('\n'),
        },
        {
          id: 'r-tour',
          kind: 'table',
          label: 'result — 4 rows',
          pattern: 'service',
          headers: ['table_name', 'rows'],
          values: [
            ['customers', '9'],
            ['products', '10'],
            ['orders', '11'],
            ['order_items', '16'],
          ],
        },
      ],
      edges: [{ source: 'q-tour', target: 'r-tour' }],
    },
  ],
  edges: [
    { source: 'conversation', target: 'dialects' },
    { source: 'dialects', target: 'tour' },
  ],
}
