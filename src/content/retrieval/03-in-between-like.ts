import type { Section } from '../types'

export const inBetweenLike: Section = {
  id: 'in-between-like',
  title: 'IN, BETWEEN, and LIKE',
  scene: 'in-between-like',
  slide: `## IN, BETWEEN, and LIKE

Three shorthands for conditions you could write longhand.

### Mental model
- \`IN (…)\` — equal to **one of** a list
- \`BETWEEN a AND b\` — **inclusive** at both ends
- \`LIKE\` — pattern: \`%\` any text, \`_\` one character

### Worked example
- \`city IN ('London','Lyon','Milan')\` → **4** customers
- \`price BETWEEN 29.90 AND 44.00\` → **4** rows, **both ends** included
- \`LIKE 'c%'\` → **2** emails; \`LIKE 'C%'\` → **0**

### Misconception
- "\`BETWEEN\` excludes the ends" — it includes them
- "\`LIKE\` ignores case" — here it does **not**; no error says so

### Explanation summary
- Each shorthand has a precise boundary: read it`,
  narration:
    "In, between and like are three shorthands for conditions you could write out longhand. In means equal to one of a list. The first card asks for customers in London, Lyon or Milan and finds four, with Lyon appearing twice because two customers live there. Between means within a range, and it is inclusive at both ends. The second card asks for prices between twenty-nine ninety and forty-four, and the result contains the book at exactly twenty-nine ninety and the other at exactly forty-four. A common misconception is that between excludes its ends; it includes them. Like matches patterns: percent stands for any text, and underscore for a single character. The third card shows that like is case sensitive in PostgreSQL. The pattern lowercase c percent finds two email addresses, while uppercase C percent finds none, and no error tells you so. You simply get an empty result. Pattern matching rules differ between products, so check the documentation of the one you use. The lesson is that each shorthand has a precise boundary, and reading that boundary carefully is what keeps a query honest.",
}
