import type { Course } from '../types'
import { theBrief } from './01-the-brief'
import { model } from './02-model'
import { secure } from './03-secure'
import { load } from './04-load'
import { analyze } from './05-analyze'
import { report } from './06-report'
import { optimize } from './07-optimize'
import { shipped } from './08-shipped'

// capstone — one e-commerce database, built end to end with no new SQL. Eight sections: the brief,
// then the six project steps (model · secure · load · analyze · report · optimize), then shipped.
// Every section rides a scene carrying the shared six-step strip and sets `focus` to its own step,
// which is how the narration's promise that "the flow up top will light up step by step" is kept
// without a camera. Course COMPLETE — 8 sections, 8 scenes, 8 wavs (8.4 min).
export const capstone: Course = {
  id: 'capstone',
  title: 'The project',
  sections: [
    theBrief,
    model,
    secure,
    load,
    analyze,
    report,
    optimize,
    shipped,
  ],
}
