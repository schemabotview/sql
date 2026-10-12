import type { Section } from '../types'

export const anomalies: Section = {
  id: 'anomalies',
  title: 'Concurrency anomalies explained through two-session timelines',
  scene: 'anomalies',
  slide: `## Concurrency anomalies

Each timeline was run in **two real sessions**.

### Mental model
- Sessions interleave; each sees **committed** data at some moment
- **Non-repeatable read:** the same query, two answers
- **Lost update:** two writers, one effect
- **Write skew:** each is right alone, **both** break the rule

### Worked example
- A reads **59.00**, B commits **64.00**, A reads **64.00** again
- Both read stock **120**, both write **119**
- Both see **2 on duty**, each leaves: **0** on duty
- Fix: \`SET stock = stock - 1\` → **118**

### Misconception
- "If each transaction is correct, the mix is correct" — **timing** matters

### Explanation summary
- Let the database compute from the **current** row, and protect cross-row rules`,
  narration:
    "Anomalies appear when sessions interleave. Every timeline here was run in two real sessions, with time running downward. In the first, session A reads a price of fifty-nine, session B commits sixty-four, and A's second read, in the same transaction, returns sixty-four. That is a non-repeatable read, allowed by read committed, the default level. In the second, both sessions read a stock of one hundred twenty and each writes one nineteen, so two sales produced one decrement: a lost update. The fix is the fourth card: let the database compute from the current row with stock equals stock minus one; session B waits for A, and the final stock is one eighteen. The third timeline is write skew. Both sessions check that two people are on duty, each takes a different person off duty, and both commit, leaving nobody. Each transaction was correct alone. Timing made the mix wrong, and the next section shows which isolation level prevents it.",
}
