import styled from 'styled-components'
import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { deleteTodo, toggleTodo, updateTodo } from './todosSlice'
import { selectImagesForTodo } from './selectors'
import type { Priority, Todo } from '../../types'
import { formatDueDate, isOverdue, PRIORITIES, PRIORITY_LABEL } from '../../utils/date'
import ImageThumbnails from '../images/ImageThumbnails'
import { Badge, Button, IconButton, Input, Select, Textarea } from '../../styles/primitives'

const Item = styled.li<{ $priority: Priority; $done: boolean; $editing?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: ${({ $done, $editing, theme }) =>
    $editing ? theme.color.surface2 : $done ? theme.color.surface2 : theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-left: 3px solid
    ${({ $priority, $editing, theme }) => {
      if ($editing) return theme.color.accent
      return { high: theme.color.high, medium: theme.color.medium, low: theme.color.low }[
        $priority
      ]
    }};
  border-radius: 10px;
  padding: 13px 14px;
  transition: box-shadow 0.14s ease;

  &:hover { box-shadow: ${({ theme }) => theme.shadow.md}; }
`

const Check = styled.label`
  input {
    width: 18px;
    height: 18px;
    accent-color: ${({ theme }) => theme.color.accent};
    cursor: pointer;
    margin-top: 2px;
    flex-shrink: 0;
  }
`

const Body = styled.div`
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 7px;
`

const Title = styled.p<{ $done: boolean }>`
  margin: 0;
  font-weight: 500;
  overflow-wrap: anywhere;
  text-decoration: ${({ $done }) => ($done ? 'line-through' : 'none')};
  color: ${({ $done, theme }) => ($done ? theme.color.muted : theme.color.text)};
`

const Notes = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.text2};
  font-size: 14px;
  overflow-wrap: anywhere;
`

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const Actions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.14s ease;

  ${Item}:hover &,
  ${Item}:focus-within & {
    opacity: 1;
  }

  @media (hover: none) {
    opacity: 1;
  }
`

const EditForm = styled.form`
  display: grid;
  gap: 8px;
  width: 100%;
`

const EditMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  select, input { width: auto; }
`

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
      dispatch(
        updateTodo({ id: todo.id, changes: { title, notes, priority, dueDate: dueDate || null } }),
      )
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Item $priority={todo.priority} $done={false} $editing>
        <EditForm onSubmit={handleSave}>
          <Input
            autoFocus
            value={title}
            aria-label="Todo title"
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setIsEditing(false)
            }}
          />
          <Textarea
            value={notes}
            rows={2}
            placeholder="Notes"
            aria-label="Notes"
            onChange={(event) => setNotes(event.target.value)}
          />
          <EditMeta>
            <Select
              value={priority}
              aria-label="Priority"
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              {PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {PRIORITY_LABEL[value]}
                </option>
              ))}
            </Select>
            <Input
              type="date"
              value={dueDate}
              aria-label="Due date"
              onChange={(event) => setDueDate(event.target.value)}
            />
            <Button type="submit" $variant="primary" $size="sm">
              Save
            </Button>
            <Button type="button" $variant="ghost" $size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </EditMeta>
        </EditForm>
      </Item>
    )
  }

  return (
    <Item $priority={todo.priority} $done={todo.completed}>
      <Check>
        <input
          type="checkbox"
          checked={todo.completed}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'pending' : 'complete'}`}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
      </Check>

      <Body>
        <Title $done={todo.completed}>{todo.title}</Title>
        {todo.notes && <Notes>{todo.notes}</Notes>}

        <Badges>
          <Badge $tone={todo.priority}>{PRIORITY_LABEL[todo.priority]}</Badge>
          <Badge $tone={overdue ? 'alert' : 'neutral'}>{formatDueDate(todo.dueDate)}</Badge>
          {images.length > 0 && (
            <Badge>
              {images.length} image{images.length === 1 ? '' : 's'}
            </Badge>
          )}
        </Badges>

        {images.length > 0 && <ImageThumbnails images={images} />}
      </Body>

      <Actions>
        <IconButton type="button" title="Edit" aria-label={`Edit ${todo.title}`} onClick={beginEdit}>
          ✎
        </IconButton>
        <IconButton
          type="button"
          $danger
          title="Delete"
          aria-label={`Delete ${todo.title}`}
          onClick={() => {
            if (window.confirm(`Delete "${todo.title}"?`)) dispatch(deleteTodo(todo.id))
          }}
        >
          ✕
        </IconButton>
      </Actions>
    </Item>
  )
}