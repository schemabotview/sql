import type { Scene } from '@graphlearning/flow'
import { projectSteps } from './steps'

// §8 cap-shipped — the last scene in the concept. The strip is here one final time with nothing
// focused, so all six steps read as done rather than one being current; below it, the five courses
// that built up to this, and the closing claim.
export const capShipped: Scene = {
  id: 'cap-shipped',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    projectSteps(),
    {
      id: 'journey',
      label: 'The whole journey — five courses',
      pattern: 'group',
      cols: 5,
      children: [
        { id: 'jn-design', label: 'Design', variant: 'tile', pattern: 'storage', icon: 'table', sub: 'course 1' },
        { id: 'jn-read', label: 'Read', variant: 'tile', pattern: 'storage', icon: 'funnel', sub: 'course 2' },
        { id: 'jn-change', label: 'Change', variant: 'tile', pattern: 'storage', icon: 'wrench', sub: 'course 3' },
        { id: 'jn-tune', label: 'Tune', variant: 'tile', pattern: 'storage', icon: 'gauge', sub: 'course 4' },
        { id: 'jn-build', label: 'Build', variant: 'tile', pattern: 'service', icon: 'boxes', sub: 'this one' },
      ],
    },
    { id: 'end', label: 'From the query down to the disk', pattern: 'service', icon: 'circlecheck', sub: "that's SQL, end to end" },
  ],
  edges: [
    { source: 'plan', target: 'journey', label: 'modeled, secured, loaded, queried, ranked and tuned' },
    { source: 'journey', target: 'end' },
  ],
}
