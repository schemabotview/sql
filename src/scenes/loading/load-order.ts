import type { Scene, SceneNode } from '@graphlearning/flow'

// §3 load-order — what a constraint failure does, and why loading has an order. (1) A statement is
// ALL OR NOTHING: two products in one INSERT, the second with a negative price, and PostgreSQL rejects
// the whole statement — the valid first row is not kept (asserted in db/verify/ch03-loading.sql, since
// a script stops at its first error and cannot show the aftermath). (2) Foreign keys give loading a
// direction: parents first. The chain is the one workable order for the shop. (3) The same fact seen
// as an error: a line for order 14, which does not exist yet.
const step = (node: Pick<SceneNode, 'id' | 'label'>): SceneNode => ({
  ...node,
  variant: 'chip',
  pattern: 'storage',
  icon: 'none',
})

export const loadOrder: Scene = {
  id: 'load-order',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'atomic',
      label: 'One bad row rejects the whole statement',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-atomic',
          kind: 'code',
          filename: 'all-or-nothing.sql',
          hug: true,
          label: [
            '-- expect-error: row 2 breaks CHECK',
            'INSERT INTO products',
            '  (product_id, name, category_id, price)',
            'VALUES',
            "  (11, 'Good', 3, 5.00),",
            "  (12, 'Bad',  3, -1.00);",
          ].join('\n'),
        },
        {
          id: 'outcome',
          label: 'what is stored',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            { id: 'e-atomic', label: 'CHECK violated', pattern: 'warn', icon: 'triangleAlert', sub: 'products_price_check' },
            { id: 'stored', label: 'neither row kept', pattern: 'storage', icon: 'database', sub: 'row 1 was valid too' },
          ],
        },
      ],
      edges: [{ source: 'q-atomic', target: 'outcome' }],
    },
    {
      id: 'chain',
      label: 'Parents before children — the workable load order',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        step({ id: 'st-cat', label: '1 categories' }),
        step({ id: 'st-prod', label: '2 products' }),
        step({ id: 'st-cust', label: '3 customers' }),
        step({ id: 'st-ord', label: '4 orders' }),
        step({ id: 'st-item', label: '5 order_items' }),
        step({ id: 'st-pay', label: '6 payments' }),
      ],
      edges: [
        { source: 'st-cat', target: 'st-prod' },
        { source: 'st-prod', target: 'st-cust' },
        { source: 'st-cust', target: 'st-ord' },
        { source: 'st-ord', target: 'st-item' },
        { source: 'st-item', target: 'st-pay' },
      ],
    },
    {
      id: 'wrong',
      label: 'The same rule, seen as an error',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-wrong',
          kind: 'code',
          filename: 'child-first.sql',
          hug: true,
          label: ['-- expect-error: order 14 does not exist', 'INSERT INTO order_items', '  VALUES (14, 1, 1, 1, 1.00);'].join('\n'),
        },
        { id: 'e-wrong', label: 'no order 14 yet', pattern: 'warn', icon: 'lock', sub: 'foreign key refuses' },
      ],
      edges: [{ source: 'q-wrong', target: 'e-wrong' }],
    },
  ],
  edges: [
    { source: 'atomic', target: 'chain' },
    { source: 'chain', target: 'wrong' },
  ],
}
