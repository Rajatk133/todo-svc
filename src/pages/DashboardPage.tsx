import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAppSelector } from '../app/hooks'
import { selectAllImages, selectAllTodos, selectTabs } from '../features/todos/selectors'
import { PRIORITY_LABEL, toDateKey } from '../utils/date'
import {
  Badge,
  Card,
  CardHead,
  Grid2,
  LinkButton,
  MutedText,
  Page,
  PageHead,
  PageSub,
  Pill,
  StatCard,
  StatGrid,
  StatLabel,
  StatValue,
} from '../styles/primitives'

const ProgressList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
`

const ProgressRow = styled(Link)`
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) auto;
  grid-template-areas:
    'dot name meta'
    'dot bar pct';
  align-items: center;
  gap: 4px 10px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.color.text};

  &:hover {
    background: ${({ theme }) => theme.color.surface2};
    text-decoration: none;
  }
`

const RowDot = styled.span`
  grid-area: dot;
  width: 9px;
  height: 9px;
  border-radius: 50%;
`

const RowName = styled.span`
  grid-area: name;
  font-weight: 500;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const RowMeta = styled.span`
  grid-area: meta;
  font-size: 12px;
  color: ${({ theme }) => theme.color.muted};
  font-variant-numeric: tabular-nums;
`

const Bar = styled.span`
  grid-area: bar;
  height: 6px;
  background: ${({ theme }) => theme.color.surface3};
  border-radius: ${({ theme }) => theme.radius.pill};
  overflow: hidden;
`

const BarFill = styled.span`
  display: block;
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.pill};
  transition: width 0.25s ease;
`

const RowPct = styled.span`
  grid-area: pct;
  font-size: 12px;
  color: ${({ theme }) => theme.color.muted};
  font-variant-numeric: tabular-nums;
  justify-self: end;
`

const AttentionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
`

const AttentionRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.color.text};

  &:hover {
    background: ${({ theme }) => theme.color.surface2};
    text-decoration: none;
  }
`

const AttentionTitle = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
`

const AttentionMeta = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.color.muted};
`

const AttentionDue = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.color.danger};
  font-weight: 600;
`

const InlineEmpty = styled.div`
  text-align: center;
  padding: 24px 12px;
  color: ${({ theme }) => theme.color.muted};

  p { margin: 0; font-size: 14px; }

  .icon {
    font-size: 30px;
    font-weight: 700;
    margin: 0 0 8px;
    color: ${({ theme }) => theme.color.success};
  }
`

export default function DashboardPage() {
  const tabs = useAppSelector(selectTabs)
  const todos = useAppSelector(selectAllTodos)
  const images = useAppSelector(selectAllImages)

  const today = toDateKey()
  const completed = todos.filter((todo) => todo.completed).length
  const overdue = todos.filter(
    (todo) => !todo.completed && todo.dueDate !== null && todo.dueDate < today,
  )
  const dueToday = todos.filter((todo) => !todo.completed && todo.dueDate === today)

  const stats = [
    { label: 'Tabs', value: tabs.length, alert: false },
    { label: 'Total todos', value: todos.length, alert: false },
    { label: 'Completed', value: completed, alert: false },
    { label: 'Overdue', value: overdue.length, alert: overdue.length > 0 },
  ]

  return (
    <Page>
      <PageHead>
        <h1>Dashboard</h1>
        <PageSub>Everything across all tabs, at a glance.</PageSub>
      </PageHead>

      <StatGrid>
        {stats.map((stat) => (
          <StatCard key={stat.label} $alert={stat.alert}>
            <StatLabel>{stat.label}</StatLabel>
            <StatValue $alert={stat.alert}>{stat.value}</StatValue>
          </StatCard>
        ))}
      </StatGrid>

      <Grid2>
        <Card>
          <CardHead>
            <h2>Tabs</h2>
            <Pill>{tabs.length}</Pill>
          </CardHead>
          <ProgressList>
            {tabs.map((tab) => {
              const inTab = todos.filter((todo) => todo.tabId === tab.id)
              const done = inTab.filter((todo) => todo.completed).length
              const pct = inTab.length === 0 ? 0 : Math.round((done / inTab.length) * 100)
              return (
                <li key={tab.id}>
                  <ProgressRow to={`/tab/${tab.id}`}>
                    <RowDot style={{ background: tab.color }} />
                    <RowName>{tab.name}</RowName>
                    <RowMeta>
                      {done}/{inTab.length}
                    </RowMeta>
                    <Bar aria-hidden="true">
                      <BarFill style={{ width: `${pct}%`, background: tab.color }} />
                    </Bar>
                    <RowPct>{pct}%</RowPct>
                  </ProgressRow>
                </li>
              )
            })}
          </ProgressList>
        </Card>

        <Card>
          <CardHead>
            <h2>Needs attention</h2>
            <Pill>{overdue.length + dueToday.length}</Pill>
          </CardHead>

          {overdue.length === 0 && dueToday.length === 0 ? (
            <InlineEmpty>
              <p className="icon" aria-hidden="true">
                ✓
              </p>
              <p>Nothing overdue or due today.</p>
            </InlineEmpty>
          ) : (
            <AttentionList>
              {[...overdue, ...dueToday].map((todo) => {
                const tab = tabs.find((t) => t.id === todo.tabId)
                return (
                  <li key={todo.id}>
                    <AttentionRow to={`/tab/${todo.tabId}`}>
                      <Badge $tone={todo.priority}>{PRIORITY_LABEL[todo.priority]}</Badge>
                      <AttentionTitle>{todo.title}</AttentionTitle>
                      <AttentionMeta>{tab?.name ?? '—'}</AttentionMeta>
                      <AttentionDue>{todo.dueDate === today ? 'today' : todo.dueDate}</AttentionDue>
                    </AttentionRow>
                  </li>
                )
              })}
            </AttentionList>
          )}
        </Card>
      </Grid2>

      <Card>
        <CardHead>
          <h2>Images</h2>
          <LinkButton as={Link} to="/images">
            Manage →
          </LinkButton>
        </CardHead>
        <MutedText>
          {images.length} image{images.length === 1 ? '' : 's'} uploaded this session. Images are
          held in memory only and clear on refresh.
        </MutedText>
      </Card>
    </Page>
  )
}