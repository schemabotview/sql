import type { Section } from '../types'

export const programmatic: Section = {
  id: 'programmatic',
  title: 'Programmatic SQL: logic in the database',
  scene: 'server-side-logic',
  slide: `## Programmatic SQL

SQL isn't only single statements — you can store **logic** in the database and run it server-side.

### Procedures & functions
- A **function** takes inputs and **returns a value** — callable inside a query
- A **procedure** performs actions (writes, \`COMMIT\`) and is run with \`CALL\` — no return
- Written in a procedural dialect (Postgres: **PL/pgSQL**) — variables, \`IF\`, loops

### Triggers — logic that fires on a write
- Attach code to a table: run it **\`BEFORE\`/\`AFTER\` \`INSERT\`/\`UPDATE\`/\`DELETE\`**, automatically
- The classic use: an **audit log** row on every change, or enforcing a complex rule

### Cursors — row-by-row
- Walk a result **one row at a time** when set-based SQL genuinely can't express the job
- A last resort — SQL is fastest when it works on **whole sets**

That completes the write machinery.`,
  narration:
    'The last part of the map is that SQL doesn\'t have to live in your application — you can store logic inside the database and run it right next to the data. It comes in a few forms. A function takes some inputs and returns a value, which means you can call it from inside a query, wherever an expression would go — a custom calculation you reuse everywhere. A procedure is different: it performs actions rather than returning a value — it can run writes, manage transactions, commit — and you invoke it with the CALL keyword. Both are written in a procedural dialect that adds real programming to SQL — in Postgres it\'s PL/pgSQL, with variables, IF statements, and loops. Then there are triggers, which are the most distinctive, because you don\'t call them at all — they fire automatically. You attach a trigger to a table and say when: before or after an INSERT, UPDATE, or DELETE. The moment a matching write happens, your code runs. The classic example is an audit log — every time a row changes, a trigger quietly writes a record of what changed, when, and by whom, without the application having to remember to. Triggers can also enforce complex rules that a simple CHECK constraint can\'t express. And finally, cursors, which let you walk through a result set one row at a time. This is the tool of last resort: SQL is at its best and fastest when it operates on whole sets at once, so you reach for a cursor only when a job genuinely can\'t be expressed that way. And that completes the machinery for changing data safely. Let\'s zoom back out to the map and see everything this course has covered.',
}
