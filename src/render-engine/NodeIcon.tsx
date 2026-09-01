import { LUCIDE_ICONS } from './lucideIcons'
import type { PatternStyle } from './patterns'

// The leading glyph for a node: a named lucide glyph from LUCIDE_ICONS when `icon` names one (e.g.
// icon: 'terminal'), tinted in the pattern accent; else the pattern's default glyph. (The AWS repo
// this engine came from also had an official-service-icon layer here — dropped for Spark, which uses
// only generic lucide glyphs.)
export function NodeIcon({ icon, pattern, size = 26 }: { icon?: string; pattern: PatternStyle; size?: number }) {
  const Lucide = (icon ? LUCIDE_ICONS[icon] : undefined) ?? pattern.icon
  return <Lucide size={size} color={pattern.color} strokeWidth={1.75} style={{ flex: 'none' }} />
}
