import type { Section } from '../types'

export const compareAlternatives: Section = {
  id: 'compare-alternatives',
  title: 'Compare alternatives using annotated measurements and read/write trade-offs',
  scene: 'compare-alternatives',
  slide: `## Comparing alternatives

Same query, several designs, **measured** the same way.

### Mental model
- Measure: rows examined, pages visited, index size
- Judge the **read gain** against the **write cost**
- Every index must be updated on each insert, delete, and update of its columns

### Worked example
- Pending orders, 1–7 March (**54** rows returned)
- No index: **20 000** examined; \`(status, order_date)\`: **54**
- Index cost: **180 224** bytes; two single indexes: **327 680**

### Misconception
- "The fastest read is the best design" — it can be the **costliest to maintain**

### Explanation summary
- Choose the **smallest design** that meets the measured need`,
  narration:
    "Now we compare alternatives fairly: one query, several designs, measured the same way. The query is pending orders from the first to the seventh of March, which returns fifty-four rows. With no index, twenty thousand rows are examined. An index on status alone examines twenty-eight hundred. An index on date alone examines three hundred eighty-five. The composite index on status and date examines exactly the fifty-four it returns. Two single indexes can be combined with a bitmap and, but they take twice the space. The table omits timings on purpose, since they vary between machines. The last column is the price: the composite index occupies one hundred eighty thousand bytes. And every index must be maintained on every insert, delete, and update of its columns, so a read gain is paid for on writes. The measurements are from PostgreSQL 16 on this generated data. The best design is the smallest one that meets the measured need, not the one with the fastest read.",
}
