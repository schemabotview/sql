import type { Section } from '../types'

export const clientServerTour: Section = {
  id: 'client-server-tour',
  title: 'Client/server interaction, dialects, and an annotated shop-database tour',
  scene: 'client-server-tour',
  slide: `## Client, server, dialects, and a tour

SQL is a **conversation**: a client asks, a server answers.

### Mental model
- The **client** sends statement **text**
- The **server** parses, plans, executes, returns rows and a **tag**
- A **dialect** is one product's version of SQL

### Worked example: two spellings
- \`LIMIT 3\` and \`FETCH FIRST 3 ROWS ONLY\`: both accepted here
- Other products may accept one: read **their** docs
- \`ORDER BY\` decides *which* 3 rows

### Annotated tour
- **9** customers · **10** products · **11** orders · **16** lines
- Four more tables join as needed; running these is optional

### Misconception
- "My computer ran the query" — the **server** did`,
  narration:
    "SQL is a conversation, and it helps to be clear about who is speaking. The client, which might be psql, an application, or a notebook, sends the text of a statement. The server, here PostgreSQL, parses that text, plans how to answer it, executes the plan, and sends back rows together with a command tag. The server does the work; the client only shows the result. That answers a common misconception: your computer did not run the query, the server did. Next, dialects. SQL is a standard, but each product speaks its own version of it. On the board, the same request, give me three customers, is written two ways. Limit three is PostgreSQL's spelling, and fetch first three rows only is the standard one, and PostgreSQL accepts both. Other products may accept only one of them, and the way to find out is to read that product's documentation. Notice that order by decides which three rows come back; without it, no particular three are promised. Finally, an annotated tour of the shop. This one query counts the rows in each of the four core tables: nine customers, ten products, eleven orders and sixteen order lines. Four more tables, categories, employees, payments and reviews, join the story as we need them. If you want to follow along, you can run these queries yourself, but that is entirely optional. We can now describe relational data. Next, we translate business requirements into structures and enforceable rules.",
}
