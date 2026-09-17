import type { Scene } from '@graphlearning/flow'
import { projectSteps } from './steps'

// §1 project-plan — the brief. No new SQL in this course, so the board is the PLAN: the six steps,
// and which course each one calls back to. The second band is the capstone's actual argument — that
// the pieces learned separately click together into one workflow.
export const projectPlan: Scene = {
  id: 'project-plan',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    projectSteps(),
    {
      id: 'callbacks',
      label: 'Every step is a callback to a course you have already done',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'cb-c1', label: 'Course 1 · DDL', pattern: 'storage', icon: 'table', sub: 'model the schema' },
        { id: 'cb-c3', label: 'Course 3 · DCL, txn', pattern: 'user', icon: 'lock', sub: 'secure it, load it' },
        { id: 'cb-c2', label: 'Course 2 · pipeline', pattern: 'network', icon: 'funnel', sub: 'analyze, report' },
        { id: 'cb-c4', label: 'Course 4 · the engine', pattern: 'service', icon: 'gauge', sub: 'index, then prove it' },
      ],
    },
  ],
  edges: [{ source: 'plan', target: 'callbacks', label: 'no new SQL — every tool here is one you already have' }],
}
