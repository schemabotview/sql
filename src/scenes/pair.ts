import type { PatternKey, SceneEdge, SceneNode } from '@graphlearning/flow'

// The recurring board unit: a SQL code card and the result table(s) — or the error — it really
// produces, grouped so each card reads as one question and its answer. Every result is the output of
// running the card against db/seed.sql (check:sql runs the card; the table is copied from that run).
//
// Node ids are derived from `id` (`q-<id>`, `r-<id>-<n>`, `e-<id>`). That is safe wherever no section
// uses `focus` on a generated node — check-content.mjs finds focus targets by literal `id: '…'`.
export interface Out {
  label: string
  headers: string[]
  values: string[][]
  pattern?: PatternKey
}
export interface Err {
  label: string
  sub: string
}

export function pair(o: { id: string; title: string; file: string; sql: string[]; outs?: Out[]; err?: Err }): SceneNode {
  const q = `q-${o.id}`
  const children: SceneNode[] = [{ id: q, kind: 'code', filename: o.file, hug: true, label: o.sql.join('\n') }]
  const edges: SceneEdge[] = []
  ;(o.outs ?? []).forEach((r, i) => {
    const id = `r-${o.id}-${i}`
    children.push({ id, kind: 'table', label: r.label, pattern: r.pattern ?? 'service', headers: r.headers, values: r.values })
    edges.push({ source: q, target: id })
  })
  if (o.err) {
    const id = `e-${o.id}`
    children.push({ id, label: o.err.label, pattern: 'warn', icon: 'triangleAlert', sub: o.err.sub })
    edges.push({ source: q, target: id })
  }
  return { id: `g-${o.id}`, label: o.title, pattern: 'group', icon: 'none', cols: 1, children, edges }
}

export const grid = (id: string, label: string, cols: number, children: SceneNode[]): SceneNode => ({
  id,
  label,
  pattern: 'group',
  icon: 'none',
  cols,
  children,
})
