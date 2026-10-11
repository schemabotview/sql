import type { Section } from '../types'

export const correlated: Section = {
  id: 'correlated',
  title: 'Correlated subqueries',
  scene: 'correlated',
  slide: `## Correlated subqueries

A subquery that uses a column of the **outer row**.

### Mental model
- Logically: for each outer row, run the inner query with that row's value
- The inner query **cannot run alone**: \`p.category_id\` comes from outside

### Worked example
- Products priced above **their own category's** average → **5 of 10**
- Studio Headphones: 149.00 > category 6 average 104.00 → keep
- In the \`SELECT\` list, customers 7 and 8 get **0**, not "missing"

### Misconception
- "The inner query runs once" — logically it runs **per outer row**

### Explanation summary
- Plain subquery: independent. Correlated: **depends on the row**`,
  narration:
    "A correlated subquery refers to a column of the outer row, so it cannot run on its own. Logically, for each outer row, the inner query is evaluated with that row's value. The first card keeps the products priced above the average of their own category. The trace table follows one row: for Studio Headphones in category six, the inner query computes the average price of category six, which is one hundred four, and since one forty-nine is greater, the row stays. The third card shows the averages for each category, so you can check every comparison by eye. Five of ten products pass. That is the logical order; the engine is free to plan it differently, as chapter seven will show. Correlated subqueries also work in the select list. The last card counts orders for each customer, and customers seven and eight receive a zero, whereas a join followed by grouping would have dropped them. The misconception is that the inner query runs once: logically it depends on the row, and that dependence is what makes it correlated.",
}
