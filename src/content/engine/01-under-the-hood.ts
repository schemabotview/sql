import type { Section } from '../types'

export const underTheHood: Section = {
  id: 'under-the-hood',
  title: 'What happens when you run a query',
  scene: 'query-journey',
  slide: `## What happens when you run a query

You've designed, read, and changed data. Now: what does the database *actually do* when you hit run — and how do you make it fast?

### The journey of a query
- **The planner** turns your SQL into an **execution plan** — choosing *how* to get the rows
- **\`EXPLAIN\`** shows you that plan — the single most useful tuning tool

### Where the rows live
- **Storage** — tablespaces → heap files → 8 KB **pages** → **tuples** (rows), with a **WAL** for durability
- **Access methods** — read every page (**Seq Scan**) or jump via an **index** (**Index Scan**)

### The two big mechanisms
- **Indexes** (B-trees) make lookups fast — the heart of tuning
- **MVCC** lets readers and writers run concurrently without blocking

Understand these and "why is this query slow?" becomes a question you can answer.`,
  narration:
    'You can now design a database, read from it, and change it safely. This course answers the next question: when you actually run a query, what does the database do with it — and just as importantly, how do you make it fast? Here\'s the whole journey on one map. It starts at the top with the planner. You hand the database a SELECT, and it doesn\'t just blindly execute it — it first turns your query into an execution plan, deciding how to fetch the rows: which order to join tables, whether to use an index or scan the whole table. And the tool that lets you see the plan it chose is EXPLAIN, which is, without exaggeration, the single most useful thing to learn for making queries fast. Below that is where the data physically lives: storage. Your rows sit in files organized into fixed-size eight-kilobyte pages, each row stored as a tuple, with a write-ahead log guarding durability. To read those rows, the executor uses an access method — either a sequential scan that reads every page, or an index scan that jumps straight to what it needs. Which brings us to the two big mechanisms this course zooms into. Indexes, built as B-trees, are what make lookups fast, and they\'re the heart of tuning. And MVCC — multi-version concurrency control — is the clever trick that lets many transactions read and write at the same time without waiting on each other. Master these, and why is this query slow stops being a mystery and becomes a question you can actually answer. Let\'s start where the query does: the planner.',
}
