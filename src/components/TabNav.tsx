import { useState, type CSSProperties, type FormEvent } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addTab, removeTab, renameTab } from '../features/tabs/tabsSlice'
import { selectTabCounts } from '../features/todos/selectors'
import { Button, Input } from '../styles/primitives'

const Label = styled.p`
  margin: 0 0 6px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${({ theme }) => theme.color.muted};
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 2px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.sm};

  &:hover .tools { opacity: 1; }

  &:focus-within .tools { opacity: 1; }
`

const TabLink = styled(NavLink)`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.color.text2};
  font-size: 14px;
  text-decoration: none;
  min-width: 0;

  &:hover {
    background: ${({ theme }) => theme.color.surface2};
    color: ${({ theme }) => theme.color.text};
    text-decoration: none;
  }

  &.active {
    background: ${({ theme }) => theme.color.accentSoft};
    color: ${({ theme }) => theme.color.accent};
    font-weight: 550;
  }
`

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tab-color);
  flex-shrink: 0;
`

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Count = styled.span`
  margin-left: auto;
  background: ${({ theme }) => theme.color.surface3};
  color: ${({ theme }) => theme.color.muted};
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 0 7px;
  font-size: 11px;
  font-weight: 600;
`

const Tools = styled.div`
  display: flex;
  gap: 1px;
  opacity: 0;
  padding-right: 4px;
  transition: opacity 0.12s ease;

  @media (hover: none) {
    opacity: 1;
  }

  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.color.muted};
    cursor: pointer;
    padding: 3px 5px;
    border-radius: 5px;
    font-size: 11px;
    line-height: 1;
  }

  button:hover:not(:disabled) {
    background: ${({ theme }) => theme.color.surface3};
    color: ${({ theme }) => theme.color.text};
  }

  button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const AddForm = styled.form`
  display: flex;
  gap: 6px;
  margin-top: 8px;

  input { flex: 1; min-width: 0; }
`

const NewTabButton = styled.button`
  margin-top: 8px;
  width: 100%;
  background: none;
  border: 1px dashed ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.color.muted};
  padding: 8px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    color: ${({ theme }) => theme.color.accent};
    border-color: ${({ theme }) => theme.color.accent};
    background: ${({ theme }) => theme.color.accentSoft};
  }
`

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
    <div>
      <Label>Tabs</Label>

      <List>
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
                  <Input
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
              <Row>
                <TabLink
                  to={`/tab/${tab.id}`}
                  style={{ '--tab-color': tab.color } as CSSProperties}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <Dot aria-hidden="true" />
                  <Name>{tab.name}</Name>
                  <Count>{count}</Count>
                </TabLink>
                <Tools className="tools">
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
                </Tools>
              </Row>
            </li>
          )
        })}
      </List>

      {isAdding ? (
        <AddForm onSubmit={submit}>
          <Input
            autoFocus
            value={name}
            placeholder="Tab name"
            aria-label="New tab name"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setIsAdding(false)
            }}
          />
          <Button type="submit" $variant="primary" $size="sm">
            Add
          </Button>
          <Button type="button" $variant="ghost" $size="sm" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </AddForm>
      ) : (
        <NewTabButton type="button" onClick={() => setIsAdding(true)}>
          + New tab
        </NewTabButton>
      )}
    </div>
  )
}