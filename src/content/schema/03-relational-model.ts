import type { Section } from '../types'

export const relationalModel: Section = {
  id: 'relational-model',
  title: 'The relational model',
  scene: 'two-tables',
  slide: `## The relational model

A relational database stores everything as **tables** — and the power is in how they *relate*.

### A table is a relation
- **Rows** = records · **Columns** = typed properties, the same on every row
- Row order carries no meaning — a table is a *set*, found by **value, not position**

### Tables relate by keys
- One table points at another by storing its key — here **orders → customers**
- Following those links is what a **join** does, and what *relational* means

### Why model first
- Get the shape right and queries, integrity and speed all follow
- Get it wrong and every query spends its life fighting the schema

*(NoSQL trades this fixed schema for a flexible one — and gives up joins and guarantees.)*`,
  narration:
    'The word relational is the key to all of this, and it\'s simpler than it sounds. A relational database keeps everything in tables. A table is just a grid: each row is one record — one customer, or one order — and each column is an attribute of that record, with a fixed data type. Every row in a table has the exact same shape, and the order of rows means nothing — mathematically, a table is a set of rows, which is why it\'s called a relation. Now here\'s the relational part. Tables don\'t sit alone; they point at each other. Our orders table points at customers by storing a customer\'s key inside each order. That one idea — a value in one table matching a value in another — is the whole game. It\'s how the database keeps a tangle of real-world facts consistent. And it\'s why we design first: get the shape of your tables and their connections right, and querying, integrity, and performance all fall into place; get it wrong, and every query you ever write will be fighting the schema. So before we touch SQL, we lay out the tables and how they link.',
}
