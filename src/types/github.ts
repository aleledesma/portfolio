// Repositorio fijado en un perfil de GitHub (ya normalizado desde GraphQL)
export interface PinnedRepo {
  name: string
  owner: string
  description: string | null
  url: string
  homepage: string | null
  stars: number
  forks: number
  language: { name: string; color: string | null } | null
  label: string // visibilidad como la muestra GitHub: "Public", "Public archive"...
}

// Repos fijados por usuario (clave: login en minúsculas)
export type PinnedReposByUser = Record<string, PinnedRepo[]>
