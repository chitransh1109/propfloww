import React, { useState } from 'react'
import styled, { keyframes, createGlobalStyle } from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: #0a0a0b;
    overflow-x: hidden;
  }
`

const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`
const lineGrow = keyframes`from { width: 0; } to { width: 48px; }`

const C = {
  obsidian: '#0a0a0b',
  ink: '#111114',
  surface: '#16161a',
  card: '#1c1c22',
  border: 'rgba(212,175,55,0.18)',
  borderSubtle: 'rgba(255,255,255,0.07)',
  gold: '#d4af37',
  goldLight: '#f0d060',
  cream: '#f5f0e8',
  muted: '#7a7a8a',
  mutedLight: '#a0a0b0',
  white: '#ffffff',
  error: '#e05252',
  errorBg: 'rgba(224,82,82,0.08)',
}

const Page = styled.div`
  display: flex; min-height: 100vh;
  background: ${C.obsidian};
  font-family: 'Inter', sans-serif;
`

// ── LEFT PANEL ───────────────────────────────────────────
const Left = styled.div`
  flex: 1; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 4rem;
`
const LeftBg = styled.div`
  position: absolute; inset: 0;
  background: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80') center/cover;
  &::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(10,10,11,0.96) 0%, rgba(10,10,11,0.5) 50%, rgba(10,10,11,0.2) 100%);
  }
`
const LeftContent = styled.div`position: relative; z-index: 1;`
const LeftLogo = styled.div`
  position: absolute; top: 4rem; left: 4rem; z-index: 1;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem; font-weight: 600; color: ${C.white};
  letter-spacing: 0.04em;
  span { color: ${C.gold}; }
`
const LeftEyebrow = styled.div`
  display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.2rem;
`
const EyebrowLine = styled.div`
  height: 1px; background: ${C.gold};
  animation: ${lineGrow} 1s ease both; width: 48px;
`
const EyebrowText = styled.span`
  font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: ${C.gold};
`
const LeftTitle = styled.h1`
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 300; color: ${C.white}; line-height: 1.15;
  margin-bottom: 1rem;
  em { font-style: italic; color: ${C.gold}; }
`
const LeftSub = styled.p`
  color: ${C.muted}; font-size: 0.88rem; line-height: 1.8; max-width: 380px;
`
const LeftFeatures = styled.div`
  display: flex; gap: 2.5rem; margin-top: 2.5rem;
  padding-top: 2rem; border-top: 1px solid rgba(212,175,55,0.15);
`
const LeftFeature = styled.div``
const FeatureNum = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem; font-weight: 500; color: ${C.white};
  span { color: ${C.gold}; }
`
const FeatureLabel = styled.div`
  font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.muted};
`

// ── RIGHT PANEL ──────────────────────────────────────────
const Right = styled.div`
  width: 480px; flex-shrink: 0;
  background: ${C.surface};
  display: flex; flex-direction: column; justify-content: center;
  padding: 4rem 3.5rem;
  border-left: 1px solid ${C.border};
  position: relative;
  overflow: hidden;
  z-index: 1;
`
const RightBg = styled.div`
  position: absolute; top: 15%; right: -20%; width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
  filter: blur(80px); pointer-events: none; z-index: 0;
`
const RightBg2 = styled.div`
  position: absolute; bottom: 10%; left: -20%; width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(0,240,255,0.03) 0%, transparent 70%);
  filter: blur(80px); pointer-events: none; z-index: 0;
`
const Corner = styled.div`
  position: absolute; width: 12px; height: 12px;
  border-color: ${C.border}; border-style: solid;
  pointer-events: none; z-index: 2;
  &.top-left { top: 1.5rem; left: 1.5rem; border-width: 1px 0 0 1px; }
  &.top-right { top: 1.5rem; right: 1.5rem; border-width: 1px 1px 0 0; }
  &.bottom-left { bottom: 1.5rem; left: 1.5rem; border-width: 0 0 1px 1px; }
  &.bottom-right { bottom: 1.5rem; right: 1.5rem; border-width: 0 1px 1px 0; }
