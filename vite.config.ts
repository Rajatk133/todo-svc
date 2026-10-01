import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  // Bundle styled-components instead of externalising it. When externalised in
  // an SSR build, its ESM default export resolves to a namespace object and
  // `styled.button` is undefined.
  ssr: {
    noExternal: ['styled-components'],
  },
})