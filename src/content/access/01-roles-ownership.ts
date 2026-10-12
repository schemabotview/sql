import type { Section } from '../types'

export const rolesOwnership: Section = {
  id: 'roles-ownership',
  title: 'Authentication, authorisation, ownership, users, and roles',
  scene: 'roles-ownership',
  slide: `## Authentication, authorisation, roles

Two questions: **who are you**, and **what may you do**?

### Mental model
- **Authentication:** proving identity (configured outside SQL)
- **Authorisation:** privileges granted to a **role**
- A **user** is a role that can **log in**
- The **owner** of an object may do everything with it

### Worked example
- \`ana\` can log in; \`analyst\` cannot: same kind of object
- \`SET ROLE analyst\` → \`current_user\` is **analyst**
- A new role has **no** rights: even \`shop.orders\` is refused

### Misconception
- "Logging in means access" — authentication grants **nothing** by itself

### Explanation summary
- Identity first, then **explicit** privileges`,
  narration:
    "Access control starts with two different questions. Authentication asks who you are, and it is configured outside SQL with passwords or certificates, so we only describe it. Authorisation asks what that identity may do, and that is expressed in SQL as privileges granted to roles. In PostgreSQL, a user is simply a role that is allowed to log in. The first card shows two roles that differ only in that attribute. The second card shows a session acting as the analyst role. The third card shows the default: a brand-new role has no rights at all, so even a qualified query on the orders table is refused with permission denied for the schema. With an unqualified name you would get a does not exist message instead, because objects in a schema you may not use are invisible. The owner of an object, whoever created it, may do everything with it. So logging in grants nothing by itself: identity comes first, and privileges are explicit. The roles here are created inside a transaction that is rolled back, so nothing is left in the database.",
}
