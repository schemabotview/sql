import type { Section } from '../types'

export const mvcc: Section = {
  id: 'mvcc',
  title: 'Understand MVCC and visibility',
  scene: 'mvcc',
  slide: `## MVCC and visibility

An \`UPDATE\` writes a **new row version**; the old one stays for older snapshots.

### Mental model
- Each version records who **created** and who **replaced** it
- A snapshot sees the versions that were **committed** when it began
- That is why **readers and writers do not block** each other

### Worked example
- A (snapshot first): sees **59.00** all the way
- B sees its own **64.00** at once; C sees **59.00** until B commits
- After B commits: C sees **64.00**; A still sees **59.00**
- After A commits: A sees **64.00**

### Misconception
- "An update overwrites the row" — it adds a **version**

### Explanation summary
- Visibility depends on **when your snapshot was taken**`,
  narration:
    "Multiversion concurrency control explains the timelines we have seen. An update does not overwrite a row; it writes a new version, and the old version stays for snapshots that still need it. Each version records which transaction created it and which replaced it; the small table uses symbolic ids. Now read the three-session timeline. Session A takes a repeatable read snapshot and reads fifty-nine. Session B updates the price to sixty-four and sees its own change immediately. Session C, a fresh reader, still sees fifty-nine, because B has not committed. After B commits, C sees sixty-four, but A, whose snapshot is older, still sees fifty-nine. Only when A finishes does its next statement see sixty-four. That is why readers and writers do not block each other. The cost is old versions piling up, which vacuum reclaims; we state that but do not demonstrate it. A hidden test confirms that an update really produces a new row version.",
}
