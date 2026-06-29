import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

const fadeUp = keyframes`from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}`
const pulseGlow = keyframes`0%{box-shadow:0 0 12px rgba(212,175,55,0.15);}50%{box-shadow:0 0 24px rgba(212,175,55,0.3);}100%{box-shadow:0 0 12px rgba(212,175,55,0.15);}`

const C = {
  obsidian: '#0a0a0b',
  ink: '#111114',
  surface: '#16161a',
  card: '#1c1c22',
  border: 'rgba(212,175,55,0.18)',
  borderSubtle: 'rgba(255,255,255,0.07)',
  gold: '#d4af37',
  goldLight: '#f0d060',
  muted: '#7a7a8a',
  mutedLight: '#a0a0b0',
  white: '#ffffff',
  error: '#e05252',
  errorBg: 'rgba(224,82,82,0.08)',
  success: '#4ade80',
  successBg: 'rgba(74,222,128,0.08)',
}

const Page = styled.div`
  animation: ${fadeUp} 0.5s ease both;
  color: ${C.white};
  position: relative;
`
const Eyebrow = styled.div`
  font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: ${C.gold}; margin-bottom: 0.5rem;
`
const PageTitle = styled.h1`
  font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 300;
  color: ${C.white}; margin: 0 0 0.25rem; line-height: 1.1;
`
const PageSub = styled.p`
  color: ${C.muted}; font-size: 0.85rem; margin: 0 0 2.5rem;
`

const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem; margin-bottom: 3rem;
`
const StatCard = styled.div`
  background: ${C.card}; border: 1px solid ${C.border};
  padding: 1.8rem; position: relative; overflow: hidden;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  animation: ${pulseGlow} 4s infinite ease-in-out;
  transition: all 0.3s;
  &:hover { border-color: ${C.gold}; transform: translateY(-2px); }
`
const StatLabel = styled.div`
  font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
  color: ${C.muted}; margin-bottom: 0.5rem;
`
const StatValue = styled.div`
  font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 300;
  color: ${C.white};
  span { color: ${C.gold}; }
`
const StatDecorator = styled.div`
  position: absolute; bottom: -10px; right: -10px; font-size: 5rem;
  color: rgba(212,175,55,0.03); font-weight: 900; pointer-events: none;
`

const TabRow = styled.div`
  display: flex; gap: 1rem; border-bottom: 1px solid ${C.borderSubtle};
  margin-bottom: 2rem; padding-bottom: 0.5rem;
`
const Tab = styled.button`
  background: transparent; border: none; cursor: pointer;
  color: ${p => p.active ? C.gold : C.muted};
  font-size: 0.75rem; font-weight: 500; letter-spacing: 0.15em;
  text-transform: uppercase; padding: 0.75rem 1.5rem;
  transition: all 0.3s; position: relative;
  &::after {
    content: ''; position: absolute; bottom: -0.6rem; left: 0; right: 0; height: 2px;
    background: ${C.gold}; transform: scaleX(${p => p.active ? 1 : 0});
    transition: transform 0.3s ease;
  }
  &:hover { color: ${C.gold}; }
`

const MainCard = styled.div`
  background: ${C.card}; border: 1px solid ${C.border};
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  padding: 2.5rem;
`

const ErrorMsg = styled.div`
  color: ${C.error}; background: ${C.errorBg}; border: 1px solid rgba(224,82,82,0.2);
  padding: 1rem 1.25rem; font-size: 0.85rem; margin-bottom: 1.5rem;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
`
const SuccessMsg = styled.div`
  color: ${C.success}; background: ${C.successBg}; border: 1px solid rgba(74,222,128,0.2);
  padding: 1rem 1.25rem; font-size: 0.85rem; margin-bottom: 1.5rem;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
`

const Table = styled.table`
  width: 100%; border-collapse: collapse; text-align: left;
