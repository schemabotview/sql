import type { Section } from '../types'

export const scans: Section = {
  id: 'scans',
  title: 'Seq Scan vs Index Scan',
  scene: 'scan-choice',
  slide: `## Seq Scan vs Index Scan

Having an index doesn't mean using it. The planner **chooses** per query — and sometimes a full scan really is cheaper.

### The choice is about selectivity
- **Selective** query (few rows match) → **Index Scan** — jump to just those rows
- **Unselective** (most rows match) → **Seq Scan** — reading every page in order beats thousands of random look-ups

### Why an index scan isn't free
- Each match means a hop to the heap for the row — **random I/O**, costly at volume
- A **Bitmap** scan is the middle ground; an **index-only** scan skips the heap entirely

### "I added an index but it's not used!"
- Usually the query isn't **selective** enough — or **statistics are stale** (\`ANALYZE\`)
- The optimizer is doing its job: below a threshold, the scan is genuinely faster`,
  narration:
    'Here\'s a fact that surprises people: just because a table has an index doesn\'t mean a query will use it. The planner decides, per query, whether to do an index scan or a sequential scan — and sometimes scanning the entire table is genuinely the faster choice. The deciding factor is selectivity: how many rows your query actually matches. If it\'s very selective — you want customer forty-two, one row out of a million — the index scan is a huge win: descend the B-tree, grab that row, done. But if your query matches most of the table — say, all orders from the last two years out of three years of data — then an index scan is actually the wrong tool, because of a subtle cost. Each row an index finds requires a separate hop back to the heap to fetch the actual data, and those hops are random I/O, scattered all over the disk. Do that for millions of rows and it\'s slower than just reading every page of the table in one smooth sequential sweep — which is exactly what a seq scan does. So above a certain fraction of the table, the sequential scan wins, and the optimizer knows it. This is the answer to one of the most common complaints in SQL: I added an index but the database isn\'t using it. Almost always, it\'s because the query isn\'t selective enough to justify the index — or the statistics are stale and the optimizer is mis-estimating how many rows match, which a quick ANALYZE fixes. The planner isn\'t being stubborn; it\'s picking the genuinely cheaper plan. That\'s the read path understood and tunable. There\'s one last mechanism that makes all of this work while many users read and write at once — MVCC. Let\'s look at it.',
}
