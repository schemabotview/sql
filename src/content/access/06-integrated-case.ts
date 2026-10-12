import type { Section } from '../types'

export const integratedCase: Section = {
  id: 'integrated-case',
  title: 'Integrated narrated case: explain the shop database from design to controlled access',
  scene: 'integrated-case',
  slide: `## The shop, from design to controlled access

One shop, ten chapters, **one case**.

### Mental model
- **Design:** tables, keys, constraints (1–2); loading (3)
- **Questions:** retrieval, joins, analysis (4–6); speed (7)
- **Change and safety:** modification, transactions (8–9)
- **Access:** who may do what (10)

### Worked example
- Place order 12 for Ben: guarded stock update, joined total **59.80**
- Rank by spend: **Dev 1205.00**, Ben 1017.00, Asha 460.80
- Support sees orders by status; the **email** stays closed

### Misconception
- "Finishing the course means practical competence" — it does **not**

### Explanation summary
- Every design choice had a **reason**; practice is separate`,
  narration:
    "This closing case follows one shop from design to controlled access. The chips mark where each chapter shows up. The tables, keys and constraints of chapters one and two make an order possible and refuse impossible ones. The first card places order twelve for Ben: insert the order and its line from chapter three, decrement the stock with a guarded update, as chapter nine taught, and read the order back through a join from chapter five, giving a total of fifty-nine eighty. The second card answers a business question with a common table expression and a window function: Dev leads with twelve hundred five, then Ben, then Asha. Chapter seven would ask what that query costs. The third card applies chapter ten: a support role sees order counts by status through a view, while the email column stays closed. Each choice had a reason, and the reasons are what we have tried to explain. This course illustrates reasoning on one small database, and it does not verify that anyone has gained practical competence. Continue exploring unfamiliar queries, documented engine differences, and failure cases; practical competence requires separate implementation experience.",
}
