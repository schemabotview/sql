import type { Scene, SceneNode } from '@graphlearning/flow'
import { pair } from '../pair'

// §10 processing-order — the logical order a query is READ in (FROM → WHERE → GROUP BY → HAVING →
// SELECT → DISTINCT → ORDER BY → LIMIT), which is not the order it is WRITTEN in and which defines the
// result. The engine is free to execute differently (chapter 7) as long as the result is the same.
// Left: the failing query the order explains (an alias used in WHERE), its repair, and the
// incorrect-summary walkthrough — "9 customers" is right as a row count and wrong as a count of
// PEOPLE, because customers 3 and 9 are one person (rows 9, people 8, asserted in db/verify).
const step = (node: Pick<SceneNode, 'id' | 'label'>): SceneNode => ({ ...node, variant: 'chip', pattern: 'service', icon: 'none' })

export const processingOrder: Scene = {
  id: 'processing-order',
  padding: 0.12,
  flow: 'LR',
  nodes: [
    {
      id: 'attempts',
      label: 'Two attempts, one summary',
      pattern: 'group',
      icon: 'none',
      cols: 2,
      children: [
        pair({
          id: 'fails',
          title: 'WHERE runs before SELECT',
          file: 'alias-fails.sql',
          sql: ['-- expect-error: no sale_price yet', 'SELECT name,', '  round(price * 0.9, 2) AS sale_price', 'FROM products', 'WHERE sale_price < 40;'],
          err: { label: 'no column "sale_price"', sub: 'the alias is born later' },
        }),
        pair({
          id: 'works',
          title: 'repeat the expression',
          file: 'alias-works.sql',
          sql: ['SELECT name,', '  round(price * 0.9, 2) AS sale_price', 'FROM products', 'WHERE price * 0.9 < 40', 'ORDER BY sale_price;'],
          outs: [{ label: '4 rows, sorted by the alias', headers: ['name', 'sale_price'], values: [['SQL for Beginners', '26.91'], ['Desk Lamp', '30.60'], ['Retro Cassette Player', '35.10'], ['Database Design', '39.60']] }],
        }),
        pair({
          id: 'people',
          title: 'an incorrect summary',
          file: 'people.sql',
          sql: ['SELECT count(*) AS rows,', '  count(DISTINCT (first_name, last_name))', '    AS people', 'FROM customers;'],
          outs: [{ label: '9 rows, but 8 people', headers: ['rows', 'people'], values: [['9', '8']], pattern: 'warn' }],
        }),
      ],
    },
    {
      id: 'order',
      label: 'Run order',
      pattern: 'group',
      icon: 'none',
      flow: 'TB',
      children: [
        step({ id: 'p-from', label: '1 FROM' }),
        step({ id: 'p-where', label: '2 WHERE' }),
        step({ id: 'p-group', label: '3 GROUP BY' }),
        step({ id: 'p-having', label: '4 HAVING' }),
        step({ id: 'p-select', label: '5 SELECT' }),
        step({ id: 'p-distinct', label: '6 DISTINCT' }),
        step({ id: 'p-order', label: '7 ORDER BY' }),
        step({ id: 'p-limit', label: '8 LIMIT' }),
      ],
      edges: [
        { source: 'p-from', target: 'p-where' },
        { source: 'p-where', target: 'p-group' },
        { source: 'p-group', target: 'p-having' },
        { source: 'p-having', target: 'p-select' },
        { source: 'p-select', target: 'p-distinct' },
        { source: 'p-distinct', target: 'p-order' },
        { source: 'p-order', target: 'p-limit' },
      ],
    },
  ],
  edges: [{ source: 'attempts', target: 'order' }],
}
