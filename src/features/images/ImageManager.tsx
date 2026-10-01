import { useRef, useState, type DragEvent } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectImagesForTab, selectTodosForActiveTab } from '../todos/selectors'
import { addImages, buildAssets, clearTabImages, MAX_IMAGE_BYTES } from './imagesSlice'
import { readFileAsDataUrl } from './readFile'
import ImageThumbnails from './ImageThumbnails'
import { formatBytes } from '../../utils/date'
import { AlertList, Button, Field, LinkButton, Select } from '../../styles/primitives'

const Panel = styled.section`
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const Head = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 15px;
  }
`

const Hint = styled.p`
  margin: 3px 0 0;
  color: ${({ theme }) => theme.color.muted};
  font-size: 12px;
`

const Dropzone = styled.div<{ $active: boolean }>`
  border: 2px dashed
    ${({ $active, theme }) => ($active ? theme.color.accent : theme.color.borderStrong)};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 32px 20px;
  text-align: center;
  background: ${({ $active, theme }) =>
    $active ? theme.color.accentSoft : theme.color.surface2};
  transition: border-color 0.15s ease, background 0.15s ease;

  p {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.color.text2};
  }
`

const DropIcon = styled.p`
  font-size: 22px;
  color: ${({ theme }) => theme.color.muted};
  margin-bottom: 6px !important;
`

const DropMeta = styled.p`
  color: ${({ theme }) => theme.color.muted} !important;
  font-size: 12px !important;
  margin-top: 8px !important;
`

const InlineField = styled(Field)`
  margin-top: 14px;
  max-width: 380px;
`

export default function ImageManager() {
  const dispatch = useAppDispatch()
  const activeTab = useAppSelector((state) =>
    state.tabs.items.find((tab) => tab.id === state.tabs.activeTabId),
  )
  const images = useAppSelector(selectImagesForTab)
  // Memoized selector — an inline .filter() would return a new array each call.
  const tabTodos = useAppSelector(selectTodosForActiveTab)

  const inputRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [linkToTodoId, setLinkToTodoId] = useState('')

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0 || !activeTab) return

    const rejected: string[] = []
    const accepted: File[] = []

    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith('image/')) {
        rejected.push(`${file.name} is not an image`)
      } else if (file.size > MAX_IMAGE_BYTES) {
        rejected.push(
          `${file.name} is ${formatBytes(file.size)} (max ${formatBytes(MAX_IMAGE_BYTES)})`,
        )
      } else {
        accepted.push(file)
      }
    }

    setErrors(rejected)
    if (accepted.length === 0) return

    setIsReading(true)
    try {
      const dataUrls = await Promise.all(accepted.map(readFileAsDataUrl))
      dispatch(
        addImages(
          buildAssets({
            tabId: activeTab.id,
            todoId: linkToTodoId || null,
            files: accepted,
            dataUrls,
          }),
        ),
      )
    } catch {
      setErrors(['Something went wrong while reading the image file.'])
    } finally {
      setIsReading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    void handleFiles(event.dataTransfer.files)
  }

  if (!activeTab) return null

  return (
    <Panel>
      <Head>
        <div>
          <h3>Images</h3>
          <Hint>
            {images.length} image{images.length === 1 ? '' : 's'} in “{activeTab.name}” ·{' '}
            <strong>in-memory only</strong>, cleared on refresh
          </Hint>
        </div>
        {images.length > 0 && (
          <Button
            type="button"
            $variant="ghost"
            $size="sm"
            onClick={() => {
              if (window.confirm(`Remove all ${images.length} image(s) from this tab?`)) {
                dispatch(clearTabImages(activeTab.id))
              }
            }}
          >
            Clear all
          </Button>
        )}
      </Head>

      <Dropzone
        $active={isDragging}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <DropIcon aria-hidden="true">⬆</DropIcon>
        <p>
          Drag &amp; drop images here, or{' '}
          <LinkButton type="button" onClick={() => inputRef.current?.click()}>
            browse files
          </LinkButton>
        </p>
        <DropMeta>
          PNG, JPG, GIF, WEBP or SVG · up to {formatBytes(MAX_IMAGE_BYTES)} each
        </DropMeta>
        {isReading && <DropMeta>Reading files…</DropMeta>}
      </Dropzone>

      {tabTodos.length > 0 && (
        <InlineField>
          <span>Attach uploads to a todo</span>
          <Select value={linkToTodoId} onChange={(event) => setLinkToTodoId(event.target.value)}>
            <option value="">No todo (tab gallery)</option>
            {tabTodos.map((todo) => (
              <option key={todo.id} value={todo.id}>
                {todo.completed ? '✓ ' : ''}
                {todo.title}
              </option>
            ))}
          </Select>
        </InlineField>
      )}

      {errors.length > 0 && (
        <AlertList role="alert">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </AlertList>
      )}

      <ImageThumbnails images={images} />
    </Panel>
  )
}