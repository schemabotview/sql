import type { Section } from '../types'

export const selectGrain: Section = {
  id: 'select-grain',
  title: 'SELECT, aliases, DISTINCT, and result grain',
  scene: 'select-grain',
  slide: `## SELECT, aliases, DISTINCT, and grain

\`SELECT\` chooses columns; the result is a **new table**.

### Mental model
- \`AS\` names an output column — it changes the **label**, not the data
- \`DISTINCT\` removes duplicate **result rows**
- The **grain** is what one result row means

### Worked example
- \`SELECT status FROM orders\` — one row per **order**: 11
- \`SELECT DISTINCT status\` — one row per **status**: 4
- \`DISTINCT city\` gives **8** rows for **9** customers

### Misconception
- "\`DISTINCT\` cleans the data" — it hides duplicates; it does not remove them

### Explanation summary
- Before reading a result, say what **one row** means`,
  narration:
    "A select statement chooses columns, and its result is a new table. Three ideas matter here. An alias, introduced with as, gives an output column a new name; it changes the label, never the data. Distinct removes duplicate rows from the result. And the grain of a result is what one row of it means. Look at the board. Selecting the status of every order returns eleven rows, because the grain is one row per order. Selecting distinct status returns four rows, because the grain is now one row per kind of status. And distinct city gives eight rows for nine customers, because two of our customers live in Lyon. The result is shorter, but the customers table is unchanged. A common misconception is that distinct cleans the data. It does not remove anything from the table; it hides duplicates in one result. That matters because duplicates are sometimes a problem to fix and sometimes simply the truth. So before you read any result, ask what one row of it means. That habit prevents many wrong summaries, and we will use it again when we group and join. Queries here are written for PostgreSQL, and the columns we choose are only the ones we ask for.",
}
