import { pinnedRepos } from 'virtual:github-pinned'
import { Eyebrow } from '../Eyebrow/Eyebrow'
import { RepoCard } from '../RepoCard/RepoCard'
import styles from './PinnedRepos.module.css'

interface PinnedReposProps {
  username: string
  title?: string
  className?: string
}

// Lista los repos fijados de un usuario de GitHub (datos traídos en el build)
export function PinnedRepos({ username, title = 'Proyectos destacados', className }: PinnedReposProps) {
  const login = username.trim().toLowerCase()
  const repos = pinnedRepos[login] ?? []

  // Sin datos (sin token o usuario sin repos fijados) no se muestra la sección
  if (repos.length === 0) return null

  return (
    <section
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-labelledby="pinned-repos-title"
    >
      {/* Encabezado: título y enlace al perfil */}
      <header className={styles.header}>
        <Eyebrow as="h2" id="pinned-repos-title">
          {title}
        </Eyebrow>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.all}
        >
          <span>Ver todo</span>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </a>
      </header>

      {/* Grilla de tarjetas */}
      <ul className={styles.grid}>
        {repos.map((repo) => (
          <li key={`${repo.owner}/${repo.name}`}>
            <RepoCard repo={repo} showOwner={repo.owner.toLowerCase() !== login} />
          </li>
        ))}
      </ul>
    </section>
  )
}
