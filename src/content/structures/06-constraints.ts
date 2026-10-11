import type { Section } from '../types'

export const constraints: Section = {
  id: 'constraints',
  title: 'Enforce relationships and rules with constraints',
  scene: 'constraint-guards',
  slide: `## Relationships and rules as constraints

Constraints keep bad records **out**, whoever is writing.

### Mental model
- **NOT NULL** — required · **FOREIGN KEY** — must exist in the parent
- **CHECK** — must satisfy a rule: \`priority BETWEEN 1 AND 5\`
- Each rejection **names** the rule and the value

### Worked example: six records
- \`(1, 4, 3)\` and \`(3, 5, 1)\` — **accepted**
- Repeated pair · no customer 99 · priority 9 · \`NULL\` customer — each **refused** by one named rule
- \`ON DELETE CASCADE\`: 2 wishes → **0**

### Misconception
- "The application can enforce it" — the database covers **every** writer

### Explanation summary
- To predict a record: test it against **each** rule in turn`,
  narration:
    "Constraints keep bad records out, no matter who or what is writing them. There are three guards on the finished wishlist table. Not null says a column must have a value. A foreign key says the value must exist in the parent table: every customer I D on the wishlist must belong to a real customer. And a check constraint says the value must satisfy a rule, here that priority is between one and five. The table on the board is the exercise to follow with your own reasoning: six candidate records, and for each, will it be accepted? The first two, customer one with product four and customer three with product five, satisfy every rule, so they are accepted. The pair one-four a second time repeats the primary key. Customer ninety-nine has no parent row, so the foreign key refuses it. Priority nine fails the check. And a null customer fails not null. Each is refused by one named rule, and the error says which, so you can read the cause directly. Foreign keys also force a decision about the children. By default, deleting a parent that still has children is refused. With on delete cascade, deleting the parent deletes its children too, and the bottom card shows it: customer seven had two wishes, and after deleting her, none are left. A common misconception is that the application can enforce all this. But then every program, script and person would have to, and the database is the one place that sees every writer.",
}
