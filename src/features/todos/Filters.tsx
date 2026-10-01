import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { resetFilters, setPriorityFilter, setSearch, setSort, setStatusFilter } from '../ui/uiSlice'
import { selectIsFilterActive, selectVisibleTodos } from './selectors'
import type { PriorityFilter, SortKey, StatusFilter } from '../../types'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
]

const PRIORITY_OPTIONS: { value: PriorityFilter; label: string }[] = [
  { value: 'all', label: 'Any priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'created-desc', label: 'Newest first' },
  { value: 'created-asc', label: 'Oldest first' },
  { value: 'due-asc', label: 'Due soonest' },
  { value: 'priority-desc', label: 'Priority' },
]

interface Props {
  tabId: string
}

export default function Filters({ tabId }: Props) {
  const dispatch = useAppDispatch()
  const ui = useAppSelector((state) => state.ui)
  const isFilterActive = useAppSelector(selectIsFilterActive)
  const visibleCount = useAppSelector(selectVisibleTodos(tabId)).length

  return (
    <div className="filters">
      <input
        type="search"
        className="filters__search"
        value={ui.search}
        placeholder="Search title or notes…"
        aria-label="Search todos"
        onChange={(event) => dispatch(setSearch(event.target.value))}
      />

      <select
        value={ui.status}
        aria-label="Filter by status"
        onChange={(event) => dispatch(setStatusFilter(event.target.value as StatusFilter))}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={ui.priority}
        aria-label="Filter by priority"
        onChange={(event) => dispatch(setPriorityFilter(event.target.value as PriorityFilter))}
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={ui.sort}
        aria-label="Sort todos"
        onChange={(event) => dispatch(setSort(event.target.value as SortKey))}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span className="filters__count" aria-live="polite">
        {visibleCount} shown
      </span>

      {isFilterActive && (
        <button
          type="button"
          className="button button--ghost button--sm"
          onClick={() => dispatch(resetFilters())}
        >
          Clear
        </button>
      )}
    </div>
  )
}