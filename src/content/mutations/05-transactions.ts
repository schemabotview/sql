import type { Section } from '../types'

export const transactions: Section = {
  id: 'transactions',
  title: 'Transactions: all-or-nothing',
  scene: 'the-transfer',
  slide: `## Transactions: all-or-nothing

A transaction groups several writes so they **all succeed or all fail** — never half.

### The lifecycle
- \`BEGIN\` starts it → run your writes → \`COMMIT\` makes them **all** permanent at once
- Something failed? \`ROLLBACK\` — the database is left exactly as before \`BEGIN\`

### Why it matters — the transfer
- Move $100: **debit** one account, **credit** another — two writes, one truth
- A crash between them would lose money; a transaction makes both land or neither does

### SAVEPOINT & autocommit
- \`SAVEPOINT\` marks a spot to **partially** roll back to, without losing the whole txn
- With no explicit \`BEGIN\`, each statement is its **own** auto-committed transaction

A transaction *promises* four things. Those promises have a name: \`ACID\`.`,
  narration:
    'This is the heart of changing data safely: the transaction. A transaction groups a set of writes together and makes a promise about them — they all succeed, or they all fail, and you never get stuck halfway. The lifecycle is three words. BEGIN starts the transaction. Then you run your writes — one, or ten, however many belong together. Then COMMIT makes all of them permanent in a single instant. And if anything goes wrong before you commit, you ROLLBACK, and the database throws away every change since BEGIN, leaving things exactly as they were. The classic example is a bank transfer. Moving a hundred dollars is really two writes: subtract a hundred from one account, add a hundred to another. If the system crashed right between those two, the money would simply vanish — debited from one side, never credited to the other. Wrap both writes in a transaction and that\'s impossible: either both happen and the transfer completes, or neither does and nothing moved. Two refinements. A SAVEPOINT is a bookmark inside a transaction — you can roll back to it to undo just the recent part, without abandoning everything you\'ve done since BEGIN. And when you don\'t write BEGIN at all, you\'re still in a transaction — the database wraps each individual statement in its own automatic one, called autocommit, which is why a single UPDATE is already all-or-nothing. Now, a transaction makes four specific promises, and together they have a famous name: ACID.',
}
