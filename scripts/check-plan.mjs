// Plan conformance guard. SQL-COURSE-PLAN.md is the syllabus; this holds src/content to it so the
// app cannot drift from the reviewed plan. It reads the plan, then checks every authored section:
//
//   1. the plan parses: 10 chapters, and the section counts its header declares match the lists
//   2. each course folder is a plan chapter (by order), and its Course title is the chapter title
//   3. each section file is `NN-<id>.ts`, NN is a real section number of that chapter, no NN twice
//   4. the section's title is the plan's section title, word for word
//
// Titles are enforced verbatim on purpose: the plan's wording is the reviewed artefact, and a
// section that has been quietly renamed is a section the reviewers no longer recognise.
// It also prints coverage (authored / planned per chapter), so progress is a number, not a feeling.
//
// Run: npm run check
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const COURSE_IDS = ['foundations', 'structures', 'loading', 'retrieval', 'combining', 'analytics', 'performance', 'modification', 'transactions', 'access']

const plan = readFileSync('SQL-COURSE-PLAN.md', 'utf8')
const chapters = []
let cur = null
for (const line of plan.split('\n')) {
  const h = line.match(/^## Chapter (\d+) — (.+)$/)
  if (h) {
    cur = { n: Number(h[1]), title: h[2].trim(), sections: [] }
    chapters.push(cur)
    continue
  }
  if (line.startsWith('## ')) cur = null // Sources and scope etc.
  const s = line.match(/^(\d+)\. (.+)$/)
  if (cur && s) cur.sections.push({ n: Number(s[1]), title: s[2].trim() })
}

const problems = []
const bad = (m) => problems.push(m)

const declared = (plan.match(/section counts of ([^.]+)\./)?.[1] ?? '').match(/\d+/g)?.map(Number) ?? []
if (chapters.length !== COURSE_IDS.length) bad(`plan has ${chapters.length} chapters, this guard knows ${COURSE_IDS.length} course ids`)
if (declared.join() !== chapters.map((c) => c.sections.length).join()) {
  bad(`plan header declares section counts [${declared}] but the lists have [${chapters.map((c) => c.sections.length)}]`)
}

let authored = 0
const total = chapters.reduce((a, c) => a + c.sections.length, 0)
const rows = []
chapters.forEach((ch, i) => {
  const id = COURSE_IDS[i]
  const dir = join('src/content', id)
  let done = 0
  if (existsSync(dir)) {
    const idx = join(dir, 'index.ts')
    if (existsSync(idx)) {
      const t = readFileSync(idx, 'utf8').match(/title:\s*'([^']*)'/)?.[1]
      if (t !== ch.title) bad(`${idx}: course title '${t}' is not the plan's chapter title '${ch.title}'`)
    }
    const seen = new Set()
    for (const f of readdirSync(dir).filter((f) => /^\d+-.+\.ts$/.test(f))) {
      const n = Number(f.match(/^(\d+)-/)[1])
      const sec = ch.sections.find((s) => s.n === n)
      if (!sec) { bad(`${dir}/${f}: the plan has no section ${n} in chapter ${ch.n} (it has ${ch.sections.length})`); continue }
      if (seen.has(n)) bad(`${dir}: two files claim section ${n}`)
      seen.add(n)
      const title = readFileSync(join(dir, f), 'utf8').match(/title:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'")
      if (title !== sec.title) bad(`${dir}/${f}: title '${title}' is not the plan's '${sec.title}'`)
      done++
    }
  }
  authored += done
  rows.push(`  ch ${String(ch.n).padStart(2)}  ${id.padEnd(13)} ${String(done).padStart(2)} / ${String(ch.sections.length).padStart(2)}   ${ch.title}`)
})
for (const d of existsSync('src/content') ? readdirSync('src/content', { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : []) {
  if (!COURSE_IDS.includes(d)) bad(`src/content/${d} is not a course in the plan (expected one of ${COURSE_IDS.join(', ')})`)
}

console.log(rows.join('\n'))
console.log(`  authored ${authored} of ${total} planned sections`)
if (problems.length) {
  console.error(`\n✗ ${problems.length} plan-conformance problem(s):`)
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log('✓ content matches SQL-COURSE-PLAN.md')
