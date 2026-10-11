import type { Course } from '../types'
import { baseline } from './01-baseline'
import { readPlans } from './02-read-plans'
import { estimates } from './03-estimates'
import { indexDesign } from './04-index-design'
import { indexFriendly } from './05-index-friendly'
import { compareAlternatives } from './06-compare-alternatives'
import { materializedViews } from './07-materialized-views'

// Chapter 7 of SQL-COURSE-PLAN.md — COMPLETE: 7 of 7 sections, one scene each.
//
// Objective: Interpret query-cost evidence and explain the trade-offs behind performance decisions.
//
// Worked illustrations (from the plan): Annotated execution plans and supplied before/after measurements;
// CREATE INDEX examples; composite-index alternatives; a materialized-view refresh and freshness scenario.
//
// Outcome: Interpret an annotated plan and before/after measurements, explain plausible bottlenecks, and
// compare indexing or stored-summary trade-offs.
//
// Bridge: We can retrieve and analyse data efficiently; next we use those findings to correct and
// synchronise stored records.
//
// Notes: sections 1-6 use a SECOND schema, `perf` (db/perf.sql: 20 000 generated orders and 2 000
// customers, no random(), small enough that ANALYZE reads every row so estimates are repeatable); the
// frozen `shop` serves only the materialized view. Measures are exact counts (rows examined, heap pages,
// index bytes) and plan shapes — never timings. Plan text on a board is real EXPLAIN output with long
// condition lines omitted; shapes and counts are asserted in db/verify/ch07-performance.sql. Plans are
// what PostgreSQL 16 chose on this data and are labelled that way.
export const performance: Course = {
  id: 'performance',
  title: 'Query Performance and Indexing',
  sections: [baseline, readPlans, estimates, indexDesign, indexFriendly, compareAlternatives, materializedViews],
}
