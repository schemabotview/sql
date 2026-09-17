import type { Scene } from '@graphlearning/flow'

// §1 file-vs-database — the cold open. Why a database at all, when a flat file is right there? The
// top band grants the honest concession (a file IS fine at first) and then names the two pains that
// arrive with scale; the bottom band answers each with a capability. The six gains are not a list
// for its own sake — each one becomes a later course, which the narration says outright, so this
// scene doubles as the concept's table of contents.
//
// Composition: TB, two bands of three. The pains sit as `warn` beside the file itself so the cost is
// attached to the thing, not floated as an abstract complaint.
export const fileVsDatabase: Scene = {
  id: 'file-vs-database',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'flat-file',
      label: 'One flat file — fine at first',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'csv', label: 'orders.csv', pattern: 'storage', icon: 'filecode', sub: 'one row per order' },
        { id: 'dup', label: 'Copied every row', pattern: 'warn', sub: 'the same customer' },
        { id: 'drift', label: 'One edit, many rows', pattern: 'warn', sub: 'miss one, it drifts' },
      ],
    },
    {
      id: 'database',
      label: "A database — six things a file can't do",
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'gain-store', label: 'Structured storage', pattern: 'service', icon: 'table', sub: 'each fact stored once' },
        { id: 'gain-integrity', label: 'Integrity', pattern: 'service', icon: 'shieldcheck', sub: 'constraints + ACID' },
        { id: 'gain-concurrent', label: 'Concurrent access', pattern: 'service', icon: 'network', sub: 'many readers + writers' },
        { id: 'gain-fast', label: 'Fast at scale', pattern: 'service', icon: 'zap', sub: 'indexes, not full scans' },
        { id: 'gain-secure', label: 'Security', pattern: 'service', icon: 'lock', sub: 'GRANT / REVOKE' },
        { id: 'gain-reliable', label: 'Reliability', pattern: 'service', icon: 'circlecheck', sub: 'WAL, backups, recovery' },
      ],
    },
  ],
  // Band → band: it is the whole "one file" arrangement that stops working, not orders.csv turning
  // into structured storage. The label carries WHEN it stops working, which is the section's claim.
  edges: [{ source: 'flat-file', target: 'database', label: 'the data grows · a second writer arrives' }],
}
