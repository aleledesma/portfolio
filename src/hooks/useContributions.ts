import { useEffect, useMemo, useState } from 'react'
import { fetchContributions } from '../services/contributionsApi'
import type { ContributionCalendar } from '../types/contributions'

export type ContributionsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; data: ContributionCalendar }

// ---- Caché en sessionStorage (1 hora) para no repetir el pedido al recargar ----
const CACHE_TTL = 60 * 60 * 1000
const cacheKey = (username: string) => `gh-contributions:${username.toLowerCase()}`

function readCache(username: string): ContributionCalendar | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(username))
    if (!raw) return null
    const { savedAt, data } = JSON.parse(raw) as { savedAt: number; data: ContributionCalendar }
    return Date.now() - savedAt < CACHE_TTL ? data : null
  } catch {
    return null
  }
}

function writeCache(username: string, data: ContributionCalendar) {
  try {
    sessionStorage.setItem(cacheKey(username), JSON.stringify({ savedAt: Date.now(), data }))
  } catch {
    // Sin almacenamiento disponible: se sigue sin caché
  }
}

// ---- Hook ----
// El resultado se guarda junto al usuario que lo pidió: si el usuario cambia,
// el estado "loading" se deriva en el render sin setState extra.
interface Result {
  username: string
  state: ContributionsState
}

export function useContributions(username: string): ContributionsState {
  const cached = useMemo(() => readCache(username), [username])
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    if (cached) return

    // Pedido cancelable: si cambia el usuario o se desmonta, se descarta
    const controller = new AbortController()
    fetchContributions(username, controller.signal)
      .then((data) => {
        writeCache(username, data)
        setResult({ username, state: { status: 'success', data } })
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ username, state: { status: 'error' } })
      })

    return () => controller.abort()
  }, [username, cached])

  if (cached) return { status: 'success', data: cached }
  if (result?.username === username) return result.state
  return { status: 'loading' }
}
