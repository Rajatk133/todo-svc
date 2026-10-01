import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setSort } from '../features/ui/uiSlice'
import { clearPersistedState } from '../app/persistence'
import { selectAllImages, selectAllTodos } from '../features/todos/selectors'
import type { SortKey } from '../types'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'created-desc', label: 'Newest first' },
  { value: 'created-asc', label: 'Oldest first' },
  { value: 'due-asc', label: 'Due soonest' },
  { value: 'priority-desc', label: 'Priority' },
]

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const sort = useAppSelector((state) => state.ui.sort)
  const tabs = useAppSelector((state) => state.tabs.items.length)
  const todos = useAppSelector(selectAllTodos)
  const images = useAppSelector(selectAllImages)

  function handleReset() {
    if (
      window.confirm(
        'Reset everything? This deletes all tabs and todos saved in this browser. Images are already in memory only.',
      )
    ) {
      clearPersistedState()
      window.location.reload()
    }
  }

  return (
    <div className="page">
      <header className="page__head">
        <h1>Settings</h1>
        <p className="page__sub">Preferences and stored data.</p>
      </header>

      <div className="grid-2">
        <section className="card">
          <header className="card__head">
            <h2>Preferences</h2>
          </header>

          <label className="field">
            <span>Default sort order</span>
            <select
              value={sort}
              onChange={(event) => dispatch(setSort(event.target.value as SortKey))}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="card">
          <header className="card__head">
            <h2>Stored data</h2>
          </header>
          <dl className="kv">
            <div>
              <dt>Tabs</dt>
              <dd>{tabs}</dd>
            </div>
            <div>
              <dt>Todos</dt>
              <dd>{todos.length}</dd>
            </div>
            <div>
              <dt>Images (this session)</dt>
              <dd>{images.length}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="card">
        <header className="card__head">
          <h2>How saving works</h2>
        </header>
        <ul className="bullets">
          <li>
            Tabs, todos and your sort preference are written to <code>localStorage</code> and
            restored when you return.
          </li>
          <li>
            Images are <strong>not</strong> saved. They are kept in memory for the session only,
            because the ~5 MB <code>localStorage</code> quota cannot hold them as base64.
          </li>
          <li>Data stays in your browser. Nothing is sent to a server.</li>
        </ul>
      </section>

      <section className="card card--danger">
        <header className="card__head">
          <h2>Danger zone</h2>
        </header>
        <p className="muted">
          Permanently remove all tabs and todos saved in this browser.
        </p>
        <button type="button" className="button button--danger" onClick={handleReset}>
          Reset all data
        </button>
      </section>
    </div>
  )
}