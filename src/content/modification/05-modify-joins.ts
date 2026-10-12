import type { Section } from '../types'

export const modifyJoins: Section = {
  id: 'modify-joins',
  title: 'Modify data using joins, subqueries, and CTEs',
  scene: 'modify-joins',
  slide: `## Changes with joins, subqueries, and CTEs

Aim a change using **data from elsewhere**.

### Mental model
- \`UPDATE … FROM\`: new values come from another source
- A subquery in \`WHERE\` **chooses** the rows
- \`WITH … DELETE … RETURNING\` + \`INSERT\`: **move** rows in one step

### Worked example
- Order 11's 3 lamps: stock **75 → 72**
- \`NOT EXISTS\` finds product **10** (no order line, no review)
- Payment 8 moves to an archive; **7** payments remain

### Misconception
- "Every source row is applied" — if several match one row, **only one is used**

### Explanation summary
- Check that each target row has **at most one** source row`,
  narration:
    "Real changes often depend on other data. Update from lets the new values come from another source. The first card sums the quantities of order eleven's lines and subtracts them from stock: three desk lamps take stock from seventy-five to seventy-two. A subquery in the where clause chooses rows by existence. The second card deletes only products with no order line and no review, which is product ten, and not exists is used rather than not in because of the null trap from chapter five. The third card uses a common table expression to delete a payment and insert it into an archive in one statement, so the row cannot be lost between steps. One risk is worth remembering: if several source rows match one target row, only one of them is used, and which one is not defined. A hidden test confirms that behaviour. So check that every target row has at most one matching source row before you trust an update from.",
}
