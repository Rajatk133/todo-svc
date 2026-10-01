import { useState, type CSSProperties, type FormEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addTab, removeTab, renameTab } from '../features/tabs/tabsSlice'
import { selectTabCounts } from '../features/todos/selectors'

export default function TabNav() {
  const dispatch = useAppDispatch()
  const tabs = useAppSelector((state) => state.tabs.items)
  const counts = useAppSelector(selectTabCounts)

  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    dispatch(addTab({ name }))
    setName('')
    setIsAdding(false)
  }

  function commitRename(id: string) {
    if (editingName.trim()) dispatch(renameTab({ id, name: editingName }))
    setEditingId(null)
    setEditingName('')
  }

  function handleDelete(id: string, tabName: string) {
    const count = counts.get(id)?.total ?? 0
    const suffix = count > 0 ? ` and its ${count} todo${count === 1 ? '' : 's'}` : ''
    if (window.confirm(`Delete tab "${tabName}"${suffix}? This cannot be undone.`)) {
      dispatch(removeTab(id))
    }
  }

  return (
    <div className="tabnav">
      <p className="sidebar__label">Tabs</p>

      <ul className="tabnav__list">
        {tabs.map((tab) => {
          const count = counts.get(tab.id)?.total ?? 0

          if (editingId === tab.id) {
            return (
              <li key={tab.id}>
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    commitRename(tab.id)
                  }}
                >
                  <input
                    autoFocus
                    value={editingName}
                    aria-label={`Rename ${tab.name}`}
                    onChange={(event) => setEditingName(event.target.value)}
                    onBlur={() => commitRename(tab.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        setEditingId(null)
                        setEditingName('')
                      }
                    }}
                  />
                </form>
              </li>
            )
          }

          return (
            <li key={tab.id}>
              <div className="tabnav__row">
                <NavLink
                  to={`/tab/${tab.id}`}
                  className={({ isActive }) => `tabnav__link ${isActive ? 'is-active' : ''}`}
                  style={{ '--tab-color': tab.color } as CSSProperties}
                >
                  <span className="tabnav__dot" aria-hidden="true" />
                  <span className="tabnav__name">{tab.name}</span>
                  <span className="tabnav__count">{count}</span>
                </NavLink>
                <div className="tabnav__tools">
                  <button
                    type="button"
                    title="Rename"
                    aria-label={`Rename ${tab.name}`}
                    onClick={() => {
                      setEditingId(tab.id)
                      setEditingName(tab.name)
                    }}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    aria-label={`Delete ${tab.name}`}
                    disabled={tabs.length <= 1}
                    onClick={() => handleDelete(tab.id, tab.name)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {isAdding ? (
        <form className="tabnav__add" onSubmit={submit}>
          <input
            autoFocus
            value={name}
            placeholder="Tab name"
            aria-label="New tab name"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setIsAdding(false)
            }}
          />
          <button type="submit" className="button button--primary button--sm">
            Add
          </button>
        </form>
      ) : (
        <button type="button" className="tabnav__new" onClick={() => setIsAdding(true)}>
          + New tab
        </button>
      )}
    </div>
  )
}