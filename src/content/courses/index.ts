import type { Course } from 'reveal-engine'
import { schema } from './schema.ts'
import { queries } from './queries.ts'
import { mutations } from './mutations.ts'
import { engine } from './engine.ts'
import { capstone } from './capstone.ts'

// This concept's course catalog. Each course is routed by id (#/<id>) and shown on the index by
// title. All courses share the concept's scene registry (scenes/index.ts).
//
// The 5-course arc — the lifecycle of working with a database (design → query → change → tune →
// build), ported from the reference sql app one reviewed slice at a time:
//   1. schema     — Modeling data: the relational model, DDL & the catalog        (Design)
//   2. queries    — Reading data: the SELECT pipeline, joins, windows, set ops    (Query)
//   3. mutations  — Changing data safely: DML, transactions, DCL, procedures      (Write)
//   4. engine     — Under the hood: storage, indexes, the planner & EXPLAIN       (Tune)
//   5. capstone   — an end-to-end project over an e-commerce schema               (Build)
// Each authored Course is added to `courses` (order = syllabus order) with a one-line BLURBS entry.
// COMPLETE: all 5 courses ported (schema · queries · mutations · engine · capstone).
export const CONCEPT = 'SQL'

export const courses: Course[] = [schema, queries, mutations, engine, capstone]

export const courseById = (id: string): Course | undefined => courses.find((c) => c.id === id)

// One-line blurb per course (concept-specific copy — the engine's Course type carries only
// id/title/sections). Consumed by the app landing (CourseIndex). Keyed by course id.
export const BLURBS: Record<string, string> = {
  schema: 'The relational model, DDL & the catalog — modeling data as tables, keys & constraints.',
  queries: 'The SELECT pipeline, joins, windows & set operations — reading data back out.',
  mutations: 'DML, transactions & ACID, isolation levels, DCL & procedures — changing data safely.',
  engine: 'Storage, B-tree indexes, the planner, EXPLAIN & MVCC — how it runs under the hood.',
  capstone: 'One e-commerce project end to end — design, secure, load, analyze, report, tune.',
}
