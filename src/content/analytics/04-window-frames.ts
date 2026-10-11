import type { Section } from '../types'

export const windowFrames: Section = {
  id: 'window-frames',
  title: 'Understand window frames',
  scene: 'window-frames',
  slide: `## Window frames

The **frame** says which rows around the current one the function sees.

### Mental model
- \`ROWS\`: count **physical rows**
- \`RANGE\`: include **peers** with an equal \`ORDER BY\` value
- With \`ORDER BY\`, the default frame is \`RANGE … CURRENT ROW\`

### Worked example
- Orders 1 and 2 share 03-01: \`rows_sum\` **118.80, 1017.80**
- \`range_sum\` shows **1017.80 on both**
- They differ only on **tied dates**: 03-01, 03-06, 03-12

### Misconception
- "A running total is always row by row" — with ties the default is **not**

### Explanation summary
- State the frame **explicitly**; do not rely on the default`,
  narration:
    "A window function sees a frame, a set of rows around the current row. The frame can be counted in physical rows, with rows, or by value, with range. With range, rows that tie on the order by value are peers, and all peers are included. The card computes a running sum of order totals twice. Orders one and two share the same date. With rows, the running sum steps from one eighteen eighty to ten seventeen eighty. With range, both rows show ten seventeen eighty, because they are peers. The two columns differ exactly on the tied dates, the first, the sixth and the twelfth of March, and agree everywhere else. Since the default frame with an order by is range up to the current row and its peers, a running total can surprise you when dates repeat. The habit is to state the frame explicitly. The table lists the frame words, and in the next sections we will use them to build running totals and moving averages.",
}
