import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'

const BlurContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
`

const BlurredContent = styled.div`
  filter: blur(12px) brightness(0.4);
  pointer-events: none;
  user-select: none;
  width: 100%;
  min-height: 100vh;
`

const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(10, 10, 11, 0.65);
  backdrop-filter: blur(4px);
`

const PopupBox = styled.div`
  background: #16161a;
  border: 1px solid rgba(212, 175, 55, 0.25);
  width: 100%;
  max-width: 460px;
  padding: 3.5rem 2.5rem;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0,0,0,0.85);
  animation: popupScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;

  @keyframes popupScale {
    from { opacity: 0; transform: scale(0.96) translateY(12px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`

const PopupLogo = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 0.3rem;
  letter-spacing: 0.06em;
  span {
    color: #d4af37;
    text-shadow: 0 0 10px rgba(212,175,55,0.3);
  }
`

const PopupLogoSub = styled.div`
  font-size: 0.58rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #7a7a8a;
  margin-bottom: 2.5rem;
  font-family: 'Inter', sans-serif;
  opacity: 0.8;
`

const PopupEyebrow = styled.div`
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #d4af37;
  margin-bottom: 0.75rem;
`

const PopupTitle = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 300;
  color: #ffffff;
  margin: 0 0 1rem;
  line-height: 1.25;
`

const PopupDesc = styled.p`
  font-size: 0.85rem;
  color: #a0a0b0;
  line-height: 1.6;
  margin: 0 0 2.5rem;
  font-weight: 300;
`

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const PrimaryBtn = styled.button`
  width: 100%;
  padding: 0.95rem;
  background: #d4af37;
  border: none;
  color: #0a0a0b;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: #f0d060;
    box-shadow: 0 8px 25px rgba(212,175,55,0.25);
    transform: translateY(-1px);
  }
`

const SecondaryBtn = styled.button`
  width: 100%;
  padding: 0.95rem;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: #d4af37;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #d4af37;
    background: rgba(212,175,55,0.04);
  }
`

function ProtectedRoute() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) {
    return (
      <BlurContainer>
        <BlurredContent>
          <Outlet />
        </BlurredContent>
        <PopupOverlay>
          <PopupBox>
            <PopupLogo>Prop<span>Flow</span></PopupLogo>
            <PopupLogoSub>Private Residences</PopupLogoSub>
            
            <PopupEyebrow>Access Restricted</PopupEyebrow>
            <PopupTitle>Elite Membership Required</PopupTitle>
            <PopupDesc>
              To browse our private collection, list properties, and directly contact owners, you need a registered account.
            </PopupDesc>
            
            <ButtonRow>
              <PrimaryBtn onClick={() => navigate('/login', { state: { mode: 'login', from: location.pathname } })}>
                Sign In to Account
              </PrimaryBtn>
              <SecondaryBtn onClick={() => navigate('/login', { state: { mode: 'register', from: location.pathname } })}>
                Create Membership
              </SecondaryBtn>
            </ButtonRow>
          </PopupBox>
        </PopupOverlay>
      </BlurContainer>
    )
  }

  return <Outlet />
}

export default ProtectedRoute