import type { Section } from '../types'

export const cohorts: Section = {
  id: 'cohorts',
  title: 'Cohort analysis: define populations, time periods, and metrics',
  scene: 'cohorts',
  slide: `## Cohort analysis

Three **definitions** first, then one query.

### Mental model
- **Population:** who is counted (all 9 customers)
- **Cohort and period:** signup month, months since signup
- **Metric:** distinct customers with a non-cancelled order

### Worked example
- Jan cohort (2): both active in **month 2**
- Feb cohort (3): all 3 active in **month 1**
- Mar and Apr cohorts: **none** active
- Customer 6's only order was **cancelled**, so it does not count

### Misconception
- "The query is the analysis" — the **definitions** decide what the numbers mean

### Explanation summary
- Customer 9 ordered **before** signing up (period −1): excluded, and **said so**`,
  narration:
    "A cohort analysis follows groups that share a starting event across time. The query is the easy part; the definitions are the analysis. The population is all nine customers. A customer's cohort is the month of signup, the period is months since signup, and the metric is the number of distinct customers with a non-cancelled order in that period. The result shows that both January customers ordered in month two, all three February customers ordered in month one, and the March and April cohorts have no active customers in this data. The definitions have consequences. Customer nine ordered in March but signed up in April, a period of minus one. Our definition keeps periods from zero upwards, so that order is excluded, and the slide says so. Customer six's March order was cancelled, so it does not count either. Those choices are limitations of the data and the rules, not facts about customers, so state them next to the numbers. The analysis produces the right answer; next we investigate the work required to produce it and improve performance with evidence.",
}
