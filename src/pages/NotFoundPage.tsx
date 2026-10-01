import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Empty, EmptyIcon } from '../styles/primitives'

const BackLink = styled(Link)`
  display: inline-block;
  background: ${({ theme }) => theme.color.accent};
  border: 1px solid ${({ theme }) => theme.color.accent};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.color.accentDark};
    text-decoration: none;
  }
`

const Action = styled.div`
  margin-top: 12px;
`

export default function NotFoundPage() {
  return (
    <Empty>
      <EmptyIcon $tone="muted">404</EmptyIcon>
      <h3>Page not found</h3>
      <p>That route does not exist.</p>
      <Action>
        <BackLink to="/">Back to dashboard</BackLink>
      </Action>
    </Empty>
  )
}