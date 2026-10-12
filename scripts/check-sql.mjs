// SQL correctness guard. Every number and result table on a slide must be what PostgreSQL really
// returns, so this runs the canonical dataset and every SQL snippet in the scenes against a real
// server. Three steps:
//
//   1. rebuild the `shop` schema from db/schema.sql + db/seed.sql
//   2. run db/assertions.sql  — the facts the lessons rely on (row counts, NULL specimens, ...)
//   3. run every CODE node whose `filename` ends in .sql, each in a transaction that is rolled back,
//      so a snippet that deletes rows cannot change what the next one sees
//
// Claims a snippet cannot show (which rule rejects which record, what a failed statement left
// behind) are asserted in db/verify/*.sql: each file is run in a rolled-back transaction and must
// finish without raising. They are the hidden half of a section's evidence.
//
// A snippet that is MEANT to fail (a constraint violation, a permission error) says so on its first
// line with `-- expect-error`, and then must fail. A snippet that is shown but cannot run alone
// (psql meta-commands, two-session demos) is simply not given a .sql filename.
//
// The server is whatever the standard libpq variables name (PGHOST, PGPORT, PGUSER, PGPASSWORD,
// PGDATABASE). CI supplies a postgres service container; locally, `pg_ctlcluster 16 main start`
// or Docker will do.
//
// Run: npm run check:sql
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'

function psql(args, input) {
  return spawnSync('psql', ['-X', '-q', '-v', 'ON_ERROR_STOP=1', ...args], { encoding: 'utf8', input })
}

let failures = 0
const fail = (msg) => {
  failures++
  console.error(`✗ ${msg}`)
}

// --- 1. the dataset ---------------------------------------------------------------------------
const reset = psql(['-f', 'db/schema.sql', '-f', 'db/seed.sql', '-f', 'db/perf.sql'])
if (reset.status !== 0) {
  console.error(reset.stderr || reset.error?.message)
  console.error('✗ could not build the dataset — is a PostgreSQL server reachable via the PG* variables?')
  process.exit(1)
}
console.log('✓ db/schema.sql + db/seed.sql + db/perf.sql load')

// --- 2. assertions ----------------------------------------------------------------------------
const asserts = psql(['-f', 'db/assertions.sql'])
if (asserts.status !== 0) fail(`db/assertions.sql: ${asserts.stderr.trim()}`)
else console.log('✓ db/assertions.sql — the dataset still has the properties the lessons rely on')

// --- 2b. hidden verifications ----------------------------------------------------------------
import { readdirSync, readFileSync, existsSync } from 'node:fs'
let verified = 0
if (existsSync('db/verify')) {
  for (const f of readdirSync('db/verify').filter((f) => f.endsWith('.sql')).sort()) {
    const body = readFileSync(join('db/verify', f), 'utf8')
    const r = psql([], `BEGIN;\nSET search_path = shop;\n${body}\n;ROLLBACK;\n`)
    if (r.status !== 0) fail(`db/verify/${f}: ${r.stderr.trim().split('\n').slice(0, 2).join(' ')}`)
    else verified++
  }
}
console.log(`✓ ${verified} db/verify file(s) hold`)

// --- 3. snippets ------------------------------------------------------------------------------
// Scenes are TypeScript, so bundle the registry with esbuild and import the result.
const work = mkdtempSync(join(tmpdir(), 'check-sql-'))
const out = join(work, 'scenes.mjs')
await build({ entryPoints: ['src/scenes/index.ts'], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent', external: ['@graphlearning/flow'] })
const { SCENES } = await import(pathToFileURL(out).href)
rmSync(work, { recursive: true, force: true })

const snippets = []
const walk = (scene, nodes) => {
  for (const n of nodes) {
    if (n.kind === 'code' && n.filename?.endsWith('.sql')) snippets.push({ where: `${scene}/${n.id}`, sql: n.label })
    if (n.children) walk(scene, n.children)
  }
}
for (const s of Object.values(SCENES)) walk(s.id, s.nodes)

let ran = 0
for (const { where, sql } of snippets) {
  const expectError = /^\s*--\s*expect-error/.test(sql)
  const script = `BEGIN;\nSET search_path = shop;\n${sql}\n;ROLLBACK;\n`
  const r = psql([], script)
  if (expectError && r.status === 0) fail(`${where}: marked -- expect-error but ran cleanly`)
  else if (!expectError && r.status !== 0) fail(`${where}: ${r.stderr.trim().split('\n')[0]}`)
  else ran++
}
console.log(`✓ ${ran} of ${snippets.length} SQL snippets behave as written`)

// --- 4. two-session timelines (chapter 9) -----------------------------------------------------
// Each timeline runs in real, separate sessions against a scratch schema; see check-timelines.mjs.
const tl = spawnSync('node', ['scripts/check-timelines.mjs'], { encoding: 'utf8' })
process.stdout.write(tl.stdout)
if (tl.status !== 0) fail(`scripts/check-timelines.mjs: ${(tl.stderr || '').trim().split('\n').slice(0, 3).join(' | ')}`)

if (failures) {
  console.error(`\n${failures} problem(s)`)
  process.exit(1)
}
