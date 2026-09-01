// A "flow" edge: the static line + arrow, plus a pulse of light that travels source → target so the
// path reads as live traffic (user → igw → lb → ec2 → rds). The pulse is tinted to the destination
// node's pattern colour (passed in via edge `data.pulse`), so arriving at a service lights up in
// that service's accent.
//
// Capture note: the pulse is SVG <animateMotion>, i.e. motion over time. A single-frame screenshot
// freezes it at one position; the base line + arrow always render, so static capture degrades
// cleanly. Getting the motion into the composited video is a capture-pipeline concern, not here.

import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export function FlowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  markerStart,
  style,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })
  const d = data as { pulse?: string; bidirectional?: boolean } | undefined
  const pulse = d?.pulse ?? '#7dd3fc'

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} markerStart={markerStart} style={style} />
      <circle r={4.5} fill={pulse} opacity={0.9} filter="url(#flow-pulse-glow)">
        <animateMotion dur="2.4s" repeatCount="indefinite" path={edgePath} rotate="auto" />
      </circle>
      {/* A two-way edge gets a second pulse travelling the other way (end → start). */}
      {d?.bidirectional && (
        <circle r={4.5} fill={pulse} opacity={0.9} filter="url(#flow-pulse-glow)">
          <animateMotion
            dur="2.4s"
            repeatCount="indefinite"
            path={edgePath}
            rotate="auto"
            keyPoints="1;0"
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>
      )}
    </>
  )
}
