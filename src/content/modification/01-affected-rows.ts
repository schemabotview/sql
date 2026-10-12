import type { Section } from '../types'

export const affectedRows: Section = {
  id: 'affected-rows',
  title: 'Affected-row reasoning, validation, and an annotated rollback walkthrough',
  scene: 'affected-rows',
  slide: `## Affected rows, validation, rollback

Know **how many rows** a change should touch **before** you run it.

### Mental model
- **Preview:** a \`SELECT\` with the same \`WHERE\`
- **Compare:** the command tag (\`UPDATE 2\`) against the preview
- **Undo:** \`ROLLBACK\` before \`COMMIT\`

### Worked example
- Category 5: preview **2** → \`UPDATE 2\`, prices **34.00 → 37.40**, **52.00 → 57.20**
- No \`WHERE\`: \`UPDATE 10\` — **not** 2
- Rollback: prices back to **34.00** and **52.00**

### Misconception
- "No error means it was right" — the **count** is the evidence

### Explanation summary
- Predict, change, compare, then **commit or roll back**`,
  narration:
    "Every change to data deserves a prediction. Before an update, run a select with the same where clause and count the rows. The first card does that for category five and expects two. The second card runs the update with returning, which shows the new values, and the command tag says update two: the prediction held. The third card is the warning sign. Without a where clause, the same statement answers update ten, which is not what we expected, and no error appeared to stop it. The count is the evidence. The fourth card shows the way back. Inside a transaction, a rollback undoes everything since begin; here we use a savepoint so the example can continue, and a follow-up select shows both prices restored to thirty-four and fifty-two. The habit is to predict, change, compare, and only then commit or roll back. Chapter nine deepens transactions, and this section only needs the idea that a change can be undone until you commit.",
}
