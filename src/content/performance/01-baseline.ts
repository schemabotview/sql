import type { Section } from '../types'

export const baseline: Section = {
  id: 'baseline',
  title: 'Establish correctness, representative workloads, and a baseline',
  scene: 'baseline',
  slide: `## Correctness, workload, baseline

Tune **only** a query you can already prove correct.

### Mental model
- **Correct first:** know the expected result
- **Representative workload:** the queries that really run, and how often
- **Baseline:** what the work costs **before** any change

### Worked example
- Customer 42: **10** orders, revenue **1018.30**
- No index → PostgreSQL examines **20 000** rows to return **10**
- Measure **rows examined**: exact and repeatable

### Misconception
- "Run it twice and compare times" — timings vary; **record what you changed**

### Explanation summary
- Result, workload, baseline: **then** change one thing`,
  narration:
    "Performance work starts before any index is created. First, correctness: you must know the expected result, here ten orders and a revenue of one thousand eighteen thirty for customer forty-two, because a fast wrong answer is worthless. Second, a representative workload: the table lists the queries that really run and how often, since a lookup on every page view matters differently from a nightly report. Third, a baseline: what the work costs before any change. The plan card shows a sequential scan that examines all twenty thousand rows and keeps ten, a useful share of five hundredths of a percent. We use rows examined as the measure because it is exact and repeatable, while timings vary with the machine and the cache. This section uses a larger generated schema called perf, because the tiny shop is too small for the planner to have a real choice. The common mistake is to change several things and compare two timings. Record the baseline, change one thing, and measure again.",
}
