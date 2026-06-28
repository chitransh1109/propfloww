import styled from 'styled-components'
import Sidebar from './Sidebar'

const Wrapper = styled.div`
  display:flex; min-height:100vh; background:#111114;
`
const SidebarArea = styled.div`
  width:240px; flex-shrink:0; position:fixed; top:0; left:0; height:100vh; z-index:100;
`
const MainContent = styled.main`
  margin-left:240px; flex:1; padding:3rem 3.5rem;
  background:#111114; min-height:100vh;
`

const Layout = ({ children }) => (
  <Wrapper>
    <SidebarArea><Sidebar /></SidebarArea>
    <MainContent>{children}</MainContent>
  </Wrapper>
)

export default Layout