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
import { joinCardinality } from './combining/join-cardinality'
import { innerJoins } from './combining/inner-joins'
import { outerJoins } from './combining/outer-joins'
import { selfCrossJoins } from './combining/self-cross-joins'
import { amplification } from './combining/amplification'
import { subqueries } from './combining/subqueries'
import { correlated } from './combining/correlated'
import { existsNotIn } from './combining/exists-not-in'
import { setOperations } from './combining/set-operations'
import { views } from './combining/views'
import { cteSteps } from './analytics/cte-steps'
import { recursive } from './analytics/recursive'
import { windowPartitions } from './analytics/window-partitions'
import { windowFrames } from './analytics/window-frames'
import { rankingTopN } from './analytics/ranking-top-n'
import { runningAverages } from './analytics/running-averages'
import { lagLead } from './analytics/lag-lead'
import { gapsIslands } from './analytics/gaps-islands'
import { groupingSets } from './analytics/grouping-sets'
import { cohorts } from './analytics/cohorts'
import { baseline } from './performance/baseline'
import { readPlans } from './performance/read-plans'
import { estimates } from './performance/estimates'
import { indexDesign } from './performance/index-design'
import { indexFriendly } from './performance/index-friendly'
import { compareAlternatives } from './performance/compare-alternatives'
import { materializedViews } from './performance/materialized-views'
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
  // chapter 5 — combining
  joinCardinality,
  innerJoins,
  outerJoins,
  selfCrossJoins,
  amplification,
  subqueries,
  correlated,
  existsNotIn,
  setOperations,
  views,
  // chapter 6 — analytics
  cteSteps,
  recursive,
  windowPartitions,
  windowFrames,
  rankingTopN,
  runningAverages,
  lagLead,
  gapsIslands,
  groupingSets,
  cohorts,
  // chapter 7 — performance
  baseline,
  readPlans,
  estimates,
  indexDesign,
  indexFriendly,
  compareAlternatives,
  materializedViews,
]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
