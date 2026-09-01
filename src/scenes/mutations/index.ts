import type { Scene } from '../../render-engine'
import { writeMachinery } from './write-machinery'
import { insertForms } from './insert-forms'
import { updateBeforeAfter } from './update-before-after'
import { deleteAndMerge } from './delete-and-merge'
import { theTransfer } from './the-transfer'
import { acid } from './acid'
import { isolationDial } from './isolation-dial'
import { whoMayWrite } from './who-may-write'
import { serverSideLogic } from './server-side-logic'
import { mutationsRecap } from './mutations-recap'

// Scenes for the `mutations` course — one per section. This is the course about STATE CHANGING, so
// four of the ten carry real table nodes showing before and after; that node did not exist when the
// first two courses were authored, and this slice is the first to be built with it available.
export const mutationsScenes: Scene[] = [
  writeMachinery,
  insertForms,
  updateBeforeAfter,
  deleteAndMerge,
  theTransfer,
  acid,
  isolationDial,
  whoMayWrite,
  serverSideLogic,
  mutationsRecap,
]
