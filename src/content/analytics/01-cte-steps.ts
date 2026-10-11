import type { Section } from '../types'

export const cteSteps: Section = {
  id: 'cte-steps',
  title: 'Structure multi-step queries with CTEs',
  scene: 'cte-steps',
  slide: `## Multi-step queries with CTEs

A **CTE** (\`WITH name AS (…)\`) gives an intermediate result a name.

### Mental model
- Each stage is a small query; the next stage reads the previous one
- The query reads **top to bottom**, like a recipe
- A CTE is a **named step**, not a stored table

### Worked example
- \`line_totals\`: **11** rows, one per order
- \`live\`: **10** rows (cancelled order 8 dropped)
- Final stage: customers over 500 → **2 and 4**

### Misconception
- "A CTE makes the query faster" — it makes it **clearer**; speed is chapter 7

### Explanation summary
- Name each step by the **grain** it produces`,
  narration:
    "Real questions rarely fit one select. A common table expression, written with, gives an intermediate result a name, so the query reads top to bottom like a recipe. The board shows three stages. Line totals has one row per order, eleven rows. Live keeps the orders that are not cancelled, which drops order eight and leaves ten. The final stage groups by customer and keeps those who spent more than five hundred: customers two and four, each with two orders. Each stage is a small query that reads only the stage before it, so you can run any stage alone to check it, and name it after the grain it produces. The assumption is that every stage returns what its name says. A common misconception is that a CTE makes a query faster. It makes it clearer; whether it is faster is a performance question that chapter seven examines with evidence. A CTE is a named step in one statement, not a saved table, and it disappears when the statement ends.",
}
