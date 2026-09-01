import type { Scene } from '../../render-engine'

// §5 keys-pk-fk — the link itself, at COLUMN level. §3 drew the relationship between two tables;
// the constraint is finer than that, so here the two cards ARE the columns and the arrow between
// them is the rule the database enforces. Below, what that rule actually does at write time: the
// rejection, and the two delete policies that decide the children's fate.
//
// Composition: TB. The link band flows 'RL' so the FOREIGN KEY sits on the right pointing LEFT at
// the PRIMARY KEY — the direction the reference genuinely runs (the child names the parent), which
// is the reverse of §3's one-to-many reading.
export const keysPkFk: Scene = {
  id: 'keys-pk-fk',
  padding: 0.16,
  flow: 'TB',
  nodes: [
    {
      id: 'link',
      label: 'One value, matching across two tables',
      pattern: 'group',
      flow: 'RL',
      children: [
        { id: 'pk', label: 'id', pattern: 'service', icon: 'key', sub: 'customers · PRIMARY KEY' },
        { id: 'fk', label: 'customer_id', pattern: 'user', icon: 'gitbranch', sub: 'orders · FOREIGN KEY' },
      ],
      edges: [{ source: 'fk', target: 'pk', label: 'must match a real row' }],
    },
    {
      id: 'ri',
      label: 'Referential integrity — what the rule does at write time',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'ri-orphan', label: 'No such customer', pattern: 'warn', sub: 'the order is rejected' },
        { id: 'ri-restrict', label: 'ON DELETE RESTRICT', pattern: 'service', icon: 'ban', sub: 'blocks the delete' },
        { id: 'ri-cascade', label: 'ON DELETE CASCADE', pattern: 'external', icon: 'waves', sub: 'children go too' },
      ],
    },
  ],
  edges: [{ source: 'link', target: 'ri', label: 'the database enforces it on every write' }],
}
