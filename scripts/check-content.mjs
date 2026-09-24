// Content budget guard. Two hard limits the engine does NOT enforce for you — both cause silent
// visual breakage rather than a build error, so they are checked here:
//
//   1. LEAF CARDS are a fixed NODE_W×NODE_H (210×96). Only containers grow to fit their text
//      (layout.ts headerHeight). A leaf whose label/sub overruns the ~134px text column spills
//      outside its card, top and bottom — the text block is vertically centred.
//   4. A `focus:` on a Section that names no node in its scene is a silent no-op — SceneView marks
//      `__focus` by id comparison and simply never matches, so the section renders with nothing lit.
//
//   3. An `icon:` key that is NOT in lucideIcons.ts silently falls back to the PATTERN's default
//      glyph — NodeIcon looks the name up and shrugs when it misses. So a typo (`filter` instead of
//      the registered `funnel`) renders a plausible-looking wrong icon and nothing complains.
//
//   2. SLIDES do not scale to fit. useSlideScale sets `zoom = paneWidth / 806` — width-proportional
//      only — so type size is fixed by the frame and an over-long slide CLIPS at the bottom
//      (.slide-panel is `align-items: safe center`, which falls back to start when content
//      overflows). The pane is ~1080 DESIGN px tall, so the check MODELS the rendered height.
//
//      Character count is a poor proxy and was the earlier check: a bullet-heavy slide renders far
//      taller than a prose one of the same length. The slide that actually clipped was 869 chars
//      (modelling 1198px) while a 895-char slide rendered fine (953px) — the bullets each wrapped to
//      two lines. Height is what matters.
//
// Run: npm run check
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// --- leaf-card budget -------------------------------------------------------------------------
// A leaf card is 210×96 with a 134px text column (icon 26 + gap 14 + padding 18×2). What matters is
// how many LINES the text wraps to, and the ceiling is the CARD'S OWN HEIGHT — not another repo's
// tolerance. Practical rule: keep the LABEL to 2 wrapped lines; 2 label + 2 sub = 76px and fits.
const CARD_H_MAX = 92
const LABEL_CPL = 12 // chars per line at 18px/600 in a 134px column (word-wrapped, measured)
const SUB_CPL = 20 // chars per line at 13px
const LINE_LABEL = 21.6 // 18px × 1.2
const LINE_SUB = 15.6 // 13px × 1.2
// Landscape design metrics, read off index.css (.stage--section .slide-panel__scaler).
const SLIDE_H_MAX = 1100 // pane ≈ 1080; the model runs ~7% high, so this is the practical ceiling
const PANE = 806, PAD_X = 60, FS = 26
const TEXT_W = PANE - PAD_X * 2 // 686
const LI_W = TEXT_W - 30 // li has padding-left: 30
const BODY_LH = FS * 1.45
const H2_H = FS * 1.73 * 1.15
const H3_H = FS * 1.2 * 1.2
const CPX = 12.4 // px per character at 26px IBM Plex Sans (measured off a rendered slide)

