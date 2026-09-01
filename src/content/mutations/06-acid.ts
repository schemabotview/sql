import type { Section } from '../types'

export const acidSection: Section = {
  id: 'acid',
  title: 'ACID: the four guarantees',
  scene: 'acid',
  slide: `## ACID: the four guarantees

ACID names the four promises a transaction makes.

### A · Atomicity
- **All-or-nothing** — every write commits, or none does (the transfer)

### C · Consistency
- The transaction moves the DB from one **valid state to another** — constraints always hold

### I · Isolation
- Concurrent transactions don't **step on each other** — each runs as if alone
- *How much* they're isolated is tunable — that's the whole next section

### D · Durability
- Once **committed**, it survives a crash — the **write-ahead log** guarantees it

Three of these are absolute. **Isolation** is a dial — let's see what it's protecting against.`,
  narration:
    'ACID is an acronym for the four guarantees a transaction gives you, and each letter is worth knowing by name. A is atomicity, which we just saw: all-or-nothing — the whole group of writes commits, or none of it does, like the transfer that can\'t lose money in the middle. C is consistency: a transaction always moves the database from one valid state to another, which means all the constraints you defined — the foreign keys, the checks, the unique rules — hold true before it starts and after it commits; it can never leave the data in a state that breaks the rules. I is isolation, and this is the subtle one: when many transactions run at the same time, isolation is the promise that they won\'t step on each other — each one behaves, as much as possible, as if it were the only transaction running. And crucially, isolation isn\'t a single fixed thing; it\'s a dial you can turn, trading strictness for speed. D is durability: once a transaction has committed, that data is safe even if the server loses power the very next second, because the database wrote the change to a durable write-ahead log before saying done. Three of these four — atomicity, consistency, durability — are absolutes you simply get. Isolation is the one you tune, and turning that dial too low exposes you to real, named problems. Let\'s look at exactly what isolation is protecting you from.',
}
