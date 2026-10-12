import type { Section } from '../types'

export const parametersBoundaries: Section = {
  id: 'parameters-boundaries',
  title: 'Parameterised query values, identifier boundaries, and appropriate application privileges',
  scene: 'parameters-boundaries',
  slide: `## Parameters, identifiers, application privileges

A **parameter** is data; pasted text becomes **code**.

### Mental model
- Placeholders (\`$1\`) carry **values**, never SQL
- Names (tables, columns) **cannot** be parameters: use an **allowlist** or \`format(%I)\`
- The application role gets **only** what the application needs

### Worked example
- Pasted \`x' OR '1'='1\` → **all 9** customers
- Same text as a parameter → **0** rows
- \`PREPARE bad(text) AS SELECT * FROM $1\` → **syntax error**
- App role: \`INSERT\` works, \`DELETE\` is **refused**

### Misconception
- "Escaping is enough" — **separate** values from code

### Explanation summary
- Parameters for values, allowlists for names, **narrow rights**`,
  narration:
    "Query text built by pasting user input is a security boundary problem. The first card pastes the input x quote or quote one equals quote one into the where clause, and the input becomes code: all nine customers come back. The second card passes the very same text as a parameter of a prepared statement. A normal address finds customer one, and the hostile text is just a value that matches nobody. Prepare and execute is the server-side equivalent of the placeholders that database drivers send. A parameter can only stand for a value. The third card shows that a table name cannot be a parameter, which is a syntax error, so names from outside must be checked against an allowlist or quoted with the format function and its identifier option, as the fourth card shows. Finally, the application should connect with a role that has only the privileges it needs, as a second layer: it may insert an order, but delete is refused. Separate values from code first; narrow privileges limit the damage if something is missed.",
}