`
const Scanline = styled.div`
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, ${C.gold}, transparent);
  opacity: 0.25; pointer-events: none; z-index: 2;
  animation: scanlineAnimation 6s linear infinite;
  @keyframes scanlineAnimation {
    0% { top: -10%; }
    100% { top: 110%; }
  }
`
const FormWrap = styled.div`
  animation: ${fadeIn} 0.4s ease both;
  position: relative;
  z-index: 10;
  background: rgba(28, 28, 34, 0.45);
  border: 1px solid ${C.borderSubtle};
  padding: 3rem 2.5rem;
  backdrop-filter: blur(16px);
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
`
const FormEyebrow = styled.div`
  font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: ${C.gold}; margin-bottom: 1rem;
`
const FormTitle = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem; font-weight: 300; color: ${C.white};
  margin-bottom: 0.4rem; letter-spacing: -0.01em;
`
const FormSub = styled.p`
  color: ${C.muted}; font-size: 0.85rem; margin-bottom: 2.5rem; line-height: 1.6;
`
const ToggleRow = styled.div`
  display: flex; background: ${C.card}; border: 1px solid ${C.borderSubtle};
  margin-bottom: 2rem; padding: 4px; gap: 4px;
`
const ToggleBtn = styled.button`
  flex: 1; padding: 0.65rem; border: none; cursor: pointer;
  font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.25s;
  background: ${p => p.$active ? C.gold : 'transparent'};
  color: ${p => p.$active ? C.obsidian : C.muted};
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
`
const Group = styled.div`margin-bottom: 1.25rem;`
const Label = styled.label`
  display: block; font-size: 0.7rem; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: ${C.muted}; margin-bottom: 0.5rem;
`
const Input = styled.input`
  width: 100%; padding: 0.85rem 0.5rem;
  background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06);
  color: ${C.white}; font-size: 0.9rem; outline: none;
  box-sizing: border-box; transition: all 0.25s;
  font-family: 'Inter', sans-serif;
  border-radius: 4px;
  &::placeholder { color: ${C.muted}; }
  &:focus { border-color: ${C.gold}; background: rgba(212, 175, 55, 0.03); }
 
  &:-webkit-autofill,
  &:-webkit-autofill:hover, 
  &:-webkit-autofill:focus, 
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${C.surface} inset !important;
    -webkit-text-fill-color: ${C.white} !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`
const RoleRow = styled.div`display: flex; gap: 0.75rem;`
const RoleBtn = styled.button`
  flex: 1; padding: 0.8rem; border: 1px solid;
  font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
  cursor: pointer; transition: all 0.25s;
  background: ${p => p.$active ? 'rgba(212,175,55,0.1)' : 'transparent'};
  color: ${p => p.$active ? C.gold : C.muted};
  border-color: ${p => p.$active ? C.gold : C.borderSubtle};
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  &:hover { border-color: ${C.gold}; color: ${C.gold}; }
`
const ErrMsg = styled.div`
  color: ${C.error}; background: ${C.errorBg};
  border: 1px solid rgba(224,82,82,0.2);
  padding: 0.75rem 1rem; font-size: 0.82rem;
  margin-bottom: 1.25rem; letter-spacing: 0.02em;
`
const SubmitBtn = styled.button`
  width: 100%; padding: 1rem;
  background: ${C.gold}; border: none;
  color: ${C.obsidian}; font-size: 0.8rem; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase;
  cursor: pointer; transition: all 0.3s; margin-top: 0.5rem;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  &:hover { background: ${C.goldLight}; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,175,55,0.3); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`
