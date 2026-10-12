import type { Course } from '../types'
import { affectedRows } from './01-affected-rows'
import { updateSafely } from './02-update-safely'
import { deleteSafely } from './03-delete-safely'
import { insertSelect } from './04-insert-select'
import { modifyJoins } from './05-modify-joins'
import { upsertMerge } from './06-upsert-merge'
import { cascadesTriggers } from './07-cascades-triggers'
import { cleaningCase } from './08-cleaning-case'

// Chapter 8 of SQL-COURSE-PLAN.md — COMPLETE: 8 of 8 sections, one scene each.
//
// Objective: Reason about targeted changes, synchronisation, and their side effects.
//
// Worked illustrations (from the plan): UPDATE, DELETE, and INSERT … SELECT with before/after records;
// an annotated rollback; contrasting upsert and MERGE scenarios; cascade and trigger side effects.
//
// Outcome: Predict before/after records, explain rollback and synchronisation cases, and distinguish
// upsert, MERGE, cascades, and trigger side effects.
//
// Bridge: A change can be correct in isolation yet fail as part of a larger operation or race another
// user; next we study transaction boundaries and concurrency.
//
// Notes: every statement runs on the frozen `shop` schema inside the snippet runner's rolled-back
// transaction, so shop never changes; each card shows the command tag or RETURNING output it really
// produced. Claims no card shows (UPDATE without WHERE touches 10 rows and ROLLBACK restores them, the
// foreign-key refusals, several-matches-one-row, the upsert/MERGE counts, cascade and trigger counts, the
// cleaning reconciliation) are asserted in db/verify/ch08-modification.sql. MERGE is labelled PostgreSQL
// 15+ (verified on 16); concurrency behaviour is stated, not run (chapter 9).
export const modification: Course = {
  id: 'modification',
  title: 'Modifying and Synchronising Data',
  sections: [affectedRows, updateSafely, deleteSafely, insertSelect, modifyJoins, upsertMerge, cascadesTriggers, cleaningCase],
}
