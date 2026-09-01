import type { Scene } from '../../render-engine'

// §1 write-machinery — the course's orientation board. Reading is forgiving and writing is not, so
// SQL wraps every change in layers: the verbs at the top, the transaction they run inside, and the
// guarantees and guards around that. Every later section in this course is one of these three bands,
// which is exactly what the narration promises.
export const writeMachinery: Scene = {
  id: 'write-machinery',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'verbs',
      label: 'The write verbs — DML',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'v-insert', label: 'INSERT', pattern: 'service', icon: 'dooropen', sub: 'adds new rows' },
        { id: 'v-update', label: 'UPDATE', pattern: 'service', icon: 'wrench', sub: 'modifies rows' },
        { id: 'v-delete', label: 'DELETE', pattern: 'warn', sub: 'removes rows' },
        { id: 'v-merge', label: 'MERGE', pattern: 'network', icon: 'gitbranch', sub: 'all three, conditional' },
      ],
    },
    {
      id: 'envelope',
      label: 'The transaction — the safety envelope',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'e-begin', label: 'BEGIN', pattern: 'network', icon: 'dooropen', sub: 'open the envelope' },
        { id: 'e-writes', label: 'Your writes', pattern: 'network', icon: 'wrench', sub: 'the DML statements' },
        { id: 'e-commit', label: 'COMMIT', pattern: 'storage', icon: 'circlecheck', sub: 'permanent, at once' },
        { id: 'e-rollback', label: 'ROLLBACK', pattern: 'user', icon: 'repeat', sub: 'as if none happened' },
      ],
    },
    {
      id: 'guards',
      label: 'The guarantees, and the guards',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'g-acid', label: 'ACID', pattern: 'service', icon: 'shieldcheck', sub: 'what it promises' },
        { id: 'g-dcl', label: 'DCL', pattern: 'user', icon: 'lock', sub: 'who may write' },
        { id: 'g-prog', label: 'Triggers · procs', pattern: 'user', icon: 'gears', sub: 'logic on the write' },
      ],
    },
  ],
  edges: [
    { source: 'verbs', target: 'envelope', label: 'a bare write is a risk — these run INSIDE a transaction' },
    { source: 'envelope', target: 'guards' },
  ],
}
