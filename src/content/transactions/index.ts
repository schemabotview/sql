import type { Course } from '../types'
import { invariantsAcid } from './01-invariants-acid'
import { beginCommitSavepoints } from './02-begin-commit-savepoints'
import { anomalies } from './03-anomalies'
import { isolationLevels } from './04-isolation-levels'
import { locking } from './05-locking'
import { mvcc } from './06-mvcc'
import { deadlocks } from './07-deadlocks'
import { purchaseTimelines } from './08-purchase-timelines'

// Chapter 9 of SQL-COURSE-PLAN.md — COMPLETE: 8 of 8 sections, one scene each.
//
// Objective: Explain how transaction boundaries and concurrency controls protect business invariants.
//
// Worked illustrations (from the plan): Two-session SQL timelines showing visibility, blocking, and
// anomalies; a deadlock sequence; transaction and retry pseudocode for inventory changes.
//
// Outcome: Trace concurrent transaction timelines and justify a consistency requirement, an isolation
// choice, and the need for transaction retries under stated assumptions.
//
// Bridge: Operations now have explicit consistency guarantees; next we control who may perform them and
// integrate the full lifecycle.
//
// Notes: single-session cards run as .sql snippets (check:sql). TWO-SESSION TIMELINES cannot, so they are
// non-.sql cards (timeline() in src/scenes/pair.ts) and every one is replayed in separate real psql
// sessions by scripts/check-timelines.mjs (scenarios in scripts/timelines.mjs, on a scratch schema `cc`
// of committed copies of shop tables; `npm run check:timelines` prints the transcripts). Blocking steps are
// confirmed to wait on a lock. All-or-nothing, savepoints and new row versions are asserted in
// db/verify/ch09-transactions.sql. Behaviour is PostgreSQL 16's (READ UNCOMMITTED = READ COMMITTED,
// no phantoms at REPEATABLE READ) and labelled so; the SQL standard allows more. The retry and purchase
// cards are pseudocode: described, not run.
export const transactions: Course = {
  id: 'transactions',
  title: 'Transactions and Concurrency',
  sections: [invariantsAcid, beginCommitSavepoints, anomalies, isolationLevels, locking, mvcc, deadlocks, purchaseTimelines],
}
