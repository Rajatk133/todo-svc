import { useRef, useState, type DragEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectImagesForTab, selectTodosForActiveTab } from '../todos/selectors'
import { addImages, buildAssets, clearTabImages, MAX_IMAGE_BYTES } from './imagesSlice'
import { readFileAsDataUrl } from './readFile'
import ImageThumbnails from './ImageThumbnails'
import { formatBytes } from '../../utils/date'

export default function ImageManager() {
  const dispatch = useAppDispatch()
  const activeTab = useAppSelector((state) =>
    state.tabs.items.find((tab) => tab.id === state.tabs.activeTabId),
  )
  const images = useAppSelector(selectImagesForTab)
  // Must be a memoized selector — an inline `.filter()` returns a fresh array
  // reference on every call and forces needless re-renders.
  const tabTodos = useAppSelector(selectTodosForActiveTab)

  const inputRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [linkToTodoId, setLinkToTodoId] = useState<string>('')

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
    <section className="images">
      <header className="images__header">
        <div>
          <h3>Images</h3>
          <p className="images__hint">
            {images.length} image{images.length === 1 ? '' : 's'} in “{activeTab.name}” ·{' '}
            <strong>in-memory only</strong>, cleared on refresh
          </p>
        </div>
        {images.length > 0 && (
          <button
            type="button"
            className="button button--ghost button--sm"
            onClick={() => {
              if (window.confirm(`Remove all ${images.length} image(s) from this tab?`)) {
                dispatch(clearTabImages(activeTab.id))
              }
            }}
          >
            Clear all
          </button>
        )}
      </header>

      <div
        className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
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
        <p className="dropzone__icon" aria-hidden="true">
          ⬆
        </p>
        <p>
          Drag &amp; drop images here, or{' '}
          <button type="button" className="link-button" onClick={() => inputRef.current?.click()}>
            browse files
          </button>
        </p>
        <p className="dropzone__meta">
          PNG, JPG, GIF, WEBP or SVG · up to {formatBytes(MAX_IMAGE_BYTES)} each
        </p>
        {isReading && <p className="dropzone__meta">Reading files…</p>}
      </div>

      {tabTodos.length > 0 && (
        <label className="field field--inline">
          <span>Attach uploads to a todo</span>
          <select value={linkToTodoId} onChange={(event) => setLinkToTodoId(event.target.value)}>
            <option value="">No todo (tab gallery)</option>
            {tabTodos.map((todo) => (
              <option key={todo.id} value={todo.id}>
                {todo.completed ? '✓ ' : ''}
                {todo.title}
              </option>
            ))}
          </select>
        </label>
      )}

      {errors.length > 0 && (
        <ul className="errors" role="alert">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      <ImageThumbnails images={images} />
    </section>
  )
}