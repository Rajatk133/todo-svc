import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setSort } from '../features/ui/uiSlice'
import { clearPersistedState } from '../app/persistence'
import { selectAllImages, selectAllTodos } from '../features/todos/selectors'
import type { SortKey } from '../types'
import {
  BulletList,
  Button,
  Card,
  CardHead,
  Field,
  Grid2,
  KeyValue,
  MutedText,
  Page,
  PageHead,
  PageSub,
  Select,
} from '../styles/primitives'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'created-desc', label: 'Newest first' },
  { value: 'created-asc', label: 'Oldest first' },
  { value: 'due-asc', label: 'Due soonest' },
  { value: 'priority-desc', label: 'Priority' },
]

const DangerCard = styled(Card)`
  border-color: ${({ theme }) => theme.color.dangerBorder};
  background: ${({ theme }) => theme.color.dangerSoft};

  h2 { color: ${({ theme }) => theme.color.highText}; }
`

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const sort = useAppSelector((state) => state.ui.sort)
  const tabCount = useAppSelector((state) => state.tabs.items.length)
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
    <Page>
      <PageHead>
        <h1>Settings</h1>
        <PageSub>Preferences and stored data.</PageSub>
      </PageHead>

      <Grid2>
        <Card>
          <CardHead>
            <h2>Preferences</h2>
          </CardHead>

          <Field>
            <span>Default sort order</span>
            <Select
              value={sort}
              onChange={(event) => dispatch(setSort(event.target.value as SortKey))}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        </Card>

        <Card>
          <CardHead>
            <h2>Stored data</h2>
          </CardHead>
          <KeyValue>
            <div>
              <dt>Tabs</dt>
              <dd>{tabCount}</dd>
            </div>
            <div>
              <dt>Todos</dt>
              <dd>{todos.length}</dd>
            </div>
            <div>
              <dt>Images (this session)</dt>
              <dd>{images.length}</dd>
            </div>
          </KeyValue>
        </Card>
      </Grid2>

      <Card>
        <CardHead>
          <h2>How saving works</h2>
        </CardHead>
        <BulletList>
          <li>
            Tabs, todos and your sort preference are written to <code>localStorage</code> and
            restored when you return.
          </li>
          <li>
            Images are <strong>not</strong> saved. They are kept in memory for the session only,
            because the ~5 MB <code>localStorage</code> quota cannot hold them as base64.
          </li>
          <li>Data stays in your browser. Nothing is sent to a server.</li>
        </BulletList>
      </Card>

      <DangerCard>
        <CardHead>
          <h2>Danger zone</h2>
        </CardHead>
        <MutedText>Permanently remove all tabs and todos saved in this browser.</MutedText>
        <Button type="button" $variant="danger" onClick={handleReset}>
          Reset all data
        </Button>
      </DangerCard>
    </Page>
  )
}