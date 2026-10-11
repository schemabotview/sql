import type { Scene } from '@graphlearning/flow'

// §5 reconciliation — the worked case. A six-row feed of new customers is staged as TEXT (so nothing is
// refused on the way in) and each row is given a verdict: three load, three are rejected, each for a
// stated reason (email missing, email already in use, impossible date). The result table IS the
// source-file-to-loaded-rows comparison, and the reconciliation table closes the books: source 6 =
// loaded 3 + rejected 3, and customers go from 9 to 12. The verdict query runs under check:sql; the
// before/after counts and the identity "6 = 3 + 3" are asserted in db/verify/ch03-loading.sql.
export const reconciliation: Scene = {
  id: 'reconciliation',
  padding: 0.04,
  flow: 'LR',
  nodes: [
    {
      id: 'q-classify',
      kind: 'code',
      filename: 'classify-feed.sql',
      hug: true,
      label: [
        'CREATE TEMP TABLE feed (',
        '  id text, email text,',
        '  signup_date text);',
        'COPY feed FROM STDIN',
        '  WITH (FORMAT csv, HEADER);',
        'id,email,signup_date',
        '10,ines@x.com,2025-04-15',
        '11,jon@x.com,2025-04-16',
        '12,,2025-04-17',
        '13,asha.rao@example.com,2025-04-18',
        '14,noor@x.com,2025-13-40',
        '15,omar@x.com,2025-04-20',
        '\\.',
        '',
        'SELECT f.id, CASE',
        "  WHEN f.email IS NULL",
        "    THEN 'rejected: email missing'",
        '  WHEN EXISTS (SELECT 1 FROM customers c',
        '               WHERE c.email = f.email)',
        "    THEN 'rejected: email in use'",
        '  WHEN f.signup_date !~',
        "    '^[0-9]{4}-(0[1-9]|1[0-2])-[0-9]{2}$'",
        "    THEN 'rejected: bad date'",
        "  ELSE 'loaded' END AS verdict",
        'FROM feed f ORDER BY f.id::integer;',
      ].join('\n'),
    },
    {
      id: 'books',
      label: 'Source file against loaded rows',
      pattern: 'group',
      icon: 'none',
      cols: 1,
      children: [
        {
          id: 'r-verdicts',
          kind: 'table',
          label: 'every source row has a verdict',
          pattern: 'service',
          headers: ['id', 'verdict'],
          values: [
            ['10', 'loaded'],
            ['11', 'loaded'],
            ['12', 'rejected: email missing'],
            ['13', 'rejected: email in use'],
            ['14', 'rejected: bad date'],
            ['15', 'loaded'],
          ],
        },
        {
          id: 'r-books',
          kind: 'table',
          label: 'the books balance',
          pattern: 'storage',
          headers: ['count', 'rows'],
          values: [
            ['source file', '6'],
            ['loaded', '3'],
            ['rejected', '3'],
            ['customers before', '9'],
            ['customers after', '12'],
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'q-classify', target: 'books' }],
}
