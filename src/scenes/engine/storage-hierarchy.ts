import type { Scene } from '../../render-engine'

// §4 storage-hierarchy — the first scene in the concept built on genuine NESTING rather than a flow.
// The claim is containment: a heap file holds pages, a page holds tuples. A four-card chain would
// say "next", which is wrong — these are not stages, they are boxes inside boxes, and that is
// precisely why a Seq Scan costs what it does (you cannot read one tuple, only the page holding it).
//
// Two pages are drawn rather than one so the "reads whole pages" claim has something to bite on.
// The WAL sits outside the hierarchy because it is a separate file — that separation IS durability.
export const storageHierarchy: Scene = {
  id: 'storage-hierarchy',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'tablespace',
      label: 'Tablespace — a location on disk',
      pattern: 'group',
      children: [
        {
          id: 'heapfile',
          label: "Heap file — the table's rows, in NO particular order",
          pattern: 'group',
          cols: 2,
          children: [
            {
              id: 'page-1',
              label: 'Page — a fixed 8 KB block',
              pattern: 'storage',
              icon: 'boxes',
              cols: 3,
              children: [
                { id: 'tup-1', label: 'tuple', variant: 'tile', pattern: 'network', sub: 'a row' },
                { id: 'tup-2', label: 'tuple', variant: 'tile', pattern: 'network', sub: 'a row' },
                { id: 'tup-3', label: 'tuple', variant: 'tile', pattern: 'network', sub: 'a row' },
              ],
            },
            {
              id: 'page-2',
              label: 'Page',
              pattern: 'storage',
              icon: 'boxes',
              cols: 3,
              children: [
                { id: 'tup-4', label: 'tuple', variant: 'tile', pattern: 'network', sub: 'a row' },
                { id: 'tup-5', label: 'tuple', variant: 'tile', pattern: 'network', sub: 'a row' },
              ],
            },
          ],
        },
      ],
    },
    { id: 'wal', label: 'The WAL', pattern: 'service', icon: 'scroll', sub: 'the write-ahead log' },
  ],
  edges: [{ source: 'tablespace', target: 'wal', label: 'a change hits the log before it ever reaches a data page' }],
}
