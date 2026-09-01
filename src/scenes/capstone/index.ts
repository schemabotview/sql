import type { Scene } from '../../render-engine'
import { projectPlan } from './project-plan'
import { capModel } from './cap-model'
import { capSecure } from './cap-secure'
import { capLoad } from './cap-load'
import { capAnalyze } from './cap-analyze'
import { capReport } from './cap-report'
import { capOptimize } from './cap-optimize'
import { capShipped } from './cap-shipped'

// Scenes for the `capstone` course — one per section, and the only course where every scene shares a
// common element: the six-step strip from `steps.ts`, with each Section focusing its own step. That
// is how this engine keeps the narration's promise that "the flow up top will light up step by step"
// without the camera the promise was written for. Six of the eight are code cards, because the
// narration also promises "the real SQL for each step appears as code on the left".
export const capstoneScenes: Scene[] = [
  projectPlan,
  capModel,
  capSecure,
  capLoad,
  capAnalyze,
  capReport,
  capOptimize,
  capShipped,
]
