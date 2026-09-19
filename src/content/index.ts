import { schema } from './schema'
import { queries } from './queries'
import { mutations } from './mutations'
import { engine } from './engine'
import { capstone } from './capstone'
import type { Course, Section } from './types'

// The course catalog, in syllabus order. → past a course's last section rolls into the next course's
// first. Courses are added here as they're authored (slice by slice): schema → queries → mutations
// → engine → capstone.
export const COURSES: Record<string, Course> = {
  [schema.id]: schema,
  [queries.id]: queries,
  [mutations.id]: mutations,
  [engine.id]: engine,
  [capstone.id]: capstone,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract the recorder drives, so it cannot be a per-repo decision. Re-exported here because
// this module is what the app and the scripts already import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
