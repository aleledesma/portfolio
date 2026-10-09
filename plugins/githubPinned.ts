import type { Plugin } from 'vite'
import type { PinnedRepo, PinnedReposByUser } from '../src/types/github.ts'

/**
 * Plugin de Vite que trae los repos fijados ("pinned") de GitHub con la API GraphQL
 * y los expone como módulo virtual: `import { pinnedRepos } from 'virtual:github-pinned'`.
 * El token solo se usa en Node (dev/build): nunca llega al bundle del navegador.
 */

const VIRTUAL_ID = 'virtual:github-pinned'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const ENDPOINT = 'https://api.github.com/graphql'

// ---- Consulta GraphQL ----
const QUERY = /* GraphQL */ `
  query PinnedRepos($login: String!, $limit: Int!) {
    user(login: $login) {
      pinnedItems(first: $limit, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            owner { login }
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            visibility
            isArchived
            isTemplate
            primaryLanguage { name color }
          }
        }
      }
    }
  }
`

// Forma cruda de cada repo en la respuesta de GitHub
interface GqlRepo {
  name: string
  owner: { login: string }
  description: string | null
  url: string
  homepageUrl: string | null
  stargazerCount: number
  forkCount: number
  visibility: 'PUBLIC' | 'PRIVATE' | 'INTERNAL'
  isArchived: boolean
  isTemplate: boolean
  primaryLanguage: { name: string; color: string | null } | null
}

interface GqlResponse {
  data?: { user: { pinnedItems: { nodes: GqlRepo[] } } | null }
  errors?: { message: string }[]
}

// Etiqueta igual a la de GitHub: "Public", "Public archive", "Private template"...
function visibilityLabel({ visibility, isArchived, isTemplate }: GqlRepo): string {
  const base = visibility.charAt(0) + visibility.slice(1).toLowerCase()
  if (isArchived) return `${base} archive`
  if (isTemplate) return `${base} template`
  return base
}

// ---- Pedido y normalización ----
async function fetchPinned(login: string, token: string, limit: number): Promise<PinnedRepo[]> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { login, limit } }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

  const json = (await res.json()) as GqlResponse
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '))
  if (!json.data?.user) throw new Error(`no existe el usuario "${login}"`)

  return json.data.user.pinnedItems.nodes.map((r) => ({
    name: r.name,
    owner: r.owner.login,
    description: r.description,
    url: r.url,
    homepage: r.homepageUrl || null,
    stars: r.stargazerCount,
    forks: r.forkCount,
    language: r.primaryLanguage,
    label: visibilityLabel(r),
  }))
}

// ---- Plugin ----
interface GithubPinnedOptions {
  usernames: string[]
  token?: string
  limit?: number // máximo de repos por usuario (GitHub permite fijar hasta 6)
}

export function githubPinned({ usernames, token, limit = 6 }: GithubPinnedOptions): Plugin {
  // Se consulta una sola vez por arranque del servidor o por build
  let cached: PinnedReposByUser | null = null

  return {
    name: 'github-pinned',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    async load(id) {
      if (id !== RESOLVED_ID) return

      if (!cached) {
        cached = {}
        const logins = usernames.map((u) => u.trim()).filter(Boolean)

        if (logins.length === 0) {
          this.warn('No hay usuario configurado (src/data/github.ts): no se mostrarán repos fijados.')
        } else if (!token) {
          this.warn('Falta GITHUB_TOKEN en .env: no se mostrarán repos fijados.')
        } else {
          // Un error en un usuario no rompe el build: se avisa y se sigue sin datos
          for (const login of logins) {
            try {
              cached[login.toLowerCase()] = await fetchPinned(login, token, limit)
            } catch (err) {
              this.warn(`No se pudieron traer los repos fijados de "${login}": ${(err as Error).message}`)
            }
          }
        }
      }

      return `export const pinnedRepos = ${JSON.stringify(cached)}`
    },
  }
}