`
const Th = styled.th`
  padding: 1rem; font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase;
  color: ${C.gold}; border-bottom: 1px solid ${C.border};
`
const Td = styled.td`
  padding: 1.25rem 1rem; font-size: 0.85rem; border-bottom: 1px solid ${C.borderSubtle};
  color: ${C.white}; vertical-align: middle;
`
const Tr = styled.tr`
  transition: background 0.2s;
  &:hover { background: rgba(255,255,255,0.01); }
`

const Select = styled.select`
  background: ${C.surface}; border: 1px solid ${C.borderSubtle};
  color: ${C.white}; font-size: 0.78rem; padding: 0.4rem 0.8rem;
  outline: none; cursor: pointer; transition: all 0.2s;
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
  &:focus { border-color: ${C.gold}; }
`

const ActionBtn = styled.button`
  background: transparent; border: 1px solid ${p => p.danger ? 'rgba(224,82,82,0.4)' : C.border};
  color: ${p => p.danger ? C.error : C.gold};
  font-size: 0.68rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.4rem 0.8rem; cursor: pointer; transition: all 0.2s;
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
  &:hover {
    border-color: ${p => p.danger ? C.error : C.gold};
    background: ${p => p.danger ? C.errorBg : 'rgba(212,175,55,0.06)'};
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const Avatar = styled.img`
  width: 32px; height: 32px; border-radius: 50%;
  object-fit: cover; border: 1px solid ${C.border};
`
const DefaultAvatar = styled.div`
  width: 32px; height: 32px; border-radius: 50%;
  background: ${C.gold}; color: ${C.obsidian};
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 600;
`

const ReAuthWrapper = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 60vh; animation: ${fadeUp} 0.5s ease both;
`
const ReAuthCard = styled.div`
  background: ${C.card}; border: 1px solid ${C.border};
  width: 100%; max-width: 400px; padding: 3rem 2.5rem;
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
`
const ReAuthTitle = styled.h3`
  font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 300;
  color: ${C.white}; margin-bottom: 0.5rem; text-align: center;
`
const ReAuthSub = styled.p`
  color: ${C.muted}; font-size: 0.82rem; margin-bottom: 2rem; text-align: center; line-height: 1.5;
`
const ReAuthInput = styled.input`
  width: 100%; padding: 0.85rem 1rem; margin-bottom: 1.25rem;
  background: rgba(255, 255, 255, 0.02); border: 1px solid ${p => p.$hasError ? C.error : 'rgba(255, 255, 255, 0.06)'};
  color: ${C.white}; font-size: 0.9rem; outline: none; box-sizing: border-box;
  font-family: 'Inter', sans-serif; border-radius: 4px;
  &:focus { border-color: ${C.gold}; background: rgba(212,175,55,0.03); }
`
const SubmitBtn = styled.button`
  width: 100%; padding: 1rem;
  background: ${C.gold}; border: none;
  color: ${C.obsidian}; font-size: 0.8rem; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase;
  cursor: pointer; transition: all 0.3s;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  &:hover { background: ${C.goldLight}; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,175,55,0.3); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('stats')

  const [adminSession, setAdminSession] = useState(null)
  const [adminToken, setAdminToken] = useState('')

  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const getHeaders = () => {
    return { headers: { Authorization: `Bearer ${adminToken}` } }
  }

  const handleAdminLogin = async () => {
    if (!adminEmail || !adminPassword) {
      setLoginError('Please enter both email and password.')
      return
    }
    setLoggingIn(true)
    setLoginError('')

    try {
      const { data } = await API.post('/auth/login', {
        email: adminEmail,
        password: adminPassword
      })

      if (data.role !== 'admin') {
        setLoginError('Access denied. Administrator privileges required.')
        setLoggingIn(false)
        return
      }

      setAdminToken(data.token)
      setAdminSession(data)
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoggingIn(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats', getHeaders())
      setStats(data)
    } catch (err) {
      setError('Failed to fetch platform statistics.')
    }
  }

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users', getHeaders())
      setUsers(data)
    } catch (err) {
      setError('Failed to load user accounts.')
    }
  }

  const fetchProperties = async () => {
    try {
      const { data } = await API.get('/admin/properties', getHeaders())
      setProperties(data)
    } catch (err) {
      setError('Failed to load property listings.')
    }
  }

  useEffect(() => {
    if (adminSession) {
      if (activeTab === 'stats') fetchStats()
      if (activeTab === 'users') fetchUsers()
      if (activeTab === 'properties') fetchProperties()
    }
  }, [activeTab, adminSession])

  const handleRoleChange = async (userId, role) => {
    setError(''); setSuccess('')
    try {
      await API.put(`/admin/users/${userId}/role`, { role }, getHeaders())
      setSuccess('User role updated successfully.')
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update user role.')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this user? All their property listings will be permanently deleted.')) return
    setError(''); setSuccess('')
    try {
      await API.delete(`/admin/users/${userId}`, getHeaders())
      setSuccess('User and their listings deleted successfully.')
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete user.')
    }
  }

  const handleDeleteProperty = async (propId) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return
    setError(''); setSuccess('')
    try {
      await API.delete(`/admin/properties/${propId}`, getHeaders())
      setSuccess('Property listing removed successfully.')
      fetchProperties()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete property listing.')
    }
  }

  const resolveImg = (url) => {
    if (!url) return null
    let path = url
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const parsed = new URL(url)
        path = parsed.pathname
      }
    } catch (e) {}
    const apiHost = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '')
    return `${apiHost}${path.startsWith('/') ? '' : '/'}${path}`
  }

  const fmtPrice = (p) => {
    if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Cr`
    if (p >= 100000) return `₹${(p/100000).toFixed(1)} L`
    return `₹${p.toLocaleString()}`
  }

  const isAdmin = adminSession && adminSession.role === 'admin'

  if (!isAdmin) {
    return (
      <ReAuthWrapper style={{ minHeight: '80vh' }}>
        <ReAuthCard>
          <ReAuthTitle style={{ fontSize: '2rem' }}>Admin Portal</ReAuthTitle>
          <ReAuthSub>Please authenticate with your administrator credentials.</ReAuthSub>
          {loginError && <ErrorMsg>{loginError}</ErrorMsg>}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.5rem' }}>Email Address</label>
            <ReAuthInput 
              type="email" 
              placeholder="admin@propflow.com" 
              value={adminEmail} 
              $hasError={!!loginError}
              onChange={e => setAdminEmail(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.5rem' }}>Password</label>
            <ReAuthInput 
              type="password" 
              placeholder="••••••••" 
              value={adminPassword} 
              $hasError={!!loginError}
              onChange={e => setAdminPassword(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
            />
          </div>
          <SubmitBtn onClick={handleAdminLogin} disabled={loggingIn}>
            {loggingIn ? 'Authenticating…' : 'Access Admin Panel'}
          </SubmitBtn>
        </ReAuthCard>
      </ReAuthWrapper>
    )
  }

  return (
    <Page>
      <Eyebrow>Platform Control</Eyebrow>
      <PageTitle>Platform Administration</PageTitle>
      <PageSub>Monitor statistics, moderate users, and manage listings</PageSub>

      {error && <ErrorMsg>{error}</ErrorMsg>}
      {success && <SuccessMsg>{success}</SuccessMsg>}

      <StatsGrid>
        <StatCard>
          <StatLabel>Registered Users</StatLabel>
          <StatValue>{stats ? stats.totalUsers : '...'}</StatValue>
          <StatDecorator>👥</StatDecorator>
        </StatCard>
        <StatCard>
          <StatLabel>Active Listings</StatLabel>
          <StatValue>{stats ? stats.totalProperties : '...'}</StatValue>
          <StatDecorator>🏡</StatDecorator>
        </StatCard>
        <StatCard>
          <StatLabel>Total Value listed</StatLabel>
          <StatValue>{stats ? fmtPrice(stats.totalValue) : '...'}</StatValue>
          <StatDecorator>💎</StatDecorator>
        </StatCard>
        <StatCard>
          <StatLabel>Cities Covered</StatLabel>
          <StatValue>{stats ? stats.totalCities : '...'}</StatValue>
          <StatDecorator>📍</StatDecorator>
        </StatCard>
      </StatsGrid>

      <TabRow>
        <Tab active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>Overview</Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>User Management</Tab>
        <Tab active={activeTab === 'properties'} onClick={() => setActiveTab('properties')}>Listing Moderation</Tab>
      </TabRow>

      <MainCard>
        {activeTab === 'stats' && (
          <div style={{ lineHeight: '1.8', color: C.mutedLight }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: C.white, fontWeight: 300, marginBottom: '1.5rem' }}>
              System Health & Diagnostics
            </h3>
            <p>Welcome to the PropFlow White-Glove Administration interface. From here you can oversee platform operations, audit broker listings, and manage user credential access roles.</p>
            <p style={{ marginTop: '1rem' }}>All updates to user roles and listings take effect immediately across all client routing databases. Please handle moderation actions with caution.</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: '60px' }}>Avatar</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Current Role</Th>
                  <Th>Change Role</Th>
                  <Th style={{ textAlign: 'right' }}>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <Tr key={u._id}>
                    <Td>
                      {u.profileImage ? (
                        <Avatar src={resolveImg(u.profileImage)} alt={u.name} />
                      ) : (
                        <DefaultAvatar>{u.name?.charAt(0).toUpperCase()}</DefaultAvatar>
                      )}
                    </Td>
                    <Td style={{ fontWeight: 500 }}>{u.name}</Td>
                    <Td style={{ color: C.mutedLight }}>{u.email}</Td>
                    <Td>
                      <span style={{ 
                        color: u.role === 'admin' ? '#ff9f43' : u.role === 'owner' ? C.gold : '#48dbfb',
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                      }}>
                        {u.role}
                      </span>
                    </Td>
                    <Td>
                      {u._id !== adminSession._id ? (
                        <Select 
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        >
                          <option value="buyer">buyer</option>
                          <option value="owner">owner</option>
                          <option value="admin">admin</option>
                        </Select>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: C.muted }}>Super Admin</span>
                      )}
                    </Td>
                    <Td style={{ textAlign: 'right' }}>
                      {u._id !== adminSession._id && (
                        <ActionBtn 
                          danger 
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          Delete Account
                        </ActionBtn>
                      )}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {activeTab === 'properties' && (
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <Th>Property Title</Th>
                  <Th>Owner</Th>
                  <Th>Location</Th>
                  <Th>Price</Th>
                  <Th>Status</Th>
                  <Th style={{ textAlign: 'right' }}>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <Tr key={p._id}>
                    <Td style={{ fontWeight: 500 }}>{p.title}</Td>
                    <Td>
                      <div style={{ fontSize: '0.82rem', color: C.white }}>{p.owner?.name || 'Verified Owner'}</div>
                      <div style={{ fontSize: '0.72rem', color: C.muted }}>{p.owner?.email || 'no-email@propflow.com'}</div>
                    </Td>
                    <Td style={{ color: C.mutedLight }}>{p.city}</Td>
                    <Td style={{ fontWeight: 500, color: C.gold }}>{fmtPrice(p.price)}</Td>
                    <Td style={{ textTransform: 'capitalize', fontSize: '0.78rem' }}>{p.status}</Td>
                    <Td style={{ textAlign: 'right' }}>
                      <ActionBtn 
                        danger 
                        onClick={() => handleDeleteProperty(p._id)}
                      >
                        Remove Listing
                      </ActionBtn>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </MainCard>
    </Page>
  )
}
