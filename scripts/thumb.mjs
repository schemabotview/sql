// thumb.mjs — a crisp, branded YouTube thumbnail for a course.
//
//   node scripts/thumb.mjs <course> [--section N] [--beat N]
//                          [--title T] [--kicker K] [--number NN] [--panel css] [--out file] [--full4k] [--at ms]
//   node scripts/thumb.mjs setup
//
// Adapted from the GraphL index-site thumbnailer for this single-app repo (<course> only). The
// reference read a built public/courses.json for the concept + title; this app keeps them in the
// typed registry (CONCEPT, courses) + scripts/titles.json, evaluated via esbuild.
//
// The thumbnail is a TEMPLATE (thumb-template.html): LEFT = the course scene as it renders (a
// lossless screenshot of the scene pane — no slide pane), RIGHT = an HTML/CSS panel driven by the
// concept + course (kicker = concept, title = course title) with the GraphL wordmark (+ an optional
// logo mark if one is present).
//
// It's composited in the app's OWN page so the panel inherits the app's self-hosted Plex fonts (no
// CDN, crisp text — never ffmpeg drawtext). Like record-course.mjs it drives the app in ?capture=1
// off window.__capture (plan → seek → __captureReady), spawns the app's `npm run dev` unless
// APP_URL reuses a server, supersamples to SCALE× (4K), then downscales to 1280×720 (Lanczos).
//
// Prerequisites: ffmpeg on PATH (Homebrew preferred, as with record-course.mjs).

import { execFile, spawn } from 'node:child_process'
import { build } from 'esbuild'
import { mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs'
import { promisify } from 'node:util'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, isAbsolute } from 'node:path'

const run = promisify(execFile)
const here = dirname(fileURLToPath(import.meta.url))
const appDir = resolve(here, '..') // scripts/ lives inside the concept app
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')) } catch { return null } }

// Same supersampling as record-course.mjs: render the 1920×1080 stage at SCALE× device pixels so
// text re-rasterizes crisp, then downscale. SCALE=2 → a 3840×2160 master → 1280×720 thumbnail.
const W = 1920
const H = 1080
const SCALE = process.env.SCALE ? +process.env.SCALE : 2
const CW = W * SCALE
const CH = H * SCALE

// Prefer a Homebrew ffmpeg (same choice record-course.mjs makes) for the Lanczos downscale.
const FFMPEG =
  process.env.FFMPEG ??
  ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg'].find(existsSync) ??
  'ffmpeg'

const TEMPLATE = join(here, 'thumb-template.html')
// Optional GraphL mark for the panel foot. Drop an SVG at any of these paths to show it; otherwise
// the foot renders the "GraphL" wordmark alone. Override with LOGO_SVG=/path.
const LOGO_CANDIDATES = [
  process.env.LOGO_SVG,
  join(here, 'logo.svg'),
  join(appDir, 'public', 'icon.svg'),
].filter(Boolean)
const LOGO_SVG = LOGO_CANDIDATES.find(existsSync) ?? null

// The right-side panel gradient (brand block). Single default for this concept; override per-thumb
// with --panel. Teal/cyan distinguishes SQL from the other concepts in the catalog and reads well
// against the Zed-slate scene on the left; white text stays high-contrast.
const DEFAULT_PANEL_BG = 'radial-gradient(118% 104% at 70% 34%, #34e0d0 0%, #0e8f9e 44%, #062028 100%)'
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// A slug → display fallback ("data-structures" → "Data Structures") when the registry lacks it.
const titleCase = (slug) => slug.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

// ---- CLI --------------------------------------------------------------------------------
function parse(argv) {
  const pos = []
  const opt = { section: 0, beat: 0, at: 1200, out: null, full4k: false, title: null, kicker: null, number: null, panel: null }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--section') opt.section = +argv[++i]
    else if (a === '--beat') opt.beat = +argv[++i]
    else if (a === '--at') opt.at = +argv[++i]
    else if (a === '--out') opt.out = argv[++i]
    else if (a === '--title') opt.title = argv[++i]
    else if (a === '--kicker') opt.kicker = argv[++i]
    else if (a === '--number') opt.number = argv[++i]
    else if (a === '--panel') opt.panel = argv[++i]
    else if (a === '--full4k') opt.full4k = true
    else pos.push(a)
  }
  return { pos, opt }
}

// ---- the concept app dev server (same handshake as record-course.mjs) --------------------
async function startDevServer(conceptDir) {
  console.log(`Starting dev server: ${conceptDir} …`)
  const child = spawn('npm', ['run', 'dev'], { cwd: conceptDir, env: process.env })
  const url = await new Promise((res, rej) => {
    const to = setTimeout(() => rej(new Error('dev server did not print a URL within 60s')), 60000)
    const onData = (buf) => {
      const m = String(buf).match(/https?:\/\/localhost:\d+\/?/)
      if (m) { clearTimeout(to); child.stdout.off('data', onData); res(m[0].replace(/\/?$/, '/')) }
    }
    child.stdout.on('data', onData)
    child.stderr.on('data', (b) => process.env.DEBUG && process.stderr.write(b))
    child.on('exit', (code) => rej(new Error(`dev server exited early (code ${code})`)))
  })
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(url)).ok) break } catch { /* not up yet */ }
    await sleep(250)
  }
  console.log(`  dev server at ${url}`)
  return { child, url }
}

