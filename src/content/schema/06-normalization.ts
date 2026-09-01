import type { Section } from '../types'

export const normalization: Section = {
  id: 'normalization',
  title: 'Normalization',
  scene: 'normal-forms',
  slide: `## Normalization

Normalization removes the **§1 pains** *by construction* — you split tables until every fact lives in exactly **one** place.

> *The key, the whole key, and nothing but the key.*

### The forms, each fixing one flaw
- **1NF** — **atomic cells**: no repeating groups (split \`Pen, Pencil\` into rows)
- **2NF** — **the whole key**: no attribute depends on *part* of a composite key
- **3NF** — **nothing but the key**: no non-key depends on another non-key (\`city\` on \`zip\`)
- **BCNF** — the strict finish: *every* determinant must be a candidate key

### Why bother
- Each fact stored once → no duplication, no update anomaly, no drift
- The shape enforces integrity; the database does the bookkeeping, not you`,
  narration:
    'Remember the flat spreadsheet from the very start, and all the pain it caused — the same customer copied on every row, drifting out of sync? Normalization is the discipline that removes that pain systematically, and it\'s the reason the relational model works. The idea is simple: keep splitting your tables until every single fact is stored in exactly one place. There are four levels, and each one fixes a specific flaw. First normal form just says every cell must hold one atomic value — no lists jammed into a field. Look at orders_raw: the products column holds Pen, Pencil in a single cell. First normal form splits that into separate rows. Second normal form says no column may depend on only part of a composite key. Once we\'re keying line items by order plus product, the customer\'s name clearly depends on the order alone, not the product — a partial dependency — so we pull the customer out into its own table. Third normal form says no non-key column may depend on another non-key column. Here city depends on zip, which isn\'t a key — a transitive dependency — so zip and city move into their own little lookup table. There\'s a mnemonic that captures the first three perfectly: every non-key column must depend on the key, the whole key, and nothing but the key. Boyce-Codd normal form is the strict finish: it demands that every determinant — anything that decides another column\'s value — must itself be a candidate key. It only differs from third normal form in tricky cases with overlapping candidate keys, but the spirit is the same. And here\'s the payoff: apply these forms to that one messy sheet and you don\'t get something abstract — you get exactly the customers, orders, and related tables we\'ve been designing all along. Normalization isn\'t extra theory; it\'s the reason the shape is the shape.',
}
