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

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}

// The slug for a section is `<courseId>-<sectionId>` — section IS the unit (one slide, one
// narration), so no trailing beat index.
export function slugOf(course: Course, section: Section): string {
  return `${course.id}-${section.id}`
}

export function allSections(course: Course): { section: Section; slug: string }[] {
  return course.sections.map((section) => ({ section, slug: slugOf(course, section) }))
}
