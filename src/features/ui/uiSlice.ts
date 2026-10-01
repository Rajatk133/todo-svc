import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UiState } from '../../types'

const initialState: UiState = {
  search: '',
  status: 'all',
  priority: 'all',
  sort: 'created-desc',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setStatusFilter(state, action: PayloadAction<UiState['status']>) {
      state.status = action.payload
    },
    setPriorityFilter(state, action: PayloadAction<UiState['priority']>) {
      state.priority = action.payload
    },
    setSort(state, action: PayloadAction<UiState['sort']>) {
      state.sort = action.payload
    },
    resetFilters(state) {
      state.search = ''
      state.status = 'all'
      state.priority = 'all'
    },
  },
})

export const { setSearch, setStatusFilter, setPriorityFilter, setSort, resetFilters } =
  uiSlice.actions
export default uiSlice.reducer