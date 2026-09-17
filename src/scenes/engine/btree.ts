import type { Scene } from '@graphlearning/flow'

// §5 btree — the one scene in the concept that literally IS its subject: a real tree, laid out by the
// engine from the edges rather than drawn as a metaphor. Root → branch → leaf is three hops, which is
// the section's whole claim about finding one row among millions.
//
// The leaves are tiles so four of them fit without the scene running too wide, and they carry key
// ranges so the "sorted, and linked sideways" property is visible — that ordering is what makes a
// BETWEEN cheap, which the trade-off band below picks up.
export const btree: Scene = {
  id: 'btree',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'tree',
      label: 'A B-tree — 3 or 4 hops to one row among millions',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'bt-root', label: 'Root', pattern: 'service', icon: 'gitbranch', sub: 'one page, always' },
        { id: 'bt-b1', label: 'Branch', pattern: 'network', icon: 'gitbranch', sub: 'keys < 500' },
        { id: 'bt-b2', label: 'Branch', pattern: 'network', icon: 'gitbranch', sub: 'keys >= 500' },
        { id: 'bt-l1', label: 'Leaf', variant: 'tile', pattern: 'storage', sub: '1–249' },
        { id: 'bt-l2', label: 'Leaf', variant: 'tile', pattern: 'storage', sub: '250–499' },
        { id: 'bt-l3', label: 'Leaf', variant: 'tile', pattern: 'storage', sub: '500–749' },
        { id: 'bt-l4', label: 'Leaf', variant: 'tile', pattern: 'storage', sub: '750–999' },
      ],
      edges: [
        { source: 'bt-root', target: 'bt-b1' },
        { source: 'bt-root', target: 'bt-b2' },
        { source: 'bt-b1', target: 'bt-l1' },
        { source: 'bt-b1', target: 'bt-l2' },
        { source: 'bt-b2', target: 'bt-l3' },
        { source: 'bt-b2', target: 'bt-l4' },
      ],
    },
    {
      id: 'tradeoff',
      label: 'What it buys, and what it costs',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'bt-range', label: 'Ranges walk sideways', pattern: 'service', icon: 'waves', sub: 'leaves are linked' },
        { id: 'bt-writecost', label: 'Every write pays', pattern: 'warn', sub: 'the index updates too' },
      ],
    },
  ],
  edges: [{ source: 'tree', target: 'tradeoff', label: 'the leaf holds the key and a pointer into the heap' }],
}
