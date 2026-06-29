import React, { useState, useEffect } from 'react'
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
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`
const spinnerAnim = keyframes`
  to { transform: rotate(360deg); }
`
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`

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
  success: '#4ade80',
  successBg: 'rgba(74,222,128,0.08)',
}

const Page = styled.div`
  display: flex; min-height: 100vh;
  background: ${C.obsidian};
  font-family: 'Inter', sans-serif;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`

// ── LEFT PANEL ───────────────────────────────────────────
const Left = styled.div`
  flex: 1; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 4rem;
  @media (max-width: 900px) {
    min-height: 320px;
    padding: 3rem 2rem 4rem 2rem;
  }
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
  animation: ${slideIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  @media (max-width: 900px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid ${C.border};
    padding: 3rem 2rem;
  }
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
const InputWrapper = styled.div`
  position: relative; display: flex; align-items: center;
`
const Input = styled.input`
  width: 100%; padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.02); border: 1px solid ${p => p.$hasError ? C.error : 'rgba(255, 255, 255, 0.06)'};
  color: ${C.white}; font-size: 0.9rem; outline: none;
  box-sizing: border-box; transition: all 0.25s;
  font-family: 'Inter', sans-serif;
  border-radius: 4px;
  &::placeholder { color: ${C.muted}; }
  &:focus { 
    border-color: ${p => p.$hasError ? C.error : C.gold}; 
    background: rgba(212, 175, 55, 0.03); 
  }
`
const EyeToggle = styled.button`
  position: absolute; right: 1rem; background: none; border: none;
  color: ${C.muted}; cursor: pointer; display: flex; align-items: center;
  padding: 0; transition: color 0.2s;
  &:hover { color: ${C.gold}; }
`
const InlineError = styled.div`
  color: ${C.error}; font-size: 0.72rem; margin-top: 0.35rem; font-weight: 500;
`

const CheckboxRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.5rem;
`
const CheckboxLabel = styled.label`
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.75rem; color: ${C.muted}; cursor: pointer;
  user-select: none;
`
const Checkbox = styled.input`
  accent-color: ${C.gold};
`
const ForgotLink = styled.span`
  font-size: 0.75rem; color: ${C.gold}; cursor: pointer;
  &:hover { text-decoration: underline; }
`

const ErrMsg = styled.div`
  color: ${C.error}; background: ${C.errorBg};
  border: 1px solid rgba(224,82,82,0.2);
  padding: 0.75rem 1rem; font-size: 0.82rem;
  margin-bottom: 1.25rem; letter-spacing: 0.02em;
`
const SuccessMsg = styled.div`
  color: ${C.success}; background: ${C.successBg};
  border: 1px solid rgba(74,222,128,0.2);
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
const Spinner = styled.div`
  width: 16px; height: 16px; border: 2px solid rgba(10,10,11,0.2);
  border-top-color: ${C.obsidian}; border-radius: 50%;
  animation: ${spinnerAnim} 0.6s linear infinite;
`
const SwitchText = styled.p`
  text-align: center; color: ${C.muted}; font-size: 0.82rem; margin-top: 1.5rem;
`
const SwitchLink = styled.span`
  color: ${C.gold}; cursor: pointer; font-weight: 500;
  &:hover { text-decoration: underline; }
