import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectAllImages, selectAllTodos, selectTabs } from '../features/todos/selectors'
import { PRIORITY_LABEL, toDateKey } from '../utils/date'

export default function DashboardPage() {
  const tabs = useAppSelector(selectTabs)
  const todos = useAppSelector(selectAllTodos)
  const images = useAppSelector(selectAllImages)

  const today = toDateKey()
  const completed = todos.filter((todo) => todo.completed).length
  const overdue = todos.filter(
    (todo) => !todo.completed && todo.dueDate !== null && todo.dueDate < today,
  )
  const dueToday = todos.filter(
    (todo) => !todo.completed && todo.dueDate === today,
  )

  const stats = [
    { label: 'Tabs', value: tabs.length },
    { label: 'Total todos', value: todos.length },
    { label: 'Completed', value: completed },
    { label: 'Overdue', value: overdue.length, alert: overdue.length > 0 },
  ]

  return (
    <div className="page">
      <header className="page__head">
        <h1>Dashboard</h1>
        <p className="page__sub">Everything across all tabs, at a glance.</p>
      </header>

      <section className="stat-grid">
        {stats.map((stat) => (
          <div key={stat.label} className={`stat-card ${stat.alert ? 'stat-card--alert' : ''}`}>
            <p className="stat-card__label">{stat.label}</p>
            <p className="stat-card__value">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="grid-2">
        <section className="card">
          <header className="card__head">
            <h2>Tabs</h2>
            <span className="pill">{tabs.length}</span>
          </header>
          <ul className="progress-list">
            {tabs.map((tab) => {
              const inTab = todos.filter((todo) => todo.tabId === tab.id)
              const done = inTab.filter((todo) => todo.completed).length
              const pct = inTab.length === 0 ? 0 : Math.round((done / inTab.length) * 100)
              return (
                <li key={tab.id}>
                  <Link to={`/tab/${tab.id}`} className="progress-row">
                    <span className="progress-row__dot" style={{ background: tab.color }} />
                    <span className="progress-row__name">{tab.name}</span>
                    <span className="progress-row__meta">
                      {done}/{inTab.length}
                    </span>
                    <span className="progress-bar" aria-hidden="true">
                      <span
                        className="progress-bar__fill"
                        style={{ width: `${pct}%`, background: tab.color }}
                      />
                    </span>
                    <span className="progress-row__pct">{pct}%</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="card">
          <header className="card__head">
            <h2>Needs attention</h2>
            <span className="pill">{overdue.length + dueToday.length}</span>
          </header>

          {overdue.length === 0 && dueToday.length === 0 ? (
            <div className="empty empty--inline">
              <p className="empty__icon" aria-hidden="true">
                ✓
              </p>
              <p>Nothing overdue or due today.</p>
            </div>
          ) : (
            <ul className="attention">
              {[...overdue, ...dueToday].map((todo) => {
                const tab = tabs.find((t) => t.id === todo.tabId)
                return (
                  <li key={todo.id}>
                    <Link to={`/tab/${todo.tabId}`} className="attention__row">
                      <span className={`badge badge--${todo.priority}`}>
                        {PRIORITY_LABEL[todo.priority]}
                      </span>
                      <span className="attention__title">{todo.title}</span>
                      <span className="attention__tab">{tab?.name ?? '—'}</span>
                      <span className="attention__due">
                        {todo.dueDate === today ? 'today' : todo.dueDate}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      <section className="card">
        <header className="card__head">
          <h2>Images</h2>
          <Link to="/images" className="link-button">
            Manage →
          </Link>
        </header>
        <p className="muted">
          {images.length} image{images.length === 1 ? '' : 's'} uploaded this session. Images are
          held in memory only and clear on refresh.
        </p>
      </section>
    </div>
  )
}