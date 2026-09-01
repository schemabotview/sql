import type { Section } from '../types'

export const planner: Section = {
  id: 'planner',
  title: 'The planner: SQL → a plan',
  scene: 'the-planner',
  slide: `## The planner: SQL → a plan

SQL is **declarative** — you say *what* rows you want, not *how* to get them. The planner decides the how.

### From text to a plan
- **Parse** — your SQL becomes a syntax tree · **Analyze** — resolve table & column names, types
- **Rewrite** — expand views and rules · **Optimize** — choose the plan · **Execute** — run it

### The optimizer is cost-based
- For one query there are **many** ways to run it — join orders, scan types, index or not
- It **estimates the cost** of each using table **statistics** (row counts, value spread)
- Then it picks the cheapest — an estimate, not a certainty

### Why plans go wrong
- **Stale statistics** → bad cost estimates → a slow plan. \`ANALYZE\` refreshes them

The optimizer's chosen plan isn't hidden — \`EXPLAIN\` shows it to you.`,
  narration:
    'The journey starts with the planner, and to understand it you have to remember that SQL is declarative: you describe what rows you want, never how to fetch them. That how is entirely the database\'s job, and the planner is where it\'s decided. It works in stages. First it parses your SQL text into a syntax tree — a structured form of the query. Then it analyzes that tree, resolving the names you used to real tables and columns and checking their types. Then it rewrites the query, expanding any views or rules into their underlying definitions. Then comes the interesting stage: optimize. For any given query there are usually many different ways to actually run it — which table to read first, what order to join them in, whether to use an index or just scan the whole table. The optimizer\'s job is to choose, and it does so by cost: it estimates how expensive each candidate plan would be, using statistics the database keeps about your tables — how many rows they have, how values are distributed — and it picks the cheapest one. Finally, execute runs that chosen plan. This cost-based approach is powerful, but it has a well-known failure mode: if those statistics are stale — if the table has grown ten times since they were last gathered — the cost estimates are wrong and the optimizer can pick a genuinely slow plan. The fix is to run ANALYZE, which refreshes the statistics. Now, the plan the optimizer settled on isn\'t a black box. There\'s a command that shows it to you, and it\'s the most important tuning tool in SQL: EXPLAIN.',
}
