import { NavLink, Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { useAppSelector } from '../app/hooks'
import { selectActiveTab } from '../features/todos/selectors'
import TabNav from './TabNav'

const Shell = styled.div`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.layout.sidebar} 1fr;
  min-height: 100vh;

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    grid-template-columns: 1fr;
  }
`

const Sidebar = styled.aside`
  background: ${({ theme }) => theme.color.surface};
  border-right: 1px solid ${({ theme }) => theme.color.border};
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
  }
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 6px;
`

const BrandMark = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: ${({ theme }) => theme.color.accent};
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  flex-shrink: 0;
`

const BrandText = styled.div`
  p { margin: 0; }

  .name {
    font-weight: 650;
    font-size: 15px;
    line-height: 1.2;
  }

  .tag {
    font-size: 11px;
    color: ${({ theme }) => theme.color.muted};
  }
`

const SidebarNav = styled.nav`
  display: grid;
  gap: 2px;

  a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: ${({ theme }) => theme.radius.sm};
    color: ${({ theme }) => theme.color.text2};
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
  }

  a:hover {
    background: ${({ theme }) => theme.color.surface2};
    color: ${({ theme }) => theme.color.text};
    text-decoration: none;
  }

  a.active {
    background: ${({ theme }) => theme.color.accentSoft};
    color: ${({ theme }) => theme.color.accent};
  }
`

const Main = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const Topbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    padding-left: 18px;
    padding-right: 18px;
  }
`

const Crumb = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
`

const CrumbDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
`

const TopbarHint = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.color.muted};
`

const Content = styled.main`
  padding: 28px;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    padding-left: 18px;
    padding-right: 18px;
  }
`

export default function Layout() {
  const activeTab = useAppSelector(selectActiveTab)

  return (
    <Shell>
      <Sidebar>
        <Brand>
          <BrandMark aria-hidden="true">✓</BrandMark>
          <BrandText>
            <p className="name">Todo App</p>
            <p className="tag">React · Redux · TS</p>
          </BrandText>
        </Brand>

        <SidebarNav aria-label="Main">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            <span aria-hidden="true">◧</span> Dashboard
          </NavLink>
          <NavLink to="/images" className={({ isActive }) => (isActive ? 'active' : '')}>
            <span aria-hidden="true">▣</span> Images
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
            <span aria-hidden="true">⚙</span> Settings
          </NavLink>
        </SidebarNav>

        <TabNav />
      </Sidebar>

      <Main>
        <Topbar>
          <Crumb>
            {activeTab ? (
              <>
                <CrumbDot style={{ background: activeTab.color }} />
                {activeTab.name}
              </>
            ) : (
              'Overview'
            )}
          </Crumb>
          <TopbarHint>Autosaved to this browser</TopbarHint>
        </Topbar>

        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  )
}