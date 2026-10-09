import type { PointerEvent } from 'react'

// Guarda la posición del cursor relativa al elemento en las variables CSS --x / --y
// (la usan los halos que siguen al cursor, sin provocar re-renders)
export function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--x', `${e.clientX - r.left}px`)
  el.style.setProperty('--y', `${e.clientY - r.top}px`)
}
