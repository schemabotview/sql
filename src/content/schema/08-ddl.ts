import type { Section } from '../types'

export const ddl: Section = {
  id: 'ddl',
  title: 'DDL: the verbs that build the schema',
  scene: 'ddl-catalog',
  slide: `## DDL: the verbs that build the schema

DDL is how you write this design into the database's **catalog**.

### Create and change structure
- **CREATE TABLE** — name it, list its columns, types and constraints
- **ALTER TABLE** — add or drop a column / constraint as the model evolves
- **DROP TABLE** — remove it entirely · **TRUNCATE** — empty it fast, keep the shell

### Other objects
- **CREATE INDEX** — add an access path · **CREATE VIEW** — save a query as an object

### DDL writes metadata
- Each statement updates the **catalog** — not a single row of data moves
- In Postgres DDL is transactional: a failed migration **rolls back** cleanly
- ⚠ In MySQL and Oracle it auto-commits — there, run DDL as planned migrations`,
  narration:
    'Now we write the design into the database, and the language for that is DDL — data definition language. The workhorse is CREATE TABLE: in one statement you name the table and list its columns, their types, and their constraints — everything we just designed. As the model evolves, ALTER TABLE lets you add or drop a column or a constraint without rebuilding from scratch. DROP TABLE removes a table entirely, structure and data together, while TRUNCATE is the one to reach for when you want to empty a table\'s rows fast but keep its shell and definition intact. Beyond tables, the same family builds the other objects: CREATE INDEX adds a fast access path, CREATE VIEW saves a query as a reusable object, and RENAME relabels a table or column. The thing to understand about every one of these is that DDL writes metadata — each statement updates the catalog, the database\'s own record of its structure. And in PostgreSQL, DDL is transactional, which is a real gift: you can wrap a whole migration in a transaction, and if any step fails, the entire thing rolls back cleanly, leaving your schema exactly as it was. Two of the objects we just created — views and indexes — are worth a closer look before we move on.',
}
