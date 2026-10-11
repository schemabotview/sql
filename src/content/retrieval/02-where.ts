import type { Section } from '../types'

export const where: Section = {
  id: 'where',
  title: 'WHERE, comparisons, and logical operators',
  scene: 'where-filters',
  slide: `## WHERE, comparisons, and logical operators

\`WHERE\` keeps a row only when its condition is **true**.

### Mental model
- Compare with \`=\`, \`<>\`, \`<\`, \`<=\`, \`>\`, \`>=\`
- Combine with \`AND\`, \`OR\`, \`NOT\`
- **\`AND\` binds tighter than \`OR\`**

### Worked example
- \`delivered\` **and** dated from 2 March → **3** of 11 orders
- \`pending OR shipped AND customer 2\` → **4** rows
- With parentheses around the \`OR\` → **1** row

### Misconception
- "It reads left to right" — precedence decides, not position
- Text goes in **single quotes**; equality is \`=\`, not \`==\`

### Explanation summary
- When you mix \`AND\` and \`OR\`, **parenthesise** to say what you mean`,
  narration:
    "The where clause is a filter. For every row, the database evaluates your condition and keeps the row only if the answer is true. You compare with equals, not equals, less than and greater than, with or without equals, and you combine conditions with and, or, and not. The first card shows an and: of the eleven orders, three are delivered and dated from the second of March, orders three, four and five. Now the trap on the second card. And binds more tightly than or, so the condition pending or shipped and customer two does not mean what it seems to say. It means pending, or else shipped by customer two. It returns four orders: six, nine, ten and eleven. Put parentheses around the or, so that the condition reads pending or shipped, and then customer two, and exactly one order qualifies, order six. A common misconception is that conditions are read left to right. Precedence decides, not position. Remember also that text goes in single quotes and that equality is a single equals sign. The rule to take away is simple: whenever you mix and with or, add parentheses to say exactly what you mean.",
}
