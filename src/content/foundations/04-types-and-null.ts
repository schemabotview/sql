import type { Section } from '../types'

export const typesAndNull: Section = {
  id: 'types-and-null',
  title: 'Data types, missing information, and NULL',
  scene: 'types-and-null',
  slide: `## Data types, missing information, and NULL

Every column has **one type**; every cell may hold **no value**.

### Mental model
- A type is a promise about **every** value in the column
- \`'abc'\` is **refused** by an \`integer\` column
- \`NULL\` means **unknown** — not zero, not blank

### Worked example: Elena's phone
- \`phone IS NULL\` → **1 row**: Elena
- \`phone = NULL\` → **0 rows**, and no error
- \`count(*)\` = **9**, \`count(phone)\` = **8**

### Misconception
- "\`NULL = NULL\` is true" — it is \`NULL\`; \`WHERE\` keeps only **true**

### Explanation summary
- Use \`IS NULL\`; chapter 4 gives the full logic`,
  narration:
    "Every column in a table has one type, and the type is a promise about every value that column will ever hold. The table at the top of the board shows five everyday types, each taken from a real column in our shop: integer for whole numbers, numeric for exact decimals such as prices, text for strings, date for calendar days, and boolean for true or false. If you try to put the word abc into an integer column, the database refuses it. Now the idea that trips up almost everyone: null. Null does not mean zero and it does not mean blank. It means the value is unknown or missing. Elena has no phone number on file, so her phone cell is null. Look at the three cards. Asking where phone is null finds Elena. Asking where phone equals null returns nothing at all, and raises no error, because comparing anything with null gives unknown, not true, and where only keeps rows that are true. And counting shows the same effect: there are nine customers, but count of phone says eight, because aggregate functions skip nulls. A common misconception is that null equals null is true. It is not; it is itself null. So always use is null, and its opposite, is not null. This is only the first look. Chapter four returns to null with the full three-valued logic.",
}
