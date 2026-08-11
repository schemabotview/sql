import { type SceneSpec, TEAL, GRAY, BLUE, PURPLE, GREEN } from 'reveal-engine'

// The `normalization` scene — Course 1 §6, a mechanism detour after Keys. Normalization is a
// *transformation* (splitting tables so each fact lives in one place), which a labelled box can't
// show — so this scene pairs a RULES band (the four normal forms) with a WORKED EXAMPLE that
// takes one messy flat table and decomposes it into the clean customers ─< orders shape the rest
// of the course uses. It's the systematic cure for the §1 pains (duplication / update anomaly /
// inconsistency): the "before" here is the same flat-sheet idea, the "after" is the ERD.
//
// Legibility over completeness: showing every intermediate table (0NF→1NF→2NF→3NF→BCNF) would be
// unreadable at capture size, so we render BEFORE → the four forms (which ARE the steps) → AFTER.
// BCNF needs overlapping candidate keys (a different example), so it stays a rule card + narration.
//
//   ┌ 1NF ┐ ┌ 2NF ┐ ┌ 3NF ┐ ┌ BCNF ┐          (the four forms = the four steps)
//   0NF flat table  ──normalize──▶  customers · zipcodes · orders · order_items
//   (multi-valued, customer copied, city↔zip)   (each fact stored once, keyed)
//
// Solid tour: one beat solidifies the whole scene (focus: [], all bright).
export const normalization: SceneSpec = {
  id: 'normalization',
  title: 'Normalization',
  // Narrower canvas → the whole-scene camera zooms less far out, so everything reads bigger on
  // screen; a tall row-0 lets the forms `code` card hit the ~24px code-font cap (like capstone).
  canvas: { width: 820, height: 620 },
  grid: { cols: [1, 1, 1, 1], rows: [1.4, 0.95, 0.95], gap: 0.1, padding: 0.45 },
  nodes: [
    // ── the four normal forms — a `code` cheatsheet card (IDE window + numbered lines): the line
    //    numbers 1–4 double as the ordered progression, monospace keeps the columns aligned, and
    //    the mnemonic trails as a `# comment`. Better for retention than plain boxes. ──
    {
      id: 'nf-forms', kind: 'code', color: TEAL, filename: 'normal_forms.md', cell: [0, 0, 4, 1],
      label: [
        '1NF   atomic values · no repeating groups',
        '2NF   the whole key · no partial dependency',
        '3NF   nothing but the key · no transitive dep',
        'BCNF  every determinant is a candidate key',
      ].join('\n'),
      sub: 'the key, the whole key, and nothing but the key',
    },

    // ── BEFORE: one flat table breaking every rule — multi-valued products (not 1NF), the
    //    customer copied onto each line (partial dep, not 2NF), city depending on zip (transitive,
    //    not 3NF). The same denormalized shape §1 opened with. ──
    {
      id: 'nf-raw', label: 'orders_raw — one flat table', kind: 'table', color: GRAY, icon: 'file', cell: [0, 1, 2, 1],
      columns: ['order', 'customer', 'zip', 'city', 'products', 'prices'],
      rows: [
        ['1', 'Amy', '10001', 'New York', 'Pen, Pencil', '1, 2'],
        ['2', 'Bob', '10001', 'New York', 'Notebook', '5'],
      ],
    },

    // ── AFTER: the decomposition — each fact in exactly one table, related by keys (= the ERD) ──
    {
      id: 'nf-customers', label: 'customers', kind: 'table', color: BLUE, icon: 'table', cell: [2, 1],
      columns: ['id', 'name', 'zip'],
      rows: [['1', 'Amy', '10001'], ['2', 'Bob', '10001']],
    },
    {
      id: 'nf-zipcodes', label: 'zipcodes', kind: 'table', color: TEAL, icon: 'table', cell: [3, 1],
      columns: ['zip', 'city'],
      rows: [['10001', 'New York']],
    },
    {
      id: 'nf-orders', label: 'orders', kind: 'table', color: PURPLE, icon: 'table', cell: [2, 2],
      columns: ['id', 'customer_id'],
      rows: [['1', '1'], ['2', '2']],
    },
    {
      id: 'nf-items', label: 'order_items', kind: 'table', color: GREEN, icon: 'table', cell: [3, 2],
      columns: ['oid', 'product', 'price'],
      rows: [['1', 'Pen', '1'], ['1', 'Pencil', '2'], ['2', 'Notebook', '5']],
    },
  ],
  edges: [
    // one flat table → four clean ones, by applying the forms in order.
    { from: 'nf-raw', to: 'nf-orders', label: 'normalize · 1NF → BCNF', animated: false },
  ],
}
