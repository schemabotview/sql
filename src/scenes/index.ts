import type { SceneSpec } from 'reveal-engine'
import { sqlLandscape } from './sql-landscape.ts'
import { schemaErd } from './schema-erd.ts'
import { whyRelational } from './why-relational.ts'
import { normalization } from './normalization.ts'
import { queryPipeline } from './query-pipeline.ts'
import { joins } from './joins.ts'
import { windows } from './windows.ts'
import { writePath } from './write-path.ts'
import { isolation } from './isolation.ts'
import { enginePath } from './engine-path.ts'
import { btree } from './btree.ts'
import { mvcc } from './mvcc.ts'
import { capstone } from './capstone.ts'

// This concept's scene registry. The engine's RevealPlayer resolves a section's scene id through
// getScene; content/courses reference these ids. Each course brings its own scenes.
//
// Ported from the reference sql app (../../GraphL-project/sql) one course at a time, imports
// retargeted flow-engine → reveal-engine. Course 1 (`schema`): sql-landscape (the master map) +
// schema-erd (the e-commerce ERD) + why-relational (§1 motivation) + normalization (§6 detour).
// Course 2 (`queries`): query-pipeline (the SELECT spine) + joins (row-matching detour) +
// windows (window-functions detour). Course 3 (`mutations`): write-path (DML/txn/ACID/DCL/prog
// spine) + isolation (interleaved-transactions detour). Course 4 (`engine`): engine-path
// (EXPLAIN/planner/access/storage/MVCC spine) + btree (index internals detour) + mvcc
// (version-chain detour). Course 5 (`capstone`): capstone (build-flow spine + 6 SQL code cards).
const scenes: Record<string, SceneSpec> = {
  [sqlLandscape.id]: sqlLandscape,
  [schemaErd.id]: schemaErd,
  [whyRelational.id]: whyRelational,
  [normalization.id]: normalization,
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
