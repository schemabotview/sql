import type { Course } from '../types'
import { joinCardinality } from './01-join-cardinality'
import { innerJoins } from './02-inner-joins'
import { outerJoins } from './03-outer-joins'
import { selfCrossJoins } from './04-self-cross-joins'
import { amplification } from './05-amplification'
import { subqueries } from './06-subqueries'
import { correlated } from './07-correlated'
import { existsNotIn } from './08-exists-not-in'
import { setOperations } from './09-set-operations'
import { views } from './10-views'

// Chapter 5 of SQL-COURSE-PLAN.md — COMPLETE: 10 of 10 sections, one scene each.
//
// Objective: Reason about combined result sets and reusable query interfaces.
//
// Worked illustrations (from the plan): Join diagrams and query outputs showing matching, unmatched,
// and duplicated rows; EXISTS versus NOT IN cases; a view definition and its use.
//
// Outcome: Predict join and subquery outputs, explain cardinality errors and duplicate semantics, and
// compare a view with its underlying query.
//
// Bridge: We can connect the necessary evidence; next we express sequences, comparisons, and
// multi-step analytical questions.
//
// Notes: every board is a query card paired with the result it really returns (src/scenes/pair.ts), run
// by check:sql on PostgreSQL 16. Row counts that no card shows (the wrong-key join's 9 rows, the
// amplified total, a view following its base table, the NOT IN / NULL cause, WITH CHECK OPTION) are
// asserted in db/verify/ch05-combining.sql. INTERSECT ALL / EXCEPT ALL are labelled as PostgreSQL's.
export const combining: Course = {
  id: 'combining',
  title: 'Combining Tables and Queries',
  sections: [joinCardinality, innerJoins, outerJoins, selfCrossJoins, amplification, subqueries, correlated, existsNotIn, setOperations, views],
}
