import type { Section } from '../types'

export const youAreHere: Section = {
  id: 'you-are-here',
  title: 'You are here',
  scene: 'schema-recap',
  slide: `## You are here

You've filled in the top-left corner of the map: **define + catalog**.

### What you can now do
- Model data as **tables** of typed **columns**, related by **keys**
- Split them with **normal forms** so every fact lives in one place
- Enforce rules with **constraints**, and build it all with **DDL**
- Add **views** and **indexes** as catalog objects

### The rest of the map
- **Query pipeline** — read it all back *(next course)*
- **Transactions · DCL** — change data safely, and control who can
- **Storage · Programmatic** — where it lives, and server-side logic

With a schema in place, the next course reads it back — the \`SELECT\` pipeline.`,
  narration:
    'Let\'s step back to the map we started on. The top-left corner is now lit, because that\'s exactly what this course filled in: define and catalog. You can now model data the relational way — as tables of typed columns, related to each other by primary and foreign keys. You can hand your business rules to the database as constraints, and build the whole structure with DDL. And you can add the two derived objects, views and indexes, all of which live in the catalog. Everything else on the map is still dim, and that\'s the road ahead. Next, the query pipeline — how you read all of this back out with SELECT. After that, transactions and access control, for changing data safely and deciding who\'s allowed to. And finally storage and the programmatic layer — where your data physically lives, and the server-side logic that runs on it. But it all starts here: with a schema in place, the next course brings it to life by querying it.',
}
