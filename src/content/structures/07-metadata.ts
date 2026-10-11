import type { Section } from '../types'

export const metadata: Section = {
  id: 'metadata',
  title: 'Read schema metadata: information_schema and database-specific catalogues',
  scene: 'metadata-queries',
  slide: `## Reading schema metadata

The database **describes itself**, in tables you can query.

### Mental model
- \`information_schema\` — the **SQL-standard** view
- Behind it, a **product-specific** catalogue: \`pg_catalog\`
- The questions are ordinary \`SELECT\`s

### Worked example: three questions
- Which tables? **8**, with 3 to 8 columns
- Which columns? Only \`orders.employee_id\` may be \`NULL\`
- Which keys? \`orders_pkey\` and two \`_fkey\`s — the names in errors

### Misconception
- "Metadata needs a separate tool" — it is **data**
- Another product's catalogue differs: read **its** docs

### Explanation summary
- Metadata turns a schema from something you **assume** into something you **read**`,
  narration:
    "A database can describe itself, and it does so in tables that you can query like any other. The SQL standard defines a set of views for this called information schema. Behind them sits a catalogue, the system's own tables, and that part is specific to each product: in PostgreSQL it is called pg catalog. Another product's catalogue will differ, so read its documentation before relying on it. The three cards on the board ask three ordinary questions. First, which tables are there? The answer is eight tables, with between three and eight columns each. Second, which columns does the orders table have, and may they be null? Only employee I D may be null, which matches the business rule that online orders have no sales rep. Third, which keys does orders have? One primary key, and two foreign keys, and notice that their names are exactly the names that appeared in the error messages in the last two sections. That is why metadata matters: it lets you read an unfamiliar schema before writing a query against it, and check that a constraint you expect really exists. A common misconception is that metadata needs a separate tool. It is just data, and you query it with SQL. If you follow along, running these queries is optional, and the answers are on the board.",
}
