import type { Scene, SceneNode } from '@graphlearning/flow'

// §1 requirements-structures — how a sentence about the business becomes a structure. The table maps
// six real requirements of the shop to the entity or relationship each one names, its cardinality, and
// what it becomes in the schema (a column, a foreign key, a junction table). The board beneath draws
// the one transformation that surprises beginners — a many-to-many relationship cannot be a column, so
// it becomes a TABLE: orders and products meet in order_items. The rows are the real lines of orders 1
// and 3 from db/seed.sql, laid out left to right so no line crosses another.
const chip = (node: Pick<SceneNode, 'id' | 'label'>, pattern: SceneNode['pattern']): SceneNode => ({
  ...node,
  variant: 'chip',
  pattern,
  icon: 'none',
})

export const requirementsStructures: Scene = {
  id: 'requirements-structures',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'req',
      kind: 'table',
      label: 'A requirement names an entity or a relationship',
      pattern: 'storage',
      headers: ['business sentence', 'cardinality', 'becomes'],
      values: [
        ['A customer places many orders', 'one-to-many', 'orders.customer_id (FK)'],
        ['An order has many products, a product many orders', 'many-to-many', 'a junction table'],
        ['Each line keeps the price paid', 'attribute of the pairing', 'order_items.unit_price'],
        ['Products sit in categories, which nest', 'one-to-many, self', 'category_id, parent_id'],
        ['An online order has no sales rep', 'optional', 'employee_id may be NULL'],
        ['A customer reviews a product once', 'many-to-many, limited', 'UNIQUE (product, customer)'],
      ],
    },
    {
      id: 'junction',
      label: 'Many-to-many becomes a table in the middle',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'col-orders',
          label: 'orders',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [chip({ id: 'o1', label: 'order 1' }, 'service'), chip({ id: 'o3', label: 'order 3' }, 'service')],
        },
        {
          id: 'col-lines',
          label: 'order_items',
          sub: 'one row per pairing',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            chip({ id: 'l11', label: '(1, line 1)' }, 'warn'),
            chip({ id: 'l12', label: '(1, line 2)' }, 'warn'),
            chip({ id: 'l31', label: '(3, line 1)' }, 'warn'),
            chip({ id: 'l32', label: '(3, line 2)' }, 'warn'),
          ],
        },
        {
          id: 'col-products',
          label: 'products',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            chip({ id: 'p1', label: 'Wireless Earbuds' }, 'storage'),
            chip({ id: 'p6', label: 'SQL for Beginners' }, 'storage'),
            chip({ id: 'p2', label: 'Studio Headphones' }, 'storage'),
            chip({ id: 'p7', label: 'Database Design' }, 'storage'),
          ],
        },
      ],
      edges: [
        { source: 'o1', target: 'l11' },
        { source: 'o1', target: 'l12' },
        { source: 'o3', target: 'l31' },
        { source: 'o3', target: 'l32' },
        { source: 'l11', target: 'p1' },
        { source: 'l12', target: 'p6' },
        { source: 'l31', target: 'p2' },
        { source: 'l32', target: 'p7' },
      ],
    },
  ],
  edges: [{ source: 'req', target: 'junction' }],
}
