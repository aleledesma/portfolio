import { contactLinks, githubUrl } from '../../data/profile'
import { BrandIcon } from '../BrandIcon/BrandIcon'
import styles from './ContactFooter.module.css'

interface ContactFooterProps {
  className?: string
}

// Pie con enlaces de contacto y botón de GitHub
export function ContactFooter({ className }: ContactFooterProps) {
  return (
    <footer className={[styles.footer, className].filter(Boolean).join(' ')}>
      {/* Enlaces de contacto */}
      <div className={styles.contact}>
        <span className={styles.label}>Contacto</span>
        {contactLinks.map(({ label, href, external }) => (
          <a
            key={label}
            href={href}
            className={styles.link}
            {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
          >
            <span>{label}</span>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>

      {/* Botón circular de GitHub */}
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        title="GitHub"
        className={styles.github}
      >
        <BrandIcon name="github" className={styles.githubIcon} />
      </a>
    </footer>
  )
}
