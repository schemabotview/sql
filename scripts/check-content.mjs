// Content budget guard. Four silent failures the engine does NOT catch for you — each builds green
// and breaks only on screen, so they are checked here:
//
//   1. LEAF CARDS are a fixed NODE_W×NODE_H (210×96). Only containers grow to fit their text
//      (layout.ts headerHeight). A leaf whose label/sub overruns the ~134px text column spills
//      outside its card, top and bottom — the text block is vertically centred.
//   2. SLIDES do not scale to fit. useSlideScale sets `zoom = paneWidth / 806` — width-proportional
//      only — so type size is fixed by the frame and an over-long slide CLIPS at the bottom
//      (.slide-panel is `align-items: safe center`, which falls back to start when content
//      overflows). The pane is 1081 DESIGN px tall at 16:9, so the check MODELS the rendered height.
//
//      Character count is a poor proxy and was the earlier check: a bullet-heavy slide renders far
//      taller than a prose one of the same length. The slide that actually clipped was 869 chars
//      (modelling 1198px) while a 895-char slide rendered fine (953px) — the bullets each wrapped to
//      two lines. Height is what matters.
//
//      Every constant below is MEASURED off the rendered app (canvas measureText against the real
//      faces, computed styles off the real elements), against 18 slides whose true height was read
//      out of the DOM. It lands within ±3.5%, and that error is irreducible: the face is
//      proportional, so a line of wide words overflows a character budget a line of narrow ones
//      fits, and one wrapped block can be off by a line (37.7px) either way. This catches the gross
//      case. THE ORACLE IS THE RENDERED DOM — see the note on SLIDE_H_MAX.
//   3. A `focus:` on a Section that names no node in its scene is a silent no-op — SceneView marks
//      `__focus` by id comparison and simply never matches, so the section renders with nothing lit.
//   4. A SECTION WITH NO WAV narrates nothing. The app resolves audio by convention —
//      public/audio/<course>/<section-id>.wav — so a renamed section id or a missed file plays
//      silence in the app and records a SILENT segment, with no error anywhere.
//
// NOT checked here: the `icon:` registry guard that data-warehousing/sql/linux carry. Theirs reads
// src/render-engine/*Icons.ts — a path the engine extraction deleted, which is why `npm run check`
// throws ENOENT in those three repos. The published @graphlearning/flow does not enumerate its icon
// keys (dist/lucideIcons.d.ts is just `Record<string, LucideIcon>`), so there is nothing to read
// against. Keep icon names honest by eye until the package exports the registry.
//
// Run: npm run check
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
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
// The pane measures 1078 DESIGN px — read off the rendered app as `panel.clientHeight / zoom`, not
// guessed. Every constant in this model was measured the same way (see CPX below), and against 18
// slides whose true height was read out of the DOM it lands within ±3.5%.
//
// That ±3.5% is IRREDUCIBLE, and worth understanding before tightening this number. The model
// counts characters; the face is proportional, so a line of wide words overflows a character budget
// a line of narrow ones fits. One wrapped block can therefore be off by a line (37.7px) either way.
// Lowering the ceiling to cover the worst undercount would flag six slides that are verified
// correct on screen, which is how a guard gets ignored.
//
// So this catches the gross case, and the ORACLE IS THE RENDERED DOM. To read the truth for a
// section, with the dev server up and the section routed:
//
//   const p = document.querySelector('.slide-panel')
//   const sc = document.querySelector('.slide-panel__scaler')
//   sc.scrollHeight                          // the slide's true design height
//   p.scrollHeight > p.clientHeight + 1      // whether it is actually clipping
const SLIDE_H_MAX = 1078
const PANE = 806, PAD_X = 60, FS = 26
const TEXT_W = PANE - PAD_X * 2 // 686
const LI_W = TEXT_W - 30 // li has padding-left: 30
// An ORDERED list indents further than a bulleted one — the number sits in its own gutter, so the
// text column is ~43px narrower. Measured off a rendered runbook slide whose numbered command list
// wrapped a line more than the model predicted, and clipped.
const LI_W_OL = TEXT_W - 73
// A BLOCKQUOTE is inset: its inner paragraph measures 606px, not 686, and it carries a 26px top
// margin rather than a paragraph's zero. Modelling it as a plain paragraph cost a whole wrapped
// line on every slide that ends in one — measured off the rendered DOM, not read off the CSS.
const QUOTE_W = TEXT_W - 80
const BODY_LH = FS * 1.45
const H2_H = FS * 1.73 * 1.15
const H3_H = FS * 1.2 * 1.2
// Average advance per character at 26px IBM Plex Sans, weight 400 — measured with canvas
// measureText over 4,102 characters of THIS repo's own rendered slide text, which is the only
// corpus that matters. The earlier 12.4 came from measuring an alphabet string, and an alphabet
// over-weights m/w: it made every borderline line wrap one item early and pushed the model's error
// spread to +15%, which is what forced the ceiling up to a value that could not catch a real clip.
const CPX = 11.52
// A heading is set larger AND heavier, so it wraps sooner in the same column.
// Measured the same way, over the headings of nine rendered slides.
const H2_CPX = 20.99
const H3_CPX = 14.95

