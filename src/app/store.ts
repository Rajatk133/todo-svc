import { configureStore } from '@reduxjs/toolkit'
import tabsReducer from '../features/tabs/tabsSlice'
import todosReducer from '../features/todos/todosSlice'
import uiReducer from '../features/ui/uiSlice'
import imagesReducer from '../features/images/imagesSlice'
import { loadPersistedState, savePersistedState, throttle } from './persistence'

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
    todos: todosReducer,
    ui: uiReducer,
    images: imagesReducer,
  },
  preloadedState: loadPersistedState(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const persist = throttle((state: ReturnType<typeof store.getState>) => {
  const { tabs, todos, ui } = state
  savePersistedState({ tabs, todos, ui })
}, 400)

store.subscribe(() => persist(store.getState()))