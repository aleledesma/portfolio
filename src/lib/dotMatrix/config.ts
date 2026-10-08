// Ajustes del fondo de matriz de puntos (curvas de nivel animadas)
export interface DotMatrixConfig {
  spacing: number // distancia entre puntos de la matriz (px)
  density: number // curvas de nivel por unidad de altura (más = más curvas)
  indexEvery: number // cada cuántas curvas aparece una curva maestra más brillante
  band: number // grosor de cada curva, medido en puntos (0.5 fina, 1.5 gruesa)
  scale: number // tamaño del relieve (menor = montañas más grandes)
  speed: number // velocidad de transformación del terreno
  drift: number // desplazamiento lento del mapa (px por segundo)
  baseAlpha: number // opacidad de la matriz de fondo (0 para ocultarla)
  lineAlpha: number // opacidad de los puntos sobre una curva
  indexAlpha: number // opacidad de los puntos sobre una curva maestra
  baseRadius: number // radio de los puntos de fondo
  maxRadius: number // radio de los puntos más brillantes
  mouseRadius: number // radio de la colina que levanta el cursor
  mouseStrength: number // altura de esa colina (0 para desactivar)
  fadeIn: number // ms de aparición inicial
}

export const DEFAULT_CONFIG: DotMatrixConfig = {
  spacing: 13,
  density: 5,
  indexEvery: 5,
  band: 0.85,
  scale: 0.0017,
  speed: 0.05,
  drift: 5,
  baseAlpha: 0.07,
  lineAlpha: 0.55,
  indexAlpha: 0.9,
  baseRadius: 0.75,
  maxRadius: 1.55,
  mouseRadius: 200,
  mouseStrength: 0.5,
  fadeIn: 2400,
}

// Niveles de brillo en que se agrupan los puntos (un fill por nivel)
export const BUCKETS = 12

// Límite de puntos para cuidar el rendimiento en pantallas enormes
export const MAX_POINTS = 22000
