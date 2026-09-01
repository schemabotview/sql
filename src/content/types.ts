// A course = an ordered list of sections. Each SECTION is one slug (course-section) and one unit of
// the video: a scene shown full-frame + a slide (markdown, on-screen) + a narration script (spoken).
//
// The authoring contract:  .md (source of truth) → (.slide, .tts)
//   slide     = terse markdown shown in the SlidePanel (for the eye)
//   narration = natural-flow spoken script for TTS / Chatterbox (for the ear)
// For the MVP these two projections are hand-authored here in TS; a single-source .md + generator is
// a later layer.

export interface Section {
  id: string // "what-is-cloud" → slug: foundations-what-is-cloud
  title: string
  scene: string // scene id shown behind the panel (may be shared across sections)
  focus?: string // node the slide floats clear of (optional)
  slide: string // markdown → rendered in the SlidePanel
  narration: string // natural-flow TTS script (Chatterbox)
}

export interface Course {
  id: string
  title: string
  sections: Section[]
}
