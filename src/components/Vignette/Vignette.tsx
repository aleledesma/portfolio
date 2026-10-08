import styles from './Vignette.module.css'

interface VignetteProps {
  opacity?: number // intensidad del oscurecido (0 a 1)
}

// Degradado oscuro detrás del texto para mejorar la legibilidad sobre el fondo
export function Vignette({ opacity = 1 }: VignetteProps) {
  return <div className={styles.vignette} style={{ opacity }} aria-hidden="true" />
}
