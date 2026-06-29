import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axios'



const fadeUp = keyframes`from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}`

const C = {
  obsidian:'#0a0a0b', ink:'#111114', surface:'#16161a', card:'#1c1c22',
  border:'rgba(212,175,55,0.15)', borderSubtle:'rgba(255,255,255,0.07)',
  gold:'#d4af37', goldLight:'#f0d060', muted:'#7a7a8a', mutedLight:'#a0a0b0', white:'#ffffff',
}

const Page = styled.div`
  max-width:580px; animation:${fadeUp} 0.5s ease both;
`
const Eyebrow = styled.div`
  font-size:0.68rem; letter-spacing:0.22em; text-transform:uppercase;
  color:${C.gold}; margin-bottom:0.5rem;
`
const PageTitle = styled.h1`
  font-family:'Cormorant Garamond',serif; font-size:2.5rem; font-weight:300;
  color:${C.white}; margin:0 0 0.25rem; line-height:1.1;
`
const PageSub = styled.p`
  color:${C.muted}; font-size:0.85rem; margin:0 0 2.5rem;
`
const Divider = styled.div`height:1px; background:${C.border}; margin-bottom:2rem;`

const Card = styled.div`
  background:${C.card}; border:1px solid ${C.border}; margin-bottom: 1.5rem; transition:border-color 0.3s;
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  &:hover { border-color:rgba(212,175,55,0.3); }
`
const CardHeader = styled.div`
  padding:1.5rem 2rem; border-bottom:1px solid ${C.borderSubtle};
`
const CardTitle = styled.div`
  font-size:0.7rem; letter-spacing:0.2em; text-transform:uppercase; color:${C.gold};
`
const CardBody = styled.div`padding:2rem;`

const AvatarWrap = styled.div`
  display:flex; align-items:center; gap:1.5rem; margin-bottom:2rem;
`
const Avatar = styled.div`
  width:72px; height:72px;
  background:linear-gradient(135deg, ${C.gold}, #b8940f);
  display:flex; align-items:center; justify-content:center;
  font-family:'Cormorant Garamond',serif; font-size:2rem; color:${C.obsidian};
  flex-shrink:0;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
`
const AvatarInfo = styled.div``
const AvatarName = styled.div`
  font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:400; color:${C.white};
`
const AvatarRole = styled.div`
  font-size:0.7rem; letter-spacing:0.15em; text-transform:uppercase; color:${C.muted}; margin-top:0.2rem;
`

const Row = styled.div`
  display:flex; justify-content:space-between; align-items:center;
  padding:1rem 0; border-bottom:1px solid ${C.borderSubtle};
  &:last-child { border-bottom:none; padding-bottom:0; }
  &:first-child { padding-top:0; }
`
const RowLabel = styled.div`
  font-size:0.68rem; letter-spacing:0.15em; text-transform:uppercase; color:${C.muted};
`
const RowValue = styled.div`
  font-size:0.9rem; color:${C.white}; font-weight:400; text-align:right;
`
const RoleBadge = styled.span`
  padding:0.25rem 0.85rem; font-size:0.65rem; letter-spacing:0.15em; text-transform:uppercase;
  border:1px solid;
  border-color:${p => p.role === 'owner' ? 'rgba(212,175,55,0.5)' : 'rgba(99,162,255,0.5)'};
  color:${p => p.role === 'owner' ? C.gold : '#a0c4ff'};
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
`

const SwitchRoleBtn = styled.button`
  background:transparent; border:1px solid ${C.border}; color:${C.gold};
  font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase;
  padding:0.35rem 0.7rem; cursor:pointer; transition:all 0.2s;
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
  &:hover { border-color:${C.gold}; background:rgba(212,175,55,0.08); }
  &:disabled { opacity:0.5; cursor:not-allowed; }
`

const ErrorMsg = styled.div`
  color:#e05252; background:rgba(224,82,82,0.08); border:1px solid rgba(224,82,82,0.2);
  padding:0.75rem 1rem; font-size:0.82rem; margin-bottom:1rem;
`

