import type { Section } from '../types'

export const gapsIslands: Section = {
  id: 'gaps-islands',
  title: 'Gaps, islands, and sequences',
  scene: 'gaps-islands',
  slide: `## Gaps, islands, and sequences

An **island** is a run of consecutive values; a **gap** is what is missing.

### Mental model
- Number the distinct dates; subtract the number from each date
- Consecutive dates give the **same anchor**
- Group by the anchor → one row per island

### Worked example
- Order dates: **3 islands** (03-01 to 03-03, 03-06 to 03-07, 03-12)
- Lengths **3, 2, 1** days
- **6 gap days** from a generated calendar

### Misconception
- "Group by month finds the runs" — runs ignore **calendar boundaries**

### Explanation summary
- Islands: \`value − row_number()\`. Gaps: a **calendar** and an anti-join`,
  narration:
    "Sequences have runs and holes. An island is a run of consecutive dates, and a gap is a stretch with nothing. The trick is to number the distinct dates and subtract that number from each date. Consecutive dates give the same anchor, because both the date and the number grow by one. The first card shows it: the first three dates all give the twenty-eighth of February, the next two give the second of March, and the last gives the sixth of March. Grouping by the anchor in the second card yields the islands: three days, two days and one day, which are the three bursts of ordering we built into the data. For the gaps, we generate a calendar of every day and keep those that are not in the orders table, giving six missing days. The misconception is that grouping by month finds the runs; runs ignore calendar boundaries. The method assumes distinct values, which is why the dates are made distinct first, and it extends to any number sequence.",
}
