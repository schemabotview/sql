// gen-audio-manifest.mjs — flatten the typed course catalog into the audio manifest.
//
// The Colab/Chatterbox notebook can't parse our TypeScript course files, so this is the bridge:
// it evaluates the REAL `courses` registry (esbuild strips the type-only reveal-engine import,
// so the files have no runtime deps) and folds every beat into one flat JSON entry, keyed to the
// engine's audio contract path  `<courseId>/<section-id>-<beatIndex>.wav`  (LivePlayer.tsx).
//
//   Output: scripts/audio-manifest.json   →  { count, entries: [{ course, section, file, line }] }
//
// Run:  npm run gen:audio   (then commit the json so the notebook sees it)

import { build } from 'esbuild'
import { writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')
const entry = resolve(repoRoot, 'src/content/courses/index.ts')
const outFile = resolve(here, 'audio-manifest.json')

// Bundle the course registry to an in-memory ESM string. `reveal-engine` is type-only in these
// files (import type … erases), so marking it external leaves zero runtime references to it.
const result = await build({
  entryPoints: [entry],
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
  external: ['reveal-engine'],
})
const code = result.outputFiles[0].text
const mod = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
const { courses } = mod

const entries = []
for (const course of courses) {
  course.sections.forEach((section) => {
    section.beats.forEach((beat, beatIndex) => {
      entries.push({
        course: course.id,
        section: section.id,
        file: `${course.id}/${section.id}-${beatIndex}.wav`,
        line: beat.line,
      })
    })
  })
}

const manifest = { count: entries.length, entries }
writeFileSync(outFile, JSON.stringify(manifest, null, 2) + '\n', 'utf-8')

// A short human summary — how many beats per course, so a bad fold is obvious at a glance.
const perCourse = {}
for (const e of entries) perCourse[e.course] = (perCourse[e.course] ?? 0) + 1
console.log(`Wrote ${entries.length} beat(s) -> scripts/audio-manifest.json`)
for (const c of courses) console.log(`  ${c.id.padEnd(12)} ${perCourse[c.id] ?? 0} beat(s), ${c.sections.length} section(s)`)
