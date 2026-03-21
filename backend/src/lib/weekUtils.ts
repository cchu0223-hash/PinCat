import { getISOWeek, getYear, startOfISOWeek, endOfISOWeek, format, parseISO } from 'date-fns'

export function dateToWeekKey(dateStr: string): string {
  const date = parseISO(dateStr)
  const year = getYear(startOfISOWeek(date))
  const week = getISOWeek(date)
  return `${year}-W${String(week).padStart(2, '0')}`
}

export function getWeekBounds(weekKey: string): { start: string; end: string } {
  const [yearStr, weekPart] = weekKey.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekPart)

  // Find first Monday of the year's first ISO week
  const jan4 = new Date(year, 0, 4)
  const startOfFirstWeek = startOfISOWeek(jan4)
  const weekStart = new Date(startOfFirstWeek)
  weekStart.setDate(startOfFirstWeek.getDate() + (week - 1) * 7)
  const weekEnd = endOfISOWeek(weekStart)

  return {
    start: format(weekStart, 'yyyy-MM-dd'),
    end: format(weekEnd, 'yyyy-MM-dd'),
  }
}
