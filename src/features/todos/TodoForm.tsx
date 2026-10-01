import { useState, type FormEvent } from 'react'
import styled from 'styled-components'
import { useAppDispatch } from '../../app/hooks'
import { addTodo } from './todosSlice'
import type { Priority } from '../../types'
import { PRIORITIES } from '../../utils/date'
import { Button, Input, Textarea } from '../../styles/primitives'

const Form = styled.form`
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
`

const Row = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.bp.sm}) {
    flex-wrap: wrap;
  }
`

const TitleInput = styled(Input)`
  flex: 1;
  padding: 10px 13px;

  @media (max-width: ${({ theme }) => theme.bp.sm}) {
    min-width: 100%;
  }
`

const Details = styled.div`
  display: grid;
  gap: 10px;
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: flex-end;
`

const Segmented = styled.fieldset`
  display: flex;
  gap: 3px;
  background: ${({ theme }) => theme.color.surface2};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 9px;
  padding: 3px;
  margin: 0;
`

const SegmentOption = styled.label`
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    display: block;
    padding: 5px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    text-transform: capitalize;
    color: ${({ theme }) => theme.color.text2};
  }

  /* Neighbour spans dim when any radio in the group is checked. */
  &:has(input:checked) span {
    background: ${({ theme }) => theme.color.surface};
    color: ${({ theme }) => theme.color.accent};
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }

  &:has(input:focus-visible) span {
    outline: 2px solid ${({ theme }) => theme.color.accent};
    outline-offset: 1px;
  }
`

const HiddenLegend = styled.legend`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
`

const DateField = styled.label`
  display: grid;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.text2};

  input {
    background: ${({ theme }) => theme.color.surface};
    border: 1px solid ${({ theme }) => theme.color.borderStrong};
    border-radius: ${({ theme }) => theme.radius.sm};
    padding: 8px 11px;
    color: ${({ theme }) => theme.color.text};
  }
`

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
    <Form onSubmit={handleSubmit}>
      <Row>
        <TitleInput
          value={title}
          placeholder={`Add a todo to "${tabName}"…`}
          aria-label="Todo title"
          onChange={(event) => setTitle(event.target.value)}
        />
        <Button type="submit" $variant="primary" disabled={!title.trim()}>
          Add
        </Button>
        <Button
          type="button"
          $variant="ghost"
          aria-expanded={showDetails}
          onClick={() => setShowDetails((value) => !value)}
        >
          {showDetails ? 'Less' : 'More'}
        </Button>
      </Row>

      {showDetails && (
        <Details>
          <Textarea
            value={notes}
            rows={2}
            placeholder="Notes (optional)"
            aria-label="Notes"
            onChange={(event) => setNotes(event.target.value)}
          />
          <Meta>
            <Segmented>
              <HiddenLegend>Priority</HiddenLegend>
              {PRIORITIES.map((value) => (
                <SegmentOption key={value}>
                  <input
                    type="radio"
                    name="priority"
                    value={value}
                    checked={priority === value}
                    onChange={() => setPriority(value)}
                  />
                  <span>{value}</span>
                </SegmentOption>
              ))}
            </Segmented>

            <DateField>
              Due date
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </DateField>
          </Meta>
        </Details>
      )}
    </Form>
  )
}