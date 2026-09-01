import type { Section } from '../types'

export const youAreHere: Section = {
  id: 'you-are-here',
  title: 'You are here',
  scene: 'mutations-recap',
  slide: `## You are here

Back on the map: this course lit the **middle** — changing data, safely.

### What you can now do
- Change data with **\`INSERT\` / \`UPDATE\` / \`DELETE\` / \`MERGE\`** — minding the \`WHERE\`
- Wrap changes in **transactions** (\`BEGIN\`…\`COMMIT\`/\`ROLLBACK\`) for **ACID** guarantees
- Tune **isolation** against the anomalies · control access with **DCL** · run **server-side logic**

### The map so far
- **DDL · Catalog** — design *(Course 1)* · **Query pipeline · Set ops** — read *(Course 2)*
- **Transactions · DCL · Programmatic** — change *(this course)*
- Only one region is still dark: **Storage** — where the rows physically live

You can design, read, and change a database. Next: **under the hood** — storage, indexes & the planner.`,
  narration:
    'Let\'s zoom back out to the whole map of SQL one more time. The middle is lit now — transactions, access control, and the programmatic layer — because that\'s the ground this course covered: changing data, safely. You can now make changes with the four write verbs — INSERT, UPDATE, DELETE, and MERGE — always mindful of the WHERE clause that decides which rows. You can wrap those changes in a transaction so they\'re atomic, consistent, isolated, and durable — all-or-nothing, with a clean rollback when something goes wrong. You understand the isolation dial and the anomalies it guards against, you can control who\'s even allowed to write using GRANT and REVOKE, and you can push logic into the database itself with functions, procedures, and triggers. Step back and look at how much of the map is now bright. Course one lit the design corner — DDL and the catalog. Course two lit the read path — the query pipeline and set operations. And this course lit the middle — transactions, DCL, and the programmatic layer. Three of SQL\'s five sub-languages, fully covered. Only one region of the map is still dark: storage — where your rows actually live on disk, how indexes make them fast to find, and how the query planner decides what to do. You can now design a database, read from it, and change it safely. The next course goes under the hood, into that last dark corner: the engine.',
}
