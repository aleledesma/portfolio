import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { useContributions } from '../../hooks/useContributions'
import type { ContributionDay } from '../../types/contributions'
import { buildCalendar, emptyYear } from './buildCalendar'
import styles from './ContributionGraph.module.css'

interface ContributionGraphProps {
  username: string
  className?: string
}

interface Tooltip {
  text: string
  x: number
  y: number
}

// Filas con nombre de día (como GitHub: lunes, miércoles y viernes)
const DAY_LABELS = [
  { label: 'Lun', weekday: 1 },
  { label: 'Mié', weekday: 3 },
  { label: 'Vie', weekday: 5 },
]
const LEVELS = [0, 1, 2, 3, 4] as const

// ---- Textos ----
const countFormat = new Intl.NumberFormat('es-AR')
const dayFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', timeZone: 'UTC' })

function describeDay({ date, count }: ContributionDay): string {
  const when = dayFormat.format(new Date(`${date}T00:00:00Z`))
  if (count === 0) return `Sin contribuciones el ${when}`
  return `${countFormat.format(count)} ${count === 1 ? 'contribución' : 'contribuciones'} el ${when}`
}

// Calendario de contribuciones del último año de un usuario de GitHub
export function ContributionGraph({ username, className }: ContributionGraphProps) {
  const state = useContributions(username)
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const days = state.status === 'success' ? state.data.days : null
  const layout = useMemo(() => buildCalendar(days ?? emptyYear()), [days])
  const rootClass = [styles.root, className].filter(Boolean).join(' ')

  // Si la grilla no entra (mobile), arranca mostrando las semanas más recientes, como GitHub
  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [layout])

  // Error: mensaje breve en lugar del calendario
  if (state.status === 'error') {
    return (
      <section className={rootClass}>
        <p className={styles.heading}>No se pudieron cargar las contribuciones.</p>
      </section>
    )
  }

  const loading = state.status === 'loading'
  const total = state.status === 'success' ? state.data.total : 0
  const summary = `${countFormat.format(total)} ${total === 1 ? 'contribución' : 'contribuciones'} en el último año`

  // Tooltip con el detalle del día (delegación de eventos sobre la grilla)
  const showTooltip = (e: PointerEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-index]')
    if (!cell || loading) return setTooltip(null)
    const r = cell.getBoundingClientRect()
    const { day } = layout.cells[Number(cell.dataset.index)]
    setTooltip({ text: describeDay(day), x: r.left + r.width / 2, y: r.top })
  }

  return (
    <section className={rootClass} aria-busy={loading}>
      {/* Total del año */}
      <h2 className={styles.heading}>{loading ? 'Cargando contribuciones…' : summary}</h2>

      <div className={styles.box}>
        {/* Contenedor con scroll horizontal cuando las celdas no entran en el ancho */}
        <div ref={scrollerRef} className={styles.scroller} onScroll={() => setTooltip(null)}>
          {/* Grilla: fila de meses + 7 filas de días; una columna por semana */}
          <div
            className={styles.calendar}
            style={{ '--weeks': layout.weeks } as CSSProperties}
            role="img"
            aria-label={loading ? 'Cargando calendario de contribuciones' : summary}
            onPointerOver={showTooltip}
            onPointerLeave={() => setTooltip(null)}
          >
            {layout.months.map(({ label, week }) => (
              // La etiqueta abarca hasta 3 semanas para que el texto tenga lugar
              <span
                key={`${label}-${week}`}
                className={styles.month}
                style={{ gridColumn: `${week + 2} / span ${Math.min(3, layout.weeks - week)}` }}
              >
                {label}
              </span>
            ))}

            {DAY_LABELS.map(({ label, weekday }) => (
              <span key={label} className={styles.weekday} style={{ gridRow: weekday + 2 }}>
                {label}
              </span>
            ))}

            {layout.cells.map(({ day, week, weekday }, i) => (
              <div
                key={day.date}
                data-index={i}
                data-level={day.level}
                className={loading ? `${styles.cell} ${styles.skeleton}` : styles.cell}
                style={{ gridColumn: week + 2, gridRow: weekday + 2 }}
              />
            ))}
          </div>
        </div>

        {/* Leyenda de intensidad */}
        <div className={styles.footer}>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profile}
          >
            Ver perfil ↗
          </a>
          <div className={styles.legend} aria-hidden="true">
            <span>Menos</span>
            {LEVELS.map((level) => (
              <span key={level} className={styles.cell} data-level={level} />
            ))}
            <span>Más</span>
          </div>
        </div>
      </div>

      {/* Tooltip flotante (fijo a la ventana para que no lo recorte ningún contenedor) */}
      {tooltip && (
        <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }} aria-hidden="true">
          {tooltip.text}
        </div>
      )}
    </section>
  )
}
