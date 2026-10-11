import type { Course } from '../types'
import { selectGrain } from './01-select-grain'
import { where } from './02-where'
import { inBetweenLike } from './03-in-between-like'
import { nullLogic } from './04-null-logic'
import { arithmeticCasts } from './05-arithmetic-casts'
import { functions } from './06-functions'
import { caseExpressions } from './07-case'
import { orderingPaging } from './08-ordering-paging'
import { aggregatesGroups } from './09-aggregates-groups'
import { processingOrder } from './10-processing-order'

// Chapter 4 of SQL-COURSE-PLAN.md — COMPLETE: 10 of 10 sections, one scene each.
//
// Objective: Explain single-table query results through expressions, NULL semantics, filtering, and
// grouping.
//
// Worked illustrations (from the plan): SELECT queries paired with input and result tables; NULL truth
// tables; CASE and date calculations; contrasting WHERE and HAVING results.
//
// Outcome: Interpret query outputs and explain mistakes involving duplicate rows, NULL, type
// conversion, ordering, or aggregation.
//
// Bridge: Single-table reports reveal only part of the business story; next we connect related records
// and query results.
//
// Notes: every board is a query card paired with the result it really returns (src/scenes/pair.ts), run
// by check:sql on PostgreSQL 16; grain, NULL placement and "9 rows, 8 people" are asserted in
// db/verify/ch04-retrieval.sql. Function names, date arithmetic and NULL ordering are labelled as
// PostgreSQL's, not universal.
export const retrieval: Course = {
  id: 'retrieval',
  title: 'Retrieving and Summarising Data',
  sections: [selectGrain, where, inBetweenLike, nullLogic, arithmeticCasts, functions, caseExpressions, orderingPaging, aggregatesGroups, processingOrder],
}
