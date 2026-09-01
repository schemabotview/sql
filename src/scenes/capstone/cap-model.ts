import type { Scene } from '../../render-engine'
import { projectSteps } from './steps'

// §2 cap-model — step 1. The project's real DDL, carrying every rule course 1 taught in one
// statement: keys, NOT NULL, UNIQUE, a DEFAULT, a foreign key and a CHECK. The band names what each
// rule is actually guarding, so the code reads as decisions rather than syntax.
export const capModel: Scene = {
  id: 'cap-model',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    projectSteps(),
    {
      id: 'model-code',
      kind: 'code',
      filename: '01_model.sql',
      label: [
        'CREATE TABLE customers (',
        '  id         bigserial   PRIMARY KEY,',
        '  name       text        NOT NULL,',
        '  email      text        UNIQUE,',
        '  created_at timestamptz DEFAULT now()',
        ');',
        '',
        'CREATE TABLE orders (',
        '  id          bigserial PRIMARY KEY,',
        '  customer_id bigint    NOT NULL',
        '                REFERENCES customers (id),',
        '  total       numeric(10,2) CHECK (total >= 0),',
        '  placed_at   timestamptz DEFAULT now()',
        ');',
      ].join('\n'),
    },
    {
      id: 'guards',
      label: 'What each rule is guarding',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'gd-pk', label: 'PRIMARY KEY', pattern: 'service', icon: 'key', sub: 'one identity per row' },
        { id: 'gd-unique', label: 'UNIQUE', pattern: 'service', icon: 'circleslash', sub: 'no shared email' },
        { id: 'gd-fk', label: 'REFERENCES', pattern: 'network', icon: 'gitbranch', sub: 'no orphan orders' },
        { id: 'gd-check', label: 'CHECK', pattern: 'network', icon: 'scale', sub: 'no negative totals' },
      ],
    },
  ],
  edges: [
    { source: 'plan', target: 'model-code' },
    { source: 'model-code', target: 'guards', label: 'the rules go in NOW — every later step inherits them' },
  ],
}
