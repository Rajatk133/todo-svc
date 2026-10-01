import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { ImageAsset, SortKey, Todo } from '../../types'
import { PRIORITY_RANK, toDateKey } from '../../utils/date'
import { todosSelectors } from './todosSlice'

export interface TabStats {
  total: number
  completed: number
  active: number
  overdue: number
}

export const { selectAll: selectAllTodos } = todosSelectors

export const selectTabs = (state: RootState) => state.tabs.items
export const selectActiveTabId = (state: RootState) => state.tabs.activeTabId
export const selectAllImages = (state: RootState) => state.images.items
export const selectUi = (state: RootState) => state.ui

export const selectActiveTab = createSelector([selectTabs, selectActiveTabId], (tabs, activeTabId) =>
  tabs.find((tab) => tab.id === activeTabId) ?? null,
)

/** Todos belonging to the active tab, before search/filter/sort is applied. */
export const selectTodosForActiveTab = createSelector(
  [selectAllTodos, selectActiveTabId],
  (todos, tabId) => (tabId ? todos.filter((todo) => todo.tabId === tabId) : []),
)

const SORTERS: Record<SortKey, (a: Todo, b: Todo) => number> = {
  'created-desc': (a, b) => b.createdAt - a.createdAt,
  'created-asc': (a, b) => a.createdAt - b.createdAt,
  // Todos without a due date sink to the bottom rather than sorting as year 0.
  'due-asc': (a, b) => {
    if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return a.dueDate.localeCompare(b.dueDate)
  },
  'priority-desc': (a, b) =>
    PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] || b.createdAt - a.createdAt,
}

/** A tab's todos after search, status/priority filters and sorting. */
export function selectVisibleTodos(tabId: string): (state: RootState) => Todo[] {
  let selector = visibleTodosCache.get(tabId)
  if (!selector) {
    selector = createSelector([selectTodosForTab(tabId), selectUi], (todos, ui) => {
      const query = ui.search.trim().toLowerCase()
      const sorter = SORTERS[ui.sort]

      return todos
        .filter((todo) => {
          if (ui.status === 'active' && todo.completed) return false
          if (ui.status === 'completed' && !todo.completed) return false
          if (ui.priority !== 'all' && todo.priority !== ui.priority) return false
          if (query && !`${todo.title} ${todo.notes}`.toLowerCase().includes(query)) return false
          return true
        })
        .sort(sorter)
    })
    visibleTodosCache.set(tabId, selector)
  }
  return selector
}

export const selectActiveTabStats = createSelector([selectTodosForActiveTab], (todos) => {
  const today = toDateKey()
  let completed = 0
  let overdue = 0
  for (const todo of todos) {
    if (todo.completed) completed++
    else if (todo.dueDate !== null && todo.dueDate < today) overdue++
  }
  return {
    total: todos.length,
    completed,
    active: todos.length - completed,
    overdue,
  }
})

/** Per-tab totals, used for the badges on each tab. */
export const selectTabCounts = createSelector([selectAllTodos], (todos) => {
  const counts = new Map<string, { total: number; completed: number }>()
  for (const todo of todos) {
    const entry = counts.get(todo.tabId) ?? { total: 0, completed: 0 }
    entry.total += 1
    if (todo.completed) entry.completed += 1
    counts.set(todo.tabId, entry)
  }
  return counts
})

export const selectImagesForTab = createSelector(
  [selectAllImages, selectActiveTabId],
  (images, tabId) => (tabId ? images.filter((image) => image.tabId === tabId) : []),
)

/*
 * Per-id selector factories below are cached in a module-level Map.
 *
 * Calling `createSelector` inside a component body looks memoized but is not:
 * it builds a brand-new selector every render, so the cache never hits and the
 * selector returns a fresh array each time — which trips react-redux's
 * reference-equality check and forces an extra render pass. Caching by id keeps
 * exactly one memoized selector per id for the life of the module.
 */
const tabTodosCache = new Map<string, (state: RootState) => Todo[]>()
const tabStatsCache = new Map<string, (state: RootState) => TabStats>()
const todoImagesCache = new Map<string, (state: RootState) => ImageAsset[]>()
const visibleTodosCache = new Map<string, (state: RootState) => Todo[]>()

export function selectTodosForTab(tabId: string): (state: RootState) => Todo[] {
  let selector = tabTodosCache.get(tabId)
  if (!selector) {
    selector = createSelector([selectAllTodos], (todos) =>
      todos.filter((todo) => todo.tabId === tabId),
    )
    tabTodosCache.set(tabId, selector)
  }
  return selector
}

export function selectStatsForTab(tabId: string): (state: RootState) => TabStats {
  let selector = tabStatsCache.get(tabId)
  if (!selector) {
    const todos = selectTodosForTab(tabId)
    selector = createSelector([todos], (list) => {
      const today = toDateKey()
      let completed = 0
      let overdue = 0
      for (const todo of list) {
        if (todo.completed) completed++
        else if (todo.dueDate !== null && todo.dueDate < today) overdue++
      }
      return {
        total: list.length,
        completed,
        active: list.length - completed,
        overdue,
      }
    })
    tabStatsCache.set(tabId, selector)
  }
  return selector
}

export function selectImagesForTodo(todoId: string): (state: RootState) => ImageAsset[] {
  let selector = todoImagesCache.get(todoId)
  if (!selector) {
    selector = createSelector([selectAllImages], (images) =>
      images.filter((image) => image.todoId === todoId),
    )
    todoImagesCache.set(todoId, selector)
  }
  return selector
}

export const selectIsFilterActive = createSelector([selectUi], (ui) => {
  return Boolean(ui.search.trim()) || ui.status !== 'all' || ui.priority !== 'all'
})