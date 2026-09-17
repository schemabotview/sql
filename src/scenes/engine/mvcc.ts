import type { Scene } from '@graphlearning/flow'

// §7 mvcc — the best fit for the table node in the whole concept. MVCC is invisible unless you can
// see the versions, so the top band IS the versions: one logical row, two physical tuples, with the
// xmin/xmax pair that decides which of them a given transaction is allowed to see.
//
// The middle band makes the payoff concrete — two transactions, started either side of 700, reading
// the same row and correctly getting different answers. That is the mechanism under course 3's
// isolation levels, which the narration calls back to explicitly.
export const mvcc: Scene = {
  id: 'mvcc',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'versions',
      kind: 'table',
      label: 'orders id=101 — one row, two versions',
      pattern: 'storage',
      sub: 'an UPDATE never overwrites; it writes a new version',
      headers: ['id', 'total', 'xmin', 'xmax', 'state'],
      values: [
        ['101', '120.00', '500', '700', 'dead'],
        ['101', '150.00', '700', '-', 'live'],
      ],
    },
    {
      id: 'snapshots',
      label: 'A snapshot decides what YOU see',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'snap-old', label: 'Txn started at 600', pattern: 'network', icon: 'clock', sub: 'sees 120.00' },
        { id: 'snap-new', label: 'Txn started at 800', pattern: 'service', icon: 'clock', sub: 'sees 150.00' },
      ],
    },
    { id: 'vacuum', label: 'VACUUM', pattern: 'warn', sub: 'reclaims dead versions' },
  ],
  edges: [
    { source: 'versions', target: 'snapshots', label: 'same row, same moment, two different answers — and no waiting' },
    { source: 'snapshots', target: 'vacuum', label: 'dead versions pile up — skip the cleanup and the table bloats' },
  ],
}
