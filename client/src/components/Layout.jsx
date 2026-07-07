import React, { useState } from 'react'
import styled from 'styled-components'
import Sidebar from './Sidebar'

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #111114;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const TopMobileBar = styled.header`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #0a0a0b;
    border-bottom: 1px solid rgba(212, 175, 55, 0.15);
    padding: 0 1.5rem;
    z-index: 900;
  }
`

const Hamburger = styled.button`
  background: transparent;
  border: none;
  color: #d4af37;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  outline: none;
`

const MobileLogo = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 300;
  color: #fff;
  span {
    color: #d4af37;
    font-weight: 600;
  }
`

const SidebarArea = styled.div`
  width: 240px;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 260px;
    z-index: 1000;
    transform: translateX(${p => p.$isOpen ? '0' : '-100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${p => p.$isOpen ? '0 0 30px rgba(0,0,0,0.7)' : 'none'};
  }
`

const MainContent = styled.main`
  margin-left: 240px;
  flex: 1;
  padding: 3rem 3.5rem;
  background: #111114;
  min-height: 100vh;
  box-sizing: border-box;
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 5.5rem 1.25rem 2rem 1.25rem;
  }
`

const Backdrop = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${p => p.$isOpen ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 950;
  }
`

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Wrapper>
      <TopMobileBar>
        <MobileLogo>Prop<span>Flow</span></MobileLogo>
        <Hamburger onClick={() => setIsOpen(true)}>☰</Hamburger>
      </TopMobileBar>

      <Backdrop $isOpen={isOpen} onClick={() => setIsOpen(false)} />

      <SidebarArea $isOpen={isOpen}>
        <Sidebar onClose={() => setIsOpen(false)} />
      </SidebarArea>

      <MainContent>{children}</MainContent>
    </Wrapper>
  )
}