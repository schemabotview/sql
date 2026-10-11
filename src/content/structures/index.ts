import type { Course } from '../types'
import { requirements } from './01-requirements'
import { normalisation } from './02-normalisation'
import { schemas } from './03-schemas'
import { typesDefaults } from './04-types-defaults'
import { keys } from './05-keys'
import { constraints } from './06-constraints'
import { metadata } from './07-metadata'
import { alter } from './08-alter'
import { dropTruncate } from './09-drop-truncate'

// Chapter 2 of SQL-COURSE-PLAN.md — COMPLETE: 9 of 9 sections, one scene each.
//
// Objective: Explain how business rules become relational structures and enforceable constraints.
//
// Worked illustrations (from the plan): CREATE TABLE and ALTER TABLE examples; contrasting normalised
// schemas; accepted and rejected records; a metadata query and its result.
//
// Outcome: Interpret the shop schema, explain dependencies and normalisation choices, and predict
// whether example records satisfy its constraints.
//
// Bridge: The schema expresses the business rules but has no useful records; next we populate and
// validate it.
//
// Notes: the running example for §4-§9 is a `wishlist` table (which customer wants which product), a
// small extension of the shop, built up and then altered and dropped. Every statement and error is run
// by check:sql on PostgreSQL 16; claims a snippet cannot show are asserted in db/verify/.
export const structures: Course = {
  id: 'structures',
  title: 'Designing and Defining Database Structures',
  sections: [requirements, normalisation, schemas, typesDefaults, keys, constraints, metadata, alter, dropTruncate],
}
