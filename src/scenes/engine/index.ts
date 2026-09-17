import type { Scene } from '@graphlearning/flow'
import { queryJourney } from './query-journey'
import { thePlanner } from './the-planner'
import { explainPlan } from './explain-plan'
import { storageHierarchy } from './storage-hierarchy'
import { btree } from './btree'
import { scanChoice } from './scan-choice'
import { mvcc } from './mvcc'
import { engineRecap } from './engine-recap'

// Scenes for the `engine` course — one per section. Two of these do something no earlier scene does:
// `storage-hierarchy` is built on genuine NESTING (a page contains tuples; it does not hand off to
// them), and `btree` is a real tree the engine lays out from its edges — the only scene in the
// concept that literally IS its subject.
export const engineScenes: Scene[] = [
  queryJourney,
  thePlanner,
  explainPlan,
  storageHierarchy,
  btree,
  scanChoice,
  mvcc,
  engineRecap,
]