`

// ── SUCCESS MODAL ──
const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 2rem;
  backdrop-filter: blur(10px);
`
const ModalCard = styled.div`
  background: ${C.surface}; border: 1px solid ${C.border};
  width: 100%; max-width: 440px; padding: 3rem; text-align: center;
  box-shadow: 0 30px 60px rgba(0,0,0,0.8);
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  animation: ${scaleIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
`
const ModalIcon = styled.div`
  width: 60px; height: 60px; border-radius: 50%; background: rgba(74,222,128,0.1);
  color: ${C.success}; display: flex; align-items: center; justify-content: center;
  font-size: 2rem; margin: 0 auto 1.5rem auto;
`

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [mode, setMode] = useState(location.state?.mode || 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'buyer' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  // Load remember me info
  useEffect(() => {
    const savedEmail = localStorage.getItem('propflow_remember_email')
    const savedRemember = localStorage.getItem('propflow_remember_me') === 'true'
    if (savedRemember && savedEmail) {
      setForm(p => ({ ...p, email: savedEmail }))
      setRememberMe(true)
    }
  }, [])

  const f = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    // Clear inline error as user types
    if (errors[k]) {
      setErrors(p => {
        const next = { ...p }
        delete next[k]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.email) {
      newErrors.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    
    if (mode !== 'forgot') {
      if (!form.password) {
        newErrors.password = 'Password is required.'
      } else if (form.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.'
      }
    }

    if (mode === 'register') {
      if (!form.name) {
        newErrors.name = 'Full name is required.'
      }
      if (!form.confirmPassword) {
        newErrors.confirmPassword = 'Confirm password is required.'
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true); setError(''); setSuccess('')

    try {
      if (mode === 'forgot') {
        const { data } = await API.post('/auth/forgot-password', { email: form.email })
        setSuccess(data.message || `A password reset link has been dispatched to ${form.email}. Please verify your inbox.`)
        setForm(p => ({ ...p, email: '' }))
      } else {
        const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
        const payload = form
        const { data } = await API.post(endpoint, payload)
        
        // Handle Remember Me persistence
        if (rememberMe) {
          localStorage.setItem('propflow_remember_email', form.email)
          localStorage.setItem('propflow_remember_me', 'true')
        } else {
          localStorage.removeItem('propflow_remember_email')
          localStorage.removeItem('propflow_remember_me')
        }

        if (mode === 'register') {
          setShowWelcomeModal(true)
          setTimeout(() => {
            login(data)
            const from = location.state?.from || '/properties'
            navigate(from)
          }, 2500)
        } else {
          login(data)
          const from = location.state?.from || '/properties'
          navigate(from)
        }
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong. Please check your credentials.')
    }
    setLoading(false)
  }

  return (
    <>
      <GlobalStyle />
      <Page>
        <Left>
          <LeftBg />
          <LeftLogo onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Prop<span>Flow</span></LeftLogo>
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
            <FormTitle>
              {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Begin Here' : 'Reset Password'}
            </FormTitle>
            <FormSub>
              {mode === 'login' 
                ? 'Sign in to access your private portfolio.' 
                : mode === 'register' 
                  ? 'Create your account. It takes under a minute.' 
                  : 'Enter your email to receive a secure password reset link.'}
            </FormSub>

            {mode !== 'forgot' && (
              <ToggleRow>
                <ToggleBtn $active={mode === 'login'} onClick={() => { setMode('login'); setError(''); setErrors({}); setSuccess('') }}>Sign In</ToggleBtn>
                <ToggleBtn $active={mode === 'register'} onClick={() => { setMode('register'); setError(''); setErrors({}); setSuccess('') }}>Register</ToggleBtn>
              </ToggleRow>
            )}

            {error && <ErrMsg>{error}</ErrMsg>}
            {success && <SuccessMsg>{success}</SuccessMsg>}

            {mode === 'register' && (
              <Group>
                <Label>Full Name</Label>
                <InputWrapper>
                  <Input 
                    type="text"
                    placeholder="e.g. Arjun Mehta" 
                    value={form.name} 
                    $hasError={!!errors.name}
                    onChange={e => f('name', e.target.value)} 
                  />
                </InputWrapper>
                {errors.name && <InlineError>{errors.name}</InlineError>}
              </Group>
            )}

            <Group>
              <Label>Email Address</Label>
              <InputWrapper>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={form.email}
                  $hasError={!!errors.email}
                  onChange={e => f('email', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} 
                />
              </InputWrapper>
              {errors.email && <InlineError>{errors.email}</InlineError>}
            </Group>

            {mode !== 'forgot' && (
              <>
                <Group>
                  <Label>Password</Label>
                  <InputWrapper>
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Minimum 6 characters" 
                      value={form.password}
                      $hasError={!!errors.password}
                      onChange={e => f('password', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()} 
                    />
                    <EyeToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </EyeToggle>
                  </InputWrapper>
                  {errors.password && <InlineError>{errors.password}</InlineError>}
                </Group>

                {mode === 'register' && (
                  <Group>
                    <Label>Confirm Password</Label>
                    <InputWrapper>
                      <Input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        placeholder="Verify your password" 
                        value={form.confirmPassword}
                        $hasError={!!errors.confirmPassword}
                        onChange={e => f('confirmPassword', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()} 
                      />
                      <EyeToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </EyeToggle>
                    </InputWrapper>
                    {errors.confirmPassword && <InlineError>{errors.confirmPassword}</InlineError>}
                  </Group>
                )}

                {mode === 'login' && (
                  <CheckboxRow>
                    <CheckboxLabel>
                      <Checkbox 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={e => setRememberMe(e.target.checked)} 
                      />
                      <span>Remember Me</span>
                    </CheckboxLabel>
                    <ForgotLink onClick={() => { setMode('forgot'); setError(''); setErrors({}); setSuccess('') }}>
                      Forgot Password?
                    </ForgotLink>
                  </CheckboxRow>
                )}
              </>
            )}

            <SubmitBtn onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                  <Spinner />
                  <span>Processing</span>
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'
              )}
            </SubmitBtn>

            {mode === 'forgot' ? (
              <SwitchText>
                <SwitchLink onClick={() => { setMode('login'); setError(''); setErrors({}); setSuccess('') }}>
                  Back to Sign In
                </SwitchLink>
              </SwitchText>
            ) : (
              <SwitchText>
                {mode === 'login' ? "New to PropFlow? " : 'Already a member? '}
                <SwitchLink onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setErrors({}); setSuccess('') }}>
                  {mode === 'login' ? 'Create an account' : 'Sign in'}
                </SwitchLink>
              </SwitchText>
            )}
          </FormWrap>
        </Right>
      </Page>

      {showWelcomeModal && (
        <ModalOverlay>
          <ModalCard>
            <ModalIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </ModalIcon>
            <FormTitle style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>Welcome to PropFlow</FormTitle>
            <FormSub style={{ marginBottom: '0' }}>
              Your secure member credentials have been registered. Setting up your custom dashboard portfolio now...
            </FormSub>
          </ModalCard>
        </ModalOverlay>
      )}
    </>
  )
}

export default Login