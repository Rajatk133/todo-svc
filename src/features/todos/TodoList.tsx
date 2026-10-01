import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearCompletedInTab } from './todosSlice'
import { selectStatsForTab, selectVisibleTodos } from './selectors'
import TodoItem from './TodoItem'

interface Props {
  tabId: string
}

export default function TodoList({ tabId }: Props) {
  const dispatch = useAppDispatch()
  const todos = useAppSelector(selectVisibleTodos(tabId))
  const stats = useAppSelector(selectStatsForTab(tabId))

  if (todos.length === 0) {
    return (
      <div className="empty">
        <p className="empty__icon" aria-hidden="true">
          ✓
        </p>
        <h3>Nothing here yet</h3>
        <p>Add a todo above, or adjust your filters to see more.</p>
      </div>
    )
  }

  return (
    <div className="todo-list">
      <div className="todo-list__header">
        <h3>
          {todos.length} shown · {stats.active} pending
          {stats.overdue > 0 && <span className="todo-list__overdue"> · {stats.overdue} overdue</span>}
        </h3>
        {stats.completed > 0 && (
          <button
            type="button"
            className="button button--ghost button--sm"
            onClick={() => {
              if (window.confirm(`Remove ${stats.completed} completed todo(s) from this tab?`)) {
                dispatch(clearCompletedInTab(tabId))
              }
            }}
          >
            Clear completed
          </button>
        )}
      </div>

      <ul className="todo-list__items">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  )
}