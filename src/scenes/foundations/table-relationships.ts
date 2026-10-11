import type { Scene } from '@graphlearning/flow'

// §2 table-relationships — a SCHEMA holding TABLES, a table holding ROWS and COLUMNS, and one real
// RELATIONSHIP: orders.customer_id points at customers.customer_id. The rows are the first rows of
// the real tables in db/seed.sql, labelled "5 of 9" / "5 of 11" so they are not passed off as the
// whole table. Asha (customer 1) is on orders 1 and 3 — one customer, many orders — and Elena's
// phone is the real NULL, drawn as the word NULL so the cell is visibly a value that says nothing.
export const tableRelationships: Scene = {
  id: 'table-relationships',
  padding: 0.04,
  flow: 'LR',
  nodes: [
    {
      id: 'schema',
      label: 'schema shop — a namespace that holds tables',
      pattern: 'group',
      icon: 'none',
      cols: 1,
      children: [
        {
          id: 'customers',
          kind: 'table',
          label: 'customers — 5 of 9 rows',
          pattern: 'user',
          headers: ['customer_id', 'first_name', 'city', 'phone'],
          values: [
            ['1', 'Asha', 'Bengaluru', '+91-98450-11111'],
            ['2', 'Ben', 'London', '+44-7700-900101'],
            ['3', 'Chloe', 'Lyon', '+33-6-12-34-56'],
            ['4', 'Dev', 'Mumbai', '+91-98450-22222'],
            ['5', 'Elena', 'Milan', 'NULL'],
          ],
        },
        {
          id: 'orders',
          kind: 'table',
          label: 'orders — 5 of 11 rows',
          pattern: 'service',
          headers: ['order_id', 'customer_id', 'order_date', 'status'],
          values: [
            ['1', '1', '2025-03-01', 'delivered'],
            ['2', '2', '2025-03-01', 'delivered'],
            ['3', '1', '2025-03-02', 'delivered'],
            ['4', '3', '2025-03-03', 'delivered'],
            ['5', '4', '2025-03-06', 'delivered'],
          ],
        },
      ],
      edges: [{ source: 'customers', target: 'orders' }],
    },
    {
      id: 'terms',
      label: 'Five words, one picture',
      pattern: 'group',
      icon: 'none',
      cols: 1,
      children: [
        { id: 't-col', label: 'Column', variant: 'tile', pattern: 'storage', icon: 'columns', sub: 'one attribute · one type' },
        { id: 't-row', label: 'Row', variant: 'tile', pattern: 'service', icon: 'rows', sub: 'one record' },
        { id: 't-cell', label: 'Cell', variant: 'tile', pattern: 'network', icon: 'square', sub: 'one value, maybe NULL' },
        { id: 't-schema', label: 'Schema', variant: 'tile', pattern: 'user', icon: 'folder', sub: 'the tables, together' },
        { id: 't-rel', label: 'Relationship', variant: 'tile', pattern: 'warn', icon: 'link', sub: 'orders.customer_id → customer' },
      ],
    },
  ],
  edges: [{ source: 'schema', target: 'terms' }],
}
