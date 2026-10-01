import type { Priority } from '../types'

const MS_PER_DAY = 86_400_000

/** Today as `YYYY-MM-DD` in the user's local timezone. */
export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Midnight-anchored timestamp for a `YYYY-MM-DD` key, parsed as local time. */
export function fromDateKey(key: string): number {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1).getTime()
}

export function isOverdue(dueDate: string | null, completed: boolean, today = toDateKey()): boolean {
  if (!dueDate || completed) return false
  return dueDate < today
}

/** Whole days from today until `dueDate`. Negative when it has passed. */
export function daysUntil(dueDate: string | null, today = toDateKey()): number | null {
  if (!dueDate) return null
  return Math.round((fromDateKey(dueDate) - fromDateKey(today)) / MS_PER_DAY)
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return 'No due date'
  const diff = daysUntil(dueDate)
  if (diff === null) return 'No due date'
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  if (diff === -1) return '1 day overdue'
  if (diff < 0) return `${Math.abs(diff)} days overdue`
  if (diff <= 7) return `Due in ${diff} days`
  return `Due ${dueDate}`
}

export const PRIORITY_RANK: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const PRIORITIES: Priority[] = ['high', 'medium', 'low']

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}