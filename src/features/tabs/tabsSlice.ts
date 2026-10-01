import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Tab, TabsState } from '../../types'
import { createId } from '../../utils/id'

export const TAB_COLORS = [
  '#6366f1',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#14b8a6',
] as const

export function createInitialTabs(): TabsState {
  const now = Date.now()
  const items: Tab[] = [
    { id: createId(), name: 'Work', color: TAB_COLORS[0], createdAt: now },
    { id: createId(), name: 'Personal', color: TAB_COLORS[2], createdAt: now + 1 },
    { id: createId(), name: 'Shopping', color: TAB_COLORS[3], createdAt: now + 2 },
  ]
  return { items, activeTabId: items[0].id }
}

const initialState: TabsState = createInitialTabs()

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: {
      reducer(state, action: PayloadAction<Tab>) {
        state.items.push(action.payload)
        state.activeTabId = action.payload.id
      },
      prepare(input: { name: string; color?: string }) {
        const color = input.color ?? TAB_COLORS[Math.floor(Math.random() * TAB_COLORS.length)]
        return {
          payload: {
            id: createId(),
            name: input.name.trim() || 'Untitled tab',
            color: color ?? TAB_COLORS[0],
            createdAt: Date.now(),
          } satisfies Tab,
        }
      },
    },
    renameTab(state, action: PayloadAction<{ id: string; name: string }>) {
      const tab = state.items.find((t) => t.id === action.payload.id)
      const name = action.payload.name.trim()
      if (tab && name) tab.name = name
    },
    setTabColor(state, action: PayloadAction<{ id: string; color: string }>) {
      const tab = state.items.find((t) => t.id === action.payload.id)
      if (tab) tab.color = action.payload.color
    },
    /** Deleting a tab also cascades to its todos and images (handled in those slices). */
    removeTab(state, action: PayloadAction<string>) {
      if (state.items.length <= 1) return
      const index = state.items.findIndex((t) => t.id === action.payload)
      if (index === -1) return
      state.items.splice(index, 1)
      if (state.activeTabId === action.payload) {
        const fallback = state.items[index] ?? state.items[index - 1]
        state.activeTabId = fallback ? fallback.id : null
      }
    },
    setActiveTab(state, action: PayloadAction<string>) {
      if (state.items.some((t) => t.id === action.payload)) {
        state.activeTabId = action.payload
      }
    },
  },
})

export const { addTab, renameTab, setTabColor, removeTab, setActiveTab } = tabsSlice.actions
export default tabsSlice.reducer