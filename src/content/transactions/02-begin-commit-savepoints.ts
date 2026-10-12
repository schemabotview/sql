import type { Section } from '../types'

export const beginCommitSavepoints: Section = {
  id: 'begin-commit-savepoints',
  title: 'BEGIN, COMMIT, ROLLBACK, and savepoints',
  scene: 'begin-commit-savepoints',
  slide: `## BEGIN, COMMIT, ROLLBACK, and savepoints

A transaction is **opened**, then **kept** or **discarded**.

### Mental model
- \`BEGIN\` … \`COMMIT\` keeps every change; \`ROLLBACK\` discards them
- After an **error**, the transaction is **aborted**: only \`ROLLBACK\` works
- \`SAVEPOINT\` marks a point; \`ROLLBACK TO\` returns to it

### Worked example
- Transcript: stock update **refused**, next \`SELECT\` → **"transaction is aborted"**
- After \`ROLLBACK\`: order 12 is **gone**
- Savepoint: line for product 9 undone, product **6** kept

### Misconception
- "An error just skips that statement" — it **poisons** the transaction

### Explanation summary
- Savepoint for **part**; otherwise roll back **all**`,
  narration:
    "A transaction begins with begin and ends with commit, which keeps every change, or rollback, which discards them. The first card is a real transcript from a session. We insert an order and a line, then the stock update is refused by the check constraint. The next select, which is perfectly valid, also fails: the transaction is aborted, and every later statement is ignored until rollback. After rollback, a count shows order twelve does not exist. So an error does not just skip one statement; it poisons the transaction. A savepoint lets us undo part of the work. In the second card we insert an order, mark a savepoint, insert a line for product nine, roll back to the savepoint, and insert a line for product six instead. The select shows that only the product six line remains, with the order intact. The table lists the commands. Use savepoints when part of a transaction may fail and the rest should continue; otherwise roll everything back. Chapter eight introduced rollback; this chapter shows why it matters when several sessions are active.",
}
