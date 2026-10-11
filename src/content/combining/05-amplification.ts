import type { Section } from '../types'

export const amplification: Section = {
  id: 'amplification',
  title: 'Multi-table joins and duplicate amplification',
  scene: 'amplification',
  slide: `## Multi-table joins and duplicate amplification

Joining **two "many" sides** to one row repeats each value.

### Mental model
- Each join multiplies rows by its matches
- Order 1: **2 lines** × **1 payment** → the payment appears **twice**

### Worked example
- True payments total: **2248.70**
- Summed after joining through lines: **3321.40**
- Fix: **aggregate each side to the order grain**, then join → **2248.70**

### Misconception
- "A bigger join gives more information" — here it gives a **wrong total**

### Explanation summary
- Check the grain after **every** join before summing`,
  narration:
    "Real questions need more than two tables, and each additional join can change the number of rows. Look at order one on the board. It has two lines and one payment. When we join orders to lines and to payments, the single payment of one hundred eighteen eighty is repeated on both line rows. That is duplicate amplification. Now summing over the whole shop: the payments table alone totals twenty-two forty-eight seventy, which is the true figure. Summing the payment amount after joining through the lines gives thirty-three twenty-one forty, because every payment is counted once per line. Nothing failed; the query simply answered a different question than the one we asked. The fix is to bring each side to the order grain before joining. Aggregate the payments per order, take the distinct orders that have lines, and then join. The total matches again. The habit to build is to check the grain after every join, and to sum only at the grain where the value lives.",
}
