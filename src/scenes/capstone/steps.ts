import type { SceneNode } from '@graphlearning/flow'

// The shared six-step strip that sits at the top of EVERY capstone scene.
//
// It exists because the narration promises it: §1 says the plan is "laid out as a flow across the
// top" and that "the flow up top will light up step by step". That was written for the old
// reveal-engine's camera, which this engine does not have — but each section here has its OWN scene,
// so the lighting-up happens ACROSS scenes instead of within one: every scene carries this strip, and
// each Section sets `focus` to its own step id, which makes that one node glow (SceneView passes
// focusId → SceneNode paints the glow). Same promise, no camera.
//
// Node ids only need to be unique WITHIN a scene, so the same strip can be spread into all eight.
// Tiles rather than an edged chain: six cards strung on arrows run ~1218px wide and push every
// capstone scene past a 2:1 aspect, where fitView starts shrinking everything. The numbers carry the
// sequence that the arrows would have.
export const STEP_IDS = {
  model: 'step-model',
  secure: 'step-secure',
  load: 'step-load',
  analyze: 'step-analyze',
  report: 'step-report',
  optimize: 'step-optimize',
} as const

export function projectSteps(): SceneNode {
  return {
    id: 'plan',
    label: 'The project',
    pattern: 'group',
    cols: 6,
    children: [
      { id: STEP_IDS.model, label: '1 Model', variant: 'tile', pattern: 'storage', icon: 'table', sub: 'course 1' },
      { id: STEP_IDS.secure, label: '2 Secure', variant: 'tile', pattern: 'user', icon: 'lock', sub: 'course 3' },
      { id: STEP_IDS.load, label: '3 Load', variant: 'tile', pattern: 'user', icon: 'dooropen', sub: 'course 3' },
      { id: STEP_IDS.analyze, label: '4 Analyze', variant: 'tile', pattern: 'network', icon: 'funnel', sub: 'course 2' },
      { id: STEP_IDS.report, label: '5 Report', variant: 'tile', pattern: 'network', icon: 'tag', sub: 'course 2' },
      { id: STEP_IDS.optimize, label: '6 Optimize', variant: 'tile', pattern: 'service', icon: 'gauge', sub: 'course 4' },
    ],
  }
}
