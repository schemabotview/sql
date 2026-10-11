import type { Scene } from '@graphlearning/flow'

// §1 dbms-vs-files — a fork, two parallel columns read downward: the same three applications, once
// each holding its own file and once all asking one DBMS. The pairing is the argument, so the columns
// differ only in how many copies of the data exist. The left column ends in the duplicated record
// itself (Asha · Bengaluru, three times) so "three copies" is something the reader counts, not a claim.
//
// Chips are the applications and files (counted tokens); the DBMS and the database are the two
// DESCRIBED things, so they are tiles — that asymmetry is the point of the scene.
export const dbmsVsFiles: Scene = {
  id: 'dbms-vs-files',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'fork',
      label: 'The same three applications, two ways to keep their data',
      pattern: 'group',
      icon: 'none',
      align: 'start',
      stretch: true,
      cols: 2,
      children: [
        {
          id: 'files',
          label: 'Separate files — 3 copies of every customer',
          sub: 'every application keeps its own, and they drift apart',
          pattern: 'warn',
          icon: 'files',
          cols: 3,
          children: [
            { id: 'fa-bill', label: 'Billing', variant: 'chip', pattern: 'user', icon: 'none' },
            { id: 'fa-ship', label: 'Shipping', variant: 'chip', pattern: 'user', icon: 'none' },
            { id: 'fa-rep', label: 'Reports', variant: 'chip', pattern: 'user', icon: 'none' },
            { id: 'ff-bill', label: 'billing.csv', variant: 'chip', pattern: 'storage', icon: 'none' },
            { id: 'ff-ship', label: 'shipping.csv', variant: 'chip', pattern: 'storage', icon: 'none' },
            { id: 'ff-rep', label: 'reports.xlsx', variant: 'chip', pattern: 'storage', icon: 'none' },
            { id: 'fc-bill', label: 'Asha · Bengaluru', variant: 'chip', pattern: 'warn', icon: 'none' },
            { id: 'fc-ship', label: 'Asha · Bengaluru', variant: 'chip', pattern: 'warn', icon: 'none' },
            { id: 'fc-rep', label: 'Asha · Bengaluru', variant: 'chip', pattern: 'warn', icon: 'none' },
          ],
          edges: [
            { source: 'fa-bill', target: 'ff-bill' },
            { source: 'fa-ship', target: 'ff-ship' },
            { source: 'fa-rep', target: 'ff-rep' },
            { source: 'ff-bill', target: 'fc-bill' },
            { source: 'ff-ship', target: 'fc-ship' },
            { source: 'ff-rep', target: 'fc-rep' },
          ],
        },
        {
          id: 'dbms-col',
          label: 'One database, one DBMS',
          sub: 'every application asks the same system',
          pattern: 'service',
          icon: 'database',
          cols: 1,
          children: [
            {
              id: 'd-apps',
              label: 'Applications',
              pattern: 'group',
              icon: 'none',
              cols: 3,
              children: [
                { id: 'da-bill', label: 'Billing', variant: 'chip', pattern: 'user', icon: 'none' },
                { id: 'da-ship', label: 'Shipping', variant: 'chip', pattern: 'user', icon: 'none' },
                { id: 'da-rep', label: 'Reports', variant: 'chip', pattern: 'user', icon: 'none' },
              ],
            },
            { id: 'dbms', label: 'DBMS — PostgreSQL', variant: 'tile', pattern: 'service', icon: 'shield', sub: 'queries · integrity · security · concurrency' },
            { id: 'db', label: 'database: shop', pattern: 'storage', icon: 'database', sub: 'one copy of every customer' },
          ],
          edges: [
            { source: 'da-bill', target: 'dbms' },
            { source: 'da-ship', target: 'dbms' },
            { source: 'da-rep', target: 'dbms' },
            { source: 'dbms', target: 'db' },
          ],
        },
      ],
    },
  ],
  edges: [],
}
