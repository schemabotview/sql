import type { Section } from '../types'

export const roleHierarchies: Section = {
  id: 'role-hierarchies',
  title: 'Design role hierarchies and least privilege',
  scene: 'role-hierarchies',
  slide: `## Role hierarchies and least privilege

Grant to **roles**, put **people** in the roles.

### Mental model
- Group roles: \`readers\`, \`writers\`
- \`GRANT readers TO ana\`: membership **inherits** the privileges
- **Least privilege:** only what the job needs
- Review the **matrix**; privileges accumulate

### Worked example
- \`ana\` ∈ readers → \`SELECT\` only
- \`clerk\` ∈ readers + writers → \`SELECT\`, \`INSERT\`, \`UPDATE\`, **no** \`DELETE\`
- Clerk's \`UPDATE\` works (\`UPDATE 1\`); \`DELETE\` is **refused**

### Misconception
- "More privileges are safer for the application" — they widen **every mistake**

### Explanation summary
- Few roles, narrow grants, regular **review**`,
  narration:
    "Granting privileges person by person does not scale, so we grant them to group roles and make people members. The graph shows two group roles: readers can select from every table, and writers can insert and update orders. Ana is a member of readers; the clerk is a member of both. Membership inherits the privileges, and the matrix for orders confirms it: ana can only select, while the clerk can select, insert and update, but not delete. The third card shows the least-privilege principle in action: the clerk's update succeeds, and the delete is refused because nobody was given delete, since no job needs it. The table lists the design rules: grant to roles rather than people, one role per job, only what the job needs, and review the matrix, because privileges tend to accumulate. More privileges feel safer for an application, but they widen every mistake. That is a design judgement, and it depends on the real jobs in your organisation, not on this small shop alone.",
}
