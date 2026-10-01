import 'styled-components'
import type { AppTheme } from './theme'

/**
 * Teaches styled-components about our theme so `${({ theme }) => theme.color.accent}`
 * is fully typed everywhere, including in nested interpolations.
 */
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}