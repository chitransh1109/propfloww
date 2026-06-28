import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'

const C = {
  obsidian: '#0a0a0b', ink: '#111114', surface: '#16161a', card: '#1c1c22',
  border: 'rgba(212,175,55,0.15)', borderSubtle: 'rgba(255,255,255,0.07)',
  gold: '#d4af37', muted: '#7a7a8a', mutedLight: '#a0a0b0', white: '#ffffff',
}

const SidebarWrapper = styled.div`
  background: rgba(10, 10, 11, 0.75); width: 240px; height: 100vh;
  display: flex; flex-direction: column;
  border-right: 1px solid rgba(212, 175, 55, 0.1);
  backdrop-filter: blur(20px);
`
const Logo = styled.div`
  padding:2rem 1.8rem 1.5rem;
  font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:400;
  color:${C.white}; letter-spacing:0.06em;
  border-bottom:1px solid rgba(212, 175, 55, 0.08);
  span { color:${C.gold}; text-shadow: 0 0 10px rgba(212,175,55,0.3); }
`
const LogoSub = styled.div`
  font-size:0.58rem; letter-spacing:0.25em; text-transform:uppercase;
  color:${C.muted}; margin-top:0.3rem; font-family:'Inter',sans-serif;
  opacity: 0.8;
`
const NavList = styled.nav`
  flex:1; padding:2rem 1rem; display:flex; flex-direction:column; gap:6px;
`
const NavSection = styled.div`
  font-size:0.56rem; letter-spacing:0.25em; text-transform:uppercase;
  color:${C.gold}; opacity: 0.6; padding:0.75rem 0.75rem 0.4rem;
  margin-top:0.5rem;
`
const NavItem = styled.div`
  padding:0.8rem 1.1rem; cursor:pointer;
  display:flex; align-items:center; gap:0.75rem;
  font-size:0.8rem; font-weight:400; letter-spacing:0.06em;
  color:${p => p.$active ? C.white : C.muted};
  background:${p => p.$active ? 'linear-gradient(90deg, rgba(212,175,55,0.06) 0%, transparent 100%)' : 'transparent'};
  border-left:2px solid ${p => p.$active ? C.gold : 'transparent'};
  transition:all 0.3s ease;
  &:hover { 
    color:${C.white}; 
    background: rgba(212,175,55,0.02); 
    border-left: 2px solid rgba(212,175,55,0.5);
    text-shadow: 0 0 10px rgba(255,255,255,0.25);
  }
`
const NavIcon = styled.span`
  font-size:0.95rem; opacity:0.8;
`

const BottomArea = styled.div`
  padding:1rem; border-top:1px solid ${C.border};
`
const UserCard = styled.div`
  display:flex; align-items:center; gap:0.75rem;
  padding:0.75rem; background:${C.surface}; margin-bottom:0.75rem;
`
const Avatar = styled.div`
  width:36px; height:36px; border-radius:50%;
  background:${C.gold}; display:flex; align-items:center; justify-content:center;
  font-family:'Cormorant Garamond',serif; font-size:1rem; color:${C.obsidian};
  flex-shrink:0;
`
const UserInfo = styled.div``
const UserName = styled.div`color:${C.white}; font-size:0.82rem; font-weight:500;`
const UserRole = styled.div`color:${C.muted}; font-size:0.68rem; letter-spacing:0.08em;`
const LogoutBtn = styled.button`
  width:100%; padding:0.7rem; background:transparent;
  border:1px solid ${C.borderSubtle}; color:${C.muted};
  font-size:0.72rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase;
  cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif;
  &:hover { border-color:#e05252; color:#e05252; }
`

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { label: 'Browse Residences', path: '/properties', icon: '◇' },
    { label: 'My Dashboard', path: '/dashboard', icon: '◈' },
    { label: 'Settings', path: '/settings', icon: '◉' },
  ]

  return (
    <SidebarWrapper>
      <Logo onClick={() => navigate('/properties')} style={{ cursor: 'pointer' }}>
        Prop<span>Flow</span>
        <LogoSub>Private Residences</LogoSub>
      </Logo>

      <NavList>
        <NavSection>Navigation</NavSection>
        {navLinks.map(link => (
          <NavItem
            key={link.path}
            $active={location.pathname === link.path}
            onClick={() => navigate(link.path)}
          >
            <NavIcon>{link.icon}</NavIcon>
            {link.label}
          </NavItem>
        ))}
      </NavList>

      <BottomArea>
        {user && (
          <UserCard>
            <Avatar>{user.name?.charAt(0).toUpperCase() || 'U'}</Avatar>
            <UserInfo>
              <UserName>{user.name || 'Member'}</UserName>
              <UserRole>{user.role || 'Buyer'} · Elite</UserRole>
            </UserInfo>
          </UserCard>
        )}
        <LogoutBtn onClick={handleLogout}>Sign Out</LogoutBtn>
      </BottomArea>
    </SidebarWrapper>
  )
}

export default Sidebar