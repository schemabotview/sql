import type { Course } from 'flow-engine'
import { schema } from './schema.ts'
import { queries } from './queries.ts'
import { mutations } from './mutations.ts'
import { engine } from './engine.ts'
import { capstone } from './capstone.ts'

// This concept's course catalog. A concept can hold several courses; each is routed by id
// (#/<id>) and shown in the course index by title. All courses share the concept's scene
// registry (scenes/index.ts).
//
// SCAFFOLD: empty until Course 1 lands. The approved 5-course arc (the lifecycle of working
// with a database — design → query → change → tune → build):
//   1. schema     — Modeling data: relational model, DDL & the catalog        [Design]
//   2. queries    — Reading data: the SELECT pipeline, joins, windows, sets    [Query]
//   3. mutations  — Changing data safely: DML, transactions, DCL, procedures   [Write]
//   4. engine     — Under the hood: storage, indexes, the planner & EXPLAIN    [Tune]
//   5. capstone   — End-to-end project over an e-commerce schema               [Build]
// Add each authored Course to `courses` (order = syllabus order) and a one-line BLURBS entry.
export const CONCEPT = 'SQL'

export const courses: Course[] = [schema, queries, mutations, engine, capstone]

export const courseById = (id: string): Course | undefined => courses.find((c) => c.id === id)

// One-line blurb per course (concept-specific copy — the engine's Course type carries only
// id/title/sections). SINGLE SOURCE OF TRUTH: consumed by the app landing (CourseIndex) AND
// emitted into public/courses.json (gen-courses-json) so the graphl.in catalog shows the same
// descriptions. Keyed by course id.
export const BLURBS: Record<string, string> = {
  schema: 'The relational model, DDL & the catalog',
  queries: 'The SELECT pipeline, joins, windows & sets',
  mutations: 'DML, transactions, ACID, DCL & procedures',
  engine: 'Storage, indexes, the planner, EXPLAIN & MVCC',
  capstone: 'One e-commerce project, end to end',
}