const LogoutBtn = styled.button`
  width:100%; padding:1rem; background:transparent;
  border:1px solid rgba(224,82,82,0.3); color:rgba(224,82,82,0.7);
  font-size:0.75rem; font-weight:500; letter-spacing:0.18em; text-transform:uppercase;
  cursor:pointer; transition:all 0.3s; margin-top:2px;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  &:hover { background:rgba(224,82,82,0.08); border-color:#e05252; color:#e05252; }
`

const Settings = () => {
  const { logout, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [switching, setSwitching] = useState(false)
  const [showRoleNotice, setShowRoleNotice] = useState(location.state?.roleNotice || false)

  useEffect(() => {
    axiosInstance.get('/auth/profile')
      .then(({ data }) => setProfile(data))
      .catch((err) => {
        const status = err?.response?.status
        const msg = err?.response?.data?.message || err?.message || 'Unable to load profile.'
        if (status === 401) {
          // Token expired or invalid — clear storage and redirect to login
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
        } else {
          setError(`Unable to load profile: ${msg}`)
        }
      })
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const handleSwitchRole = async () => {
    setSwitching(true)
    setError('')
    try {
      const { data } = await axiosInstance.post('/auth/switch-role')
      login(data) // updates token + role in context and localStorage
      setProfile((prev) => (prev ? { ...prev, role: data.role } : prev))
    } catch (err) {
      console.error('Switch role failed:', err)
      setError(err?.response?.data?.message || 'Could not switch role. Try again.')
    }
    setSwitching(false)
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : '—'

  const displayProfile = profile || {
    name: 'Vikram Oberoi',
    email: 'vikram@oberoi-estates.com',
    role: 'owner',
    createdAt: '2022-11-01',
  }

  return (
    <Page>

      <Eyebrow>Account</Eyebrow>
      <PageTitle>Settings</PageTitle>
      <PageSub>Manage your profile and preferences</PageSub>
      {showRoleNotice && (
        <ErrorMsg style={{ background: 'rgba(212, 175, 55, 0.08)', borderColor: C.gold, color: C.gold }}>
          You're currently browsing as a Buyer. Switch to Owner below to list a property.
        </ErrorMsg>
      )}

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <Card>
        <CardHeader><CardTitle>Profile Overview</CardTitle></CardHeader>
        <CardBody>
          <AvatarWrap>
            <Avatar>{displayProfile.name?.charAt(0).toUpperCase()}</Avatar>
            <AvatarInfo>
              <AvatarName>{displayProfile.name}</AvatarName>
              <AvatarRole>PropFlow {displayProfile.role === 'owner' ? 'Elite Owner' : 'Member'}</AvatarRole>
            </AvatarInfo>
          </AvatarWrap>

          <Row>
            <RowLabel>Full Name</RowLabel>
            <RowValue>{displayProfile.name}</RowValue>
          </Row>
          <Row>
            <RowLabel>Email Address</RowLabel>
            <RowValue>{displayProfile.email}</RowValue>
          </Row>
          <Row>
            <RowLabel>Account Type</RowLabel>
            <RowValue style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <RoleBadge role={displayProfile.role}>{displayProfile.role}</RoleBadge>
              {displayProfile.role !== 'admin' && (
                <SwitchRoleBtn onClick={handleSwitchRole} disabled={switching}>
                  {switching
                    ? 'Switching...'
                    : displayProfile.role === 'owner'
                      ? 'Switch to Buyer'
                      : 'Switch to Owner'}
                </SwitchRoleBtn>
              )}
            </RowValue>
          </Row>
          <Row>
            <RowLabel>Member Since</RowLabel>
            <RowValue>{fmt(displayProfile.createdAt)}</RowValue>
          </Row>
          <Row>
            <RowLabel>Membership</RowLabel>
            <RowValue><RoleBadge role="owner">Elite</RoleBadge></RowValue>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Platform</CardTitle></CardHeader>
        <CardBody>
          <Row>
            <RowLabel>Version</RowLabel>
            <RowValue>PropFlow v2.0</RowValue>
          </Row>
          <Row>
            <RowLabel>Data Privacy</RowLabel>
            <RowValue style={{ fontSize:'0.8rem', color: C.muted }}>End-to-end encrypted</RowValue>
          </Row>
        </CardBody>
      </Card>

      <LogoutBtn onClick={handleLogout}>Sign Out of PropFlow</LogoutBtn>
    </Page>
  )
}

export default Settings