import type { Section } from '../types'

export const runningAverages: Section = {
  id: 'running-averages',
  title: 'Running totals and moving averages',
  scene: 'running-averages',
  slide: `## Running totals and moving averages

Both are **windows with a chosen frame**.

### Mental model
- Running total: \`sum(x) OVER (ORDER BY d)\`, from the start to now
- Moving average: \`avg(x) OVER (… ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)\`
- Early rows have **fewer rows** in the frame

### Worked example
- Daily revenue over **6** order dates
- Running total ends at **3017.70**
- 03-12's \`avg3\` = (305.00 + 73.90 + 1269.00) ÷ 3 = **549.30**, from rows 03-06, 03-07, 03-12

### Misconception
- "A 3-row average is a 3-day average" — **not across gaps**

### Explanation summary
- Say what the frame counts: **rows or time**`,
  narration:
    "A running total is a window sum from the first row to the current one. A moving average is an average over a sliding frame, for example the current row and the two before it. The card aggregates revenue by order date first, giving six dates, and then adds both calculations. The running total climbs from one thousand seventeen eighty to three thousand seventeen seventy. The three-row average starts with only one row in its frame, so it equals the revenue, then uses two rows, and from the third row on uses three. Now notice the limitation. The row for the twelfth of March averages the rows of the sixth, the seventh and the twelfth. There is a five-day gap before the twelfth, so calling this a three-day average would be wrong: it averages three rows, not three days. If you need real days, you must first build a calendar with every date present, which the gaps section shows how to generate. Always say what the frame counts, rows or time.",
}
