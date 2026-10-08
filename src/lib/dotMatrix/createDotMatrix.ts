import { BUCKETS, DEFAULT_CONFIG, MAX_POINTS, type DotMatrixConfig } from './config'
import { createNoise3D } from './noise'

// Estado del cursor: posición suavizada (x, y), objetivo (tx, ty) y altura de la colina (amp)
interface MouseState {
  x: number
  y: number
  tx: number
  ty: number
  amp: number
  target: number
}

const OFFSCREEN = -9999
const TIME_OFFSET = 40 // arranca el terreno "avanzado" para que no se vea uniforme

/**
 * Inicia la animación de la matriz de puntos sobre un canvas.
 * Devuelve una función que detiene la animación y libera los listeners.
 */
export function createDotMatrix(
  canvas: HTMLCanvasElement,
  config: DotMatrixConfig = DEFAULT_CONFIG,
): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const noise3 = createNoise3D()
  const mouse: MouseState = { x: OFFSCREEN, y: OFFSCREEN, tx: OFFSCREEN, ty: OFFSCREEN, amp: 0, target: 0 }

  // ---- Geometría de la grilla ----
  let dpr = 1
  let cols = 0
  let rows = 0
  let gx0 = 0
  let gy0 = 0
  let sp = config.spacing
  let field = new Float32Array(0)
  let baseLayer: HTMLCanvasElement | null = null

  // ---- Redimensionado: recalcula la grilla y la capa estática ----
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)

    sp = config.spacing
    while ((W / sp) * (H / sp) > MAX_POINTS) sp += 1
    cols = Math.floor(W / sp) + 2
    rows = Math.floor(H / sp) + 2
    gx0 = (W - (cols - 1) * sp) / 2
    gy0 = (H - (rows - 1) * sp) / 2
    field = new Float32Array(cols * rows)
    baseLayer = renderBaseLayer()

    if (reduceMotion) draw(TIME_OFFSET, 1)
  }

  // La matriz tenue de fondo es estática: se dibuja una vez y se reutiliza
  function renderBaseLayer(): HTMLCanvasElement {
    const layer = document.createElement('canvas')
    layer.width = canvas.width
    layer.height = canvas.height
    const b = layer.getContext('2d')
    if (!b || config.baseAlpha <= 0) return layer

    b.setTransform(dpr, 0, 0, dpr, 0, 0)
    const path = new Path2D()
    const r = config.baseRadius
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = gx0 + i * sp
        const y = gy0 + j * sp
        path.moveTo(x + r, y)
        path.arc(x, y, r, 0, Math.PI * 2)
      }
    }
    b.fillStyle = `rgba(255,255,255,${config.baseAlpha})`
    b.fill(path)
    return layer
  }

  // ---- Paso 1: altura del terreno en cada punto ----
  function computeField(time: number) {
    const sc = config.scale
    const z = time * config.speed
    const ox = time * config.drift
    const oy = time * config.drift * 0.4
    const r2 = config.mouseRadius * config.mouseRadius
    const amp = mouse.amp * config.mouseStrength

    let idx = 0
    for (let j = 0; j < rows; j++) {
      const y = gy0 + j * sp
      const ny = (y + oy) * sc
      for (let i = 0; i < cols; i++) {
        const x = gx0 + i * sp
        const nx = (x + ox) * sc
        let h = noise3(nx, ny, z) * 0.72 + noise3(nx * 2.1 + 17.3, ny * 2.1 - 9.1, z * 1.4) * 0.28
        if (amp > 0.001) {
          const dx = x - mouse.x
          const dy = y - mouse.y
          h += amp * Math.exp(-(dx * dx + dy * dy) / r2)
        }
        field[idx++] = h * config.density
      }
    }
  }

  // ---- Paso 2: se encienden los puntos que caen sobre una curva de nivel ----
  // La distancia se mide en píxeles (usando la pendiente) para que todas
  // las curvas tengan el mismo grosor, sea el terreno empinado o plano.
  function buildContourPaths(): (Path2D | null)[] {
    const paths: (Path2D | null)[] = new Array(BUCKETS + 1).fill(null)
    const bandPx = config.band * sp
    const every = config.indexEvery
    const minorRatio = config.lineAlpha / config.indexAlpha

    for (let j = 0; j < rows; j++) {
      const y = gy0 + j * sp
      const jm = j > 0 ? j - 1 : j
      const jp = j < rows - 1 ? j + 1 : j
      for (let i = 0; i < cols; i++) {
        const v = field[j * cols + i]
        const nearest = Math.round(v)
        const dv = Math.abs(v - nearest)

        // Gradiente por diferencias centrales
        const im = i > 0 ? i - 1 : i
        const ip = i < cols - 1 ? i + 1 : i
        const gx = (field[j * cols + ip] - field[j * cols + im]) / ((ip - im) * sp)
        const gy = (field[jp * cols + i] - field[jm * cols + i]) / ((jp - jm) * sp)
        const g = Math.sqrt(gx * gx + gy * gy) + 1e-5
        const dpx = dv / g
        if (dpx >= bandPx) continue

        // Intensidad con suavizado (smoothstep); las curvas menores brillan menos
        let intensity = 1 - dpx / bandPx
        intensity = intensity * intensity * (3 - 2 * intensity)
        const isIndex = ((nearest % every) + every) % every === 0
        if (!isIndex) intensity *= minorRatio

        const bucket = Math.ceil(intensity * BUCKETS)
        if (bucket <= 0) continue
        const p = (paths[bucket] ??= new Path2D())
        const x = gx0 + i * sp
        const r = config.baseRadius + (config.maxRadius - config.baseRadius) * (bucket / BUCKETS)
        p.moveTo(x + r, y)
        p.arc(x, y, r, 0, Math.PI * 2)
      }
    }
    return paths
  }

  // ---- Dibujo de un frame ----
  function draw(time: number, fade: number) {
    if (!ctx || !baseLayer) return

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 1
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = fade
    ctx.drawImage(baseLayer, 0, 0)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    computeField(time)
    const paths = buildContourPaths()
    for (let k = 1; k <= BUCKETS; k++) {
      const p = paths[k]
      if (!p) continue
      const a = config.baseAlpha + (config.indexAlpha - config.baseAlpha) * (k / BUCKETS)
      ctx.fillStyle = `rgba(255,255,255,${a})`
      ctx.fill(p)
    }
    ctx.globalAlpha = 1
  }

  // ---- Interacción con el cursor ----
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    mouse.tx = e.clientX
    mouse.ty = e.clientY
    if (mouse.x < OFFSCREEN / 2) {
      mouse.x = mouse.tx
      mouse.y = mouse.ty
    }
    mouse.target = 1
  }
  const onPointerLeave = () => {
    mouse.target = 0
  }

  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(resize, 120)
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
  window.addEventListener('blur', onPointerLeave)
  window.addEventListener('resize', onResize)

  // ---- Bucle de animación ----
  let raf = 0
  let start: number | null = null
  let last = 0

  function frame(now: number) {
    if (start === null) {
      start = now
      last = now
    }
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now

    // El cursor y la colina se acercan suavemente a su objetivo
    const follow = 1 - Math.exp(-dt * 4)
    mouse.x += (mouse.tx - mouse.x) * follow
    mouse.y += (mouse.ty - mouse.y) * follow
    mouse.amp += (mouse.target - mouse.amp) * (1 - Math.exp(-dt * 1.5))

    // Aparición inicial con ease-out cúbico
    const f = Math.min((now - start) / config.fadeIn, 1)
    draw((now - start) / 1000 + TIME_OFFSET, 1 - Math.pow(1 - f, 3))
    raf = requestAnimationFrame(frame)
  }

  resize()
  if (!reduceMotion) raf = requestAnimationFrame(frame)

  // ---- Limpieza ----
  return () => {
    cancelAnimationFrame(raf)
    clearTimeout(resizeTimer)
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerleave', onPointerLeave)
    window.removeEventListener('blur', onPointerLeave)
    window.removeEventListener('resize', onResize)
  }
}
