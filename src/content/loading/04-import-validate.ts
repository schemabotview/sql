import type { Section } from '../types'

export const importValidate: Section = {
  id: 'import-validate',
  title: 'Import external data and validate the load',
  scene: 'copy-validate',
  slide: `## Importing external data and validating it

\`COPY\` loads a whole file in one statement — then **you** check it.

### Mental model
- \`COPY\` — the **server** reads the file; \`\\copy\` — **psql** reads yours
- \`FROM STDIN\` — data inline, ended by \`\\.\`
- Load into a **staging table**, validate, then insert

### Worked example
- A bad value, \`five\` → *line 3, column 2*; **nothing** is loaded
- A clean \`COPY 4\` — yet one row has **no such customer**
- …and the pair \`(1, 4)\` appears **twice**

### Misconception
- "COPY checks my business rules" — only types and constraints

### Explanation summary
- A load can succeed and still be wrong: **validate it**`,
  narration:
    "Copy loads a whole file in one statement, and it is far faster than a series of inserts. Plain copy with a file name makes the server read the file, which needs special privileges. The psql command backslash copy reads a file from your own machine. And copy from standard in takes the data inline, ended by a line with backslash dot, which is what the cards on the board do, so they need no file. The safe pattern, drawn at the top, is to load into a staging table, validate the data, and only then insert it into the real table. The first card has a bad value, the word five where a number belongs. The whole load is rejected, and the error context names the line and the column, so you know what to fix. Nothing was loaded, because the load is atomic. The second card is the more interesting case. This load is clean: copy four, four rows loaded. But the validation queries reveal two problems. One row refers to customer ninety-nine, who does not exist, and the pair one-four appears twice. Those queries use joins and grouping that chapters four and five explain; for now, read the results. A common misconception is that copy checks your business rules. It checks types and the target table's constraints, nothing more. A load can succeed and still be wrong, which is why you validate before you trust it. Loader-specific options are out of scope here.",
}
