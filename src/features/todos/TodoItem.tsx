import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { deleteTodo, toggleTodo, updateTodo } from './todosSlice'
import { selectImagesForTodo } from './selectors'
import type { Priority, Todo } from '../../types'
import { formatDueDate, isOverdue, PRIORITIES, PRIORITY_LABEL } from '../../utils/date'
import ImageThumbnails from '../images/ImageThumbnails'

interface Props {
  todo: Todo
}

export default function TodoItem({ todo }: Props) {
  const dispatch = useAppDispatch()
  const images = useAppSelector(selectImagesForTodo(todo.id))

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [notes, setNotes] = useState(todo.notes)
  const [priority, setPriority] = useState<Priority>(todo.priority)
  const [dueDate, setDueDate] = useState(todo.dueDate ?? '')

  const overdue = isOverdue(todo.dueDate, todo.completed)

  function beginEdit() {
    setTitle(todo.title)
    setNotes(todo.notes)
    setPriority(todo.priority)
    setDueDate(todo.dueDate ?? '')
    setIsEditing(true)
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (title.trim()) {
      dispatch(updateTodo({ id: todo.id, changes: { title, notes, priority, dueDate: dueDate || null } }))
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="todo todo--editing">
        <form className="todo__edit-form" onSubmit={handleSave}>
          <input
            autoFocus
            value={title}
            aria-label="Todo title"
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setIsEditing(false)
            }}
          />
          <textarea
            value={notes}
            rows={2}
            placeholder="Notes"
            aria-label="Notes"
            onChange={(event) => setNotes(event.target.value)}
          />
          <div className="todo__edit-meta">
            <select
              value={priority}
              aria-label="Priority"
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              {PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {PRIORITY_LABEL[value]}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dueDate}
              aria-label="Due date"
              onChange={(event) => setDueDate(event.target.value)}
            />
            <button type="submit" className="button button--primary button--sm">
              Save
            </button>
            <button
              type="button"
              className="button button--ghost button--sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className={`todo priority-border-${todo.priority} ${todo.completed ? 'todo--done' : ''}`}>
      <label className="todo__check">
        <input
          type="checkbox"
          checked={todo.completed}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'pending' : 'complete'}`}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
      </label>

      <div className="todo__body">
        <p className="todo__title">{todo.title}</p>
        {todo.notes && <p className="todo__notes">{todo.notes}</p>}

        <div className="todo__badges">
          <span className={`badge badge--${todo.priority}`}>{PRIORITY_LABEL[todo.priority]}</span>
          <span className={`badge badge--due ${overdue ? 'badge--overdue' : ''}`}>
            {formatDueDate(todo.dueDate)}
          </span>
          {images.length > 0 && (
            <span className="badge">
              {images.length} image{images.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {images.length > 0 && <ImageThumbnails images={images} />}
      </div>

      <div className="todo__actions">
        <button
          type="button"
          className="icon-button"
          title="Edit"
          aria-label={`Edit ${todo.title}`}
          onClick={beginEdit}
        >
          ✎
        </button>
        <button
          type="button"
          className="icon-button icon-button--danger"
          title="Delete"
          aria-label={`Delete ${todo.title}`}
          onClick={() => {
            if (window.confirm(`Delete "${todo.title}"?`)) dispatch(deleteTodo(todo.id))
          }}
        >
          ✕
        </button>
      </div>
    </li>
  )
}