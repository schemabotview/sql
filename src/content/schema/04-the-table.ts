import type { Section } from '../types'

export const theTable: Section = {
  id: 'the-table',
  title: 'Anatomy of a table',
  scene: 'table-anatomy',
  slide: `## Anatomy of a table

Zoom into one table — \`customers\` — and meet its parts.

### Columns and types
- Each **column** has a name and a **data type** the database enforces
- \`id\` bigint · \`name\` text · \`email\` text · \`created_at\` timestamptz

### Rows
- A **row** is one record, with a value for every column
- The database **rejects** a row whose values don't fit the column types

### The type is a contract
- It decides what's storable, how values compare, and how much space they take
- Pick the **narrowest type that fits** — it guards the data and speeds up scans
- Money is \`decimal\`, never a float — binary rounding makes \`0.1 + 0.2 ≠ 0.30\``,
  narration:
    'Let\'s zoom into a single table, customers, and take it apart. Reading across the top, a table is defined by its columns — and every column has two things: a name, and a data type. Here id is a bigint, name and email are text, and created_at is a timestamp with time zone. That type isn\'t decoration; it\'s a contract the database enforces. Reading down, each row is one record — one actual customer — carrying a value for every column. If you try to insert a row whose values don\'t match the declared types — a word where a number belongs — the database refuses it outright. That\'s the quiet power of types: they decide what can be stored, how two values compare to each other, and even how much space each value takes on disk. A good rule is to pick the narrowest type that comfortably fits your data — it both protects the data from bad values and makes scans faster, because there\'s less to read. A single well-defined table is already useful — but the real power of the relational model shows up the moment two tables connect.',
}