/** Wrapped line count for one markdown block at the given column width.
 *
 * `cpx` is the per-character width of the FACE THIS BLOCK IS SET IN. It defaults to the body's,
 * but a heading is larger, and a HEADING THAT WRAPS was the one thing this model could not see: the
 * h2/h3 branches below used to push a single line's height unconditionally, so a two-line title was
 * undercounted by a whole line (~52px at h2). `databases` §09 modelled 1096px, passed, and clipped
 * its title at the top and its blockquote at the bottom on screen. */
function textLines(text, widthPx, cpx = CPX) {
  // **bold** is wider at weight 700 — pad it so a bold-heavy line wraps when it really does. The
  // factor is MEASURED over the same corpus: 12.517px per character at weight 700 against 11.518
  // at 400, so 8.7%.
  const padded = text.replace(/\*\*(.+?)\*\*/g, (_, b) => b + 'x'.repeat(Math.ceil(b.length * 0.087)))
  // `inline code` renders as a monospace CHIP, and it is MEASURED rather than guessed: a chip is
  // set at 20.28px mono (≈10.47px per glyph, or 0.91 of a body character) inside 7px of padding
  // either side (≈1.22 body characters). So a chip costs slightly MORE than its characters when it
  // is short and slightly less when it is long — the earlier flat "+2 per chip" over-counted every
  // short one. The replacement is a solid run of x, which also models the chip correctly as
  // UNBREAKABLE: `202 Accepted` cannot wrap at its space.
  const chipped = padded.replace(/`([^`]+)`/g, (_, c) => 'x'.repeat(Math.max(1, Math.round(c.length * 0.91 + 1.22))))
  const clean = chipped.replace(/[*`_]/g, '')
  const cpl = Math.floor(widthPx / cpx)
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
      blocks.push({ mt: 0, h: textLines(l.slice(3), TEXT_W, H2_CPX) * H2_H, mb: 20 })
    } else if (l.startsWith('### ')) {
      closeUl()
      blocks.push({ mt: 30, h: textLines(l.slice(4), TEXT_W, H3_CPX) * H3_H, mb: 12 })
    } else if (/^([-*]|\d+\.)\s/.test(l)) {
      ul ??= { lines: 0, items: 0 }
      ul.items++
      ul.lines += textLines(l.replace(/^([-*]|\d+\.)\s/, ''), /^\d/.test(l) ? LI_W_OL : LI_W)
    } else if (l.startsWith('> ')) {
      closeUl()
      blocks.push({ mt: 26, h: textLines(l.slice(2), QUOTE_W) * BODY_LH, mb: 16 })
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
  // The LAST block's margin-bottom counts. This used to be dropped on the assumption that CSS
  // zeroes it, and it does not: the scaler's scrollHeight includes it, which is exactly the
  // systematic -16px (~1.6%) the model showed against every measured slide.
  return Math.round(h + prevMb)
}

