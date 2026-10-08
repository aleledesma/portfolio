import { brandIcons, type BrandIconName } from '../../data/brandIcons'
import styles from './BrandIcon.module.css'

interface BrandIconProps {
  name: BrandIconName
  className?: string
}

// Logo de marca en SVG inline: se pinta con `currentColor` y respeta su proporción
export function BrandIcon({ name, className }: BrandIconProps) {
  const { path, viewBox } = brandIcons[name]

  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      className={[styles.icon, className].filter(Boolean).join(' ')}
    >
      <path d={path} fill="currentColor" />
    </svg>
  )
}
