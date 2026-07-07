import React, { useState } from 'react'
import styled, { keyframes, createGlobalStyle } from 'styled-components'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API from '../api/axios'

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
  background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80') center/cover;
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

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const f = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
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
    if (!form.password) {
      newErrors.password = 'New password is required.'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please verify your new password.'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!token) {
      setError('Invalid reset request. Missing token.')
      return
    }
    if (!validate()) return
    setLoading(true); setError(''); setSuccess('')

    try {
      const { data } = await API.post('/auth/reset-password', {
        token,
        password: form.password
      })
      setSuccess(data.message || 'Password updated successfully! Redirecting to Sign In...')
      setForm({ password: '', confirmPassword: '' })
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (e) {
      setError(e.response?.data?.message || 'Verification failed. The secure link might have expired.')
    } finally {
      setLoading(false)
    }
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
              <EyebrowText>Secure Gateway</EyebrowText>
            </LeftEyebrow>
            <LeftTitle>
              Re-Establish<br /><em>Your Private</em><br />Credentials
            </LeftTitle>
            <LeftSub>
              PropFlow secure protocol ensures your password remains fully private and encrypted at all times.
            </LeftSub>
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

          <FormWrap>
            <FormEyebrow>Credential Security</FormEyebrow>
            <FormTitle>Reset Password</FormTitle>
            <FormSub>Enter and verify your new account password below.</FormSub>

            {error && <ErrMsg>{error}</ErrMsg>}
            {success && <SuccessMsg>{success}</SuccessMsg>}

            {!token ? (
              <ErrMsg>Invalid reset password token. Please request a new email link.</ErrMsg>
            ) : (
              <>
                <Group>
                  <Label>New Password</Label>
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

                <Group>
                  <Label>Confirm Password</Label>
                  <InputWrapper>
                    <Input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="Verify your new password" 
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

                <SubmitBtn onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                      <Spinner />
                      <span>Saving</span>
                    </div>
                  ) : (
                    'Save New Password'
                  )}
                </SubmitBtn>
              </>
            )}

            <SwitchText>
              <SwitchLink onClick={() => navigate('/login')}>
                Back to Sign In
              </SwitchLink>
            </SwitchText>
          </FormWrap>
        </Right>
      </Page>
    </>
  )
}
