import type { Scene } from '../../render-engine'

// §6 scan-choice — the section exists to kill a wrong belief: that adding an index makes a query use
// it. The top band is the actual rule (selectivity, not existence), the middle explains why an index
// scan has a real cost of its own, and the bottom answers the complaint the narration quotes.
//
// The bottom band lands on stale statistics, which is deliberately the same culprit §2 named — an
// index going unused and a plan going bad are usually the same failure.
export const scanChoice: Scene = {
  id: 'scan-choice',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'choice',
      label: 'Same table, same index — the planner still CHOOSES per query',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'sc-selective', label: 'Few rows match', pattern: 'service', icon: 'funnel', sub: 'Index Scan wins' },
        { id: 'sc-unselective', label: 'Most rows match', pattern: 'network', icon: 'database', sub: 'Seq Scan wins' },
      ],
    },
    {
      id: 'not-free',
      label: "Why an index scan isn't free",
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'nf-hop', label: 'A heap hop per match', pattern: 'warn', sub: 'random I/O, at volume' },
        { id: 'nf-bitmap', label: 'Bitmap scan', pattern: 'network', icon: 'boxes', sub: 'the middle ground' },
        { id: 'nf-only', label: 'Index-only scan', pattern: 'service', icon: 'zap', sub: 'skips the heap' },
      ],
    },
    {
      id: 'complaint',
      label: '"I added an index but it is not being used!"',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'cp-selectivity', label: 'Not selective enough', pattern: 'user', icon: 'scale', sub: 'the scan is faster' },
        { id: 'cp-stats', label: 'Stale statistics', pattern: 'warn', sub: 'run ANALYZE' },
      ],
    },
  ],
  edges: [
    { source: 'choice', target: 'not-free', label: 'below a threshold, reading every page in order genuinely wins' },
    { source: 'not-free', target: 'complaint' },
  ],
}
