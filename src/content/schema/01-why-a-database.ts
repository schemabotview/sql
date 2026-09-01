import type { Section } from '../types'

export const whyADatabase: Section = {
  id: 'why-a-database',
  title: 'Why a database?',
  scene: 'file-vs-database',
  slide: `## Why a database?

Before the syntax, the *why*. One flat file — every order a row, the customer copied in beside it — is **fine at first**. It stops being fine the moment the data grows, or a second person touches it.

### What a database gives you that a file can't
- **Structured storage** — tables related by **keys**, so each fact is stored *once*
- **Integrity** — constraints and **ACID** transactions reject bad data before it lands
- **Concurrent access** — many readers and writers at once, kept safe by locking
- **Fast at scale** — **indexes** find rows in millions without scanning the file
- **Security** — \`GRANT\` / \`REVOKE\` control who reads or changes what
- **Reliability** — a write-ahead log and crash recovery survive a failure mid-write

### The through-line
- Each of those six is a whole topic — and each becomes a course in this series`,
  narration:
    'Before we learn any SQL, let\'s answer the question underneath it: why do we even need a database at all? Picture running a business out of one big spreadsheet — every order is a row, and the customer\'s name, city, and email are copied in right beside each order. Here\'s the honest part: that\'s completely fine at first. A flat file is simple, and for a little bit of data that one person touches, it might be all you ever need. It stops being fine the moment the data grows, or more than one person starts touching it — and that\'s exactly when a real database earns its place. A database gives you six things a plain file just can\'t. First, structured storage: your data lives in tables related by keys, so each fact is stored once instead of copied onto every row. Second, integrity: constraints, foreign keys, and all-or-nothing ACID transactions reject bad or orphaned data before it ever lands. Third, concurrent access: many people and programs can read and write at the same time, and the database keeps that safe with transactions and locking, instead of two writers silently clobbering each other. Fourth, speed at scale: indexes let it find the rows you want out of millions without scanning the whole file line by line. Fifth, security: you can grant and revoke exactly who is allowed to read or change what, right down to a single table, row, or column. And sixth, reliability: a write-ahead log, backups, and crash recovery mean a failure in the middle of a write doesn\'t cost you your data. Notice that every one of these is a whole topic in its own right — and each one becomes a course in this series. So that single shift, from a loose file to a system that actually enforces all of this, is what we\'re going to build, piece by piece. Let\'s start with the shape of the language that makes it possible.',
}
