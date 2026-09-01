import type { Section } from '../types'

export const constraints: Section = {
  id: 'constraints',
  title: 'Constraints: rules the DB enforces',
  scene: 'constraint-set',
  slide: `## Constraints: rules the DB enforces

Constraints are business rules you hand to the database to enforce for you — every time, forever.

### The core rules
- **NOT NULL** — the value is required · **UNIQUE** — no duplicates (e.g. \`email\`)
- **CHECK** — a condition every row must satisfy (\`total > 0\`)
- **DEFAULT** — a value filled in when you don't supply one

### Keys are constraints too
- **PRIMARY KEY** = UNIQUE + NOT NULL · **FOREIGN KEY** = must match a parent row

### Why push rules into the schema
- Enforced once, centrally — every app and query gets the **same** guarantee
- Application code can only check what *it* writes; the schema catches everything
- Bad data is rejected **at the door**, not discovered months later`,
  narration:
    'Constraints are how you hand your business rules to the database and let it enforce them for you, on every single write, forever. The core ones are simple. NOT NULL means a column is required — you can\'t leave it blank. UNIQUE means no two rows can share that value; we put it on email so two customers can\'t register the same address. CHECK lets you write an actual condition every row must satisfy — like total must be greater than zero, so a negative order is impossible. And DEFAULT supplies a value automatically when you don\'t provide one, which is how created_at can fill itself in with the current time. Here\'s the nice part: the keys you just met are really constraints too. A primary key is just UNIQUE plus NOT NULL bundled together, and a foreign key is a constraint that says this value must match a real parent row. Why push all of this down into the schema instead of checking it in your application code? Because it\'s enforced once, in one place — so every application, every query, every developer gets exactly the same guarantee, and bad data is turned away at the door rather than discovered months later when a report breaks. With the shape of our data defined and the rules locked in, we\'re ready to write the DDL that actually creates it all.',
}
