import { type SceneSpec, GREEN, TEAL, GRAY, YELLOW } from 'reveal-engine'

// The `query-pipeline` scene — the spine of Course 2 ("Reading data"). Its headline is the
// single most useful SQL insight: you don't WRITE a query in the order it RUNS. So the scene
// puts the two side by side —
//
//   ┌ report.sql · HOW YOU WRITE IT (a real annotated query) ─────────────────────────────┐
//   │ SELECT … -- projection   FROM … -- joins   WHERE … -- filter   GROUP BY … -- agg  …  │
//   ┌ HOW IT RUNS · logical execution order ──────────────────────────────────────────────┐
//   │ CTE↓                                          WINDOW↓                                │
//   │ FROM→JOIN→WHERE→GROUP BY→HAVING→SELECT→DISTINCT→ORDER BY→LIMIT                        │
//   ┌ SET OPERATIONS ─────────────────────────────────────────────────────────────────────┐
//   │ ⟦A⟧  UNION · UNION ALL · INTERSECT · EXCEPT  ⟦B⟧                                      │
//
// — the TOP band is a real annotated query (a multi-line `code` card), in the order you type
// it; the MIDDLE green pipeline (each stage carrying a one-line job) is what actually happens
// — note SELECT is written 1st but RUNS 6th. CTE feeds FROM, WINDOW feeds SELECT. The course
// tours the run-pipeline stage by stage in EXECUTION order; two stages detour to their own
// mechanism scenes (`joins`, `windows`).
export const queryPipeline: SceneSpec = {
  id: 'query-pipeline',
  title: 'How a SELECT runs',
  canvas: { width: 1900, height: 1060 },
  grid: { cols: 1, rows: [1.3, 1.2, 0.5], gap: 0.3, padding: 0.35 },
  nodes: [
    // ── band: HOW YOU WRITE IT — a real annotated query (a multi-line `code` card), each clause
    //    tagged with its role in a trailing `-- comment`, in the order you type it. ──
    {
      id: 'writeq', kind: 'code', filename: 'report.sql', color: GREEN, cell: [0, 0],
      label: [
        'SELECT   c.name, count(*)       -- projection',
        'FROM     customers c, orders o  -- source & joins',
        'WHERE    o.customer_id = c.id   -- filter rows',
        'GROUP BY c.name                 -- aggregate',
        'HAVING   count(*) > 5           -- filter groups',
        'ORDER BY count(*) DESC          -- sort',
        'LIMIT    10                     -- take top N',
      ].join('\n'),
    },

    // ── band: HOW IT RUNS — the logical execution order, each stage + its one-line job ──
    {
      id: 'run', label: 'How it runs · logical execution order', kind: 'container', color: GREEN, cell: [0, 1],
      layout: { cols: 9, rows: [0.5, 1.5], gap: 0.3, padding: 0.5 },
      children: [
        // feeders (row 0): CTE above FROM, WINDOW above SELECT
        { id: 'rp-cte', label: 'CTE / Subquery', sub: 'a named step', kind: 'symbol', color: YELLOW, cell: [0, 0] },
        { id: 'rp-window', label: 'Window', sub: 'compute across rows', kind: 'symbol', color: YELLOW, cell: [5, 0] },
        // the pipeline (row 1)
        { id: 'rp-from', label: 'FROM', sub: 'pick the tables', kind: 'symbol', color: GREEN, cell: [0, 1] },
        { id: 'rp-join', label: 'JOIN', sub: 'combine rows', kind: 'symbol', color: GREEN, cell: [1, 1] },
        { id: 'rp-where', label: 'WHERE', sub: 'keep matching rows', kind: 'symbol', color: GREEN, cell: [2, 1] },
        { id: 'rp-groupby', label: 'GROUP BY', sub: 'collapse into groups', kind: 'symbol', color: GREEN, cell: [3, 1] },
        { id: 'rp-having', label: 'HAVING', sub: 'filter the groups', kind: 'symbol', color: GREEN, cell: [4, 1] },
        { id: 'rp-select', label: 'SELECT', sub: 'choose columns', kind: 'symbol', color: GREEN, cell: [5, 1] },
        { id: 'rp-distinct', label: 'DISTINCT', sub: 'drop duplicates', kind: 'symbol', color: GREEN, cell: [6, 1] },
        { id: 'rp-orderby', label: 'ORDER BY', sub: 'sort the result', kind: 'symbol', color: GREEN, cell: [7, 1] },
        { id: 'rp-limit', label: 'LIMIT', sub: 'take the top N', kind: 'symbol', color: GREEN, cell: [8, 1] },
      ],
    },

    // ── band: SET OPERATIONS — combine two whole result sets ──
    {
      id: 'setops', label: 'Set operations · combine whole result sets', kind: 'container', color: TEAL, cell: [0, 2],
      layout: { cols: [1.1, 0.9, 1, 1, 0.9, 1.1], rows: 1, gap: 0.28, padding: 0.5 },
      children: [
        { id: 'so-a', label: 'query A', kind: 'symbol', color: GRAY, cell: [0, 0] },
        { id: 'so-union', label: 'UNION', kind: 'term', color: TEAL, cell: [1, 0] },
        { id: 'so-unionall', label: 'UNION ALL', kind: 'term', color: TEAL, cell: [2, 0] },
        { id: 'so-intersect', label: 'INTERSECT', kind: 'term', color: TEAL, cell: [3, 0] },
        { id: 'so-except', label: 'EXCEPT', kind: 'term', color: TEAL, cell: [4, 0] },
        { id: 'so-b', label: 'query B', kind: 'symbol', color: GRAY, cell: [5, 0] },
      ],
    },
  ],
  edges: [
    // The run-pipeline, in logical execution order.
    { from: 'rp-from', to: 'rp-join' },
    { from: 'rp-join', to: 'rp-where' },
    { from: 'rp-where', to: 'rp-groupby' },
    { from: 'rp-groupby', to: 'rp-having' },
    { from: 'rp-having', to: 'rp-select' },
    { from: 'rp-select', to: 'rp-distinct' },
    { from: 'rp-distinct', to: 'rp-orderby' },
    { from: 'rp-orderby', to: 'rp-limit' },
    // feeders into the pipeline
    { from: 'rp-cte', to: 'rp-from' },
    { from: 'rp-window', to: 'rp-select' },
  ],
}
