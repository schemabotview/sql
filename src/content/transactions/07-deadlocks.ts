import type { Section } from '../types'

export const deadlocks: Section = {
  id: 'deadlocks',
  title: 'Diagnose deadlocks and design retries',
  scene: 'deadlocks',
  slide: `## Deadlocks and retries

A **deadlock** is a cycle of waiting; the database breaks it by **aborting one**.

### Mental model
- A holds 1, wants 2; B holds 2, wants 1: neither can move
- After \`deadlock_timeout\` PostgreSQL aborts **one** transaction (40P01)
- **Same lock order everywhere** prevents the cycle
- **Retry** the aborted transaction

### Worked example
- Opposite order: A is the **victim** (*deadlock detected*), B continues
- Lowest id first: B just **waits**, no error
- Retry loop: **pseudocode**, not run

### Misconception
- "Deadlocks can be eliminated" — plan to **retry**

### Explanation summary
- Lock in a fixed order; retry on 40P01 and 40001`,
  narration:
    "A deadlock is a cycle of waiting. Session A holds product one and wants product two; session B holds product two and wants product one. Neither can move. The first timeline runs it in two real sessions. After the deadlock timeout, one second by default, PostgreSQL aborts one of them with the error deadlock detected. Here session A waited first and was the victim, and B then continued. The second timeline does the same work taking locks in one agreed order, lowest product number first: B simply waits for A, and nothing is aborted. So the first remedy is to lock rows in a consistent order. The second is to expect occasional aborts, because deadlocks and serialization failures can still happen under load. The pseudocode card shows the shape of the retry loop: repeat a few times, roll back and wait briefly on a deadlock or a serialization failure, and give up on any other error. It is application code, so we describe it without running it.",
}
