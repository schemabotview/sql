// Slide-height measurement, OFFLINE — no dev server, no browser.
//
// `npm run check` tells you only pass/fail against the ceiling. This prints the modelled height and
// the remaining slack for every section, which is what you need while AUTHORING: it turns "trim this
// slide" from guesswork into one number per file.
//
// The model is SLICED OUT OF check-content.mjs at runtime rather than copied. A copy would drift the
// first time anyone recalibrates a constant there, and a drifted model is worse than none — it would
// report slack on a slide that clips.
//
// IMPORTANT: this model carries a documented ±3.5% error (see the long note in check-content.mjs),
// and it has been wrong in the direction that matters: ch3 §3 modelled 1039 against a 1078 ceiling,
// passed, and rendered 1096 in the DOM. Treat a slack under ~60px as "measure it in the browser".
// THE ORACLE IS THE RENDERED DOM — use measure-frames.mjs.
//
//   node scripts/measure-slides.mjs              # every section
//   node scripts/measure-slides.mjs programming  # one course
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const guard = readFileSync('scripts/check-content.mjs', 'utf8')
const start = guard.indexOf('const SLIDE_H_MAX')
const end = guard.indexOf('// --- scenes:')
if (start === -1 || end === -1) {
  console.error('could not locate the slide model in scripts/check-content.mjs — has it been restructured?')
  process.exit(1)
}
const tmp = join(tmpdir(), `slide-model-${process.pid}.mjs`)
writeFileSync(tmp, guard.slice(start, end) + '\nexport { slideHeight, SLIDE_H_MAX }\n')
const { slideHeight, SLIDE_H_MAX } = await import(`file://${tmp}`)

const only = process.argv[2]
const courses = readdirSync('src/content').filter(
  (d) => statSync(join('src/content', d)).isDirectory() && (!only || d === only),
)

let worst = Infinity
for (const course of courses.sort()) {
  console.log(`\n${course}`)
  for (const f of readdirSync(join('src/content', course)).filter((f) => /^\d/.test(f)).sort()) {
    const src = readFileSync(join('src/content', course, f), 'utf8')
    const m = src.match(/slide: `([\s\S]*?)`,\n  narration/)
    if (!m) continue
    const h = slideHeight(m[1].replace(/\\`/g, '`'))
    const slack = SLIDE_H_MAX - h
    worst = Math.min(worst, slack)
    const flag = slack < 0 ? '✗ OVER' : slack < 60 ? '~ tight' : '✓'
    console.log(`  ${flag.padEnd(8)} ${String(h).padStart(4)}px  slack ${String(slack).padStart(5)}  ${f}`)
  }
}
console.log(`\nceiling ${SLIDE_H_MAX}px · tightest slack ${worst}px`)
console.log('slack under ~60px is inside the model error — verify it with scripts/measure-frames.mjs')