/** Wrapped line count for one markdown block at the given column width. */
function textLines(text, widthPx) {
  // **bold** is ~10% wider at weight 700 — pad it so a bold-heavy line wraps when it really does.
  const padded = text.replace(/\*\*(.+?)\*\*/g, (_, b) => b + 'x'.repeat(Math.ceil(b.length * 0.1)))
  const clean = padded.replace(/[*`_]/g, '')
  const cpl = Math.floor(widthPx / CPX)
  let n = 1
  let cur = 0
  for (const w of clean.split(/\s+/)) {
    const add = w.length + (cur ? 1 : 0)
    if (cur + add > cpl && cur) {
      n++
      cur = w.length
    } else cur += add
  }
  return n
}

/** Modelled rendered height of a slide, in design px. Adjacent CSS margins COLLAPSE to their max. */
function slideHeight(md) {
  const blocks = []
  let ul = null
  const closeUl = () => {
    if (ul) {
      blocks.push({ mt: 0, h: ul.lines * BODY_LH + (ul.items - 1) * 14, mb: 18 })
      ul = null
    }
  }
  for (const raw of md.split('\n')) {
    const l = raw.trim()
    if (!l) continue
    if (l.startsWith('## ')) {
      closeUl()
      blocks.push({ mt: 0, h: H2_H, mb: 20 })
    } else if (l.startsWith('### ')) {
      closeUl()
      blocks.push({ mt: 30, h: H3_H, mb: 12 })
    } else if (/^([-*]|\d+\.)\s/.test(l)) {
      ul ??= { lines: 0, items: 0 }
      ul.items++
      ul.lines += textLines(l.replace(/^([-*]|\d+\.)\s/, ''), LI_W)
    } else {
      closeUl()
      blocks.push({ mt: 0, h: textLines(l, TEXT_W) * BODY_LH, mb: 16 })
    }
  }
  closeUl()
  let h = 0
  let prevMb = 0
  blocks.forEach((b, i) => {
    h += (i === 0 ? 0 : Math.max(prevMb, b.mt)) + b.h
    prevMb = b.mb
  })
  return Math.round(h) // CSS zeroes the last child's margin-bottom
}

/** Word-aware line count for `text` in a column `cpl` characters wide. */
function wrapLines(text, cpl) {
  let lines = 1
  let cur = 0
  for (const w of text.split(/\s+/)) {
    const add = w.length + (cur ? 1 : 0)
    if (cur + add > cpl && cur) {
      lines += 1
      cur = w.length
    } else cur += add
  }
  return lines
}

// A long UNBREAKABLE token overflows SIDEWAYS, which the height model above cannot see: wrapLines
// puts it on a line of its own and counts it as one line, so the height looks fine while the text
// spills past the card's edge. Hyphens ARE break opportunities in CSS; underscores, dots, slashes and
// parentheses are NOT — so `/Volumes/catalog/schema/name/…` cannot wrap at all.
// Calibrated from what renders: `hive_metastore` (14) fits a label, `catalog.schema.table` (20) fits
// a sub, `/Volumes/catalog/schema/name/…` (30) overflowed.
const LABEL_TOKEN_MAX = 14
const SUB_TOKEN_MAX = 20

/** The longest run of characters with no break opportunity in it. */
const longestToken = (text) =>
  text
    .replace(/[*`_]/g, '')
    .split(/[\s\-\u2013\u2014]+/)
    .reduce((a, b) => (b.length > a.length ? b : a), '')

/** Modelled rendered height of a leaf card's text block. */
const cardHeight = (label, sub) =>
  wrapLines(label, LABEL_CPL) * LINE_LABEL + (sub ? 2 + wrapLines(sub, SUB_CPL) * LINE_SUB : 0)

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : []
  })

const problems = []

