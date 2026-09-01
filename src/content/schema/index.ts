import type { Course } from '../types'
import { whyADatabase } from './01-why-a-database'
import { theShape } from './02-the-shape'
import { relationalModel } from './03-relational-model'
import { theTable } from './04-the-table'
import { keys } from './05-keys'
import { normalization } from './06-normalization'
import { constraints } from './07-constraints'
import { ddl } from './08-ddl'
import { viewsIndexes } from './09-views-indexes'
import { youAreHere } from './10-you-are-here'

// schema — modeling data. Ten sections: the cold open (why a database at all), the whole-language
// map, then the model itself (two tables → one table → the key that links them), normalization as
// the discipline behind it, the constraints that enforce it, the DDL that builds it, the two derived
// objects, and the you-are-here bookend. Course COMPLETE — 10 sections, 10 scenes, 10 wavs (11.0 min).
export const schema: Course = {
  id: 'schema',
  title: 'Modeling data',
  sections: [
    whyADatabase,
    theShape,
    relationalModel,
    theTable,
    keys,
    normalization,
    constraints,
    ddl,
    viewsIndexes,
    youAreHere,
  ],
}
