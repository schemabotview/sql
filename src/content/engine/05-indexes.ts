import type { Section } from '../types'

export const indexes: Section = {
  id: 'indexes',
  title: 'Indexes: inside a B-tree',
  scene: 'btree',
  slide: `## Indexes: inside a B-tree

An index is a separate, sorted structure that lets the database **jump** to a row instead of scanning for it. Almost always it's a **B-tree**.

### How a lookup works
- Start at the **root**, compare your key, follow one pointer down — **root → branch → leaf**
- The **leaf** holds the sorted key and a pointer to the row's place in the heap
- Just **3–4 hops** to find one row among **millions** — that's **O(log n)**

### Range scans are cheap too
- Leaves are kept in **sorted order and linked** — so \`BETWEEN\` / \`>\` walk sideways along them
- A composite index on \`(a, b)\` serves \`a\` and \`a, b\` — the **leftmost prefix**, not \`b\` alone

### The trade-off
- Every \`INSERT\`/\`UPDATE\`/\`DELETE\` must **update the index** too — writes get slower
- \`PRIMARY KEY\` and \`UNIQUE\` are already backed by one; index what you **filter and join on**`,
  narration:
    'An index is the structure that lets the database jump straight to a row instead of scanning the heap for it, and to see how, we have to open one up. Almost every index you\'ll use is a B-tree — a balanced tree of key values, and it\'s drawn here. At the very top is the root. When you search for a key — say customer forty-two — you start at the root and make a comparison: is the key below or above the split point? That answer sends you down exactly one pointer to a branch node, where you compare again and descend once more, until you reach the bottom level, the leaves. The leaves are where the real work pays off: they hold the actual key values, in sorted order, each paired with a pointer to exactly where that row sits in the heap. So the database follows this path — root, branch, leaf — and lands directly on the row. The magic is in how few steps that takes. Because each level fans out to many children, even a table with millions of rows is only three or four levels deep, so any single row is just three or four hops away. That\'s what O-of-log-n means in practice, and it\'s the difference between reading a handful of pages and reading the entire table. There\'s a bonus, too. Notice the leaves are linked together in sorted order, left to right. That means a range query — everything BETWEEN two values, or greater than something — doesn\'t restart at the root for each row; it finds the start and then just walks sideways along the linked leaves. But indexes aren\'t free, and that\'s the trade-off on the bottom. Every time you insert, update, or delete a row, the database has to update the index too, so writes get a little slower and every index takes extra disk. The rule that follows is simple: index the columns you actually filter and join on, not every column just in case. So now the table has an index, which means the planner has a choice to make: scan the whole thing, or use the index? Let\'s see how it decides.',
}
