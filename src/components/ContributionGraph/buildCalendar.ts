import type { ContributionDay } from '../../types/contributions'

// Celda ubicada en la grilla: columna = semana, fila = día de la semana (0 = domingo)
export interface CalendarCell {
  day: ContributionDay
  week: number
  weekday: number
}

export interface MonthLabel {
  label: string
  week: number
}

export interface CalendarLayout {
  cells: CalendarCell[]
  months: MonthLabel[]
  weeks: number
}

// Las fechas vienen como YYYY-MM-DD: se interpretan en UTC para evitar corrimientos por zona horaria
const parseDate = (iso: string) => new Date(`${iso}T00:00:00Z`)

// Meses abreviados a 3 letras como en GitHub: "Ene", "Feb", ... ("sept" → "Sep")
const monthFormat = new Intl.DateTimeFormat('es', { month: 'short', timeZone: 'UTC' })
const monthLabel = (date: Date) => {
  const m = monthFormat.format(date).replace('.', '').slice(0, 3)
  return m.charAt(0).toUpperCase() + m.slice(1)
}

// Separación mínima (en semanas) entre etiquetas de mes para que no se pisen
const MIN_MONTH_GAP = 3

// Ubica cada día en su semana/fila y calcula dónde van las etiquetas de los meses (como GitHub)
export function buildCalendar(days: ContributionDay[]): CalendarLayout {
  if (days.length === 0) return { cells: [], months: [], weeks: 0 }

  // La primera semana se completa hacia atrás hasta el domingo
  const offset = parseDate(days[0].date).getUTCDay()

  const cells = days.map((day, i) => {
    const slot = i + offset
    return { day, week: Math.floor(slot / 7), weekday: slot % 7 }
  })

  const weeks = cells.at(-1)!.week + 1

  // Como GitHub: un mes se etiqueta en la primera semana que empieza (domingo) en ese mes.
  // Se omite si queda muy pegado al anterior o si al final no hay lugar para el texto.
  const months: MonthLabel[] = []
  let lastMonth = -1
  for (const { day, week, weekday } of cells) {
    if (weekday !== 0) continue
    const date = parseDate(day.date)
    if (date.getUTCMonth() === lastMonth) continue
    lastMonth = date.getUTCMonth()

    const prev = months.at(-1)
    const tooClose = prev && week - prev.week < MIN_MONTH_GAP
    const noRoom = weeks - week < 2
    if (!tooClose && !noRoom) months.push({ label: monthLabel(date), week })
  }

  return { cells, months, weeks }
}

// Año vacío (53 semanas hasta hoy) para mostrar la grilla mientras cargan los datos
export function emptyYear(today = new Date()): ContributionDay[] {
  const end = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const start = end - (52 * 7 + new Date(end).getUTCDay()) * 86_400_000
  const days: ContributionDay[] = []
  for (let t = start; t <= end; t += 86_400_000) {
    days.push({ date: new Date(t).toISOString().slice(0, 10), count: 0, level: 0 })
  }
  return days
}
