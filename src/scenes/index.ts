import type { Scene } from '@graphlearning/flow'
import { dbmsVsFiles } from './foundations/dbms-vs-files'
import { tableRelationships } from './foundations/table-relationships'
import { keyIntegrity } from './foundations/key-integrity'
import { typesAndNull } from './foundations/types-and-null'
import { statementAnatomy } from './foundations/statement-anatomy'
import { clientServerTour } from './foundations/client-server-tour'

// Scene registry. Sections reference scenes by id; scenes are grouped by course (one folder each,
// mirroring src/content). Ids are globally unique across courses, so the flat lookup is unambiguous.
const ALL: Scene[] = [
  // chapter 1 — foundations
  dbmsVsFiles,
  tableRelationships,
  keyIntegrity,
  typesAndNull,
  statementAnatomy,
  clientServerTour,
]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
