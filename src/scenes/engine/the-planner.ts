import type { Scene } from '@graphlearning/flow'

// §2 the-planner — SQL is declarative, so something has to decide the HOW. The board goes pipeline →
// principle → failure mode, which is the order the narration argues it: the five stages a statement
// passes through, the fact that the choice is a COST ESTIMATE rather than a rule, and the single
// thing that most often makes that estimate wrong.
//
// The stale-statistics band matters more than it looks — it is the same root cause §6 lands on when
// an index goes unused, so the two sections rhyme.
export const thePlanner: Scene = {
  id: 'the-planner',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'stages',
      label: 'SQL text → a plan, in five stages',
      pattern: 'group',
      cols: 5,
      children: [
        { id: 'st-parse', label: 'Parse', variant: 'tile', pattern: 'external', icon: 'braces', sub: 'a syntax tree' },
        { id: 'st-analyze', label: 'Analyze', variant: 'tile', pattern: 'network', icon: 'scanface', sub: 'resolve names' },
        { id: 'st-rewrite', label: 'Rewrite', variant: 'tile', pattern: 'network', icon: 'repeat', sub: 'expand views' },
        { id: 'st-optimize', label: 'Optimize', variant: 'tile', pattern: 'service', icon: 'brain', sub: 'choose a plan' },
        { id: 'st-execute', label: 'Execute', variant: 'tile', pattern: 'storage', icon: 'zap', sub: 'run it' },
      ],
    },
    {
      id: 'cost',
      label: 'The optimizer is COST-BASED — it estimates, it does not know',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'co-many', label: 'Many possible plans', pattern: 'network', icon: 'workflow', sub: 'join orders, scans' },
        { id: 'co-stats', label: 'Statistics', pattern: 'service', icon: 'gauge', sub: 'row counts, spread' },
        { id: 'co-cheapest', label: 'Pick the cheapest', pattern: 'storage', icon: 'scale', sub: 'by estimated cost' },
      ],
    },
    { id: 'stale', label: 'Stale statistics', pattern: 'warn', sub: 'bad estimate, slow plan' },
  ],
  edges: [
    { source: 'stages', target: 'cost' },
    { source: 'cost', target: 'stale', label: 'the estimate is only as good as the stats — ANALYZE refreshes them' },
  ],
}
