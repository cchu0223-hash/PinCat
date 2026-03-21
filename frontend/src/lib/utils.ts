import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, startOfWeek, endOfWeek, getWeek, getYear, addWeeks, subWeeks, eachDayOfInterval, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeekKey(date: Date): string {
  const year = getYear(startOfWeek(date, { weekStartsOn: 1 }))
  const week = getWeek(date, { weekStartsOn: 1 })
  return `${year}-W${String(week).padStart(2, '0')}`
}

export function getWeekDates(weekKey: string) {
  const [year, weekPart] = weekKey.split('-W')
  const weekNum = parseInt(weekPart)
  // Get first day of the year
  const jan4 = new Date(parseInt(year), 0, 4)
  const startOfFirstWeek = startOfWeek(jan4, { weekStartsOn: 1 })
  const weekStart = new Date(startOfFirstWeek)
  weekStart.setDate(startOfFirstWeek.getDate() + (weekNum - 1) * 7)
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })

  return {
    start: weekStart,
    end: weekEnd,
    days: eachDayOfInterval({ start: weekStart, end: weekEnd }),
  }
}

export function formatDateLabel(date: Date): string {
  return format(date, 'EEE d')
}

export function formatWeekRange(start: Date, end: Date): string {
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
}

export function getNextWeek(weekKey: string): string {
  const { start } = getWeekDates(weekKey)
  return getWeekKey(addWeeks(start, 1))
}

export function getPrevWeek(weekKey: string): string {
  const { start } = getWeekDates(weekKey)
  return getWeekKey(subWeeks(start, 1))
}

export function randomDecoration(): 'tape-yellow' | 'tape-blue' | 'tape-washi' | 'pin-red' | 'pin-yellow' | 'clip' {
  const decorations = ['tape-yellow', 'tape-blue', 'tape-washi', 'pin-red', 'pin-yellow', 'clip'] as const
  return decorations[Math.floor(Math.random() * decorations.length)]
}

export function randomRotation(): number {
  return (Math.random() - 0.5) * 12 // -6 to 6 degrees
}

export function dateToISO(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}
