import type { Scene } from '@graphlearning/flow'

// §7 projection — a CODE card, and the one place in this course where that is clearly right: the
// section's claim is about WHICH LINE a name comes into existence on, so the lines have to be on
// screen. `line_total` is born on line 3; line 7 (WHERE) runs BEFORE the SELECT stage and cannot see
// it, while line 8 (ORDER BY) runs after and can. The band below names that consequence.
//
// Lines are kept ≤76 cols (CODE_MIN_COLS) so the card does not render its type smaller once fitView
// scales the scene, and the card carries no `sub` — codeLines() would append it as a `#` comment,
// which is Python's syntax, not SQL's.
export const projection: Scene = {
  id: 'projection',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'projection-code',
      kind: 'code',
      filename: 'projection.sql',
      label: [
        'SELECT DISTINCT',
        '  c.name,',
        "  o.price * o.qty        AS line_total,",
        "  COALESCE(c.phone, '-') AS phone",
        'FROM orders o',
        'JOIN customers c ON c.id = o.customer_id',
        "WHERE o.status = 'paid'",
        'ORDER BY line_total DESC;',
      ].join('\n'),
    },
    {
      id: 'alias-rule',
      label: 'line_total is born at the SELECT stage',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'alias-where', label: 'WHERE runs earlier', pattern: 'warn', sub: "it can't see the alias" },
        { id: 'alias-order', label: 'ORDER BY runs later', pattern: 'service', icon: 'circlecheck', sub: 'it can use the alias' },
      ],
    },
  ],
  edges: [{ source: 'projection-code', target: 'alias-rule', label: 'written second from the top — but the fifth stage to run' }],
}
