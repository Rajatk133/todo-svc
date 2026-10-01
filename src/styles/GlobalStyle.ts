import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.color.bg};
    color: ${({ theme }) => theme.color.text};
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3 {
    letter-spacing: -0.015em;
  }

  button, input, select, textarea {
    font: inherit;
    color: inherit;
  }

  a {
    color: ${({ theme }) => theme.color.accent};
    text-decoration: none;

    &:hover { text-decoration: underline; }
  }

  code {
    background: ${({ theme }) => theme.color.surface3};
    border-radius: 4px;
    padding: 1px 5px;
    font-size: 0.9em;
  }

  /* Visible focus for keyboard users only. */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.accent};
    outline-offset: 2px;
  }

  input:focus, select:focus, textarea:focus {
    outline: 2px solid ${({ theme }) => theme.color.accent};
    outline-offset: -1px;
    border-color: ${({ theme }) => theme.color.accent};
  }

  ::selection {
    background: ${({ theme }) => theme.color.accentSoft};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`