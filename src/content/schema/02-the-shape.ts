import type { Section } from '../types'

export const theShape: Section = {
  id: 'the-shape',
  title: 'The shape of SQL',
  scene: 'sql-landscape',
  slide: `## The shape of SQL

SQL is one language with **five sub-tongues**, spoken over a **catalog** of metadata and a **store** of data.

### The five sub-languages
- **DDL** — define: \`CREATE\` \`ALTER\` \`DROP\` \`TRUNCATE\`
- **DQL** — read: \`SELECT\` · **DML** — change rows: \`INSERT\` \`UPDATE\` \`DELETE\`
- **TCL** — wrap it: \`COMMIT\` \`ROLLBACK\` \`SAVEPOINT\` · **DCL** — control: \`GRANT\` \`REVOKE\`

### What all five act on
- **Catalog** — the database's record of itself: schemas, tables, constraints, views
- **Storage** — the data: tablespaces, pages, rows, the write-ahead log

Define it · query it · change it · wrap it · control it. This course is the first of those.`,
  narration:
    'Before we write a single query, here\'s the whole of SQL on one map. It looks like a lot, but it\'s really one language with five sub-tongues. You use DDL to define structure — creating and altering tables. You use DQL, the SELECT statement, to query data back out. You use DML — insert, update, delete — to change data. Those changes are wrapped in transactions, which is TCL: begin, commit, rollback. And you control who can do any of it with DCL: grant and revoke. All five act on two things underneath. The catalog is the metadata — the databases, schemas, tables, constraints, and views the database keeps about itself. And storage is the data itself, living in tablespaces, pages, and rows, with a write-ahead log for durability. Around the edges sit the machinery: the query pipeline, where every SELECT runs in one fixed logical order; the programmatic layer of stored procedures, functions, and triggers; and set operations that combine query results. We\'ll tour all of it across five courses — and this first one is the top-left corner: how you design a database, and what the catalog records when you do.',
}
