import { profile, tags } from '../../data/profile'
import { Eyebrow } from '../Eyebrow/Eyebrow'
import { TagHalo } from '../TagHalo/TagHalo'
import styles from './Hero.module.css'

interface HeroProps {
  className?: string
}

// Presentación principal: rol, nombre, bio y etiquetas de tecnologías
export function Hero({ className }: HeroProps) {
  return (
    <section className={[styles.hero, className].filter(Boolean).join(' ')}>
      <Eyebrow>{profile.role}</Eyebrow>

      <h1 className={styles.name}>{profile.name}</h1>

      {/* Título y descripción */}
      <div className={styles.about}>
        <div className={styles.title}>{profile.title}</div>
        <p className={styles.bio}>{profile.bio}</p>
      </div>

      {/* Tecnologías */}
      <div className={styles.tags}>
        {tags.map((tag) => (
          <TagHalo key={tag.id} label={tag.name} icon={tag.icon} logoOnly={tag.logoOnly} />
        ))}
      </div>
    </section>
  )
}
