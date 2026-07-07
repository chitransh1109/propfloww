import React from 'react'
import styled, { keyframes, createGlobalStyle } from 'styled-components'
import { useNavigate } from 'react-router-dom'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: #0a0a0b;
    overflow-hidden: hidden;
  }
`

const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`
const slideIn = keyframes`from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); }`

const C = {
  obsidian: '#0a0a0b',
  surface: '#111114',
  card: '#1c1c22',
  border: 'rgba(212,175,55,0.18)',
  borderSubtle: 'rgba(255,255,255,0.06)',
  gold: '#d4af37',
  goldLight: '#f0d060',
  muted: '#7a7a8a',
  white: '#ffffff',
}

const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${C.obsidian};
  font-family: 'Inter', sans-serif;
  padding: 1.5rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
`

const GlowBg = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
`

const Corner = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: ${C.border};
  border-style: solid;
  pointer-events: none;
  z-index: 2;
  &.top-left { top: 1.5rem; left: 1.5rem; border-width: 1px 0 0 1px; }
  &.top-right { top: 1.5rem; right: 1.5rem; border-width: 1px 1px 0 0; }
  &.bottom-left { bottom: 1.5rem; left: 1.5rem; border-width: 0 0 1px 1px; }
  &.bottom-right { bottom: 1.5rem; right: 1.5rem; border-width: 0 1px 1px 0; }
`

const Card = styled.div`
  animation: ${slideIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  background: rgba(28, 28, 34, 0.45);
  border: 1px solid ${C.borderSubtle};
  padding: 4.5rem 3rem;
  backdrop-filter: blur(20px);
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  max-width: 480px;
  width: 100%;
  text-align: center;
  z-index: 10;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
`

const Logo = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 500;
  color: ${C.white};
  margin-bottom: 2rem;
  letter-spacing: 0.04em;
  span { color: ${C.gold}; }
`

const ErrorCode = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 7rem;
  font-weight: 200;
  color: ${C.gold};
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.8s ease both;
`

const Title = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 300;
  color: ${C.white};
  margin: 0 0 0.85rem 0;
`

const Description = styled.p`
  color: ${C.muted};
  font-size: 0.88rem;
  line-height: 1.7;
  margin-bottom: 3rem;
  font-weight: 300;
`

const ActionBtn = styled.button`
  width: 100%;
  padding: 1.1rem;
  background: ${C.gold};
  border: none;
  color: ${C.obsidian};
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  &:hover {
    background: ${C.goldLight};
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(212,175,55,0.35);
  }
`

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <GlobalStyle />
      <Page>
        <GlowBg />
        <Corner className="top-left" />
        <Corner className="top-right" />
        <Corner className="bottom-left" />
        <Corner className="bottom-right" />

        <Card>
          <Logo onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            Prop<span>Flow</span>
          </Logo>
          <ErrorCode>404</ErrorCode>
          <Title>Residence Not Found</Title>
          <Description>
            The private gateway or residence listing you are trying to access does not exist or has been permanently decommissioned.
          </Description>
          <ActionBtn onClick={() => navigate('/properties')}>
            Return to Collection
          </ActionBtn>
        </Card>
      </Page>
    </>
  )
}
