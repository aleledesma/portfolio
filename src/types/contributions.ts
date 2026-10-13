// Nivel de intensidad de un día, igual a la escala de GitHub (0 = sin actividad)
export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  date: string // YYYY-MM-DD
  count: number
  level: ContributionLevel
}

// Calendario de contribuciones del último año
export interface ContributionCalendar {
  total: number
  days: ContributionDay[]
}
