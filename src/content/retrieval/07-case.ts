import type { Section } from '../types'

export const caseExpressions: Section = {
  id: 'case',
  title: 'Conditional expressions with CASE',
  scene: 'case-expressions',
  slide: `## Conditional expressions with CASE

\`CASE\` returns a value that depends on a condition.

### Mental model
- \`CASE WHEN … THEN … ELSE … END\`
- Branches are tested **in order**; the **first true one wins**
- No \`ELSE\` and no match → \`NULL\`

### Worked example
- Price tiers: **budget** under 30, **mid** under 100, else **premium**
- Reorder the branches and 29.90 becomes **mid**, not budget
- \`coalesce(phone, 'no phone')\` replaces a \`NULL\` with a fallback

### Misconception
- "CASE branches are independent" — **order** is part of the meaning

### Explanation summary
- Put the **narrowest** condition first; always add an \`ELSE\``,
  narration:
    "Case lets a query return a value that depends on a condition. You write when, then, optionally else, and end. The branches are tested in order, and the first true one wins. If nothing matches and there is no else, the result is null. The first card sorts five products into price tiers: budget under thirty, mid under a hundred, premium otherwise. Wireless earbuds and the desk lamp are mid, the headphones and laptop are premium, and the SQL book at twenty-nine ninety is budget. Now the second card, where the same branches are reordered. When under a hundred comes first, the SQL book matches it and is labelled mid. The budget branch can never be reached. A common misconception is that the branches are independent. They are not: the order is part of the meaning. So put the narrowest condition first and always include an else. The third card shows coalesce, a related tool that substitutes a fallback for a null. Elena has no phone, so she shows as no phone. Case is also how you build date and range buckets, and we will use it again when we summarise.",
}
