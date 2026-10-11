import type { Section } from '../types'

export const reconciliation: Section = {
  id: 'reconciliation',
  title: 'Worked case: explain loading and reconciliation of the shop dataset',
  scene: 'reconciliation',
  slide: `## Worked case: loading and reconciliation

A load is finished when every source row is **accounted for**.

### Mental model
- Stage the feed as **text**; give each row a **verdict**
- Rejected rows carry a **reason**
- Reconcile: **source = loaded + rejected**

### Worked example: six customers
- Rows 10, 11, 15 → **loaded**
- 12 → **email missing** · 13 → **email in use** · 14 → **bad date**
- Customers go from **9** to **12**
- The date check is a **pattern** (month 1–12): a limited check

### Misconception
- "No error means correct" — compare with the **source**

### Explanation summary
- Every rejection has a reason; the counts must **balance**`,
  narration:
    "Here is the whole chapter in one worked case. A feed of six new customers arrives as a file. We load it into a staging table as plain text, so that nothing is refused on the way in, and then we give every row a verdict: loaded, or rejected with a reason. The long card on the left does exactly that, and the result is the comparison between the source file and the rows that will load. Rows ten, eleven and fifteen are fine and are loaded. Row twelve has no email, which the not null rule forbids. Row thirteen uses an email that already belongs to Asha, which the unique rule forbids. And row fourteen has a date that cannot exist, the fourteenth of month thirteen. Each rejection has a reason that traces back to a rule from chapter two. Then we reconcile. The source had six rows, three were loaded and three were rejected, so six equals three plus three, and the customers table grew from nine rows to twelve. I checked those counts by running the whole process. A common misconception is that no error means the load was correct. It does not. You have to compare what was loaded with what the source contained, and every row must be accounted for. The assumption here is that the feed's columns are complete; a real feed needs more checks. The database now contains validated records. Next, we turn those records into answers to business questions.",
}
