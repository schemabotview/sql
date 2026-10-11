import type { Scene } from '@graphlearning/flow'

// §9 drop-truncate — three destructive statements, each run for real and each answered by the state
// it leaves: TRUNCATE empties the table but keeps its structure, DROP removes the table itself, and
// DROP on a table other tables depend on is refused. The comparison table is the takeaway, and its
// last column matters most to a nervous beginner: in PostgreSQL all three can be rolled back inside
// a transaction (checked: TRUNCATE and DROP restored 3 rows and the table).
export const dropTruncate: Scene = {
  id: 'drop-truncate',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'ladder',
      label: 'Three ways to remove — each leaves something different',
      pattern: 'group',
      icon: 'none',
      cols: 2,
      children: [
        {
          id: 'g-trunc',
          label: 'TRUNCATE — rows go, table stays',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-trunc',
              kind: 'code',
              filename: 'truncate.sql',
              hug: true,
              label: [
                'CREATE TABLE wishlist (a integer);',
                'INSERT INTO wishlist VALUES (1), (2);',
                'TRUNCATE wishlist;',
                'SELECT count(*) AS n FROM wishlist;',
              ].join('\n'),
            },
            { id: 'r-trunc', kind: 'table', label: 'result', pattern: 'service', headers: ['n'], values: [['0']] },
          ],
          edges: [{ source: 'q-trunc', target: 'r-trunc' }],
        },
        {
          id: 'g-drop',
          label: 'DROP — rows and table go',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-drop',
              kind: 'code',
              filename: 'drop.sql',
              hug: true,
              label: [
                '-- expect-error: nothing left to select',
                'CREATE TABLE wishlist (a integer);',
                'DROP TABLE wishlist;',
                'SELECT * FROM wishlist;',
              ].join('\n'),
            },
            { id: 'e-drop', label: 'does not exist', pattern: 'warn', icon: 'triangleAlert', sub: 'relation "wishlist"' },
          ],
          edges: [{ source: 'q-drop', target: 'e-drop' }],
        },
        {
          id: 'g-dep',
          label: 'DROP a parent — refused',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-dep',
              kind: 'code',
              filename: 'drop-parent.sql',
              hug: true,
              label: ['-- expect-error: orders depends on it', 'DROP TABLE customers;'].join('\n'),
            },
            { id: 'e-dep', label: 'other objects depend on it', pattern: 'warn', icon: 'lock', sub: 'orders, reviews' },
          ],
          edges: [{ source: 'q-dep', target: 'e-dep' }],
        },
        {
          id: 'compare',
          kind: 'table',
          label: 'Which one? (undo = ROLLBACK)',
          pattern: 'storage',
          headers: ['statement', 'removes', 'table stays', 'undo'],
          values: [
            ['DELETE', 'chosen rows', 'yes', 'yes'],
            ['TRUNCATE', 'all rows', 'yes', 'yes'],
            ['DROP', 'rows + table', 'no', 'yes'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
