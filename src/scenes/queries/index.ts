import type { Scene } from '@graphlearning/flow'
import { logicalOrder } from './logical-order'
import { rowSources } from './row-sources'
import { joinMatch } from './join-match'
import { whereFilter } from './where-filter'
import { groupingCollapse } from './grouping-collapse'
import { windowVsGroup } from './window-vs-group'
import { projection } from './projection'
import { arrange } from './arrange'
import { setOperations } from './set-operations'
import { queriesRecap } from './queries-recap'

// Scenes for the `queries` course — one per section. The studio repo had SEVEN of these ten sections
// riding a single `query-pipeline` board, lit one stage at a time by the camera; rebuilt here, each
// section's own claim gets its own picture, and only §1 is the pipeline itself.
export const queriesScenes: Scene[] = [
  logicalOrder,
  rowSources,
  joinMatch,
  whereFilter,
  groupingCollapse,
  windowVsGroup,
  projection,
  arrange,
  setOperations,
  queriesRecap,
]
