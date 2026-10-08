// Simplex noise 3D con semilla aleatoria
export type Noise3D = (x: number, y: number, z: number) => number

const GRAD3 = [
  1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1,
  0, 1, -1, 0, -1, -1,
]
const F3 = 1 / 3
const G3 = 1 / 6

// Tabla de permutación mezclada con un LCG sembrado al azar
function buildPermutation(): Uint8Array {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i

  let s = (Math.random() * 4294967296) >>> 0
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    const t = p[i]
    p[i] = p[j]
    p[j] = t
  }

  const perm = new Uint8Array(512)
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  return perm
}

export function createNoise3D(): Noise3D {
  const perm = buildPermutation()

  // Aporte de una esquina del símplex
  const corner = (gi: number, x: number, y: number, z: number) => {
    let t = 0.6 - x * x - y * y - z * z
    if (t <= 0) return 0
    const g = (gi % 12) * 3
    t *= t
    return t * t * (GRAD3[g] * x + GRAD3[g + 1] * y + GRAD3[g + 2] * z)
  }

  return (x, y, z) => {
    const s = (x + y + z) * F3
    const i = Math.floor(x + s)
    const j = Math.floor(y + s)
    const k = Math.floor(z + s)
    const t = (i + j + k) * G3
    const x0 = x - (i - t)
    const y0 = y - (j - t)
    const z0 = z - (k - t)

    // Determina en qué símplex (tetraedro) cae el punto.
    // Asignaciones directas (sin arrays) porque esto corre miles de veces por frame.
    let i1 = 0, j1 = 0, k1 = 0, i2 = 0, j2 = 0, k2 = 0
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; i2 = 1; j2 = 1 }
      else if (x0 >= z0) { i1 = 1; i2 = 1; k2 = 1 }
      else { k1 = 1; i2 = 1; k2 = 1 }
    } else {
      if (y0 < z0) { k1 = 1; j2 = 1; k2 = 1 }
      else if (x0 < z0) { j1 = 1; j2 = 1; k2 = 1 }
      else { j1 = 1; i2 = 1; j2 = 1 }
    }

    const ii = i & 255
    const jj = j & 255
    const kk = k & 255

    const n =
      corner(perm[ii + perm[jj + perm[kk]]], x0, y0, z0) +
      corner(perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]], x0 - i1 + G3, y0 - j1 + G3, z0 - k1 + G3) +
      corner(
        perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]],
        x0 - i2 + 2 * G3,
        y0 - j2 + 2 * G3,
        z0 - k2 + 2 * G3,
      ) +
      corner(perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]], x0 - 1 + 3 * G3, y0 - 1 + 3 * G3, z0 - 1 + 3 * G3)

    return 32 * n
  }
}
