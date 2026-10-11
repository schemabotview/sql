import type { Section } from '../types'

export const processingOrder: Section = {
  id: 'processing-order',
  title: 'Logical query-processing order versus physical execution; incorrect-summary walkthrough',
  scene: 'processing-order',
  slide: `## Processing order and an incorrect summary

A query is **read** in a different order from the way it is **written**.

### Mental model
- Logical order: \`FROM\` → \`WHERE\` → \`GROUP BY\` → \`HAVING\` → \`SELECT\` → \`DISTINCT\` → \`ORDER BY\` → \`LIMIT\`
- That order defines the **result**
- **Physical** execution may differ (chapter 7) but must agree

### Worked example
- \`WHERE sale_price < 40\` fails: the alias is born at step **5**
- Repeat the expression in \`WHERE\`; \`ORDER BY\` may use the alias
- "Customers: **9**" is right as rows, wrong as **people**: **8**

### Misconception
- "The database runs it as I wrote it"

### Explanation summary
- Check the **grain** before trusting a summary`,
  narration:
    "A query is read in a different order from the order in which it is written, and that logical order defines the result. It runs from, then where, group by, having, select, distinct, order by, and finally limit. The engine is free to execute the query physically in another order, which chapter seven explores, as long as the result is the same as the logical order would give. That one picture explains many errors. In the first card, we filter on sale price, an alias created in select. Where is step two and select is step five, so the alias does not exist yet, and PostgreSQL says the column does not exist. The second card repeats the expression in where, which works, and order by may use the alias because it comes after select. The third card is an incorrect summary. A report says there are nine customers. As a count of rows, that is correct. As a count of people, it is wrong, because customers three and nine are the same person recorded twice, so there are eight. Nothing failed; the question was ambiguous. A common misconception is that the database runs the query as written. Before trusting any summary, check its grain. Single-table reports reveal only part of the business story. Next, we connect related records and query results.",
}
