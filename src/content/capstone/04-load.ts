import type { Section } from '../types'

export const load: Section = {
  id: 'load',
  title: 'Load: seed data in a transaction',
  scene: 'cap-load',
  focus: 'step-load', // lights this step in the shared strip
  slide: `## Load: seed data in a transaction

Now put data in — but as **one atomic unit**, the transaction pattern from Course 3.

### All-or-nothing
- \`BEGIN\` → insert customers → insert their orders → \`COMMIT\`
- If any insert fails (a bad FK, a \`CHECK\` violation), \`ROLLBACK\` leaves the tables **untouched**

### Why wrap it
- Orders reference customers — loading them half-way would leave **orphans or errors**
- The transaction guarantees the database is only ever seen **before** or **after**, never mid-load
- Two customers and three orders go in together, or nothing does

Data is in and consistent. Now the payoff — asking it questions.`,
  narration:
    'Now we load the data, and we do it the way course three taught: as a single atomic transaction. We say BEGIN, then insert our customers — Ann and Bob — then insert their orders, and finally COMMIT to make it all permanent at once. Why bother wrapping a few inserts in a transaction? Because these rows depend on each other. The orders carry foreign keys pointing at the customers, so if we loaded the orders before the customers existed, or if the process died halfway through, we\'d be left with a broken, half-populated database — orphaned orders, or outright errors. The transaction makes that impossible: every insert inside it succeeds together, or if any one of them fails — a foreign key that doesn\'t match, a total that violates the CHECK constraint — the whole thing rolls back and the tables are left exactly as they were before we started. Anyone querying the database sees it either fully before the load or fully after, never in some inconsistent middle state. That\'s the guarantee that lets you load data with confidence. Our shop now has customers and orders, and they\'re consistent. Which means we\'ve reached the fun part — actually asking the data questions.',
}
