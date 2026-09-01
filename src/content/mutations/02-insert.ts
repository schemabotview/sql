import type { Section } from '../types'

export const insert: Section = {
  id: 'insert',
  title: 'INSERT: adding rows',
  scene: 'insert-forms',
  slide: `## INSERT: adding rows

INSERT puts new rows into a table.

### The basic forms
- \`INSERT INTO t (cols…) VALUES (…)\` — one row, columns named explicitly
- Stack several \`VALUES (…), (…), (…)\` to insert **many rows** in one statement
- \`INSERT INTO t (…) SELECT …\` — insert the **result of a query** (copy / load data)

### Handy extras (Postgres)
- \`RETURNING id\` hands back generated values, like a new serial key, without a second query
- \`ON CONFLICT (col) DO UPDATE …\` — *upsert*: insert, or update the row that clashed

### Constraints still apply
- A row that violates a **type**, \`NOT NULL\`, \`UNIQUE\`, or a **foreign key** is rejected
- Everything course 1 declared is still standing guard on the way in

Rows added — next, changing rows that already exist: \`UPDATE\`.`,
  narration:
    'The first and simplest change is adding data, and that\'s INSERT. In its basic form you write INSERT INTO, name the table and the columns you\'re filling, and then give the VALUES for those columns — one new row. It\'s good practice to always list the columns explicitly, so the statement keeps working even if someone later adds or reorders columns in the table. If you have many rows to add, you don\'t repeat the statement; you just stack multiple parenthesized value lists after VALUES, and they all go in together. And when the data you want to insert already lives somewhere — another table, a query — you can write INSERT INTO followed by a SELECT instead of VALUES, which is how you copy or load rows in bulk. Postgres adds two things worth knowing. RETURNING lets the insert hand you back values it generated, like a new auto-incrementing id, so you don\'t need a second query to find out what key the row got. And ON CONFLICT turns an insert into an upsert: if the new row collides with an existing one on a unique column, instead of failing you can tell it to update that existing row. Through all of this, every constraint we designed back in course one still stands guard — a row with the wrong type, a missing required value, a duplicate where uniqueness is required, or a foreign key pointing at nothing, is simply refused. So that\'s how rows get in. Next, how you change rows that are already there: UPDATE.',
}