/** Word-aware line count for `text` in a column `cpl` characters wide. */
// A hyphen IS a break opportunity in CSS, so `Non-deterministic` wraps into two rendered lines in a
// 12-char column — but splitting on whitespace alone counted it as one long word on one line, and
// the card it was in overflowed with a green check. Hyphens are turned into spaces here, which
// models the break and costs one character of width per hyphen (erring on the safe side).
function wrapLines(text, cpl) {
  let lines = 1
  let cur = 0
  for (const w of text.replace(/-/g, ' ').split(/\s+/)) {
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
// NOTE: `_` is NOT stripped here, unlike the slide/height models above. In a slide, an underscore
// is usually markdown emphasis and does not render; in a scene LABEL it is a literal glyph, and
// crucially it is not a break opportunity in CSS. Stripping it undercounted every snake_case
// identifier by one character per underscore, which is how `on_schema_change` (16) passed the
// 14-char label budget as "onschemachange" (14) and then overflowed its card on screen.
const longestToken = (text) =>
  text
    .replace(/[*`]/g, '')
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
    // THIRD repo-local fix to azure's copy. The exemption list was `code|table`, but every node with
    // a `kind` is SELF-SIZING — kinds.ts pairs a sizer with each renderer, so plot, list, memory and
    // evolution all reserve their own box from their own content. Measuring one against the 210x96
    // prose-card budget flags a label its sizer handles perfectly well. Found when this repo's first
    // `evolution` node (performance §5) was reported at 157px for a caption that renders correctly.
    if (/\bchildren:/.test(body) || /\bkind: '(code|table|plot|list|memory|evolution)'/.test(body) || /variant: 'tile'/.test(body)) continue
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

// --- content: slide budget --------------------------------------------------------------------
for (const file of walk('src/content')) {
  const src = readFileSync(file, 'utf8')
  const m = src.match(/slide: `([\s\S]*?)`,\n  narration/)
  if (!m) continue
  const slide = m[1].replace(/\\`/g, '`')
  const h = slideHeight(slide)
  if (h > SLIDE_H_MAX) problems.push(`${file}  slide ${h}px > ${SLIDE_H_MAX} — clips at the bottom`)
}

// --- content: every `focus` must name a node in that section's scene -------------------------
// SceneView sets `__focus` by comparing ids, so a focus that matches nothing just fails to light
// anything — no error, no warning. Node ids are collected per scene file; a module with no top-level
// Scene id is a shared node factory, and its ids are in scope for every scene that spreads it.
const sceneNodeIds = new Map()
const sharedIds = []
for (const file of walk('src/scenes')) {
  const src = readFileSync(file, 'utf8')
  const consts = new Map([...src.matchAll(/^\s*(\w+): '([\w-]+)',$/gm)].map((m) => [m[1], m[2]]))
  const ids = [
    ...[...src.matchAll(/\bid: '([\w-]+)',/g)].map((m) => m[1]),
    ...[...src.matchAll(/\bid: \w+\.(\w+),/g)].map((m) => consts.get(m[1])).filter(Boolean),
  ]
  // The scene's own id is the first `id:` AFTER its `: Scene =` declaration, not the first in the
  // file. REPO-LOCAL FIX to azure's copy, and the second one: a scene assembled from extracted
  // `SceneNode` consts (the style ui-flow's own dev/fixtures/studies use, and that this repo's
  // application-shape follows) declares those nodes ABOVE the Scene, so matching the first id in the
  // file picks up a NODE. The scene then has the wrong key in sceneNodeIds and every `focus` into it
  // reports "scene not found" — which looks like the section is broken when the guard is.
  const sceneAt = src.search(/:\s*Scene\s*=/)
  const sceneId = sceneAt === -1 ? undefined : (src.slice(sceneAt).match(/^\s*id: '([\w-]+)',$/m) || [])[1]
  if (!sceneId) sharedIds.push(...ids)
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

// --- content: every section has its narration wav ---------------------------------------------
// src/content/<course>/NN-<id>.ts  ⇄  public/audio/<course>/<id>.wav
//
// Gated PER COURSE on that course having at least one wav. A course still being written has none at
// all — audio is a single Colab pass at the end of authoring — and reporting ten known-missing files
// on every run just trains you to ignore the guard. What it must catch is a course whose audio HAS
// been generated and is now incomplete: a renamed section id, or one file that never came back. So
// the moment a course has its first wav, every section in it is required to have one.
//
// The isDirectory() filter is this repo's addition to azure's copy. Upstream reads every entry of
// public/audio/ as a directory, which throws ENOTDIR on the first FILE it meets — a `.gitkeep`
// holding the empty dir in git, or the `.DS_Store` macOS drops in any folder you open in Finder.
// That aborts the whole script, so every guard above it would stop running too.
const coursesWithAudio = new Set(
  readdirSync('public/audio')
    .filter((c) => statSync(join('public/audio', c)).isDirectory())
    .filter((c) => readdirSync(join('public/audio', c)).some((f) => f.endsWith('.wav'))),
)
for (const file of walk('src/content')) {
  const parts = file.split('/')
  if (parts.length !== 4 || parts[3] === 'index.ts') continue // src/content/<course>/<section>.ts only
  const course = parts[2]
  if (!coursesWithAudio.has(course)) continue // pre-Colab: nothing generated for this course yet
  const src = readFileSync(file, 'utf8')
  if (!/:\s*Section\s*=/.test(src)) continue
  const id = (src.match(/\bid: '([\w-]+)',/) || [])[1]
  const wav = join('public/audio', course, `${id}.wav`)
  if (!existsSync(wav)) problems.push(`${file}  no narration wav at ${wav} — the section plays silence`)
}

if (problems.length) {
  console.error(`✗ ${problems.length} content-budget violation(s):\n` + problems.map((p) => '  ' + p).join('\n'))
  process.exit(1)
}
console.log('✓ content budgets OK')
