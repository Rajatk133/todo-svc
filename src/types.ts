export type Priority = 'low' | 'medium' | 'high'

export type StatusFilter = 'all' | 'active' | 'completed'

export type PriorityFilter = 'all' | Priority

export type SortKey = 'created-desc' | 'created-asc' | 'due-asc' | 'priority-desc'

/** A tab is a user-defined category that groups todos. */
export interface Tab {
  id: string
  name: string
  color: string
  createdAt: number
}

export interface Todo {
  id: string
  tabId: string
  title: string
  notes: string
  completed: boolean
  priority: Priority
  /** Calendar date as `YYYY-MM-DD`, or null when no due date is set. */
  dueDate: string | null
  createdAt: number
  completedAt: number | null
}

/**
 * An image held as a data URL. Image records live in memory only and are
 * deliberately never written to localStorage.
 */
export interface ImageAsset {
  id: string
  tabId: string
  /** Optional link to the todo this image belongs to. */
  todoId: string | null
  name: string
  mimeType: string
  size: number
  dataUrl: string
  createdAt: number
}

export interface TabsState {
  items: Tab[]
  activeTabId: string | null
}

export interface UiState {
  search: string
  status: StatusFilter
  priority: PriorityFilter
  sort: SortKey
}

export interface ImagesState {
  items: ImageAsset[]
}