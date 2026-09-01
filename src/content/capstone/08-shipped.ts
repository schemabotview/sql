import type { Section } from '../types'

export const shipped: Section = {
  id: 'shipped',
  title: 'Shipped',
  scene: 'cap-shipped',
  slide: `## Shipped

The project is live — and there it is, whole: **every step, start to finish.** You've used all of SQL, together, on one real database.

### What you built
- A schema with keys & constraints → roles & grants → an atomic data load
- A revenue report (joins + aggregation) → a ranked report (windows) → an index, proven with \`EXPLAIN\`

### The whole journey
- **Design** *(C1)* → **Read** *(C2)* → **Change** *(C3)* → **Tune** *(C4)* → **Build** *(this)*
- Every sub-language, every mechanism, from the query down to the disk

You can now design a database, query it, change it safely, tune it, and ship a project on it. That's SQL — end to end.`,
  narration:
    'The project is live. Step back and look at the whole thing you just built — every step of it, from the empty schema at the top to the tuned, indexed query at the end. You modeled a schema with primary keys, foreign keys, and constraints. You secured it with roles and the principle of least privilege. You loaded data safely inside a transaction, all or nothing. You analyzed it with a join and aggregation, and then went further with window functions for ranking and running totals. And you tuned it with an index, proving the speedup by reading the query plan with EXPLAIN. That\'s not six separate scripts anymore — it\'s one fluent workflow, and every step of it reached back into something you\'d already learned. That mirrors the whole journey of this series: you learned to design a database, to read it, to change it safely, to tune it, and finally, here, to build with it. Every sub-language, every mechanism, from the surface query all the way down to how the rows sit on disk. You started not knowing where SELECT ran in the pipeline, and you\'re ending able to architect, secure, populate, query, and optimize a real system. That\'s SQL, end to end — and it\'s yours now. Congratulations.',
}
