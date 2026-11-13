import type { CSSProperties } from 'react'
import type { PinnedRepo } from '../../types/github'
import { formatCount } from '../../utils/format'
import { trackPointer } from '../../utils/trackPointer'
import { ForkIcon, RepoIcon, StarIcon } from './RepoIcons'
import styles from './RepoCard.module.css'

interface RepoCardProps {
  repo: PinnedRepo
  showOwner?: boolean // útil cuando el repo pertenece a una organización
}

// Tarjeta de repo con la estructura de las "pinned" de GitHub
// (toque propio: fondo de vidrio y halo con el color del lenguaje)
export function RepoCard({ repo, showOwner = false }: RepoCardProps) {
  const { name, owner, description, url, stars, forks, language, label } = repo
  const style = language?.color ? ({ '--accent': language.color } as CSSProperties) : undefined

  return (
    <article className={styles.card} style={style} onPointerEnter={trackPointer} onPointerMove={trackPointer}>
      {/* Encabezado: ícono, nombre (enlace que cubre la tarjeta) y visibilidad */}
      <header className={styles.header}>
        <RepoIcon className={styles.repoIcon} />
        <h3 className={styles.name}>
          <a href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {showOwner && <span className={styles.owner}>{owner}/</span>}
            {name}
          </a>
        </h3>
        <span className={styles.label}>{label}</span>
      </header>

      {/* Descripción (se omite si no hay) */}
      {description && <p className={styles.description}>{description}</p>}

      {/* Pie: lenguaje, estrellas y forks (solo si hay) */}
      <footer className={styles.meta}>
        {language && (
          <span className={styles.stat}>
            <span className={styles.dot} aria-hidden="true" />
            {language.name}
          </span>
        )}
        {stars > 0 && (
          <a
            href={`${url}/stargazers`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.statLink}
            aria-label={`${stars} estrellas`}
          >
            <StarIcon />
            {formatCount(stars)}
          </a>
        )}
        {forks > 0 && (
          <a
            href={`${url}/forks`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.statLink}
            aria-label={`${forks} forks`}
          >
            <ForkIcon />
            {formatCount(forks)}
          </a>
        )}
      </footer>
    </article>
  )
}
