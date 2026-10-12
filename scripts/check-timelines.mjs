// Concurrency guard. Chapter 9 teaches with two-session timelines, and a timeline is only true if two
// real sessions did it. This runs each scenario against a real server with SEPARATE psql processes
// (one per session) and checks that what each step printed is what the slide says. Scenarios work on
// a scratch schema `cc` (committed copies of shop tables), created fresh and dropped afterwards, so
// `shop` and `perf` are never touched.
//
//   node scripts/check-timelines.mjs            check every scenario (also run by `npm run check:sql`)
//   node scripts/check-timelines.mjs --print    also print each transcript (for authoring the boards)
//
// Each step is { who, sql, wait?: false, expect?: regex }. A step with wait:false is sent without waiting
// for it to finish (it is expected to BLOCK); the runner then confirms the session is really waiting on a
// lock before moving on, and collects the output when the blocker releases it.
import { spawn, spawnSync } from 'node:child_process'

const PRINT = process.argv.includes('--print')
let failures = 0
const fail = (m) => {
  failures++
  console.error(`✗ ${m}`)
}

class Session {
  constructor(name) {
    this.name = name
    this.p = spawn('sh', ['-c', 'exec psql -X -A -t -v ON_ERROR_STOP=0 -v VERBOSITY=terse 2>&1'], { stdio: ['pipe', 'pipe', 'inherit'] })
    this.buf = ''
    this.n = 0
    this.waiters = []
    this.p.stdout.on('data', (d) => {
      this.buf += d.toString()
      this.flush()
    })
  }
  flush() {
    for (const w of [...this.waiters]) {
      const i = this.buf.indexOf(w.marker)
      if (i >= 0) {
        const out = this.buf.slice(0, i)
        this.buf = this.buf.slice(i + w.marker.length).replace(/^\r?\n/, '')
        this.waiters.splice(this.waiters.indexOf(w), 1)
        w.resolve(out.replace(/\s+$/, ''))
      }
    }
  }
  start(sql) {
    const marker = `__END_${this.name}_${++this.n}__`
    const done = new Promise((resolve) => this.waiters.push({ marker, resolve }))
    this.p.stdin.write(`${sql}\n\\echo ${marker}\n`)
    return done
  }
  run(sql) {
    return this.start(sql)
  }
  close() {
    this.p.stdin.end()
  }
}

const psql = (sql) => spawnSync('psql', ['-X', '-q', '-v', 'ON_ERROR_STOP=1', '-c', sql], { encoding: 'utf8' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function setup(extra = '') {
  const r = spawnSync(
    'psql',
    ['-X', '-q', '-v', 'ON_ERROR_STOP=1'],
    {
      input: `DROP SCHEMA IF EXISTS cc CASCADE; CREATE SCHEMA cc;
CREATE TABLE cc.products (LIKE shop.products INCLUDING ALL);
INSERT INTO cc.products SELECT * FROM shop.products;
CREATE TABLE cc.orders (LIKE shop.orders INCLUDING ALL);
INSERT INTO cc.orders SELECT * FROM shop.orders;
CREATE TABLE cc.order_items (LIKE shop.order_items INCLUDING ALL);
INSERT INTO cc.order_items SELECT * FROM shop.order_items;
CREATE TABLE cc.duty (employee_id integer PRIMARY KEY, name text NOT NULL, on_duty boolean NOT NULL);
INSERT INTO cc.duty VALUES (6, 'Sana Iqbal', true), (7, 'Tom Becker', true);
${extra}`,
      encoding: 'utf8',
    },
  )
  if (r.status !== 0) throw new Error(`scratch schema setup failed: ${r.stderr}`)
}

async function waitBlocked(control, count = 1) {
  for (let i = 0; i < 100; i++) {
    const r = spawnSync('psql', ['-X', '-q', '-A', '-t', '-c', "SELECT count(*) FROM pg_stat_activity WHERE datname = current_database() AND wait_event_type = 'Lock' AND state = 'active'"], { encoding: 'utf8' })
    if (parseInt(r.stdout.trim(), 10) >= count) return true
    await sleep(50)
  }
  return false
}

// steps: [{ who, sql, blocks?: true, expect?: RegExp, note? }]
async function scenario(name, { extra = '', init = 'SET search_path = cc;', sessions = ['A', 'B'], steps }) {
  setup(extra)
  const S = Object.fromEntries(sessions.map((s) => [s, new Session(s)]))
  for (const s of Object.values(S)) await s.run(init)
  const pending = []
  const log = []
  const record = (i, step, out) => {
    log.push({ who: step.who, sql: step.sql, out })
    if (step.expect && !step.expect.test(out)) fail(`${name} step ${i + 1} (${step.who}: ${step.sql.split('\n')[0]}): expected ${step.expect}, got «${out}»`)
  }
  for (const [i, step] of steps.entries()) {
    if (step.blocks) {
      const p = S[step.who].start(step.sql).then((out) => {
        record(i, step, out)
        return out
      })
      pending.push(p)
      if (!(await waitBlocked(null))) fail(`${name} step ${i + 1}: expected ${step.who} to block on a lock, but it did not`)
    } else if (step.release) {
      // waits for every blocked step to finish after this step runs
      const out = await S[step.who].run(step.sql)
      record(i, step, out)
      await Promise.all(pending)
    } else {
      const out = await S[step.who].run(step.sql)
      record(i, step, out)
    }
  }
  for (const s of Object.values(S)) s.close()
  if (PRINT) {
    console.log(`\n=== ${name}`)
    for (const l of log) console.log(`[${l.who}] ${l.sql.replace(/\n/g, '\n    ')}\n      -> ${l.out.replace(/\n/g, '\n         ') || '(no output)'}`)
  }
  return log
}

export const SCENARIOS = []
const add = (name, def) => SCENARIOS.push([name, def])
import { defineScenarios } from './timelines.mjs'
defineScenarios(add)

try {
  let ran = 0
  for (const [name, def] of SCENARIOS) {
    await scenario(name, def)
    ran++
  }
  console.log(`✓ ${ran} concurrency timeline(s) behave as written`)
} catch (e) {
  fail(String(e.stack || e))
} finally {
  psql('DROP SCHEMA IF EXISTS cc CASCADE')
}
if (failures) {
  console.error(`\n${failures} problem(s)`)
  process.exit(1)
}
