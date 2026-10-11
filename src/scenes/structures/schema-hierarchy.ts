import type { Scene, SceneNode } from '@graphlearning/flow'

// §3 schema-hierarchy — the containment every qualified name walks: server ⊃ database ⊃ schema ⊃
// table. Drawn as nesting because that is what it IS (a schema CONTAINS its tables); two schemas each
// hold a `customers`, which is why schemas exist. Beneath it the two demos run for real: creating the
// second schema, and the search_path order that decides which `customers` an unqualified name means.
// With `staging` first the answer is 0 — the empty table shadows the real one.
const tbl = (node: Pick<SceneNode, 'id' | 'label'>, pattern: SceneNode['pattern'] = 'storage'): SceneNode => ({
  ...node,
  variant: 'chip',
  pattern,
  icon: 'none',
})

export const schemaHierarchy: Scene = {
  id: 'schema-hierarchy',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'server',
      label: 'PostgreSQL server',
      sub: 'one running instance',
      pattern: 'group',
      icon: 'none',
      children: [
        {
          id: 'database',
          label: 'database',
          sub: 'CREATE DATABASE — you connect to ONE',
          pattern: 'group',
          icon: 'none',
          cols: 2,
          children: [
            {
              id: 's-shop',
              label: 'schema shop',
              pattern: 'group',
              icon: 'none',
              cols: 3,
              children: [
                tbl({ id: 'sh-customers', label: 'customers' }, 'user'),
                tbl({ id: 'sh-orders', label: 'orders' }),
                tbl({ id: 'sh-products', label: 'products' }),
              ],
            },
            {
              id: 's-staging',
              label: 'schema staging',
              pattern: 'group',
              icon: 'none',
              cols: 1,
              children: [tbl({ id: 'st-customers', label: 'customers' }, 'warn')],
            },
          ],
        },
      ],
    },
    {
      id: 'demos',
      label: 'Run both, for real',
      pattern: 'group',
      icon: 'none',
      cols: 2,
      children: [
        {
          id: 'create-demo',
          label: '1 · create a schema',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-create',
              kind: 'code',
              filename: 'create-schema.sql',
              hug: true,
              label: [
                'CREATE SCHEMA staging;',
                'CREATE TABLE staging.customers (',
                '  customer_id integer);',
                '',
                'SELECT schema_name',
                'FROM information_schema.schemata',
                "WHERE schema_name IN ('shop','staging')",
                'ORDER BY schema_name;',
              ].join('\n'),
            },
            {
              id: 'r-create',
              kind: 'table',
              label: 'result — 2 schemas',
              pattern: 'service',
              headers: ['schema_name'],
              values: [['shop'], ['staging']],
            },
          ],
          edges: [{ source: 'q-create', target: 'r-create' }],
        },
        {
          id: 'path-demo',
          label: '2 · which customers?',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-path',
              kind: 'code',
              filename: 'search-path.sql',
              hug: true,
              label: [
                'CREATE SCHEMA staging;',
                'CREATE TABLE staging.customers (',
                '  customer_id integer);',
                '',
                'SET search_path = staging, shop;',
                'SELECT count(*) AS n FROM customers;',
              ].join('\n'),
            },
            {
              id: 'r-path',
              kind: 'table',
              label: 'result — staging came first',
              pattern: 'warn',
              headers: ['n'],
              values: [['0']],
            },
          ],
          edges: [{ source: 'q-path', target: 'r-path' }],
        },
      ],
    },
  ],
  edges: [{ source: 'server', target: 'demos' }],
}
