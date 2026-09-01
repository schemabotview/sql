import type { Section } from '../types'

export const storage: Section = {
  id: 'storage',
  title: 'Storage: pages, tuples & the WAL',
  scene: 'storage-hierarchy',
  slide: `## Storage: pages, tuples & the WAL

Under every table is a physical layout — and it explains *why* scans and indexes cost what they do.

### The hierarchy
- **Tablespace** — a location on disk · **Heap file** — a table's rows, in **no particular order**
- **Page** — a fixed **8 KB** block; the database reads and writes **whole pages**, never single rows
- **Tuple** — one row, stored inside a page

### Why it matters for speed
- A **Seq Scan** reads *every page* — fine for small tables, costly for big ones
- The heap is **unordered**, so "find customer 42" means scanning — unless an **index** points the way
- You can never fetch one tuple alone; you fetch the page holding it

### Durability — the WAL
- A change is written to the **write-ahead log** *before* the data pages — that's ACID's **D**

The heap can't find a row fast on its own. The thing that can is an index — a B-tree.`,
  narration:
    'Everything the planner talked about — scans, pages, costs — ultimately comes down to how rows are physically stored, so let\'s look at that layout. It\'s a hierarchy. At the outside is a tablespace, which is really just a location on disk where the database keeps files. Inside, each table is a heap file — and the word heap is important: the rows are stored in no particular order, just piled in wherever there\'s room. That file is divided into pages, each a fixed size, typically eight kilobytes, and this is the crucial unit: the database always reads and writes whole pages, never individual rows. It pulls an entire eight-kilobyte page into memory even if it only wants one row from it. And within a page sit the tuples — a tuple is just the stored form of one row. Now you can see exactly why performance works the way it does. A sequential scan has to read every page of the heap, which is perfectly fine for a small table but expensive for a huge one. And because the heap is unordered, a request like find customer forty-two has no shortcut — the database would have to scan looking for it, page by page, unless something tells it where to jump. There\'s also one more piece here, for writes: durability. When you change data, the change is written first to the write-ahead log, the WAL, before the actual data pages are updated — and that write-ahead guarantee is the D, durability, in ACID. So the heap alone can find a specific row only by scanning. The structure that fixes that — that lets the database jump straight to a row — is an index, and almost always it\'s a B-tree. Let\'s open one up.',
}
