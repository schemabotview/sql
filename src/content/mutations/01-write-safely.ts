import type { Section } from '../types'

export const writeSafely: Section = {
  id: 'write-safely',
  title: 'Every change rides a transaction',
  scene: 'write-machinery',
  slide: `## Every change rides a transaction

Reading data is forgiving — a bad \`SELECT\` returns wrong rows. **Changing** data is not: a bad write can corrupt or lose it. So SQL wraps every change in safety machinery.

### The write verbs — DML
- \`INSERT\` adds rows · \`UPDATE\` modifies them · \`DELETE\` removes them
- \`MERGE\` does all three conditionally in one statement (an *upsert*)

### The transaction — the safety envelope
- \`BEGIN\` … your writes … \`COMMIT\` makes them permanent, all at once
- Anything goes wrong? \`ROLLBACK\` — as if none of it happened

### The guarantees & the guards
- **ACID** — atomic, consistent, isolated, durable: what a transaction promises
- **DCL** decides *who* may write; **triggers & procedures** run logic *on* the write

We'll tour each band — starting with the verbs that actually change the data.`,
  narration:
    'So far we\'ve only read data, and reading is forgiving — get a query wrong and you just get back the wrong rows; no harm done, try again. Changing data is a different world. A careless write can overwrite the right value with the wrong one, delete rows you meant to keep, or leave your data half-updated and inconsistent. That\'s why this whole course is about changing data safely, and why SQL wraps every change in layers of protection. Here\'s the map. At the top are the write verbs — the DML: INSERT adds new rows, UPDATE modifies existing ones, DELETE removes them, and MERGE does all three at once, conditionally, in what\'s often called an upsert. But you rarely run those verbs naked. You run them inside a transaction — the safety envelope in the second band. You say BEGIN, do your writes, and then COMMIT to make them all permanent together, in one atomic step; and if anything goes wrong along the way, you ROLLBACK, and it\'s as if none of it ever happened. What a transaction actually guarantees you is the third band: ACID — atomicity, consistency, isolation, and durability. And around all of it sits the last band: DCL, which controls who is even allowed to write, and the programmatic layer — triggers, procedures, and functions — which runs your own logic on the server when writes happen. That\'s the shape of changing data. Let\'s start at the top, with the verbs that do the actual changing.',
}
