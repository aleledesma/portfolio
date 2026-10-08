import { useEffect, useRef, type CSSProperties } from 'react'
import { createDotMatrix, DEFAULT_CONFIG, type DotMatrixConfig } from '../../lib/dotMatrix'
import styles from './DotMatrixBackground.module.css'

interface DotMatrixBackgroundProps {
  blur?: number // difuminado del canvas en px (0 = nítido)
  config?: DotMatrixConfig
}

// Fondo animado: matriz de puntos que dibuja curvas de nivel y reacciona al cursor
export function DotMatrixBackground({ blur = 3, config = DEFAULT_CONFIG }: DotMatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Arranca la animación al montar y la detiene al desmontar
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    return createDotMatrix(canvas, config)
  }, [config])

  // El leve scale evita que el blur deje bordes transparentes
  const canvasStyle: CSSProperties =
    blur > 0 ? { filter: `blur(${blur}px)`, transform: `scale(${1 + blur * 0.012})` } : {}

  return (
    <div className={styles.root} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} style={canvasStyle} />
    </div>
  )
}
