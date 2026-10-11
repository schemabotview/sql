import type { Scene, SceneNode } from '@graphlearning/flow'

// §4 copy-validate — the load pipeline (file → COPY → staging table → validate → real table) and what
// COPY does with data, both run for real with the data INLINE (COPY … FROM STDIN, ended by \.), so the
// guard needs no file on disk. A bad value aborts the WHOLE load, and the error context names the line
// and column — that is what makes a failed import fixable. A clean load into a STAGING table succeeds
// (COPY 4) and the data is then checked before it goes anywhere: one row points at customer 99, who
// does not exist, and one pair appears twice. `\copy` (psql) is the same command reading a file from
// the learner's own machine.
const step = (node: Pick<SceneNode, 'id' | 'label'>, pattern: SceneNode['pattern']): SceneNode => ({
  ...node,
  variant: 'chip',
  pattern,
  icon: 'none',
})

export const copyValidate: Scene = {
  id: 'copy-validate',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'pipe',
      label: 'The safe way to import',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        step({ id: 'p-file', label: 'CSV file' }, 'storage'),
        step({ id: 'p-copy', label: 'COPY / \\copy' }, 'service'),
        step({ id: 'p-stage', label: 'staging table' }, 'network'),
        step({ id: 'p-check', label: 'validate' }, 'warn'),
        step({ id: 'p-real', label: 'real table' }, 'user'),
      ],
      edges: [
        { source: 'p-file', target: 'p-copy' },
        { source: 'p-copy', target: 'p-stage' },
        { source: 'p-stage', target: 'p-check' },
        { source: 'p-check', target: 'p-real' },
      ],
    },
    {
      id: 'runs',
      label: 'Run it — a bad value, then a clean load that still needs checking',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'g-bad',
          label: 'one bad value',
          pattern: 'group',
          icon: 'none',
          cols: 1,
          children: [
            {
              id: 'q-bad',
              kind: 'code',
              filename: 'copy-bad.sql',
              hug: true,
              label: [
                '-- expect-error: "five" is not a number',
                'CREATE TABLE wishlist_import (',
                '  customer_id integer,',
                '  product_id  integer);',
                'COPY wishlist_import FROM STDIN',
                '  WITH (FORMAT csv, HEADER);',
                'customer_id,product_id',
                '1,4',
                '2,five',
                '\\.',
              ].join('\n'),
            },
            { id: 'e-bad', label: 'line 3, column 2', pattern: 'warn', icon: 'triangleAlert', sub: '"five" — load rejected' },
          ],
          edges: [{ source: 'q-bad', target: 'e-bad' }],
        },
        {
          id: 'g-val',
          label: 'clean load, then validate',
          pattern: 'group',
          icon: 'none',
          flow: 'LR',
          children: [
            {
              id: 'q-val',
              kind: 'code',
              filename: 'copy-validate.sql',
              hug: true,
              label: [
                'CREATE TABLE wishlist_import (',
                '  customer_id integer,',
                '  product_id  integer);',
                'COPY wishlist_import FROM STDIN',
                '  WITH (FORMAT csv, HEADER);',
                'customer_id,product_id',
                '1,4',
                '2,5',
                '99,1',
                '1,4',
                '\\.',
                '',
                'SELECT i.customer_id, i.product_id',
                '  FROM wishlist_import i',
                '  LEFT JOIN customers c USING (customer_id)',
                '  WHERE c.customer_id IS NULL;',
                '',
                'SELECT customer_id, product_id,',
                '  count(*) AS copies',
                '  FROM wishlist_import',
                '  GROUP BY customer_id, product_id',
                '  HAVING count(*) > 1;',
              ].join('\n'),
            },
            {
              id: 'checks',
              label: 'COPY 4 loaded; two problems found',
              pattern: 'group',
              icon: 'none',
              cols: 1,
              children: [
                { id: 'r-orphan', kind: 'table', label: 'no such customer', pattern: 'warn', headers: ['customer_id', 'product_id'], values: [['99', '1']] },
                { id: 'r-dup', kind: 'table', label: 'a pair twice', pattern: 'warn', headers: ['customer_id', 'product_id', 'copies'], values: [['1', '4', '2']] },
              ],
            },
          ],
          edges: [{ source: 'q-val', target: 'checks' }],
        },
      ],
    },
  ],
  edges: [{ source: 'pipe', target: 'runs' }],
}
