import type { Course } from '../types'
import { logicalOrder } from './01-logical-order'
import { from_ } from './02-from'
import { join } from './03-join'
import { where } from './04-where'
import { groupHaving } from './05-group-having'
import { window } from './06-window'
import { selectDistinct } from './07-select-distinct'
import { orderLimit } from './08-order-limit'
import { setOps } from './09-set-ops'
import { youAreHere } from './10-you-are-here'

// queries — reading data back out. Ten sections walking the pipeline in the order it RUNS: the
// write-vs-run gap, then FROM → JOIN → WHERE → GROUP BY/HAVING → windows → SELECT/DISTINCT →
// ORDER BY/LIMIT, closing on set operations (which sit outside the pipeline) and the bookend.
// Course COMPLETE — 10 sections, 10 scenes, 10 wavs (12.5 min).
export const queries: Course = {
  id: 'queries',
  title: 'Reading data',
  sections: [
    logicalOrder,
    from_,
    join,
    where,
    groupHaving,
    window,
    selectDistinct,
    orderLimit,
    setOps,
    youAreHere,
  ],
}
