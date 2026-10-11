import type { Course } from '../types'
import { cteSteps } from './01-cte-steps'
import { recursive } from './02-recursive-ctes'
import { windowPartitions } from './03-window-partitions'
import { windowFrames } from './04-window-frames'
import { rankingTopN } from './05-ranking-top-n'
import { runningAverages } from './06-running-averages'
import { lagLead } from './07-lag-lead'
import { gapsIslands } from './08-gaps-islands'
import { groupingSets } from './09-grouping-sets'
import { cohorts } from './10-cohorts'

// Chapter 6 of SQL-COURSE-PLAN.md — COMPLETE: 10 of 10 sections, one scene each.
//
// Objective: Explain multi-step analyses, recursive relationships, window calculations, and advanced
// summaries.
//
// Worked illustrations (from the plan): CTE and recursive-query walkthroughs; window-frame result
// comparisons; running totals, ranking, subtotals, and a cohort calculation with explicit definitions.
//
// Outcome: Explain how query stages, recursion, grouping sets, and window definitions determine
// analytical results and their limitations.
//
// Bridge: The analysis produces the right answer; next we investigate the work required to produce it
// and improve performance with evidence.
//
// Notes: every board is a query card paired with the result it really returns (src/scenes/pair.ts), run
// by check:sql on PostgreSQL 16, all on the frozen `shop` schema (no second schema was needed). What no
// card shows (rank ties, the ROWS/RANGE difference, the cycle that never ends, customer 9's period -1) is
// asserted in db/verify/ch06-analytics.sql. CYCLE (14+), GROUPING SETS and window syntax are labelled as
// PostgreSQL's; "3-row" is never described as "3-day".
export const analytics: Course = {
  id: 'analytics',
  title: 'Advanced Analytical Queries',
  sections: [cteSteps, recursive, windowPartitions, windowFrames, rankingTopN, runningAverages, lagLead, gapsIslands, groupingSets, cohorts],
}
