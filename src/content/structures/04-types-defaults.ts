import type { Section } from '../types'

export const typesDefaults: Section = {
  id: 'types-defaults',
  title: 'Table definitions, type choices, precision, defaults, and generated values',
  scene: 'types-defaults',
  slide: `## Table definitions, types, and defaults

A definition: a **name**, then columns — each a **name** and a **type**.

### Mental model
- Choose the **narrowest type that is always true**
- \`numeric(8,2)\` — exact; 8 digits, 2 after the point
- A **default** fills a column left out; none means \`NULL\`
- \`GENERATED ALWAYS AS IDENTITY\` numbers rows for you

### Worked example: wishlist
- An \`INSERT\` naming two columns stores **six** values
- \`12.345\` is stored as **12.35**; \`1234567.891\` is **refused**
- \`0.1 + 0.2 = 0.3\`: **true** for \`numeric\`, **false** for floats

### Misconception
- "Floats are fine for money" — binary approximations

### Explanation summary
- The type says what is **always** true; the default states the **usual** case`,
  narration:
    "A table definition is a name followed by a list of columns, and each column is a name and a type. The type is a promise about every value in the column, so choose the narrowest type that is always true. Numeric with two numbers, precision and scale, is an exact decimal: numeric eight comma two holds eight digits in all, two of them after the point. A default fills in a column you leave out of an insert, and a column with no default becomes null. And an identity column lets the database number the rows for you. The dictionary at the top describes a wishlist table, which records which customer wants which product, a small extension to our shop. The first card creates it and inserts a row naming only two columns. The result shows six values stored: priority and the gift flag from their defaults, and the note as null. The second card shows precision at work. Twelve point three four five stored in numeric eight two is rounded to twelve thirty-five. A number too large for the declared precision is refused with numeric field overflow. And the comparison explains why money must not be a floating point number: zero point one plus zero point two equals zero point three is true for numeric and false for floating point, because floats are binary approximations. The last card shows an identity column assigning ids one and two. The full catalogue of types is out of scope here.",
}
