import { type SceneSpec, GRAY, BLUE, GREEN, PURPLE, TEAL, RED, ORANGE } from 'reveal-engine'

// The `why-relational` scene — Course 1's cold open (§1). The narration tells the story a flat
// file is fine at first, then rots as it grows or a second person touches it; this scene shows the
// PAYOFF, the six things a database gives you that a plain file can't. Each is a bold pillar tile,
// tinted to its band on the §2 master map, so the cold open doubles as a map of the whole series:
// structured storage (BLUE·schema) · integrity (GREEN·constraints) · concurrent access
// (PURPLE·transactions) · fast at scale (TEAL·indexes) · security (RED·DCL) · reliability
// (ORANGE·storage/WAL). §2 then switches to the map: "here's the language that delivers all this."
//
//   ┌ WHAT A DATABASE GIVES YOU ─────────────────────────────────────────────────┐
//   │ ▤ Structured storage    🛡 Integrity           👥 Concurrent access          │
//   │ ⚡ Fast at scale         🔑 Security            💾 Reliability                │
//   └─────────────────────────────────────────────────────────────────────────────┘
//     each pillar previews a course in this series · color = its band on the §2 map
//
// Solid-tour: one beat (schema §1) solidifies the whole scene (focus: [], all bright). The seven
// ids below — wr-gains and the six tiles — are exactly what that beat's solidify delta lists, so
// the course validates. (Editing the tiles means editing that delta too.)
export const whyRelational: SceneSpec = {
  id: 'why-relational',
  title: 'Why a database?',
  canvas: { width: 1560, height: 760 },
  grid: { cols: [1], rows: 1, gap: 0, padding: 0.32 },
  nodes: [
    // ── the payoff board: the six things a database gives you that a file can't. `symbol` tiles
    //    (bold name + left-aligned `sub` payoff, inline icon) laid out 3 cols × 2 rows across the
    //    full canvas, so names sit on one line and the subs breathe. Colors preview each
    //    capability's band on the §2 master map (and the course that teaches it). ──
    {
      id: 'wr-gains', label: 'What a database gives you', kind: 'container', color: GRAY, cell: [0, 0],
      layout: { cols: 3, rows: [1, 1], gap: 0.26, padding: 0.1 },
      children: [
        { id: 'wr-store', label: 'Structured storage', sub: 'tables + keys — each fact stored once', kind: 'symbol', color: BLUE, icon: 'table', cell: [0, 0] },
        { id: 'wr-integrity', label: 'Integrity', sub: 'constraints, foreign keys, ACID', kind: 'symbol', color: GREEN, icon: 'shield', cell: [1, 0] },
        { id: 'wr-concurrent', label: 'Concurrent access', sub: 'many writers, safe — txns & locks', kind: 'symbol', color: PURPLE, icon: 'users', cell: [2, 0] },
        { id: 'wr-fast', label: 'Fast at scale', sub: 'indexes — millions of rows, not a scan', kind: 'symbol', color: TEAL, icon: 'streaming', cell: [0, 1] },
        { id: 'wr-secure', label: 'Security', sub: 'GRANT / REVOKE — table, row, column', kind: 'symbol', color: RED, icon: 'key', cell: [1, 1] },
        { id: 'wr-reliable', label: 'Reliability', sub: 'WAL, backups, crash recovery', kind: 'symbol', color: ORANGE, icon: 'disk', cell: [2, 1] },
      ],
    },
  ],
  edges: [],
}
