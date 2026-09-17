import type { Scene } from '@graphlearning/flow'

// §6 acid — the four promises, then the turn the narration makes at the end: three of them are
// absolute and the fourth is a setting. Putting Isolation alone in its own band below is the whole
// point of the section, and it is the handoff into §7.
export const acid: Scene = {
  id: 'acid',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'promises',
      label: 'ACID — what a transaction promises',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'a-atomic', label: 'A · Atomicity', pattern: 'service', icon: 'boxes', sub: 'all of it, or none' },
        { id: 'a-consistent', label: 'C · Consistency', pattern: 'service', icon: 'shieldcheck', sub: 'valid state to valid' },
        { id: 'a-isolated', label: 'I · Isolation', pattern: 'user', icon: 'lock', sub: 'as if it ran alone' },
        { id: 'a-durable', label: 'D · Durability', pattern: 'storage', icon: 'scroll', sub: 'survives a crash' },
      ],
    },
    { id: 'the-dial', label: 'Isolation is a dial', pattern: 'network', icon: 'gauge', sub: 'how much is your call' },
  ],
  edges: [{ source: 'promises', target: 'the-dial', label: 'three are absolute — this one you choose' }],
}
