import type { Section } from '../types'

export const innerJoins: Section = {
  id: 'inner-joins',
  title: 'Inner joins',
  scene: 'inner-joins',
  slide: `## Inner joins

An inner join keeps a pair **only when the condition holds**.

### Mental model
- Try every order against every customer; keep pairs where \`ON\` is true
- Aliases (\`c\`, \`o\`) say which table a column belongs to
- Rows with no partner **disappear**

### Worked example
- Condition on the **foreign key** → **11** pairs
- Customers **7** and **8** are absent: they never ordered
- Condition on the **wrong columns** → still runs, **9** rows

### Misconception
- "If it runs, the join is right" — a wrong key gives **plausible, wrong** rows

### Explanation summary
- Join **foreign key to the key it references**; check a few rows`,
  narration:
    "An inner join keeps a pair of rows only when the on condition is true. Think of trying each order against each customer and keeping the pairs that match. Aliases such as c and o say which table each column comes from, which keeps the query readable. The first card joins on the foreign key. It returns eleven pairs, one per order, and the four shown are the first by order number. Customers seven and eight never ordered, so no pair contains them: unmatched rows disappear. The second card is the failure to recognise. The condition compares the customer number with the order number. The query runs without any error and returns nine rows that look plausible, but order three belongs to Asha, and here it is paired with Chloe. The server cannot know what you meant. So join a foreign key to the key it references, and spot-check a few rows against what you expect. The limitation of the inner join is exactly what we saw: anything without a partner is lost, which is what the next section addresses.",
}
