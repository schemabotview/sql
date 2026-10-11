import type { Section } from '../types'

export const nullLogic: Section = {
  id: 'null-logic',
  title: 'NULL predicates and three-valued logic',
  scene: 'null-logic',
  slide: `## NULL predicates and three-valued logic

Logic in SQL has **three** values: true, false, **unknown**.

### Mental model
- A comparison with \`NULL\` is **unknown**, never true
- \`WHERE\` keeps only rows that are **true**
- \`IS NULL\`, \`IS NOT NULL\`, \`IS DISTINCT FROM\` treat \`NULL\` as a value

### Worked example: the truth table
- \`NULL AND false\` → **false**; \`NULL AND true\` → **unknown**
- \`NULL OR true\` → **true**; \`NOT NULL\` → **unknown**
- \`phone <> '+91-…'\` → **7** rows: Elena's \`NULL\` is dropped
- \`IS DISTINCT FROM\` → **8** rows

### Misconception
- "Not equal includes the NULLs" — it does not

### Explanation summary
- If a column can be \`NULL\`, ask what **unknown** does to your \`WHERE\``,
  narration:
    "Logic in SQL has three values: true, false, and unknown. A comparison with null is unknown, never true, and where keeps only rows that are true. The table at the top shows how and and or behave across the three values. And with false is always false, even when the other side is unknown, because no value could make it true. Or with true is always true. Anything else involving unknown stays unknown. The first card asks the server to confirm four of those cells, and it agrees. Now the consequence on real data, in the second card. We ask for customers whose phone is not equal to Asha's number. The answer is seven, not eight, because Elena's phone is null, the comparison is unknown, and her row is quietly dropped. Is distinct from treats null as an ordinary value, and returns eight. A common misconception is that not equal includes the nulls. It does not. So whenever a column can be null, ask yourself what unknown does to your where clause. Chapter one introduced is null; here is the full reason it exists.",
}
