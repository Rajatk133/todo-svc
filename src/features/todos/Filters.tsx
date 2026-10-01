import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { resetFilters, setPriorityFilter, setSearch, setSort, setStatusFilter } from '../ui/uiSlice'
import { selectIsFilterActive, selectVisibleTodos } from './selectors'
import type { PriorityFilter, SortKey, StatusFilter } from '../../types'
import { Button, Input, Select } from '../../styles/primitives'

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

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 14px 0;
  border-top: 1px solid ${({ theme }) => theme.color.border};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  margin-bottom: 6px;

  select { width: auto; min-width: 130px; }
`

const Search = styled(Input)`
  flex: 1;
  min-width: 200px;

  @media (max-width: ${({ theme }) => theme.bp.sm}) {
    min-width: 100%;
  }
`

const Count = styled.span`
  color: ${({ theme }) => theme.color.muted};
  font-size: 13px;
  margin-left: auto;
  font-variant-numeric: tabular-nums;
`

interface Props {
  tabId: string
}

export default function Filters({ tabId }: Props) {
  const dispatch = useAppDispatch()
  const ui = useAppSelector((state) => state.ui)
  const isFilterActive = useAppSelector(selectIsFilterActive)
  const visibleCount = useAppSelector(selectVisibleTodos(tabId)).length

  return (
    <Bar>
      <Search
        type="search"
        value={ui.search}
        placeholder="Search title or notes…"
        aria-label="Search todos"
        onChange={(event) => dispatch(setSearch(event.target.value))}
      />

      <Select
        value={ui.status}
        aria-label="Filter by status"
        onChange={(event) => dispatch(setStatusFilter(event.target.value as StatusFilter))}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        value={ui.priority}
        aria-label="Filter by priority"
        onChange={(event) => dispatch(setPriorityFilter(event.target.value as PriorityFilter))}
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        value={ui.sort}
        aria-label="Sort todos"
        onChange={(event) => dispatch(setSort(event.target.value as SortKey))}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Count aria-live="polite">{visibleCount} shown</Count>

      {isFilterActive && (
        <Button type="button" $variant="ghost" $size="sm" onClick={() => dispatch(resetFilters())}>
          Clear
        </Button>
      )}
    </Bar>
  )
}