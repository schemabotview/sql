import type { Scene, SceneNode } from '@graphlearning/flow'

// §5 statement-anatomy — what a statement is made of, the one mistake that tangles two of its parts,
// and the five families statements fall into. The token table is the lexical rules in one place;
// the two cards beneath it are the contrast that matters: double quotes make an IDENTIFIER, not a
// string, so "Asha" is looked up as a column and fails with PostgreSQL's real message, while an
// upper-case FIRST_NAME works because unquoted identifiers fold to lower case. The families card runs
// one statement of each family (the CREATE and GRANT roll back under the guard; ROLLBACK is the TCL line).
const cmd = (node: Pick<SceneNode, 'id' | 'label'>, pattern: SceneNode['pattern']): SceneNode => ({
  ...node,
  variant: 'chip',
  pattern,
  icon: 'none',
})

export const statementAnatomy: Scene = {
  id: 'statement-anatomy',
  padding: 0.04,
  flow: 'TB',
  nodes: [
    {
      id: 'parts',
      label: 'The parts of a statement',
      pattern: 'group',
      icon: 'none',
      flow: 'TB',
      children: [
        {
          id: 'tokens',
          kind: 'table',
          label: 'token · kind · rule',
          pattern: 'storage',
          headers: ['example', 'kind', 'rule'],
          values: [
            ['SELECT, FROM', 'keyword', 'case-insensitive'],
            ['first_name', 'identifier', 'folded to lower case'],
            ['"First_Name"', 'quoted identifier', 'case kept, must match'],
            ["'Asha', 42", 'literal', 'strings: single quotes'],
            ["'it''s'", 'literal', 'double the quote to escape'],
            ['-- note', 'comment', 'ignored to end of line'],
            ['/* note */', 'comment', 'ignored, may span lines'],
            [';', 'terminator', 'ends the statement'],
          ],
        },
        {
          id: 'contrast',
          label: 'Quotes: strings or names?',
          pattern: 'group',
          icon: 'none',
          cols: 2,
          children: [
            {
              id: 'g-works',
              label: 'unquoted names fold',
              pattern: 'group',
              icon: 'none',
              cols: 1,
              children: [
                {
                  id: 'q-works',
                  kind: 'code',
                  filename: 'folds.sql',
                  hug: true,
                  label: ['SELECT FIRST_NAME  -- upper: fine', '  FROM /* people */ customers', '  ORDER BY customer_id', '  LIMIT 1;'].join('\n'),
                },
                { id: 'r-works', kind: 'table', label: 'works', pattern: 'service', headers: ['first_name'], values: [['Asha']] },
              ],
              edges: [{ source: 'q-works', target: 'r-works' }],
            },
            {
              id: 'g-fails',
              label: 'double quotes name',
              pattern: 'group',
              icon: 'none',
              cols: 1,
              children: [
                {
                  id: 'q-fails',
                  kind: 'code',
                  filename: 'quoted.sql',
                  hug: true,
                  label: ['-- expect-error: a name here', 'SELECT "Asha" FROM customers;'].join('\n'),
                },
                { id: 'e-fails', label: 'no column "Asha"', pattern: 'warn', icon: 'triangleAlert', sub: 'quotes name things' },
              ],
              edges: [{ source: 'q-fails', target: 'e-fails' }],
            },
          ],
        },
      ],
    },
    {
      id: 'families',
      label: 'Five families of statement — one of each, run for real',
      pattern: 'group',
      icon: 'none',
      flow: 'LR',
      children: [
        {
          id: 'q-families',
          kind: 'code',
          filename: 'five-families.sql',
          hug: true,
          label: [
            'CREATE TABLE note (id integer, body text);  -- DDL',
            "INSERT INTO note VALUES (1, 'hello');       -- DML",
            'SELECT * FROM note;                         -- DQL',
            'GRANT SELECT ON note TO PUBLIC;             -- DCL',
            'ROLLBACK;                                   -- TCL',
          ].join('\n'),
        },
        {
          id: 'fam',
          label: 'what each family acts on',
          pattern: 'group',
          icon: 'none',
          cols: 5,
          align: 'start',
          stretch: true,
          children: [
            {
              id: 'ddl',
              label: 'DDL',
              sub: 'structure',
              pattern: 'group',
              icon: 'none',
              cols: 1,
              children: [cmd({ id: 'c-create', label: 'CREATE' }, 'storage'), cmd({ id: 'c-alter', label: 'ALTER' }, 'storage'), cmd({ id: 'c-drop', label: 'DROP' }, 'storage')],
            },
            {
              id: 'dml',
              label: 'DML',
              sub: 'rows',
              pattern: 'group',
              icon: 'none',
              cols: 1,
              children: [cmd({ id: 'c-insert', label: 'INSERT' }, 'service'), cmd({ id: 'c-update', label: 'UPDATE' }, 'service'), cmd({ id: 'c-delete', label: 'DELETE' }, 'service')],
            },
            {
              id: 'dql',
              label: 'DQL',
              sub: 'questions',
              pattern: 'group',
              icon: 'none',
              cols: 1,
              children: [cmd({ id: 'c-select', label: 'SELECT' }, 'network')],
            },
            {
              id: 'tcl',
              label: 'TCL',
              sub: 'transactions',
              pattern: 'group',
              icon: 'none',
              cols: 1,
              children: [cmd({ id: 'c-commit', label: 'COMMIT' }, 'warn'), cmd({ id: 'c-rollback', label: 'ROLLBACK' }, 'warn')],
            },
            {
              id: 'dcl',
              label: 'DCL',
              sub: 'access',
              pattern: 'group',
              icon: 'none',
              cols: 1,
              children: [cmd({ id: 'c-grant', label: 'GRANT' }, 'user'), cmd({ id: 'c-revoke', label: 'REVOKE' }, 'user')],
            },
          ],
        },
      ],
      edges: [{ source: 'q-families', target: 'fam' }],
    },
  ],
  edges: [{ source: 'parts', target: 'families' }],
}
