import type { Section } from '../types'

export const orderingPaging: Section = {
  id: 'ordering-paging',
  title: 'Deterministic ordering, limiting, and pagination concepts',
  scene: 'ordering-paging',
  slide: `## Ordering, limiting, and pagination

A table has **no order** — a result has none unless you ask.

### Mental model
- \`ORDER BY\` sorts; \`LIMIT\` keeps the first rows of **that** order
- A **tie** needs a **tie-breaker** to be deterministic
- Paging: \`OFFSET\` skips rows; **keyset** continues after the last key

### Worked example
- Orders 1 and 2 share a date: \`ORDER BY order_date, order_id\`
- Page 2 by \`OFFSET\` and by keyset: both orders **4, 5, 6**
- \`NULLS FIRST\` puts the **no-rep** orders on top (PostgreSQL's default is last)

### Misconception
- "\`LIMIT\` alone returns the top rows" — **which** rows is unspecified

### Explanation summary
- A page is only stable if the **order** is total`,
  narration:
    "A table has no order, and a query result has none either, unless you ask for one with order by. Limit keeps the first rows, but of that order, so limit without order by returns an unspecified set of rows. The first card shows the other half of the story: ties. Orders one and two share a date, so ordering by date alone does not say which comes first, and the answer could change between runs. Adding the order identifier as a tie-breaker makes the order deterministic. The second card is about pagination, showing page two of size three in two ways. Offset skips three rows and takes three. Keyset pagination remembers the last key seen, here three, and continues after it. Both return orders four, five and six, but only because the order is total. Offset gets slower as you page deeper, and keyset needs a unique ordering key, trade-offs we revisit in chapter seven. The third card shows where nulls sort. PostgreSQL puts them last when ascending, so we ask for nulls first, and the orders with no sales rep come to the top. Other products differ, so check. A page is only stable if the order is total.",
}
