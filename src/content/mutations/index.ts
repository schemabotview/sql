import type { Course } from '../types'
import { writeSafely } from './01-write-safely'
import { insert } from './02-insert'
import { update } from './03-update'
import { deleteMerge } from './04-delete-merge'
import { transactions } from './05-transactions'
import { acidSection } from './06-acid'
import { isolation } from './07-isolation'
import { dcl } from './08-dcl'
import { programmatic } from './09-programmatic'
import { youAreHere } from './10-you-are-here'

// mutations — changing data, safely. Ten sections: the write machinery as a whole, then the four DML
// verbs, then the envelope they run in (transactions → ACID → isolation), then the two guards —
// DCL from outside and server-side logic from inside — and the bookend.
// Course COMPLETE — 10 sections, 10 scenes, 10 wavs (12.5 min).
export const mutations: Course = {
  id: 'mutations',
  title: 'Changing data',
  sections: [
    writeSafely,
    insert,
    update,
    deleteMerge,
    transactions,
    acidSection,
    isolation,
    dcl,
    programmatic,
    youAreHere,
  ],
}
