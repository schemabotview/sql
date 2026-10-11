import type { Section } from '../types'

export const arithmeticCasts: Section = {
  id: 'arithmetic-casts',
  title: 'Arithmetic expressions and type conversions',
  scene: 'arithmetic-casts',
  slide: `## Arithmetic expressions and type conversions

Expressions compute **per row**; **types** decide the answer.

### Mental model
- \`+ - * / %\` on columns and literals
- \`/\` on two integers **truncates**
- \`CAST(x AS type)\` or \`x::type\` converts **explicitly**

### Worked example
- \`round(price * 1.18, 2)\` → **69.62**, **35.28**
- \`7 / 2\` → **3**; \`7 / 2.0\` → **3.5000000000000000**
- \`'2025-03-01'::date + 30\` → **2025-03-31**
- \`'abc'::integer\` → *invalid input syntax*

### Misconception
- "Dividing two whole numbers gives a fraction" — it does not

### Explanation summary
- Know the **types** on both sides of every operator`,
  narration:
    "Expressions compute a value for each row, and the types involved decide the answer. You can use plus, minus, times, divide and remainder on columns and literals. The first card adds eighteen percent to two real prices and rounds to two places, so money stays at two decimals: sixty-nine sixty-two and thirty-five twenty-eight. The second card is the classic trap. Seven divided by two is three, not three and a half, because dividing two whole numbers truncates. Make one side exact, as in seven divided by two point zero, and you get three point five. A common misconception is that dividing integers gives a fraction. The third card converts explicitly. Cast turns the text twelve into a number, and double colon turns a text into a date, so adding thirty days gives the thirty-first of March. The last card shows a conversion that cannot succeed. Turning abc into an integer is an error, not a guess, and that is a good thing: you find out immediately. The habit to build is to know the type on both sides of every operator. Conversion rules differ between products, so these are PostgreSQL's.",
}
