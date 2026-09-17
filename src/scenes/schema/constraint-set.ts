import type { Scene } from '@graphlearning/flow'

// §7 constraint-set — deliberately NOT an ERD. §3–§5 were about shape; this one is about RULES, so
// drawing another table diagram would say the wrong thing. Top band: the four rules you declare.
// Middle: the reveal that the keys just taught are constraints too, spelled out as what they equal.
// Bottom: the payoff — enforcement happens once, centrally, at write time.
//
// Composition: TB, narrowing 4 → 2 → 1. The funnel is the argument: many rules, one guarantee.
export const constraintSet: Scene = {
  id: 'constraint-set',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'core',
      label: 'Rules you hand the database to keep',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'c-notnull', label: 'NOT NULL', pattern: 'service', icon: 'ban', sub: 'the value is required' },
        { id: 'c-unique', label: 'UNIQUE', pattern: 'service', icon: 'circleslash', sub: 'no duplicate values' },
        { id: 'c-check', label: 'CHECK', pattern: 'service', icon: 'scale', sub: 'a condition per row' },
        { id: 'c-default', label: 'DEFAULT', pattern: 'service', icon: 'copy', sub: 'filled in for you' },
      ],
    },
    {
      id: 'keys-too',
      label: 'The keys from §5 are constraints as well',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'c-pk', label: 'PRIMARY KEY', pattern: 'user', icon: 'key', sub: 'UNIQUE + NOT NULL' },
        { id: 'c-fk', label: 'FOREIGN KEY', pattern: 'user', icon: 'gitbranch', sub: 'must match a parent' },
      ],
    },
    { id: 'enforced', label: 'Rejected at the door', pattern: 'storage', icon: 'shieldcheck', sub: 'not found months later' },
  ],
  edges: [
    { source: 'core', target: 'keys-too' },
    { source: 'keys-too', target: 'enforced', label: 'one guarantee — every app, every query, every time' },
  ],
}
