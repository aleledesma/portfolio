import type { ReactNode } from 'react'
import styles from './Eyebrow.module.css'

interface EyebrowProps {
  children: ReactNode
  as?: 'div' | 'h2' | 'p' // etiqueta HTML (h2 cuando funciona como título de sección)
  id?: string
}

// Texto introductorio en itálica con una línea decorativa a la izquierda
export function Eyebrow({ children, as: Tag = 'div', id }: EyebrowProps) {
  return (
    <Tag id={id} className={styles.eyebrow}>
      <span className={styles.rule} aria-hidden="true" />
      <span>{children}</span>
    </Tag>
  )
}
