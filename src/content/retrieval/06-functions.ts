import type { Section } from '../types'

export const functions: Section = {
  id: 'functions',
  title: 'String, numeric, and date/time functions',
  scene: 'functions',
  slide: `## String, numeric, and date/time functions

A function takes values and returns a value, row by row.

### Mental model
- **Text**: \`upper\`, \`length\`, \`left\`, \`||\` to join
- **Numbers**: \`round\`, \`ceil\`, \`floor\`, \`abs\`
- **Dates**: \`date + n\` is a date; \`date - date\` is **days**

### Worked example
- Asha's email: **20** characters, handle **asha.rao**
- \`round(29.90 * 1.18, 1)\` → **35.3**; \`ceil\` → **30**
- Order 1 plus 7 days → **2025-03-08**
- 1 to 12 March → **11** days

### Misconception
- "Function names are standard" — many differ between products
- These are PostgreSQL's: check the docs for yours

### Explanation summary
- Know what **type** a function returns`,
  narration:
    "A function takes values and returns a value, row by row, and there are three families worth knowing first. Text functions include upper, length, left, and the double bar to join strings. In the first card, Asha's email has twenty characters, and by taking everything left of the at sign we extract the handle, asha dot rao, while the double bar builds the full name. Numeric functions include round, ceiling, floor and absolute value. Rounding twenty-nine ninety times one point one eight to one place gives thirty-five point three. Date functions are where care matters most. A date plus an integer is a date that many days later, so order one plus seven days is the eighth of March. Extract pulls out a part, such as the month. And subtracting one date from another gives a plain number of days: the twelfth minus the first is eleven. A common misconception is that function names are standard across products. Many are not, and date arithmetic especially varies. These are PostgreSQL's, so check the documentation for the product you use. And always know what type a function returns.",
}