const SwitchText = styled.p`
  text-align: center; color: ${C.muted}; font-size: 0.82rem; margin-top: 1.5rem;
`
const SwitchLink = styled.span`
  color: ${C.gold}; cursor: pointer; font-weight: 500;
  &:hover { text-decoration: underline; }
`
const Divider = styled.div`
  height: 1px; background: ${C.border}; margin: 2rem 0;
`




function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [mode, setMode] = useState(location.state?.mode || 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validate = () => {
    if (!form.email || !form.password) return 'Email and password are required.'
    if (mode === 'register' && !form.name) return 'Name is required.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    return ''
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true); setError('')
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = form
      const { data } = await API.post(endpoint, payload)
      login(data)
      const from = location.state?.from || '/properties'
      navigate(from)
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong.')
    }
    setLoading(false)
  }

  return (
    <>
      <GlobalStyle />
      <Page>
        <Left>
          <LeftBg />
          <LeftLogo>Prop<span>Flow</span></LeftLogo>
          <LeftContent>
            <LeftEyebrow>
              <EyebrowLine />
              <EyebrowText>Luxury Real Estate</EyebrowText>
            </LeftEyebrow>
            <LeftTitle>
              India's Most<br /><em>Coveted</em> Addresses<br />Await You
            </LeftTitle>
            <LeftSub>
              Join an exclusive community of buyers, owners, and investors who trust PropFlow for India's finest properties.
            </LeftSub>
            <LeftFeatures>
              <LeftFeature>
                <FeatureNum>50K<span>+</span></FeatureNum>
                <FeatureLabel>Verified Listings</FeatureLabel>
              </LeftFeature>
              <LeftFeature>
                <FeatureNum>₹0<span></span></FeatureNum>
                <FeatureLabel>Brokerage</FeatureLabel>
              </LeftFeature>
              <LeftFeature>
                <FeatureNum>14<span>+</span></FeatureNum>
                <FeatureLabel>Prime Cities</FeatureLabel>
              </LeftFeature>
            </LeftFeatures>
          </LeftContent>
        </Left>

        <Right>
          <RightBg />
          <RightBg2 />
          <Scanline />
          <Corner className="top-left" />
          <Corner className="top-right" />
          <Corner className="bottom-left" />
          <Corner className="bottom-right" />
          <FormWrap key={mode}>
            <FormEyebrow>PropFlow Members</FormEyebrow>
            <FormTitle>{mode === 'login' ? 'Welcome Back' : 'Begin Here'}</FormTitle>
            <FormSub>{mode === 'login' ? 'Sign in to access your private portfolio.' : 'Create your account. It takes under a minute.'}</FormSub>

            <ToggleRow>
              <ToggleBtn $active={mode === 'login'} onClick={() => { setMode('login'); setError('') }}>Sign In</ToggleBtn>
              <ToggleBtn $active={mode === 'register'} onClick={() => { setMode('register'); setError('') }}>Register</ToggleBtn>
            </ToggleRow>

            {error && <ErrMsg>{error}</ErrMsg>}

            {mode === 'register' && (
              <Group>
                <Label>Full Name</Label>
                <Input placeholder="Arjun Mehta" value={form.name} onChange={e => f('name', e.target.value)} />
              </Group>
            )}

            <Group>
              <Label>Email Address</Label>
              <Input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => f('email', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </Group>

            <Group>
              <Label>Password</Label>
              <Input type="password" placeholder="Minimum 6 characters" value={form.password}
                onChange={e => f('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </Group>

            {/* Registered as member by default */}

            <SubmitBtn onClick={handleSubmit} disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Enter PropFlow' : 'Create Account'}
            </SubmitBtn>

            <SwitchText>
              {mode === 'login' ? "New to PropFlow? " : 'Already a member? '}
              <SwitchLink onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
                {mode === 'login' ? 'Create an account' : 'Sign in'}
              </SwitchLink>
            </SwitchText>
          </FormWrap>
        </Right>
      </Page>
    </>
  )
}

export default Login