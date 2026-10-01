import type { Tab, TabsState, Todo, UiState } from '../types'
import type { TodosState } from '../features/todos/todosSlice'

const STORAGE_KEY = 'todo-app:v2'

/**
 * Only these slices are persisted. `images` is intentionally excluded — it holds
 * base64 data URLs, which would blow past the ~5MB localStorage quota.
 */
export interface PersistedState {
  tabs: TabsState
  todos: TodosState
  ui: UiState
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isTab(value: unknown): value is Tab {
  return isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string'
}

function isTodo(value: unknown): value is Todo {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.tabId === 'string' &&
    typeof value.title === 'string'
  )
}

/**
 * Reads persisted state defensively. Anything malformed is discarded rather than
 * crashing the app on boot.
 */
export function loadPersistedState(): PersistedState | undefined {
  if (typeof localStorage === 'undefined') return undefined
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined

    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || !isRecord(parsed.tabs) || !Array.isArray(parsed.tabs.items)) {
      return undefined
    }

    const items = parsed.tabs.items.filter(isTab)
    if (items.length === 0) return undefined

    const tabIds = new Set(items.map((tab) => tab.id))
    const activeTabId =
      typeof parsed.tabs.activeTabId === 'string' && tabIds.has(parsed.tabs.activeTabId)
        ? parsed.tabs.activeTabId
        : items[0].id

    // Rebuild the normalized entity state, dropping orphans whose tab is gone.
    const rawEntities = isRecord(parsed.todos) && isRecord(parsed.todos.entities)
      ? parsed.todos.entities
      : {}
    const entries = Object.values(rawEntities)
      .filter(isTodo)
      .filter((todo) => tabIds.has(todo.tabId))
      .map((todo) => [todo.id, todo] as const)

    const ui = isRecord(parsed.ui) ? parsed.ui : {}

    return {
      tabs: { items, activeTabId },
      todos: { ids: entries.map(([id]) => id), entities: Object.fromEntries(entries) },
      // `search` is intentionally not restored: reopening the app to a stale
      // filtered list is confusing.
      ui: {
        search: '',
        status: typeof ui.status === 'string' ? (ui.status as UiState['status']) : 'all',
        priority: typeof ui.priority === 'string' ? (ui.priority as UiState['priority']) : 'all',
        sort: typeof ui.sort === 'string' ? (ui.sort as UiState['sort']) : 'created-desc',
      },
    }
  } catch {
    return undefined
  }
}

export function savePersistedState(state: PersistedState): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota exceeded or storage disabled — persistence is a nice-to-have.
  }
}

export function clearPersistedState(): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

/** Trailing-edge throttle so typing in the search box does not thrash storage. */
export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number,
): (...args: Args) => void {
  let lastRun = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  let pending: Args | null = null

  return (...args: Args) => {
    const now = Date.now()
    pending = args
    if (now - lastRun >= waitMs) {
      lastRun = now
      if (pending) fn(...pending)
      return
    }
    if (timer) return
    timer = setTimeout(() => {
      timer = null
      lastRun = Date.now()
      if (pending) fn(...pending)
    }, waitMs - (now - lastRun))
  }
}