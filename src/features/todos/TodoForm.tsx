import { useState, type FormEvent } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { addTodo } from './todosSlice'
import type { Priority } from '../../types'
import { PRIORITIES } from '../../utils/date'

interface Props {
  tabId: string
  tabName: string
}

export default function TodoForm({ tabId, tabName }: Props) {
  const dispatch = useAppDispatch()

  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return

    dispatch(addTodo({ tabId, title, notes, priority, dueDate: dueDate || null }))

    setTitle('')
    setNotes('')
    setDueDate('')
    setPriority('medium')
    setShowDetails(false)
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row">
        <input
          className="todo-form__title"
          value={title}
          placeholder={`Add a todo to "${tabName}"…`}
          aria-label="Todo title"
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit" className="button button--primary" disabled={!title.trim()}>
          Add
        </button>
        <button
          type="button"
          className="button button--ghost"
          aria-expanded={showDetails}
          onClick={() => setShowDetails((value) => !value)}
        >
          {showDetails ? 'Less' : 'More'}
        </button>
      </div>

      {showDetails && (
        <div className="todo-form__details">
          <textarea
            value={notes}
            rows={2}
            placeholder="Notes (optional)"
            aria-label="Notes"
            onChange={(event) => setNotes(event.target.value)}
          />
          <div className="todo-form__meta">
            <fieldset className="segmented">
              <legend className="sr-only">Priority</legend>
              {PRIORITIES.map((value) => (
                <label key={value} className="segmented__option">
                  <input
                    type="radio"
                    name="priority"
                    value={value}
                    checked={priority === value}
                    onChange={() => setPriority(value)}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </fieldset>

            <label className="field">
              <span>Due date</span>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </label>
          </div>
        </div>
      )}
    </form>
  )
}