import { foundations } from './foundations'
import { structures } from './structures'
import { loading } from './loading'
import { analytics } from './analytics'
import { performance } from './performance'
import { modification } from './modification'
import { transactions } from './transactions'
import { access } from './access'
import { combining } from './combining'
import { retrieval } from './retrieval'
import type { Course, Section } from './types'

// The course catalog, in syllabus order. The syllabus is SQL-COURSE-PLAN.md (10 chapters, 79
// sections); `npm run check` (scripts/check-plan.mjs) holds this folder to it. Chapters are added
// here as they are authored, one at a time:
//
//   foundations   1  Database and SQL Foundations                     (6)
//   structures    2  Designing and Defining Database Structures       (9)
//   loading       3  Populating and Validating Data                   (5)
//   retrieval     4  Retrieving and Summarising Data                  (10)
//   combining     5  Combining Tables and Queries                     (10)
//   analytics     6  Advanced Analytical Queries                      (10)
//   performance   7  Query Performance and Indexing                   (7)
//   modification  8  Modifying and Synchronising Data                 (8)
//   transactions  9  Transactions and Concurrency                     (8)
//   access        10 Access Control and Integrated Reasoning          (6)
//
// 79 of 79 sections authored: all ten chapters complete.
export const COURSES: Record<string, Course> = {
  [foundations.id]: foundations,
  [structures.id]: structures,
  [loading.id]: loading,
  [retrieval.id]: retrieval,
  [combining.id]: combining,
  [analytics.id]: analytics,
  [performance.id]: performance,
  [modification.id]: modification,
  [transactions.id]: transactions,
  [access.id]: access,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract the recorder drives, so it cannot be a per-repo decision.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
