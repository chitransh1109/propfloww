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
`
const FormWrap = styled.div`animation: ${fadeIn} 0.4s ease both;`
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
`
const Group = styled.div`margin-bottom: 1.25rem;`
const Label = styled.label`
  display: block; font-size: 0.7rem; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: ${C.muted}; margin-bottom: 0.5rem;
`
const Input = styled.input`
  width: 100%; padding: 0.85rem 0.5rem;
  background: transparent; border: none; border-bottom: 1px solid ${C.borderSubtle};
  color: ${C.white}; font-size: 0.9rem; outline: none;
  box-sizing: border-box; transition: all 0.25s;
  font-family: 'Inter', sans-serif;
  border-radius: 0;
  &::placeholder { color: ${C.muted}; }
  &:focus { border-color: ${C.gold}; }

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


const OtpRow = styled.div`
  display: flex; gap: 0.5rem; justify-content: space-between; margin-bottom: 0.75rem;
`
const OtpBox = styled.input`
  width: 42px; height: 48px; text-align: center;
  background: transparent; border: none; border-bottom: 2px solid ${p => p.$filled ? C.gold : C.borderSubtle};
  color: ${C.white}; font-size: 1.3rem; font-family: 'Cormorant Garamond', serif;
  outline: none; transition: all 0.2s;
  border-radius: 0;
  &:focus { border-color: ${C.gold}; }

  &:-webkit-autofill,
  &:-webkit-autofill:hover, 
  &:-webkit-autofill:focus, 
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${C.surface} inset !important;
    -webkit-text-fill-color: ${C.white} !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`
const OtpMeta = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 0.75rem;
`
const OtpStatus = styled.div`
  font-size: 0.7rem; color: ${p => p.$ok ? '#4ade80' : C.muted}; letter-spacing: 0.08em;
`
const OtpResend = styled.span`
  font-size: 0.7rem; color: ${p => p.$disabled ? C.muted : C.gold};
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  letter-spacing: 0.08em; text-transform: uppercase;
  pointer-events: ${p => p.$disabled ? 'none' : 'auto'};
`
const OtpVerifyBtn = styled.button`
  width: 100%; padding: 0.65rem; background: transparent;
  border: 1px solid ${C.gold}; color: ${C.gold};
  font-size: 0.72rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
  cursor: pointer; transition: all 0.2s; margin-bottom: 0.5rem;
  &:hover { background: rgba(212,175,55,0.08); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`
const SendOtpBtn = styled.button`
  padding: 0.6rem 1rem; background: transparent;
  border: 1px solid ${C.gold}; color: ${C.gold};
  font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  &:hover { background: rgba(212,175,55,0.08); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`
const EmailRow = styled.div`display: flex; gap: 0.5rem; align-items: flex-end;`
const VerifiedBadge = styled.div`
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.7rem; color: #4ade80; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.4rem 0.75rem; border: 1px solid rgba(74,222,128,0.3);
  background: rgba(74,222,128,0.06);
`

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [mode, setMode] = useState(location.state?.mode || 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const startCountdown = () => {
    setCountdown(30)
    const t = setInterval(() => {
      setCountdown(c => { if (c <= 1) { clearInterval(t); return 0 } return c - 1 })
    }, 1000)
  }

  const sendOTP = async () => {
    if (!form.email) { setOtpError('Enter your email first.'); return }
    setOtpLoading(true); setOtpError('')
    try {
      const { data } = await API.post('/auth/send-otp', { email: form.email })
      setOtpSent(true)
      setOtp(['', '', '', '', '', ''])
      setOtpVerified(false)
      startCountdown()
      if (data?.message) {
        setOtpError(data.message)
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to send OTP. Try again.')
    }
    setOtpLoading(false)
  }

  const handleOtpInput = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) document.getElementById('otp-' + (idx + 1))?.focus()
  }

  const handleOtpKey = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) document.getElementById('otp-' + (idx - 1))?.focus()
  }

  const verifyOTP = async () => {
    const code = otp.join('')
    if (code.length !== 6) { setOtpError('Enter all 6 digits.'); return }
    setOtpLoading(true); setOtpError('')
    try {
      await API.post('/auth/verify-otp', { email: form.email, otp: code })
      setOtpVerified(true)
      setOtpError('')
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid or expired OTP.')
    }
    setOtpLoading(false)
  }

  const validate = () => {
    if (!form.email || !form.password) return 'Email and password are required.'
    if (mode === 'register' && !form.name) return 'Name is required.'
    if (mode === 'register' && !otpVerified) return 'Please verify your email address via OTP first.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    return ''
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true); setError('')
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login' ? form : { ...form, otp: otp.join('') }
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

            {mode === 'login' ? (
              <Group>
                <Label>Email Address</Label>
                <Input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => f('email', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </Group>
            ) : (
              <>
                <Group>
                  <Label>Email Address</Label>
                  <EmailRow>
                    <Input type="email" placeholder="you@example.com" value={form.email}
                      onChange={e => { f('email', e.target.value); setOtpSent(false); setOtpVerified(false); setOtp(['','','','','','']) }}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={{ flex: 1 }} />
                    {!otpVerified && (
                      <SendOtpBtn onClick={sendOTP} disabled={otpLoading || countdown > 0}>
                        {otpLoading ? '...' : otpSent ? `Resend${countdown > 0 ? ' ' + countdown + 's' : ''}` : 'Send OTP'}
                      </SendOtpBtn>
                    )}
                  </EmailRow>
                  {otpVerified && (
                    <VerifiedBadge style={{ marginTop: '0.5rem' }}>✓ Email Verified</VerifiedBadge>
                  )}
                </Group>

                {otpSent && !otpVerified && (
                  <Group>
                    <Label>Enter OTP · Sent to your email</Label>
                    <OtpRow>
                      {otp.map((digit, idx) => (
                        <OtpBox
                          key={idx}
                          id={'otp-' + idx}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          $filled={!!digit}
                          onChange={e => handleOtpInput(idx, e.target.value)}
                          onKeyDown={e => handleOtpKey(idx, e)}
                        />
                      ))}
                    </OtpRow>
                    <OtpMeta>
                      <OtpStatus>{otpError || 'OTP valid for 10 minutes'}</OtpStatus>
                      <OtpResend $disabled={countdown > 0} onClick={sendOTP}>
                        {countdown > 0 ? 'Resend in ' + countdown + 's' : 'Resend OTP'}
                      </OtpResend>
                    </OtpMeta>
                    <OtpVerifyBtn onClick={verifyOTP} disabled={otp.join('').length !== 6}>
                      Verify OTP
                    </OtpVerifyBtn>
                  </Group>
                )}
              </>
            )}

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