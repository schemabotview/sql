import type { SceneSpec } from 'flow-engine'
import { sqlLandscape } from './sql-landscape.ts'
import { schemaErd } from './schema-erd.ts'
import { queryPipeline } from './query-pipeline.ts'
import { joins } from './joins.ts'
import { windows } from './windows.ts'
import { writePath } from './write-path.ts'
import { isolation } from './isolation.ts'
import { enginePath } from './engine-path.ts'
import { btree } from './btree.ts'
import { mvcc } from './mvcc.ts'
import { capstone } from './capstone.ts'

// This concept's scene registry. The engine's RevealPlayer resolves a section's scene id
// through getScene; content/courses reference these ids.
const scenes: Record<string, SceneSpec> = {
  [sqlLandscape.id]: sqlLandscape,
  [schemaErd.id]: schemaErd,
  [queryPipeline.id]: queryPipeline,
  [joins.id]: joins,
  [windows.id]: windows,
  [writePath.id]: writePath,
  [isolation.id]: isolation,
  [enginePath.id]: enginePath,
  [btree.id]: btree,
  [mvcc.id]: mvcc,
  [capstone.id]: capstone,
}

export const getScene = (id: string): SceneSpec | undefined => scenes[id]
