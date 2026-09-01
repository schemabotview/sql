import type { Section } from '../types'

export const dcl: Section = {
  id: 'dcl',
  title: 'DCL: who may write',
  scene: 'who-may-write',
  slide: `## DCL: who may write

Being *able* to write isn't the same as being *allowed* to. **DCL** controls who may do what.

### GRANT & REVOKE
- \`GRANT SELECT, INSERT ON orders TO clerk\` — hand a role specific privileges
- \`REVOKE …\` takes them back — privileges are per-object and per-operation

### Roles, not people
- Grant to a **role** (\`clerk\`, \`analyst\`), then add users to the role — access managed in one place
- The table's **owner** has full rights and decides what to hand out

### Least privilege
- Give each role the **minimum** it needs — a reporting login gets \`SELECT\`, never \`DELETE\`
- The safest write is one an account was never allowed to make

DCL guards writes from *outside*. The last piece runs logic from *inside* — programmatic SQL.`,
  narration:
    'There\'s a difference between being able to run a DELETE and being allowed to, and that difference is DCL — data control language, the layer that decides who may do what. It comes down to two verbs. GRANT hands a privilege to someone: GRANT SELECT and INSERT on the orders table to the clerk role, for instance, lets that role read and add orders but nothing more. REVOKE takes a privilege back. And notice the granularity — privileges are per object and per operation, so you can allow reads but not writes, or writes to one table but not another. The key practice is that you almost never grant privileges to individual people; you grant them to roles — clerk, analyst, admin — and then assign users to those roles. That way access lives in one place: change what a role can do, and everyone in it changes at once. Every table also has an owner, who holds full rights and decides what to hand out to others. Tying it all together is the principle of least privilege: give each role the minimum it needs to do its job and nothing more. A reporting dashboard\'s login should be able to SELECT and nothing else — then even a bug or a compromised password can\'t delete a single row. The safest write, after all, is the one an account was never permitted to make. DCL guards the data from the outside — controlling who gets in. The final piece of the map works from the inside: logic that lives in the database itself, the programmatic layer.',
}
