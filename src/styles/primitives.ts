import styled, { css } from 'styled-components'

/* ---------- Button ---------- */

type ButtonVariant = 'primary' | 'default' | 'ghost' | 'danger'
type ButtonSize = 'md' | 'sm'

const buttonVariants = {
  primary: css`
    background: ${({ theme }) => theme.color.accent};
    border-color: ${({ theme }) => theme.color.accent};
    color: #fff;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.color.accentDark};
      border-color: ${({ theme }) => theme.color.accentDark};
    }
  `,
  default: css`
    background: ${({ theme }) => theme.color.surface};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.color.surface2};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.color.text2};
    border-color: transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.color.surface2};
      color: ${({ theme }) => theme.color.text};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.color.danger};
    border-color: ${({ theme }) => theme.color.danger};
    color: #fff;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.color.dangerDark};
      border-color: ${({ theme }) => theme.color.dangerDark};
    }
  `,
}

export const Button = styled.button<{ $variant?: ButtonVariant; $size?: ButtonSize }>`
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ $size }) => ($size === 'sm' ? '5px 12px' : '8px 16px')};
  font-size: ${({ $size }) => ($size === 'sm' ? '13px' : '14px')};
  font-weight: 500;
  cursor: pointer;
  transition: background 0.14s ease, border-color 0.14s ease;
  ${({ $variant = 'default' }) => buttonVariants[$variant]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const LinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.color.accent};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover { text-decoration: underline; }
`

export const IconButton = styled.button<{ $danger?: boolean }>`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 7px;
  cursor: pointer;
  color: ${({ theme }) => theme.color.muted};
  line-height: 1;
  transition: background 0.14s ease, color 0.14s ease;

  &:hover {
    color: ${({ $danger, theme }) => ($danger ? theme.color.danger : theme.color.text)};
    background: ${({ $danger, theme }) => ($danger ? theme.color.dangerSoft : theme.color.surface2)};
    border-color: ${({ $danger, theme }) => ($danger ? theme.color.danger : theme.color.border)};
  }
`

/* ---------- Surfaces ---------- */

export const Card = styled.section`
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

export const CardHead = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
  }
`

export const Pill = styled.span`
  background: ${({ theme }) => theme.color.surface3};
  color: ${({ theme }) => theme.color.text2};
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
`

export const MutedText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.muted};
  font-size: 14px;
`

/* ---------- Page layout ---------- */

export const Page = styled.div`
  display: grid;
  gap: 20px;
  max-width: ${({ theme }) => theme.layout.contentMax};
`

export const PageHead = styled.header`
  h1 {
    margin: 0;
    font-size: 26px;
  }
`

export const PageSub = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.color.muted};
  font-size: 14px;
`

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
`

/* ---------- Stats ---------- */

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
`

export const StatCard = styled.div<{ $alert?: boolean }>`
  background: ${({ $alert, theme }) => ($alert ? theme.color.dangerSoft : theme.color.surface)};
  border: 1px solid
    ${({ $alert, theme }) => ($alert ? theme.color.dangerBorder : theme.color.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px 18px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

export const StatLabel = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.color.muted};
`

export const StatValue = styled.p<{ $alert?: boolean }>`
  margin: 6px 0 0;
  font-size: 30px;
  font-weight: 650;
  line-height: 1.1;
  color: ${({ $alert, theme }) => ($alert ? theme.color.danger : theme.color.text)};
`

/* ---------- Form controls ---------- */

const controlStyles = css`
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 11px;
  color: ${({ theme }) => theme.color.text};
  width: 100%;
`

export const Input = styled.input`
  ${controlStyles}
`

export const Textarea = styled.textarea`
  ${controlStyles}
  resize: vertical;
  font-family: inherit;
`

export const Select = styled.select`
  ${controlStyles}
  cursor: pointer;
`

export const Field = styled.label`
  display: grid;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.text2};

  > span { font-weight: 600; }
`

/* ---------- Badges ---------- */

type Tone = 'neutral' | 'high' | 'medium' | 'low' | 'alert'

const badgeTones: Record<Tone, ReturnType<typeof css>> = {
  neutral: css`
    background: ${({ theme }) => theme.color.surface3};
    color: ${({ theme }) => theme.color.text2};
  `,
  high: css`
    background: ${({ theme }) => theme.color.highSoft};
    color: ${({ theme }) => theme.color.highText};
  `,
  medium: css`
    background: ${({ theme }) => theme.color.mediumSoft};
    color: ${({ theme }) => theme.color.mediumText};
  `,
  low: css`
    background: ${({ theme }) => theme.color.lowSoft};
    color: ${({ theme }) => theme.color.lowText};
  `,
  alert: css`
    background: ${({ theme }) => theme.color.dangerSoft};
    color: ${({ theme }) => theme.color.danger};
  `,
}

export const Badge = styled.span<{ $tone?: Tone }>`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: ${({ theme }) => theme.radius.pill};
  white-space: nowrap;
  ${({ $tone = 'neutral' }) => badgeTones[$tone]}
`

/* ---------- Misc ---------- */

export const AlertList = styled.ul`
  list-style: none;
  margin: 14px 0 0;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.dangerSoft};
  border: 1px solid ${({ theme }) => theme.color.dangerBorder};
  color: ${({ theme }) => theme.color.highText};
  font-size: 13px;
`

export const BulletList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: ${({ theme }) => theme.color.text2};
  font-size: 14px;
  display: grid;
  gap: 6px;
`

export const KeyValue = styled.dl`
  display: grid;
  gap: 8px;
  margin: 0;

  > div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${({ theme }) => theme.color.border};

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  dt {
    color: ${({ theme }) => theme.color.muted};
    font-size: 14px;
  }

  dd {
    margin: 0;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }
`

export const Empty = styled.div<{ $compact?: boolean }>`
  text-align: center;
  padding: ${({ $compact }) => ($compact ? '24px 12px' : '52px 20px')};
  color: ${({ theme }) => theme.color.muted};

  h3 {
    margin: 0 0 4px;
    color: ${({ theme }) => theme.color.text};
    font-size: 16px;
  }

  p { margin: 0; font-size: 14px; }
`

export const EmptyIcon = styled.p<{ $tone?: 'success' | 'alert' | 'muted' }>`
  font-size: ${({ $tone }) => ($tone === 'muted' ? 30 : 32)}px;
  font-weight: 700;
  margin: 0 0 8px;
  color: ${({ $tone, theme }) =>
    $tone === 'alert' ? theme.color.danger : $tone === 'muted' ? theme.color.muted : theme.color.success};
`