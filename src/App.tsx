import { useEffect, useRef, useState } from 'react'
import { RevealPlayer, SceneViewer } from 'reveal-engine'
import { getScene } from './scenes/index.ts'
import { CONCEPT, courses, courseById, BLURBS } from './content/courses/index.ts'
import { CourseIndex } from './CourseIndex.tsx'

// Hash router (GitHub Pages has no SPA fallback, so `#/<courseId>` survives refresh):
//   #/            → the course index for this concept
//   #/<courseId>  → play that course
function useCourseId() {
  const read = () => location.hash.replace(/^#\/?/, '')
  const [id, setId] = useState(read)
  useEffect(() => {
    const on = () => setId(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return id
}

export function App() {
  const id = useCourseId()
  const course = id ? courseById(id) : undefined

  // Cross-course paging: → past a course's last section rolls into the NEXT course's overview; ←
  // past the first section rolls back into the PREVIOUS course's LAST section. The syllabus order
  // is the `courses` array; the player reports the boundary via onEnd/onStart (see RevealPlayer).
  // `enterAtEnd` is a one-shot flag: goPrev sets it so the next course mounts at its last section;
  // the effect below consumes it after the id changes so ordinary navigation starts at the top.
  const enterAtEnd = useRef(false)
  useEffect(() => {
    enterAtEnd.current = false
  }, [id])

  // Esc walks one level up: while a course plays it returns to this concept's index; on the
  // index (no course) a second Esc goes to the catalog home. Bound once, reads the LIVE hash.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (location.hash.replace(/^#\/?/, '')) location.hash = '' // in a course → index
      else location.href = '/' // on the index → catalog home
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Dev scene preview: `#scene/<id>` renders one scene fully solid (no player frame, camera fits
  // whole) — an authoring aid while building scenes before their course sections exist.
  if (id.startsWith('scene/')) {
    const scene = getScene(id.slice('scene/'.length))
    return (
      <div style={{ height: '100vh', background: '#282c34' }}>
        {scene ? <SceneViewer scene={scene} /> : <CourseIndex concept={CONCEPT} courses={courses} blurbs={BLURBS} />}
      </div>
    )
  }

  if (!course) return <CourseIndex concept={CONCEPT} courses={courses} blurbs={BLURBS} />

  // Boundary crossing: land on the adjacent course by id (stop at the two ends of the series).
  const idx = courses.findIndex((c) => c.id === course.id)
  const goNext = () => {
    if (idx >= 0 && idx < courses.length - 1) location.hash = `#/${courses[idx + 1].id}`
  }
  const goPrev = () => {
    if (idx > 0) {
      enterAtEnd.current = true // open the previous course at its last section, not its overview
      location.hash = `#/${courses[idx - 1].id}`
    }
  }

  // Per-course audio folder: public/audio/<courseId>/<section-id>-<beat>.wav. `key` remounts the
  // player per course so its (section, beat) cursor re-inits cleanly on every crossing.
  return (
    <RevealPlayer
      key={course.id}
      course={course}
      getScene={getScene}
      audioBase={`${import.meta.env.BASE_URL}audio/${course.id}`}
      onEnd={goNext}
      onStart={goPrev}
      startAtEnd={enterAtEnd.current}
    />
  )
}
