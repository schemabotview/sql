import type { Section } from '../types'

export const subqueries: Section = {
  id: 'subqueries',
  title: 'Scalar and table subqueries',
  scene: 'subqueries',
  slide: `## Scalar and table subqueries

A **subquery** is a query inside another query, in parentheses.

### Mental model
- **Scalar:** one row, one column; used as a value
- **Table:** a set of rows; used with \`IN\` or as a derived table in \`FROM\`

### Worked example
- Price above \`(SELECT avg(price) …)\` = 150.44 → the **Laptop**
- \`IN (…)\` → customers **1, 4, 9** have a pending order
- Derived table → filter on a **count**: customers 1, 2, 4

### Misconception
- "A scalar subquery may return a few rows" — more than one row is an **error**

### Explanation summary
- Ask: does the inner query give a **value** or a **set**?`,
  narration:
    "A subquery is a query written inside another query. It comes in two shapes. A scalar subquery returns one row with one column, and you use it wherever a value fits. The first card compares each price with the average price, one hundred fifty point forty-four, and only the laptop is above it. A table subquery returns a set of rows. With in, it supplies a list: the second card finds the customers who have a pending order, which are one, four and nine. In the from clause, the same idea is called a derived table: the third card first counts orders per customer, then filters on that count, a way to use an aggregate as an ordinary column. The contrast is the last card. If something that must be a single value produces two rows, PostgreSQL reports an error, since the price in category six matches two products. Before writing a subquery, decide whether the inner query should produce one value or a set, and shape it accordingly.",
}
