import type { Section } from '../types'

export const isolation: Section = {
  id: 'isolation',
  title: 'Isolation levels & the anomalies',
  scene: 'isolation-dial',
  slide: `## Isolation levels & the anomalies

Anomalies only appear when transactions **overlap in time** — so we watch two of them run.

### The interleave
- **T1** reads \`x\`, gets \`5\` — then, before T1 finishes, **T2** writes \`x = 8\` and commits
- T1 reads \`x\` again and now gets \`8\` — the same query, two different answers

### The three read anomalies
- **Dirty read** — you see another transaction's *uncommitted* change (it may vanish)
- **Non-repeatable read** — re-read one row, its value *changed* (the story above)
- **Phantom read** — re-run a query, *new rows* have appeared

### The four levels — the dial
- \`READ UNCOMMITTED\` → \`READ COMMITTED\` (Postgres default) → \`REPEATABLE READ\` → \`SERIALIZABLE\`
- Each step **forbids more anomalies** — but allows **less concurrency** (more waiting, more aborts)

Higher isn't always better — pick the weakest level that's still correct.`,
  narration:
    'Isolation is the one ACID guarantee you tune, so let\'s see exactly what you\'re tuning against — and the key insight is that these problems only exist when two transactions overlap in time. Watch the two here. Transaction one, T1, begins and reads x, getting the value five. But before T1 is done, transaction two, T2, slips in, writes x equals eight, and commits. Now T1 reads x a second time — and gets eight. The very same query inside the very same transaction returned two different answers. That\'s an anomaly, and it has a name: a non-repeatable read. There are three of these read anomalies, in increasing subtlety. A dirty read is the worst: you see another transaction\'s change before it has committed — and if that transaction rolls back, you acted on data that never really existed. A non-repeatable read is what we just watched: you re-read a single row and its value has changed underneath you. And a phantom read is about sets rather than single rows: you run a query, then run it again, and new rows have appeared that match — phantoms that weren\'t there the first time. To control these, SQL gives you four isolation levels, and they\'re a dial. READ UNCOMMITTED is the weakest and permits all three. READ COMMITTED, which is Postgres\'s default, stops dirty reads. REPEATABLE READ additionally stops non-repeatable reads. And SERIALIZABLE, the strongest, makes transactions behave as if they ran one at a time, eliminating all of them. Here\'s the trade-off, though: every step up the dial forbids more anomalies but allows less concurrency — more locking, more waiting, more transactions forced to abort and retry. So higher isn\'t automatically better; the skill is choosing the weakest level that\'s still correct for what you\'re doing. With safety understood, let\'s step back to the write-path — and to who is even allowed to write.',
}