// --- scenes: leaf-card label/sub budget ------------------------------------------------------
for (const file of walk('src/scenes')) {
  const src = readFileSync(file, 'utf8')
  // A node object is a leaf unless it declares `children:` before the next `id:`.
  const nodeRe = /\{\s*id: '([\w-]+)',([\s\S]*?)(?=\n\s*\{\s*id: '|\n\s*\],|\n\s*\}\s*,?\s*$)/g
  for (const [, id, body] of src.matchAll(nodeRe)) {
    // Containers grow to fit (layout.ts headerHeight); tiles, code cards and TABLES size themselves.
    if (/\bchildren:/.test(body) || /\bkind: '(code|table)'/.test(body) || /variant: 'tile'/.test(body)) continue
    const label = (body.match(/\blabel: '([^']*)'/) || ['', ''])[1] || (src.match(new RegExp(`id: '${id}',\\s*\\n?\\s*label: '([^']*)'`)) || ['', ''])[1]
    const sub = (body.match(/\bsub: '([^']*)'/) || ['', ''])[1]
    if (!label) continue
    const h = cardHeight(label, sub)
    if (h > CARD_H_MAX) {
      problems.push(`${file}  node "${id}"  card ${Math.round(h)}px > ${CARD_H_MAX}: "${label}" / "${sub}"`)
    }
    for (const [field, text, max] of [
      ['label', label, LABEL_TOKEN_MAX],
      ['sub', sub, SUB_TOKEN_MAX],
    ]) {
      if (!text) continue
      const tok = longestToken(text)
      if (tok.length > max) {
        problems.push(`${file}  node "${id}"  ${field} token ${tok.length}>${max} cannot wrap: ${tok}`)
      }
    }
  }
}

// --- scenes: icon keys — GUARD REMOVED, deliberately -------------------------------------------
// This block read every src/render-engine/*Icons.ts to build the set of valid `icon:` names. The
// engine extraction deleted that directory, so from then on `npm run check` threw ENOENT here and
// NOTHING below it ran — the focus guard, the wav guard and the slide-height budget were all dead in
// this repo while the command still looked like it was doing its job. That is worse than not having
// the guard, which is why it goes rather than getting a try/catch.
//
// It cannot simply be repointed at node_modules/@graphlearning/flow. The published package does not
// enumerate its keys: dist/lucideIcons.d.ts is `Record<string, LucideIcon>`, and in dist/index.js the
// registry BINDINGS are minified (LUCIDE_ICONS becomes `ga`) even though the keys survive — so there
// is no stable anchor to parse against, only a heuristic that would start false-flagging on the next
// engine build. snowflake reached the same conclusion and dropped the guard first; this matches it so
// all five repos that carry check-content.mjs behave the same way.
//
// What that costs: NodeIcon falls back to the pattern glyph on an unknown key, so a typo still draws
// the wrong picture silently. Keep icon names honest by eye until the engine exports its key list —
// one `ICON_KEYS: string[]` export would make this guard both possible and better than it was, since
// it would read the engine actually installed rather than a local copy that could drift.

// --- content: every `focus` must name a node in that section's scene -------------------------
// SceneView sets `__focus` by comparing ids, so a focus that matches nothing just fails to light
// anything — no error, no warning. Node ids are collected per scene file; the capstone's shared
// strip (scenes/capstone/steps.ts) is spread into several scenes, so its ids count for all of them.
const sceneNodeIds = new Map()
let sharedIds = []
for (const file of walk('src/scenes')) {
  const src = readFileSync(file, 'utf8')
  // Ids are usually literals, but a shared factory may reference a constant map (steps.ts writes
  // `id: STEP_IDS.model`). Resolve those against `prop: 'value'` entries in the same file, rather
  // than sweeping up every quoted string — that would pull in labels and patterns and weaken this.
  const consts = new Map([...src.matchAll(/^\s*(\w+): '([\w-]+)',$/gm)].map((m) => [m[1], m[2]]))
  const ids = [
    ...[...src.matchAll(/\bid: '([\w-]+)',/g)].map((m) => m[1]),
    ...[...src.matchAll(/\bid: \w+\.(\w+),/g)].map((m) => consts.get(m[1])).filter(Boolean),
  ]
  const sceneId = (src.match(/^\s*id: '([\w-]+)',$/m) || [])[1]
  // A module with no top-level Scene id is a shared node factory (steps.ts) — its ids are in scope
  // for every scene that spreads it.
  if (!sceneId || !/:\s*Scene\s*=/.test(src)) sharedIds.push(...ids)
  else sceneNodeIds.set(sceneId, new Set(ids))
}
for (const [, ids] of sceneNodeIds) for (const id of sharedIds) ids.add(id)
for (const file of walk('src/content')) {
  const src = readFileSync(file, 'utf8')
  const focus = (src.match(/\bfocus: '([\w-]+)'/) || [])[1]
  if (!focus) continue
  const scene = (src.match(/\bscene: '([\w-]+)'/) || [])[1]
  const ids = sceneNodeIds.get(scene)
  if (!ids) problems.push(`${file}  scene '${scene}' not found`)
  else if (!ids.has(focus)) problems.push(`${file}  focus '${focus}' names no node in scene '${scene}' — nothing will light up`)
}

// --- content: slide budget --------------------------------------------------------------------
for (const file of walk('src/content')) {
  const src = readFileSync(file, 'utf8')
  const m = src.match(/slide: `([\s\S]*?)`,\n  narration/)
  if (!m) continue
  const slide = m[1].replace(/\\`/g, '`')
  const h = slideHeight(slide)
  if (h > SLIDE_H_MAX) problems.push(`${file}  slide ${h}px > ${SLIDE_H_MAX} — clips at the bottom`)
}

if (problems.length) {
  console.error(`✗ ${problems.length} content-budget violation(s):\n` + problems.map((p) => '  ' + p).join('\n'))
  process.exit(1)
}
console.log('✓ content budgets OK')
