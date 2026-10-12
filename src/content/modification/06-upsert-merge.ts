import type { Section } from '../types'

export const upsertMerge: Section = {
  id: 'upsert-merge',
  title: 'Upserts versus MERGE: matching, conflicts, and concurrency assumptions',
  scene: 'upsert-merge',
  slide: `## Upserts versus MERGE

Both decide: **update the row if it exists, insert it if not**.

### Mental model
- \`ON CONFLICT (key) DO UPDATE | DO NOTHING\`: matches a **unique key**
- \`MERGE\`: matches **any join condition**; update, insert, delete
- \`MERGE\` is **PostgreSQL 15+**; verified here on 16

### Worked example
- Asha exists (id 1) → phone updated; Ivan new → id **10**
- Duplicate with \`DO NOTHING\` → \`INSERT 0 0\`
- \`MERGE\`: product 1 repriced, product 11 inserted → \`MERGE 2\`

### Misconception
- "MERGE and upsert behave the same under concurrency" — **not guaranteed**

### Explanation summary
- Unique-key insert-or-update: **upsert**; rule-based sync: **MERGE**`,
  narration:
    "Synchronising data often means insert if new, update if it already exists. PostgreSQL offers two tools. Insert with on conflict matches on a unique key. The first card inserts two customers: Asha's email already exists, so her phone is updated and she keeps customer number one, while Ivan is new and becomes customer ten. The second card uses do nothing, so a conflicting row is simply skipped and the tag reads insert zero zero. Merge matches on any join condition and can update, insert or delete. The third card merges a small staged list into products: product one is repriced, product eleven is inserted, and the tag reads merge two. Merge needs PostgreSQL fifteen or later; this course verifies on sixteen. The table compares the two. The assumption to state is concurrency: on conflict is the atomic insert-or-update, while merge can still raise a unique violation if another session inserts first. We describe that here but do not run it; chapter nine returns to concurrency.",
}
