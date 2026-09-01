// Public surface of the render-engine. Kept as a barrel so extracting this folder into its own
// package later is a move + a package.json, nothing more.

export type { Scene, SceneNode, SceneEdge, PatternKey, TableColumn } from './types'
export { SceneView } from './SceneView'
export { computeLayout, collectEdges, NODE_W, NODE_H, type Placed } from './layout'
export { PATTERNS, type PatternStyle } from './patterns'
