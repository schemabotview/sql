import type { Scene } from '@graphlearning/flow'

// §6 normal-forms — the discipline that removes §1's pains BY CONSTRUCTION. Drawn as a passage, not
// a list: the problem at the top, the four forms as the instrument, the guarantee at the bottom. The
// forms are a band rather than a chain because a four-step LR chain renders far too wide and a TB
// one far too tall — and they read as one instrument anyway, applied in order.
//
// The top band is deliberately §1's pains restated in schema terms, which is what the narration
// claims: normalization is the structural answer to the flat file.
export const normalForms: Scene = {
  id: 'normal-forms',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'messy',
      label: 'One table holding everything',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'nf-dup', label: 'Duplication', pattern: 'warn', sub: 'one fact, many rows' },
        { id: 'nf-anomaly', label: 'Update anomaly', pattern: 'warn', sub: 'fix one copy, not all' },
        { id: 'nf-drift', label: 'Drift', pattern: 'warn', sub: 'the copies disagree' },
      ],
    },
    {
      id: 'forms',
      label: 'The forms — each one fixes exactly one flaw',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'nf1', label: '1NF', variant: 'tile', pattern: 'service', sub: 'atomic cells' },
        { id: 'nf2', label: '2NF', variant: 'tile', pattern: 'service', sub: 'the whole key' },
        { id: 'nf3', label: '3NF', variant: 'tile', pattern: 'service', sub: 'nothing but the key' },
        { id: 'bcnf', label: 'BCNF', variant: 'tile', pattern: 'user', sub: 'every determinant' },
      ],
    },
    { id: 'result', label: 'Each fact stored once', pattern: 'storage', icon: 'circlecheck', sub: 'the DB does the bookkeeping' },
  ],
  edges: [
    { source: 'messy', target: 'forms', label: 'split until every fact lives in exactly one place' },
    { source: 'forms', target: 'result' },
  ],
}
