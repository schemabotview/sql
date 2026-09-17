import type { Scene } from '@graphlearning/flow'

// §8 who-may-write — being able to write and being allowed to are different things. The board goes
// privilege → role → principle, which is the order the narration argues it: what the verbs are, why
// you never grant to a person, and the rule that decides how much to grant.
export const whoMayWrite: Scene = {
  id: 'who-may-write',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'verbs',
      label: 'DCL — per object, per operation',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'dcl-grant', label: 'GRANT', pattern: 'service', icon: 'key', sub: 'hand out privileges' },
        { id: 'dcl-revoke', label: 'REVOKE', pattern: 'warn', sub: 'take them back' },
      ],
    },
    {
      id: 'roles',
      label: 'Grant to ROLES, then put people in them',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'role-owner', label: 'owner', pattern: 'user', icon: 'usercheck', sub: 'full rights' },
        { id: 'role-clerk', label: 'clerk', pattern: 'network', icon: 'usercheck', sub: 'SELECT, INSERT' },
        { id: 'role-analyst', label: 'analyst', pattern: 'storage', icon: 'usercheck', sub: 'SELECT only' },
      ],
    },
    { id: 'least', label: 'Least privilege', pattern: 'service', icon: 'shieldcheck', sub: 'the minimum each needs' },
  ],
  edges: [
    { source: 'verbs', target: 'roles', label: 'access managed in one place, not per person' },
    { source: 'roles', target: 'least', label: 'the safest write is one the account was never allowed' },
  ],
}
