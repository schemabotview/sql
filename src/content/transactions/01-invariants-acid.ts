import type { Section } from '../types'

export const invariantsAcid: Section = {
  id: 'invariants-acid',
  title: 'Business invariants, transaction boundaries, and ACID',
  scene: 'invariants-acid',
  slide: `## Invariants, boundaries, and ACID

An **invariant** is a rule that must hold **every time**.

### Mental model
- "Stock is never negative"; "an order never exists without its lines"
- Constraints guard **one row**; a **transaction** guards **several statements**
- **ACID:** atomic, consistent, isolated, durable

### Worked example
- Order for product 9 (stock **0**): insert order, insert line, **decrement stock**
- Step 3 is refused by \`CHECK (stock >= 0)\`
- Steps 1 and 2 are **undone with it**

### Misconception
- "Each statement is safe, so the sequence is safe" — only the **boundary** makes it all-or-nothing

### Explanation summary
- Name the invariant, then draw the **transaction boundary** around it`,
  narration:
    "A business invariant is a rule that must hold every time, such as stock is never negative, or an order never exists without its lines. A constraint guards one row, while a transaction guards a sequence of statements. The table lists three invariants and what enforces each. Now the example. Placing an order for product nine takes three steps: insert the order, insert its line, and decrement the stock. Product nine has no stock, so the third statement is refused by the check constraint, and the error card shows it. Because the three statements are one transaction, the first two are undone as well. A hidden test confirms that no order twelve remains. The acid table maps the four letters onto this example: atomicity is all or nothing, consistency means the constraints hold before and after, isolation means other sessions never see a half-done order, and durability means committed work survives a crash. We state durability but do not demonstrate it. Each statement being safe does not make the sequence safe; the transaction boundary does.",
}
