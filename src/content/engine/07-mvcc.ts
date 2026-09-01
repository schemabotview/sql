import type { Section } from '../types'

export const mvccSection: Section = {
  id: 'mvcc',
  title: 'MVCC: versions & snapshots',
  scene: 'mvcc',
  slide: `## MVCC: versions & snapshots

How can readers and writers hit the same row at once without locking each other out? The database keeps **multiple versions** of every row.

### One row, many versions
- An \`UPDATE\` doesn't overwrite — it writes a **new version** and marks the old one dead
- Each version carries **\`xmin\`/\`xmax\`** — the transactions that created and ended it

### A snapshot decides what you see
- Each transaction reads against a **snapshot** — the versions committed as of its start
- Two transactions can see **different versions of the same row** — with no waiting
- This is the mechanism behind **isolation levels** (Course 3)

### The cleanup — VACUUM
- Dead versions pile up; **\`VACUUM\`** reclaims them (autovacuum runs it for you)
- Skip it and tables **bloat** — the one MVCC chore you must not ignore

Readers never block writers; writers never block readers.`,
  narration:
    'One question has been lurking since the last course: how can one transaction read a row at the very moment another is updating it, without the two blocking each other? The answer is MVCC — multi-version concurrency control — and the idea is beautifully simple: the database never overwrites a row in place. Look at row forty-two here. When a transaction updates its total from forty dollars to fifty-five, the database doesn\'t change the old value — it writes a brand-new version of the row, version two, and marks the old version, version one, as dead. For a while, both physically exist. How does each version know its lifespan? Every version carries two hidden fields, xmin and xmax — the id of the transaction that created it, and the id of the one that retired it. Now the clever part: what any given transaction sees is governed by a snapshot, taken when it starts, which is essentially the list of versions that were committed as of that moment. So transaction A, which started at time one-fifty — before the update committed — looks at row forty-two and sees version one, forty dollars. Transaction B, which started at two hundred, sees version two, fifty-five dollars. Same row, same instant, two different truths, and neither transaction waited on the other for a moment. This is the actual machinery underneath the isolation levels from the previous course — snapshots are how the database gives each transaction its consistent view. There\'s one catch, and it\'s the bottom of the picture: all those dead versions accumulate, and something has to clean them up. That\'s VACUUM, which reclaims the space dead versions occupy. PostgreSQL runs it automatically as autovacuum, but if it ever falls behind, tables bloat with dead rows — the one piece of MVCC housekeeping you can\'t ignore. The payoff, though, is the whole reason for MVCC: readers never block writers, and writers never block readers. And with that, the engine is complete. Let\'s zoom back out to the map.',
}
