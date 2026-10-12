import type { Section } from '../types'

export const isolationLevels: Section = {
  id: 'isolation-levels',
  title: 'Isolation guarantees: SQL concepts and PostgreSQL-specific behaviour',
  scene: 'isolation-levels',
  slide: `## Isolation: SQL concepts and PostgreSQL

An **isolation level** says what a transaction may see of others' work.

### Mental model
- \`READ COMMITTED\`: snapshot **per statement** (default)
- \`REPEATABLE READ\`: snapshot per **transaction**
- \`SERIALIZABLE\`: as if **one after another**
- Stronger levels may **refuse**: run it again

### Worked example
- RR: price stays **59.00**, count stays **3** after B commits
- RR: updating B's row → **could not serialize** (40001)
- Serializable: second skew commit **refused**

### Misconception
- "Levels are universal" — PostgreSQL: **no dirty reads**, no phantoms at RR

### Explanation summary
- **Weakest** level that protects the invariant; **retry** on 40001`,
  narration:
    "An isolation level states what one transaction may see of the others' work. This is where SQL concepts and PostgreSQL's own behaviour must be kept apart. In PostgreSQL, read committed takes a new snapshot for each statement; repeatable read takes one snapshot for the whole transaction; and serializable behaves as if transactions ran one after another. In the first timeline, session A at repeatable read keeps seeing the price fifty-nine and the pending count three, even after B commits a new price and a new pending order, so there is no phantom either. When A then tries to update the row that B changed, PostgreSQL refuses with a serialization failure, state forty-zero-zero-one. The second timeline replays the write-skew pair at serializable: the second commit is refused, and one person stays on duty. The table summarises what each level prevents in PostgreSQL; the SQL standard allows more anomalies. A refusal is an instruction to run the whole transaction again, so pick the weakest level that protects the invariant, and design the retry.",
}
