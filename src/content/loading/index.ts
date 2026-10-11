import type { Course } from '../types'
import { insertRows } from './01-insert-rows'
import { defaultsIdsOptional } from './02-defaults-ids-optional'
import { loadOrder } from './03-load-order'
import { importValidate } from './04-import-validate'
import { reconciliation } from './05-reconciliation'

// Chapter 3 of SQL-COURSE-PLAN.md — COMPLETE: 5 of 5 sections, one scene each.
//
// Objective: Trace how records enter a database and why some loads produce incorrect or rejected data.
//
// Worked illustrations (from the plan): INSERT examples with defaults and generated identifiers;
// source-file and loaded-row comparisons; a rejected-record and reconciliation walkthrough.
//
// Outcome: Trace insertion and loading examples, explain rejected rows, and compare source records
// with the illustrated loaded dataset.
//
// Bridge: The database contains validated records; next we turn those records into answers to
// business questions.
//
// Notes: runs on the real shop tables. A script stops at its first error, so what a failed statement
// left behind is asserted in db/verify/ch03-loading.sql (all-or-nothing, load order, the identity
// gap, and the 6 = 3 + 3 reconciliation). COPY uses inline data so no file is needed.
export const loading: Course = {
  id: 'loading',
  title: 'Populating and Validating Data',
  sections: [insertRows, defaultsIdsOptional, loadOrder, importValidate, reconciliation],
}
