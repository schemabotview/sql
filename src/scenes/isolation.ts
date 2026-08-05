import { type SceneSpec, TEAL, RED, YELLOW } from 'flow-engine'

// The `isolation` scene — a mechanism detour from the write-path (§7). A labelled "Isolation"
// box can't teach what isolation protects against, because the problem only appears when two
// transactions overlap in TIME. So the scene draws two transactions on a shared 6-slot time
// axis — T1 reads x twice; T2 writes x and commits in between — so T1's second read differs.
// That interleave is a non-repeatable read, one of the three anomalies. Below: the three read
// anomalies (RED) and the four isolation levels (YELLOW) that trade them off against speed.
//
//   T1  BEGIN  read x=5   ·         ·        read x=8?!  COMMIT
//   T2    ·       ·      BEGIN   write x=8   COMMIT        ·
//              (cols align on one time axis → the overlap is where the anomaly lives)
export const isolation: SceneSpec = {
  id: 'isolation',
  title: 'Isolation & anomalies',
  canvas: { width: 1680, height: 1120 },
  grid: { cols: 1, rows: [0.62, 0.62, 0.55, 0.62], gap: 0.4, padding: 0.4 },
  nodes: [
    // ── T1: reads the same row twice, on a 6-slot time axis (cols 2 & 3 left open for T2) ──
    {
      id: 'iso-t1', label: 'T1 · reads x twice', kind: 'container', color: TEAL, cell: [0, 0],
      layout: { cols: 6, rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 't1-begin', label: 'BEGIN', kind: 'symbol', color: TEAL, cell: [0, 0] },
        { id: 't1-read1', label: 'read x → 5', sub: 'first read', kind: 'symbol', color: TEAL, cell: [1, 0] },
        { id: 't1-read2', label: 'read x → 8 ?!', sub: 'same query, new answer', kind: 'symbol', color: RED, cell: [4, 0] },
        { id: 't1-commit', label: 'COMMIT', kind: 'symbol', color: TEAL, cell: [5, 0] },
      ],
    },

    // ── T2: writes x and commits — right between T1's two reads (cols 2–4) ──
    {
      id: 'iso-t2', label: 'T2 · writes x, commits', kind: 'container', color: TEAL, cell: [0, 1],
      layout: { cols: 6, rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 't2-begin', label: 'BEGIN', kind: 'symbol', color: TEAL, cell: [2, 0] },
        { id: 't2-write', label: 'write x = 8', sub: 'changes the row', kind: 'symbol', color: TEAL, cell: [3, 0] },
        { id: 't2-commit', label: 'COMMIT', kind: 'symbol', color: TEAL, cell: [4, 0] },
      ],
    },

    // ── the three read anomalies, laid out horizontally so each name + line reads clearly ──
    {
      id: 'iso-anom', label: 'The read anomalies · weaker isolation allows more', kind: 'container', color: RED, cell: [0, 2],
      layout: { cols: 3, rows: 1, gap: 0.32, padding: 0.5 },
      children: [
        { id: 'iso-dirty', label: 'Dirty read', sub: 'sees uncommitted data', kind: 'symbol', color: RED, cell: [0, 0] },
        { id: 'iso-nonrep', label: 'Non-repeatable read', sub: 'row value changed on re-read', kind: 'symbol', color: RED, cell: [1, 0] },
        { id: 'iso-phantom', label: 'Phantom read', sub: 'new rows appear on re-run', kind: 'symbol', color: RED, cell: [2, 0] },
      ],
    },

    // ── the four levels — the dial, horizontal & ordered weakest → strongest (symbol, so the
    //    level NAME reads as the headline; the trade-off sits in the sub) ──
    {
      id: 'iso-levels', label: 'The four isolation levels · stronger forbids more, allows less concurrency', kind: 'container', color: YELLOW, cell: [0, 3],
      layout: { cols: 4, rows: 1, gap: 0.3, padding: 0.5 },
      children: [
        { id: 'iso-ru', label: 'READ UNCOMMITTED', sub: 'allows all three · weakest', kind: 'symbol', color: YELLOW, cell: [0, 0] },
        { id: 'iso-rc', label: 'READ COMMITTED', sub: 'stops dirty reads · PG default', kind: 'symbol', color: YELLOW, cell: [1, 0] },
        { id: 'iso-rr', label: 'REPEATABLE READ', sub: 'also stops non-repeatable', kind: 'symbol', color: YELLOW, cell: [2, 0] },
        { id: 'iso-ser', label: 'SERIALIZABLE', sub: 'as if serial · strongest', kind: 'symbol', color: YELLOW, cell: [3, 0] },
      ],
    },
  ],
  edges: [
    // each transaction's own time order
    { from: 't1-begin', to: 't1-read1' },
    { from: 't1-read1', to: 't1-read2' },
    { from: 't1-read2', to: 't1-commit' },
    { from: 't2-begin', to: 't2-write' },
    { from: 't2-write', to: 't2-commit' },
    // the punchline: T2's committed write is what T1 sees on its second read
    { from: 't2-write', to: 't1-read2', label: 'changes what T1 re-reads', animated: false },
  ],
}
