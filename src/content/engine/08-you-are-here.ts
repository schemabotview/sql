import type { Section } from '../types'

export const youAreHere: Section = {
  id: 'you-are-here',
  title: 'You are here',
  scene: 'engine-recap',
  slide: `## You are here

Back on the map: this course lit the **foundation** — **Storage**, where every row physically lives — and with it, the whole map is covered.

### What you can now do
- Read the **planner**'s choices with \`EXPLAIN\` — the core tuning skill
- Reason about **storage** (pages, tuples, the heap, the WAL) and why scans cost what they do
- Speed lookups with **B-tree indexes**, and know **when** the planner will actually use one
- Explain **MVCC** — the versions & snapshots behind concurrency and isolation

### The whole map, across four courses
- **Design** (DDL · Catalog) → **Read** (pipeline · sets) → **Change** (transactions · DCL) → **Tune** (storage · the engine)
- Every region is now lit — you understand SQL from the query down to the disk

One course remains, and it's different: a **capstone** that uses all of this on one real project.`,
  narration:
    'Let\'s return to the map a final time. The last dark region, storage, is now lit — and with it, look at the whole picture: every region of the map is bright. Over four courses you\'ve covered all of SQL, from the surface language down to the physical disk. In this course specifically, you learned to go under the hood. You can now read what the planner decided using EXPLAIN, which is the single most valuable tuning skill there is. You understand storage — that rows live as tuples inside eight-kilobyte pages in an unordered heap, with a write-ahead log for durability — and so you understand why a sequential scan costs what it does. You know how a B-tree index turns a scan into a handful of hops, and, just as importantly, when the planner will actually choose to use one and when it won\'t. And you can explain MVCC — the versions and snapshots that let many transactions read and write at once, the very machinery underneath the isolation levels from before. Step back and trace the arc of the whole series. You started by designing a database — DDL and the catalog. You learned to read it — the query pipeline and set operations. You learned to change it safely — transactions, access control, and server-side logic. And now you\'ve learned to tune it — storage and the engine. Design, read, change, tune: the entire lifecycle, the entire map. There\'s one course left, and it\'s a different kind of course. Instead of teaching a new region, it takes everything you now know and puts it to work on a single, real project, end to end — the capstone.',
}
