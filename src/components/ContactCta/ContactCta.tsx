import { contact, contactCta } from "../../data/profile"
import { BrandIcon } from "../BrandIcon/BrandIcon"
import styles from "./ContactCta.module.css"

interface ContactCtaProps {
  className?: string
}

// Banner de contacto: invita a escribir y agrupa email, LinkedIn y GitHub
export function ContactCta({ className }: ContactCtaProps) {
  const hasSocials = Boolean(contact.linkedinUrl || contact.githubUrl)
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(contact.emailSubject)}`

  return (
    <section
      className={[styles.banner, className].filter(Boolean).join(" ")}
      aria-labelledby="contact-cta-title"
    >
      {/* Capas decorativas: fundido sobre los puntos y brillo detrás de las acciones */}
      <div className={styles.fade} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.content}>
        {/* Texto: título */}
        <div className={styles.text}>
          <h2 id="contact-cta-title" className={styles.title}>
            {contactCta.title}
          </h2>
        </div>

        {/* Acciones: botón principal + redes */}
        <div className={styles.actions}>
          {contact.email && (
            <>
              <a href={mailto} className={styles.primary} title={contact.email}>
                <span>{contactCta.action}</span>
                <ArrowIcon />
              </a>
              {hasSocials && <span className={styles.divider} aria-hidden="true" />}
            </>
          )}
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className={styles.social}
            >
              <BrandIcon name="linkedin" className={styles.socialIcon} />
            </a>
          )}
          {contact.githubUrl && (
            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className={styles.social}
            >
              <BrandIcon name="github" className={styles.socialIcon} />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

// ---- Ícono de flecha ----
function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}
