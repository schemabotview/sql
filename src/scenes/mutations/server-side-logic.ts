import type { Scene } from '@graphlearning/flow'

// §9 server-side-logic — a CODE card, because a trigger IS code and a diagram of one is a box with
// the word "trigger" in it. The example is the classic the narration names: an audit row written
// automatically on every change, which shows both halves — the function that does the work, and the
// trigger that decides when it fires.
//
// The band below places that example among the four shapes server-side logic takes, including the
// one the narration flags as a last resort.
export const serverSideLogic: Scene = {
  id: 'server-side-logic',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'trigger-code',
      kind: 'code',
      filename: 'audit.sql',
      label: [
        'CREATE FUNCTION log_change() RETURNS trigger',
        'AS $$',
        'BEGIN',
        '  INSERT INTO audit (table_name, changed_at)',
        "  VALUES ('orders', now());",
        '  RETURN NEW;',
        'END;',
        '$$ LANGUAGE plpgsql;',
        '',
        'CREATE TRIGGER orders_audit',
        '  AFTER UPDATE ON orders',
        '  FOR EACH ROW EXECUTE FUNCTION log_change();',
      ].join('\n'),
    },
    {
      id: 'shapes',
      label: 'Four shapes of logic that lives in the database',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'sh-func', label: 'Function', pattern: 'service', icon: 'braces', sub: 'returns a value' },
        { id: 'sh-proc', label: 'Procedure', pattern: 'network', icon: 'terminal', sub: 'CALL it — it acts' },
        { id: 'sh-trigger', label: 'Trigger', pattern: 'user', icon: 'zap', sub: 'fires on a write' },
        { id: 'sh-cursor', label: 'Cursor', pattern: 'warn', sub: 'row-by-row, last resort' },
      ],
    },
  ],
  edges: [{ source: 'trigger-code', target: 'shapes', label: 'nobody CALLs this — the write itself fires it' }],
}
