import type { Section } from '../types'

export const schemas: Section = {
  id: 'schemas',
  title: 'Organise databases and schemas',
  scene: 'schema-hierarchy',
  slide: `## Organising databases and schemas

Every table lives **inside** something.

### Mental model
- A **server** runs many **databases**; you connect to **one**
- A **database** holds **schemas**; a schema holds **tables**
- \`CREATE DATABASE\` cannot run in a transaction; \`CREATE SCHEMA\` can

### Worked example: which \`customers\`?
- \`shop.customers\` and \`staging.customers\` can coexist
- Unqualified names follow \`search_path\`: first match wins
- With \`staging\` first, \`count(*)\` = **0**

### Misconception
- "A schema is a separate database" — a query can span schemas, **not** databases

### Explanation summary
- Schemas separate **names**; databases separate **everything**`,
  narration:
    "Every table lives inside something, and two levels of containment do the organising. A PostgreSQL server can run many databases, and when you connect, you connect to exactly one of them. Inside a database there are schemas, and a schema is a named folder that holds tables. The drawing shows our shop schema with its tables, and a second schema, staging, that has its own table also called customers. Two tables with the same name can coexist because they live in different schemas. Creating a database uses create database, which cannot run inside a transaction. Creating a schema is just create schema, and that can be rolled back. Now the practical question: when you write select from customers, which one do you get? An unqualified name is looked up along the search path, in order, and the first schema with a match wins. On the right, we put staging first, and the count comes back zero, because the empty staging table shadows the real one. That is the kind of surprise to avoid, so qualify names in any script you share. A common misconception is that a schema is a separate database. One query can use many schemas, but it cannot reach into another database: PostgreSQL says cross-database references are not implemented. So schemas separate names, while databases separate everything.",
}
