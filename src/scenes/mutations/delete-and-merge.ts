import type { Scene } from '../../render-engine'

// §4 delete-and-merge — two verbs on one board. DELETE vs TRUNCATE is a contrast, so it leads as a
// pair; MERGE is a reconciliation, so it is drawn as the two relations being reconciled. Row 101
// exists in both (matched → UPDATE) and row 104 exists only in the source (not matched → INSERT),
// so the reader can work out both branches from the data before the band below names them.
export const deleteAndMerge: Scene = {
  id: 'delete-and-merge',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'removal',
      label: 'Removing rows — two very different tools',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'del', label: 'DELETE — per row', pattern: 'warn', sub: 'WHERE picks · FKs guard' },
        { id: 'trunc', label: 'TRUNCATE', pattern: 'external', icon: 'ban', sub: 'DDL · no WHERE · resets' },
      ],
    },
    {
      id: 'merge',
      label: 'MERGE — reconcile a source into a target',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'merge-source',
          kind: 'table',
          label: 'source — incoming',
          pattern: 'network',
          headers: ['id', 'total'],
          values: [
            ['101', '150.00'],
            ['104', '60.00'],
          ],
        },
        {
          id: 'merge-target',
          kind: 'table',
          label: 'target — orders',
          pattern: 'storage',
          headers: ['id', 'total'],
          values: [
            ['101', '120.00'],
            ['102', '80.00'],
          ],
        },
      ],
    },
    {
      id: 'branches',
      label: 'One statement, two outcomes',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'matched', label: 'WHEN MATCHED', pattern: 'service', icon: 'wrench', sub: 'UPDATE — 120 → 150' },
        { id: 'not-matched', label: 'WHEN NOT MATCHED', pattern: 'user', icon: 'dooropen', sub: 'INSERT — 104 is new' },
      ],
    },
  ],
  edges: [
    { source: 'removal', target: 'merge' },
    { source: 'merge', target: 'branches', label: 'match on the key, then act per row' },
  ],
}
