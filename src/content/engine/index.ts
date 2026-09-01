import type { Course } from '../types'
import { underTheHood } from './01-under-the-hood'
import { planner } from './02-planner'
import { explain } from './03-explain'
import { storage } from './04-storage'
import { indexes } from './05-indexes'
import { scans } from './06-scans'
import { mvccSection } from './07-mvcc'
import { youAreHere } from './08-you-are-here'

// engine — how it all actually runs. Eight sections: the journey of a query, the planner and the
// EXPLAIN output that exposes it, the physical storage underneath, the B-tree that makes lookups
// cheap, the choice between scanning and jumping, and MVCC. Storage was the last dark region on the
// map. Course COMPLETE — 8 sections, 8 scenes, 8 wavs (11.6 min).
export const engine: Course = {
  id: 'engine',
  title: 'Under the hood',
  sections: [
    underTheHood,
    planner,
    explain,
    storage,
    indexes,
    scans,
    mvccSection,
    youAreHere,
  ],
}
