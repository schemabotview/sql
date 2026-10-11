import type { Section } from '../types'

export const outerJoins: Section = {
  id: 'outer-joins',
  title: 'Outer joins and predicate placement',
  scene: 'outer-joins',
  slide: `## Outer joins and predicate placement

A \`LEFT JOIN\` keeps **every left row**; with no match, the right columns are \`NULL\`.

### Mental model
- Match first, then **pad** unmatched left rows with \`NULL\`
- \`WHERE right.key IS NULL\` finds the **unmatched** (anti-join)

### Worked example
- Customers **7** and **8** appear with \`NULL\` orders
- Filter on the right side **in \`ON\`**: **10** rows, left rows kept
- Same filter **in \`WHERE\`**: **5** rows

### Misconception
- "\`ON\` and \`WHERE\` are interchangeable" — in outer joins they are **not**

### Explanation summary
- A right-side filter belongs in \`ON\` to keep the outer join`,
  narration:
    "An outer join solves the loss of unmatched rows. A left join keeps every row from the left table, and where nothing matches, it fills the right-hand columns with null. The first card shows customers seven and eight present, with blank orders. Testing the right key for is null after the join finds exactly the unmatched rows, as the second card shows: that pattern is called an anti-join. Now the important detail, predicate placement. The third card puts the status filter inside on, so the filter decides which rows match. All nine customers stay, giving ten rows, five of them matched. The fourth card puts the same filter in where, which runs after the join. The padded rows have a null status, so they are removed, leaving five rows. The outer join has been silently undone. These counts are real output from the server. So when a condition concerns the right table and you want to keep the left rows, put it in on, and use where only for conditions you truly want to remove rows.",
}
