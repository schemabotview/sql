import type { Course } from 'reveal-engine'

// The concept landing page: the course catalog as a numbered LIST — each row routes to
// `#/<courseId>`. While the registry is empty (pre-content scaffold) it shows a ready-state
// placeholder.
export function CourseIndex({
  concept,
  courses,
  blurbs,
}: {
  concept: string
  courses: Course[]
  blurbs: Record<string, string>
}) {
  return (
    <div className="idx">
      <header className="idx__head">
        <h1 className="idx__title">{concept}</h1>
        <p className="idx__sub">Progressive-reveal courses</p>
      </header>

      {courses.length === 0 ? (
        <p className="idx__empty">No courses authored yet — the app shell is wired to reveal-engine and ready.</p>
      ) : (
        <ol className="idx__list">
          {courses.map((c, i) => (
            <li key={c.id} className="idx__row">
              <a href={`#/${c.id}`}>
                <span className="idx__row-num">{i + 1}</span>
                <span className="idx__row-body">
                  <span className="idx__row-title">{c.title}</span>
                  {blurbs[c.id] && <span className="idx__row-blurb">{blurbs[c.id]}</span>}
                </span>
                <span className="idx__row-chev" aria-hidden="true">›</span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
