import type { Section } from '../types'

export const theBrief: Section = {
  id: 'the-brief',
  title: 'The brief: build it end to end',
  scene: 'project-plan',
  slide: `## The brief: build it end to end

No new SQL this time — instead, one real project, built end to end. You'll **use everything** from the last four courses on a single e-commerce database.

### The six steps
- **Model** the schema → **Secure** it with roles → **Load** data in a transaction
- **Analyze** with a join + aggregation → **Report** with window functions → **Optimize** with an index

### Each step reuses a course
- **Model** (Course 1 · DDL) · **Secure** & **Load** (Course 3 · DCL, transactions)
- **Analyze** & **Report** (Course 2 · joins, windows) · **Optimize** (Course 4 · indexes, EXPLAIN)

### How to watch
- The **plan** up top is the whole project; the step we're on is lit
- The **code** below it is the real SQL — the left pane is the project, the slide explains it

Let's build. First, the foundation everything rests on — the schema.`,
  narration:
    'This last course is different from the four before it. It doesn\'t teach a new corner of SQL — you\'ve now seen them all. Instead, it takes everything you\'ve learned and puts it to work building one real thing, end to end: a small e-commerce database, from an empty schema to a tuned, queryable system. Here\'s the plan, laid out as a flow across the top. Six steps. First we model the schema — the tables, keys, and constraints. Then we secure it, setting up roles so the right people have the right access. Then we load some data, safely, inside a transaction. With data in place, we analyze it — a real reporting query that joins customers to their orders and aggregates the results. Then we go further with a report that uses window functions to rank customers and compute running totals. And finally we optimize: we add an index and use EXPLAIN to prove it made the query faster. Notice that each step is really a callback to one of our courses — modeling is course one, securing and loading are course three, analyzing and reporting are course two, and optimizing is course four. That\'s the whole point of a capstone: the pieces you learned separately now click together into one workflow. As we go, the flow up top will light up step by step to show where we are, and the real SQL for each step appears as code on the left, while I explain what it\'s doing and why. Enough setup — let\'s build. Everything starts with the foundation: the schema.',
}
