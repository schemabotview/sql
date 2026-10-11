// Render sections at 1920×1080 and report what the guards cannot see: page errors, text clipped in
// the slide panel, and the scene's rendered scale. `tsc`, `check` and `build` all pass on frames
// that are visually wrong, so this is the step that matters.
//
//   npm run dev &                                   # the app on :5173
//   node scripts/shot.mjs <outDir> [slug ...]       # no slugs = every section
//
// Slugs are `<courseId>-<sectionId>` (the route is `#/<slug>`); `?capture=1` is the recorder's view.
import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [outDir, ...only] = process.argv.slice(2)
if (!outDir) {
  console.error('usage: node scripts/shot.mjs <outDir> [slug ...]')
  process.exit(1)
}
mkdirSync(outDir, { recursive: true })
const SLIDE_PANE = 1078 // the slide pane's height in design px (see check-content.mjs)
const base = process.env.APP_URL ?? 'http://localhost:5173/'
const exe = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium'

const browser = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox'], defaultViewport: { width: 1920, height: 1080 } })
const page = await browser.newPage()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
// The engine's TableNode logs React's "unique key" warning in dev on every route with a table node
// (a published-package bug, no effect on the render) — see CLAUDE.md. Anything else is real.
const KNOWN = /unique "key" prop/
page.on('console', (m) => m.type() === 'error' && !KNOWN.test(m.text()) && errors.push(m.text()))

let slugs = only
if (!slugs.length) {
  await page.goto(base)
  await page.waitForSelector('a[href^="#/"]')
  slugs = [...new Set(await page.$$eval('a[href^="#/"]', (as) => as.map((a) => a.getAttribute('href').slice(2))))]
}
for (const slug of slugs) {
  errors.length = 0
  await page.goto(`${base}?capture=1#/${slug}`)
  await page.waitForSelector('.slide-panel', { timeout: 15000 }).catch(() => {})
  await sleep(1200)
  const m = await page.evaluate(() => {
    const p = document.querySelector('.slide-panel')
    const sc = document.querySelector('.slide-panel__scaler')
    const flow = document.querySelector('.react-flow__viewport')
    const scale = flow ? new DOMMatrix(getComputedStyle(flow).transform).a : null
    // Scene density: the union of every rendered node against the pane that holds the board.
    const pane = document.querySelector('.react-flow')?.getBoundingClientRect()
    let box = null
    for (const n of document.querySelectorAll('.react-flow__node')) {
      const r = n.getBoundingClientRect()
      box = box ? { l: Math.min(box.l, r.left), t: Math.min(box.t, r.top), r: Math.max(box.r, r.right), b: Math.max(box.b, r.bottom) } : { l: r.left, t: r.top, r: r.right, b: r.bottom }
    }
    // The recorded eyebrow ("SQL · CHAPTER") sits top-left of the pane; a board that runs up under
    // it reads as a collision, so report any node that intrudes on it.
    const eb = document.querySelector('[class*="eyebrow"]')?.getBoundingClientRect()
    let hitsEyebrow = false
    if (eb) for (const n of document.querySelectorAll('.react-flow__node')) {
      const r = n.getBoundingClientRect()
      if (r.left < eb.right + 4 && r.right > eb.left && r.top < eb.bottom + 4 && r.bottom > eb.top) hitsEyebrow = true
    }
    const wFill = pane && box ? (box.r - box.l) / pane.width : null
    const hFill = pane && box ? (box.b - box.t) / pane.height : null
    return {
      slideClips: p ? p.scrollHeight > p.clientHeight + 1 : null,
      slideH: sc ? Math.round(sc.scrollHeight) : null,
      scale: scale && Number(scale.toFixed(2)),
      hitsEyebrow,
      wFill: wFill && Number(wFill.toFixed(2)),
      hFill: hFill && Number(hFill.toFixed(2)),
    }
  })
  await page.screenshot({ path: join(outDir, `${slug}.png`) })
  // Density targets: the board's binding axis near full AND at least 55% of the pane's area covered
  // (a wide board that fills the width but only a third of the height still wastes the pane); a slide
  // should fill most of the 1078 design px of its pane without nearing the clip.
  const sceneFill = Math.max(m.wFill ?? 0, m.hFill ?? 0)
  const slideFill = (m.slideH ?? 0) / SLIDE_PANE
  const notes = []
  if (m.slideClips) notes.push('CLIPS')
  if (m.hitsEyebrow) notes.push('touches eyebrow')
  if (slideFill < 0.8) notes.push('slide light')
  if (slideFill > 0.95) notes.push('slide tight')
  const area = (m.wFill ?? 0) * (m.hFill ?? 0)
  if (sceneFill < 0.85 || area < 0.55) notes.push('scene sparse')
  const flag = m.slideClips || errors.length ? '✗' : notes.length ? '~' : '✓'
  console.log(`${flag} ${slug.padEnd(36)} scene ${String(m.wFill).padStart(4)}w ${String(m.hFill).padStart(4)}h  slide ${String(Math.round(slideFill * 100)).padStart(3)}%  ${notes.join(', ')}${errors.length ? '  errors: ' + errors.join(' | ').slice(0, 200) : ''}`)
}
await browser.close()
