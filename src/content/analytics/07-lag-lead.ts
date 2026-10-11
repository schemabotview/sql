import type { Section } from '../types'

export const lagLead: Section = {
  id: 'lag-lead',
  title: 'Period comparisons with LAG and LEAD',
  scene: 'lag-lead',
  slide: `## Period comparisons with LAG and LEAD

\`lag(x)\` reads the **previous** row; \`lead(x)\` the **next**.

### Mental model
- Both follow the window's \`ORDER BY\`
- Optional offset and **default**: \`lag(x, 1, 0)\`
- No neighbour → \`NULL\`

### Worked example
- 03-02: revenue 193.00, previous 1017.80 → change **−824.80**
- 03-01 has **no previous** → \`NULL\`
- 03-12 has **no next** → \`NULL\`

### Misconception
- "The previous row is yesterday" — **03-03 → 03-06** skips two days

### Explanation summary
- Compare **adjacent rows**; check whether rows are adjacent **in time**`,
  narration:
    "Lag and lead let a row read its neighbours in the window's order, which is how we compare a period with the one before it. Lag of revenue reads the previous row, lead of the date reads the next. The card computes daily revenue and then the change from the previous day with data. The second of March has revenue of one ninety-three and a previous value of ten seventeen eighty, so the change is minus eight twenty-four eighty. The first row has no previous row, so its previous value and change are null, and the last row has no next date. You can add an offset, and a default value to use instead of null, as the table shows. Here is the trap. The previous row is the previous row in the ordering, not necessarily the previous day. After the third of March the next date with orders is the sixth, so the change compares dates three days apart. Whenever you speak of days or months, check that the rows really are adjacent in time, and fill the gaps if they are not.",
}
