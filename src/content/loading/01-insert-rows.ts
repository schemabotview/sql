import type { Section } from '../types'

export const insertRows: Section = {
  id: 'insert-rows',
  title: 'Insert individual and multiple rows',
  scene: 'insert-rows',
  slide: `## Inserting individual and multiple rows

\`INSERT\` adds rows, each tested against the rules of chapter 2.

### Mental model
- \`INSERT INTO t (columns) VALUES (values)\` adds **one** row
- Repeat the list for **many**, in one statement
- The **command tag** counts them: \`INSERT 0 3\`

### Worked example: three forms
- Column list: \`stock\` → **0**, \`discontinued\` → **f**, by default
- Positional: **all six**, in table order
- Multi-row: \`count(*)\` goes from **10** to **13**

### Misconception
- "Positional is shorter, so better" — it breaks when a column is added

### Safety
- Check the tag: a wrong count is the first sign of a wrong statement`,
  narration:
    "Insert adds rows to a table, and every row is tested against the rules we defined in chapter two. The safest form names the columns you are supplying, followed by the values in the same order. Look at the first card. We supply four columns of the products table, and the other two take their defaults. The returning clause asks PostgreSQL to print the row as it was stored, and you can see stock is zero and discontinued is false, both filled in by defaults. The second card shows the positional form, with no column list. It works, but only if you supply all six values in exactly the table's column order, so it breaks the day someone adds a column. A common misconception is that the shorter form is the better one; in practice it is the more fragile. The third card adds three rows in one statement, by repeating the parenthesised list. PostgreSQL reports insert zero three, and the product count goes from ten to thirteen. A word on safety, because this is the first statement that changes data. Always look at the command tag. Insert zero three means three rows were added, and if you expected one, something is wrong. So the lesson is to name your columns, and to add many rows in one statement rather than many statements.",
}
