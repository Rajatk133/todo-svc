import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearCompletedInTab } from './todosSlice'
import { selectStatsForTab, selectVisibleTodos } from './selectors'
import TodoItem from './TodoItem'
import { Button, Empty, EmptyIcon } from '../../styles/primitives'

const Wrapper = styled.div`
  display: grid;
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 2px;

  h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.color.muted};
  }
`

const OverdueCount = styled.span`
  color: ${({ theme }) => theme.color.danger};
`

const Items = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
`

interface Props {
  tabId: string
}

export default function TodoList({ tabId }: Props) {
  const dispatch = useAppDispatch()
  const todos = useAppSelector(selectVisibleTodos(tabId))
  const stats = useAppSelector(selectStatsForTab(tabId))

  if (todos.length === 0) {
    return (
      <Empty>
        <EmptyIcon aria-hidden="true">✓</EmptyIcon>
        <h3>Nothing here yet</h3>
        <p>Add a todo above, or adjust your filters to see more.</p>
      </Empty>
    )
  }

  return (
    <Wrapper>
      <Head>
        <h3>
          {todos.length} shown · {stats.active} pending
          {stats.overdue > 0 && (
            <OverdueCount> · {stats.overdue} overdue</OverdueCount>
          )}
        </h3>
        {stats.completed > 0 && (
          <Button
            type="button"
            $variant="ghost"
            $size="sm"
            onClick={() => {
              if (
                window.confirm(`Remove ${stats.completed} completed todo(s) from this tab?`)
              ) {
                dispatch(clearCompletedInTab(tabId))
              }
            }}
          >
            Clear completed
          </Button>
        )}
      </Head>

      <Items>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </Items>
    </Wrapper>
  )
}