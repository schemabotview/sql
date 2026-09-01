import type { Scene } from '../render-engine'
import { schemaScenes } from './schema'
import { queriesScenes } from './queries'
import { mutationsScenes } from './mutations'
import { engineScenes } from './engine'
import { capstoneScenes } from './capstone'

// Scene registry. Sections reference scenes by id; scenes are grouped by course (one folder each,
// mirroring src/content). Ids are globally unique across courses, so the flat lookup below is
// unambiguous. Courses are added here as they're authored, one slice at a time.
const ALL: Scene[] = [...schemaScenes, ...queriesScenes, ...mutationsScenes, ...engineScenes, ...capstoneScenes]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
