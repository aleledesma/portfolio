import type { ContributionCalendar, ContributionLevel } from '../types/contributions'

// API pública y gratuita (no oficial) que lee el calendario del perfil de GitHub.
// No requiere token y permite pedidos desde el navegador (CORS).
const API_URL = 'https://github-contributions-api.jogruber.de/v4'

interface ApiResponse {
  total: Record<string, number>
  contributions: { date: string; count: number; level: number }[]
}

const toLevel = (n: number): ContributionLevel => Math.min(4, Math.max(0, Math.round(n))) as ContributionLevel

// Trae las contribuciones del último año de un usuario
export async function fetchContributions(username: string, signal?: AbortSignal): Promise<ContributionCalendar> {
  const res = await fetch(`${API_URL}/${encodeURIComponent(username)}?y=last`, { signal })
  if (!res.ok) throw new Error(res.status === 404 ? `No existe el usuario "${username}"` : `HTTP ${res.status}`)

  const json = (await res.json()) as ApiResponse
  if (!Array.isArray(json.contributions)) throw new Error('Respuesta inesperada de la API')

  const days = json.contributions.map((d) => ({ date: d.date, count: d.count, level: toLevel(d.level) }))
  const total = json.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0)

  return { total, days }
}
