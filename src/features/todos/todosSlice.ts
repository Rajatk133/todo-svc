import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { EntityState } from '@reduxjs/toolkit'
import type { Priority, Todo } from '../../types'
import { createId } from '../../utils/id'
import { removeTab } from '../tabs/tabsSlice'

export type TodosState = EntityState<Todo, string>

/**
 * No `sortComparer`: ordering is user-controlled via the sort control, so the
 * adapter stays order-agnostic and the visible list is sorted in a selector.
 */
const todosAdapter = createEntityAdapter<Todo>()

const initialState: TodosState = todosAdapter.getInitialState()

export interface NewTodoInput {
  tabId: string
  title: string
  notes?: string
  priority?: Priority
  dueDate?: string | null
}

export type TodoChanges = Partial<Pick<Todo, 'title' | 'notes' | 'completed' | 'priority' | 'dueDate'>>

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        todosAdapter.addOne(state, action.payload)
      },
      prepare(input: NewTodoInput) {
        const title = input.title.trim()
        return {
          payload: {
            id: createId(),
            tabId: input.tabId,
            title,
            notes: input.notes?.trim() ?? '',
            completed: false,
            priority: input.priority ?? 'medium',
            dueDate: input.dueDate ?? null,
            createdAt: Date.now(),
            completedAt: null,
          } satisfies Todo,
        }
      },
    },
    updateTodo(state, action: PayloadAction<{ id: string; changes: TodoChanges }>) {
      const existing = state.entities[action.payload.id]
      if (!existing) return

      const patch: Partial<Todo> = {}
      if (typeof action.payload.changes.title === 'string') {
        const title = action.payload.changes.title.trim()
        if (title) patch.title = title
      }
      if (typeof action.payload.changes.notes === 'string') patch.notes = action.payload.changes.notes
      if (typeof action.payload.changes.completed === 'boolean') {
        patch.completed = action.payload.changes.completed
        patch.completedAt = action.payload.changes.completed ? Date.now() : null
      }
      if (typeof action.payload.changes.priority === 'string') {
        patch.priority = action.payload.changes.priority as Priority
      }
      if (action.payload.changes.dueDate === null || typeof action.payload.changes.dueDate === 'string') {
        patch.dueDate = action.payload.changes.dueDate
      }

      if (Object.keys(patch).length > 0) {
        todosAdapter.updateOne(state, { id: action.payload.id, changes: patch })
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const existing = state.entities[action.payload]
      if (!existing) return
      const completed = !existing.completed
      todosAdapter.updateOne(state, {
        id: action.payload,
        changes: { completed, completedAt: completed ? Date.now() : null },
      })
    },
    deleteTodo(state, action: PayloadAction<string>) {
      todosAdapter.removeOne(state, action.payload)
    },
    clearCompletedInTab(state, action: PayloadAction<string>) {
      const ids = todosAdapter
        .getSelectors()
        .selectAll(state)
        .filter((todo) => todo.tabId === action.payload && todo.completed)
        .map((todo) => todo.id)
      todosAdapter.removeMany(state, ids)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeTab, (state, action) => {
      const ids = todosAdapter
        .getSelectors()
        .selectAll(state)
        .filter((todo) => todo.tabId === action.payload)
        .map((todo) => todo.id)
      todosAdapter.removeMany(state, ids)
    })
  },
})

export const { addTodo, updateTodo, toggleTodo, deleteTodo, clearCompletedInTab } =
  todosSlice.actions
export default todosSlice.reducer

export const todosSelectors = todosAdapter.getSelectors<RootTodosState>((state) => state.todos)

type RootTodosState = { todos: TodosState }