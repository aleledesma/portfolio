import type { CSSProperties, PointerEvent } from 'react'
import { brandIcons, type BrandIconName } from '../../data/brandIcons'
import { BrandIcon } from '../BrandIcon/BrandIcon'
import styles from './TagHalo.module.css'

interface TagHaloProps {
  label: string
  icon: BrandIconName
  logoOnly?: boolean
}

// Mueve el centro del halo a la posición del cursor (vía variables CSS, sin re-render)
function trackPointer(e: PointerEvent<HTMLSpanElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--x', `${e.clientX - r.left}px`)
  el.style.setProperty('--y', `${e.clientY - r.top}px`)
}

// Etiqueta con el logo de la tecnología: en hover toma el color de la marca
export function TagHalo({ label, icon, logoOnly = false }: TagHaloProps) {
  const style = { '--accent': brandIcons[icon].accent } as CSSProperties
  const className = [styles.tag, logoOnly && styles.logoOnly].filter(Boolean).join(' ')

  return (
    <span className={className} style={style} onPointerEnter={trackPointer} onPointerMove={trackPointer}>
      <BrandIcon name={icon} className={styles.icon} />
      {/* Si el logo ya dice el nombre, el texto queda solo para lectores de pantalla */}
      <span className={logoOnly ? styles.srOnly : styles.label}>{label}</span>
    </span>
  )
}
