import type { Scene } from '@graphlearning/flow'
import { requirementsStructures } from './structures/requirements-structures'
import { normaliseSplit } from './structures/normalise-split'
import { schemaHierarchy } from './structures/schema-hierarchy'
import { typesDefaults as typesDefaultsDdl } from './structures/types-defaults'
import { keysWishlist } from './structures/keys-wishlist'
import { constraintGuards } from './structures/constraint-guards'
import { metadataQueries } from './structures/metadata-queries'
import { alterBeforeAfter } from './structures/alter-before-after'
import { dropTruncate } from './structures/drop-truncate'
import { insertRows } from './loading/insert-rows'
import { defaultsIdsOptional } from './loading/defaults-ids-optional'
import { loadOrder } from './loading/load-order'
import { copyValidate } from './loading/copy-validate'
import { reconciliation } from './loading/reconciliation'
import { selectGrain } from './retrieval/select-grain'
import { whereFilters } from './retrieval/where-filters'
import { inBetweenLike } from './retrieval/in-between-like'
import { nullLogic } from './retrieval/null-logic'
import { arithmeticCasts } from './retrieval/arithmetic-casts'
import { functions } from './retrieval/functions'
import { caseExpressions } from './retrieval/case-expressions'
import { orderingPaging } from './retrieval/ordering-paging'
import { aggregatesGroups } from './retrieval/aggregates-groups'
import { processingOrder } from './retrieval/processing-order'
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
  // chapter 2 — structures
  requirementsStructures,
  normaliseSplit,
  schemaHierarchy,
  typesDefaultsDdl,
  keysWishlist,
  constraintGuards,
  metadataQueries,
  alterBeforeAfter,
  dropTruncate,
  // chapter 3 — loading
  insertRows,
  defaultsIdsOptional,
  loadOrder,
  copyValidate,
  reconciliation,
  // chapter 4 — retrieval
  selectGrain,
  whereFilters,
  inBetweenLike,
  nullLogic,
  arithmeticCasts,
  functions,
  caseExpressions,
  orderingPaging,
  aggregatesGroups,
  processingOrder,
]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