// concept + course title from the typed registry (CONCEPT, courses) + scripts/titles.json override,
// so the panel copy matches what ships. esbuild strips the type-only reveal-engine import.
async function courseMeta(course) {
  try {
    const result = await build({
      entryPoints: [resolve(appDir, 'src/content/courses/index.ts')],
      bundle: true, format: 'esm', platform: 'node', write: false, external: ['reveal-engine'],
    })
    const code = result.outputFiles[0].text
    const reg = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
    const titles = readJson(join(here, 'titles.json')) ?? {}
    const c = reg.courses?.find((x) => x.id === course)
    return { concept: reg.CONCEPT ?? null, title: titles[course] ?? c?.title ?? null }
  } catch {
    return { concept: null, title: null }
  }
}

// ---- thumbnail --------------------------------------------------------------------------
async function makeThumb(course, opt) {
  if (!existsSync(TEMPLATE)) throw new Error(`template not found: ${TEMPLATE}`)

  const outDir = join(here, 'out')
  mkdirSync(outDir, { recursive: true })
  const outArg = opt.out ?? `${course}.png`
  const out = isAbsolute(outArg) || outArg.includes('/') ? outArg : join(outDir, outArg)

  // Spawn the dev server (unless APP_URL reuses an existing one).
  let server = null
  const base = process.env.APP_URL ? process.env.APP_URL.replace(/\/?$/, '/') : null
  const appBase = base ?? (server = await startDevServer(appDir), server.url)

  const puppeteer = (await import('puppeteer')).default
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: CW, height: CH, deviceScaleFactor: 1 },
      args: [`--window-size=${CW},${CH}`, '--autoplay-policy=no-user-gesture-required'],
    })
    const page = await browser.newPage()
    await page.goto(`${appBase}?capture=1#/${course}`, { waitUntil: 'networkidle2' })

    // Validate section/beat against the app's own layout (same source record-course.mjs uses).
    await page.waitForFunction(() => !!window.__capture, { timeout: 20000 })
    const plan = await page.evaluate(() => window.__capture.plan())
    if (!plan?.length) throw new Error(`course "${course}" has no sections (bad id?)`)
    const sec = plan[opt.section]
    if (!sec) throw new Error(`section ${opt.section} out of range (course has ${plan.length})`)
    if (opt.beat < 0 || opt.beat >= sec.beats)
      throw new Error(`beat ${opt.beat} out of range for §${opt.section} ${sec.id} (${sec.beats} beats)`)

    // Position off the pure fold → wait for the painted, already-framed frame → let it settle.
    await page.evaluate(({ s, b }) => { window.__captureReady = false; window.__capture.seek(s, b) },
      { s: opt.section, b: opt.beat })
    await page.waitForFunction(() => window.__captureReady === true, { timeout: 20000 }).catch(() => {})
    await page.waitForSelector('.scene-node, .react-flow', { timeout: 15000 }).catch(() => {})
    await sleep(opt.at)

    // LEFT — screenshot just the scene pane (no slide pane) → data URI for the template.
    const scenePane = await page.$('.rp-scene-pane')
    if (!scenePane) throw new Error('.rp-scene-pane not found (engine markup changed?)')
    const sceneB64 = await scenePane.screenshot({ encoding: 'base64' })
    const sceneUri = `data:image/png;base64,${sceneB64}`

    // Panel copy: kicker = concept, title = course title (registry/titles.json → flags override → slug).
    const meta = await courseMeta(course)
    const kicker = opt.kicker ?? meta.concept ?? titleCase(course)
    const title = opt.title ?? meta.title ?? titleCase(course)
    const numberHtml = opt.number ? `<div class="thumb__number">${esc(opt.number)}</div>` : ''
    // Logo is optional: show the mark if one is present, else just the wordmark.
    const logoSvg = LOGO_SVG ? readFileSync(LOGO_SVG, 'utf8').replace('<svg ', '<svg class="thumb__logo" ') : ''
    const panelBg = opt.panel ?? DEFAULT_PANEL_BG

    const html = readFileSync(TEMPLATE, 'utf8')
      .replaceAll('{{SCENE}}', sceneUri)
      .replaceAll('{{KICKER}}', esc(kicker))
      .replaceAll('{{NUMBER}}', numberHtml)
      .replaceAll('{{TITLE}}', esc(title))
      .replaceAll('{{LOGO}}', logoSvg)
      .replaceAll('{{PANEL_BG}}', panelBg)

    // Composite IN the app page so the panel inherits the loaded Plex fonts: replace only the BODY
    // (keeping the head's @fontsource @font-face rules), then wait for the fonts + a layout tick.
    await page.evaluate((h) => { document.body.innerHTML = h }, html)
    await page.evaluate(() => document.fonts.ready)
    await sleep(200)

    // Lossless 4K screenshot of the composed frame → downscale to 1280×720 (Lanczos).
    mkdirSync(dirname(out), { recursive: true })
    const shot = opt.full4k ? out : join(tmpdir(), `thumb-4k-${Date.now()}.png`)
    await page.screenshot({ path: shot })
    if (!opt.full4k) {
      await run(FFMPEG, ['-y', '-loglevel', 'error', '-i', shot, '-vf', 'scale=1280:720:flags=lanczos', out])
      rmSync(shot, { force: true })
    }
    console.log(`\n✅ ${out}   (${kicker} — ${title})`)
    return out
  } finally {
    if (browser) await browser.close()
    if (server) server.child.kill('SIGTERM')
  }
}

const { pos, opt } = parse(process.argv.slice(2))
const [course] = pos
if (!course) {
  console.error('usage: node scripts/thumb.mjs <course> [--section N] [--beat N] [--title T] [--kicker K] [--number NN] [--panel css-gradient] [--out file] [--full4k] [--at ms]')
  process.exit(2)
}
makeThumb(course, opt).catch((e) => {
  console.error('\n✗', e.message)
  process.exit(1)
})
