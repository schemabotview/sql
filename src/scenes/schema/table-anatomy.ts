import type { Scene } from '../../render-engine'

// §4 table-anatomy — zoom into ONE table. §3 showed why tables relate; this shows what a table is
// made of, and the two bands are the two ways to look at the same relation: its SHAPE (the columns,
// each a name and a type the database enforces) and its CONTENTS (the rows, one record each).
//
// Both are TABLE nodes, in the node's two modes — schema mode above, data mode below — which is the
// clearest possible statement of the section's point: those are two views of one thing. The closing
// `warn` is the payoff of the type being a contract rather than a label.
export const tableAnatomy: Scene = {
  id: 'table-anatomy',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'shape',
      kind: 'table',
      label: 'customers — the shape',
      pattern: 'service',
      sub: 'each column: a name and a type',
      columns: [
        { name: 'id', type: 'bigint', key: 'PK' },
        { name: 'name', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'created_at', type: 'timestamptz' },
      ],
    },
    {
      id: 'contents',
      kind: 'table',
      label: 'customers — the contents',
      pattern: 'storage',
      sub: 'each row: one record, a value per column',
      headers: ['id', 'name', 'email', 'created_at'],
      values: [
        ['1', 'Ada', 'ada@shop.io', '2026-01-14'],
        ['2', 'Ravi', 'ravi@shop.io', '2026-02-02'],
        ['3', 'Mei', 'mei@shop.io', '2026-02-19'],
      ],
    },
    { id: 'type-reject', label: "Values that don't fit", pattern: 'warn', sub: 'the row is rejected' },
  ],
  edges: [
    { source: 'shape', target: 'contents', label: 'every row has the same shape' },
    { source: 'contents', target: 'type-reject', label: 'the type is a contract, not a label' },
  ],
}
