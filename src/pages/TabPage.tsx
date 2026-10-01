import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setActiveTab } from '../features/tabs/tabsSlice'
import TodoForm from '../features/todos/TodoForm'
import TodoList from '../features/todos/TodoList'
import Filters from '../features/todos/Filters'
import { selectStatsForTab, selectTabs } from '../features/todos/selectors'
import { Card, Page, PageHead, PageSub } from '../styles/primitives'

const AlertCount = styled.span`
  color: ${({ theme }) => theme.color.danger};
`

export default function TabPage() {
  const { tabId } = useParams<{ tabId: string }>()
  const dispatch = useAppDispatch()
  const tabs = useAppSelector(selectTabs)
  const tab = tabs.find((t) => t.id === tabId)
  const stats = useAppSelector(selectStatsForTab(tabId ?? ''))

  // Mirror the route into the store so the sidebar/topbar stay in sync. This is
  // presentation only — the todos below are driven by the `tabId` param, so
  // there is no flash of the previously active tab while this effect runs.
  useEffect(() => {
    if (tabId && tabs.some((t) => t.id === tabId)) {
      dispatch(setActiveTab(tabId))
    }
  }, [dispatch, tabId, tabs])

  // Deleted or invalid tab in the URL.
  if (!tab || !tabId) {
    return <Navigate to="/" replace />
  }

  return (
    <Page>
      <PageHead>
        <h1>{tab.name}</h1>
        <PageSub>
          {stats.total} todo{stats.total === 1 ? '' : 's'} · {stats.active} pending ·{' '}
          {stats.completed} done
          {stats.overdue > 0 && <AlertCount> · {stats.overdue} overdue</AlertCount>}
        </PageSub>
      </PageHead>

      <Card>
        <TodoForm tabId={tabId} tabName={tab.name} />
        <Filters tabId={tabId} />
        <TodoList tabId={tabId} />
      </Card>
    </Page>
  )
}