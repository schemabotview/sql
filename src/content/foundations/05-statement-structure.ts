import type { Section } from '../types'

export const statementStructure: Section = {
  id: 'statement-structure',
  title: 'SQL statement structure: identifiers, literals, comments, and statement families',
  scene: 'statement-anatomy',
  slide: `## SQL statement structure

**Keywords**, **identifiers**, **literals** and **comments**, ended by \`;\`.

### Mental model
- **Keywords** ignore case; unquoted **identifiers** fold to lower case
- **Literals**: \`'Asha'\`, \`42\`; double a quote to escape it
- **Comments**: \`--\` or \`/* … */\`

### Worked example: quotes
- \`FIRST_NAME\` works; \`"Asha"\` fails: *column does not exist*

### Misconception
- "Double quotes make a string" — they make an **identifier**

### Statement families
- **DDL** structure · **DML** rows · **DQL** \`SELECT\`
- **TCL** transactions · **DCL** access

### Explanation summary
- A name is **looked up**; a string is a **value** — quotes decide which`,
  narration:
    "A SQL statement is built from a small number of parts, and knowing them makes every statement readable. Keywords, such as select and from, are not case sensitive. Identifiers are the names of things, tables and columns, and when they are not quoted, PostgreSQL folds them to lower case, so upper-case first name works perfectly well. A quoted identifier, in double quotes, keeps its case exactly and must match it. Literals are values written into the statement: text in single quotes, numbers as they are, and a quote inside text is written by doubling it. Comments are ignored: two dashes to the end of the line, or slash star to star slash for a block. And a semicolon ends the statement. The most common beginner mistake is on the board. Double quotes do not make strings; they make identifiers. So select double-quote Asha asks for a column called Asha, and fails with: column Asha does not exist. Strings use single quotes. Finally, statements fall into five families by what they act on. D D L defines structure, D M L changes rows, D Q L asks questions with select, T C L groups changes into transactions, and D C L controls access. The card on the board runs one of each. Some books file select under D M L, but we keep it separate because it changes nothing.",
}
