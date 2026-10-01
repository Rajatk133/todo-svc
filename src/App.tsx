import { ThemeProvider } from 'styled-components'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import TabPage from './pages/TabPage'
import ImagesPage from './pages/ImagesPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import { GlobalStyle } from './styles/GlobalStyle'
import { theme } from './styles/theme'
import { useAppSelector } from './app/hooks'

export default function App() {
  const tabs = useAppSelector((state) => state.tabs.items)
  const firstTabId = tabs[0]?.id

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            {/* /todos has no tab of its own, so send it to the first one. */}
            <Route
              path="/todos"
              element={
                firstTabId ? (
                  <Navigate to={`/tab/${firstTabId}`} replace />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/tab/:tabId" element={<TabPage />} />
            <Route path="/images" element={<ImagesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}