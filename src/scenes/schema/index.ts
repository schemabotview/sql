import type { Scene } from '@graphlearning/flow'
import { fileVsDatabase } from './file-vs-database'
import { sqlLandscape } from './sql-landscape'
import { twoTables } from './two-tables'
import { tableAnatomy } from './table-anatomy'
import { keysPkFk } from './keys-pk-fk'
import { normalForms } from './normal-forms'
import { constraintSet } from './constraint-set'
import { ddlCatalog } from './ddl-catalog'
import { derivedObjects } from './derived-objects'
import { schemaRecap } from './schema-recap'

// Scenes for the `schema` course — one per section, no sharing. The studio repo let six of these ten
// sections ride a single `schema-erd` board and two ride the master map, because its camera could
// light one band at a time; this engine has no camera, so each section gets its own solid board.
export const schemaScenes: Scene[] = [
  fileVsDatabase,
  sqlLandscape,
  twoTables,
  tableAnatomy,
  keysPkFk,
  normalForms,
  constraintSet,
  ddlCatalog,
  derivedObjects,
  schemaRecap,
]
