import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── ANIMATIONS ──────────────────────────────────────────
const fadeUp = keyframes`from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); }`
const shimmer = keyframes`0%,100% { opacity: 0.4; } 50% { opacity: 1; }`
const float = keyframes`0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); }`
const lineGrow = keyframes`from { width: 0; } to { width: 80px; }`
const scanline = keyframes`
  0% { top: -10%; }
  100% { top: 110%; }
`
const glitch = keyframes`
  0%, 100% { transform: translate(0); text-shadow: none; }
  92% { transform: translate(0); text-shadow: none; }
  93% { transform: translate(-2px, 1px); text-shadow: 2px 0 #00ffff, -2px 0 #d4af37; }
  94% { transform: translate(1px, -1px); text-shadow: -1px 0 #00ffff, 1px 0 #d4af37; }
  95% { transform: translate(0); text-shadow: none; }
`
const shimmerText = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`
const marquee = keyframes`from { transform: translateX(0); } to { transform: translateX(-50%); }`
const borderPulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.9; }
`

// ── TOKENS ──────────────────────────────────────────────
const C = {
  obsidian: '#0a0a0b',
  ink: '#111114',
  surface: '#16161a',
  card: '#1c1c22',
  border: 'rgba(212,175,55,0.15)',
  borderSubtle: 'rgba(255,255,255,0.07)',
  gold: '#d4af37',
  goldLight: '#f0d060',
  goldMuted: 'rgba(212,175,55,0.6)',
  cream: '#f5f0e8',
  muted: '#7a7a8a',
  white: '#ffffff',
  cyan: '#00f0ff',
}

// ── NAV ─────────────────────────────────────────────────
const Nav = styled.nav`
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: ${p => p.$scrolled ? '1rem 5vw' : '1.5rem 5vw'};
  background: ${p => p.$scrolled ? 'rgba(10,10,11,0.92)' : 'transparent'};
  border-bottom: ${p => p.$scrolled ? `1px solid ${C.border}` : '1px solid transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(20px)' : 'none'};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`
const Logo = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.7rem; font-weight: 700; color: ${C.white};
  letter-spacing: 0.04em; cursor: pointer;
  span { color: ${C.gold}; }
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`
const NavLinks = styled.div`
  display: flex; gap: 2.5rem; align-items: center;
  @media (max-width: 768px) {
    display: none;
  }
`
const NavLink = styled.a`
  color: ${C.muted}; font-size: 0.82rem; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none;
  cursor: pointer; position: relative; padding-bottom: 4px;
  transition: color 0.3s;
  &:hover { color: ${C.gold}; }
  &::after {
    content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px;
    background: ${C.gold}; transition: width 0.3s ease;
  }
  &:hover::after {
    width: 100%;
  }
`
const NavCTA = styled.button`
  padding: 0.6rem 1.6rem;
  background: transparent;
  border: 1px solid ${C.gold};
  color: ${C.gold};
  font-size: 0.78rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; transition: all 0.3s;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  &:hover { background: ${C.gold}; color: ${C.obsidian}; }
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.68rem;
  }
`

// ── HERO ────────────────────────────────────────────────
const HeroSection = styled.section`
  min-height: 100vh; background: ${C.obsidian};
  display: flex; flex-direction: column; justify-content: center;
  position: relative; overflow: hidden; padding: 0 5vw;
`
const HeroBg = styled.div`
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 60% 40%, rgba(212,175,55,0.03) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 20% 80%, rgba(0,240,255,0.02) 0%, transparent 50%);
  z-index: 1;
`
const HeroGrid = styled.div`
  position: absolute; inset: 0; opacity: 0.03;
  background-image: linear-gradient(${C.gold} 1px, transparent 1px), linear-gradient(90deg, ${C.gold} 1px, transparent 1px);
  background-size: 80px 80px;
  z-index: 1;
`
const Scanline = styled.div`
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, ${C.gold}, transparent);
  opacity: 0.35; pointer-events: none; z-index: 2;
  animation: ${scanline} 6s linear infinite;
`
const Orb1 = styled.div`
  position: absolute; top: 15%; right: 10%; width: 450px; height: 450px;
  background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 75%);
  filter: blur(80px); pointer-events: none; z-index: 0;
`
const Orb2 = styled.div`
  position: absolute; bottom: 15%; left: 5%; width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(0,240,255,0.03) 0%, transparent 75%);
  filter: blur(80px); pointer-events: none; z-index: 0;
`
const Corner = styled.div`
  position: absolute; width: 16px; height: 16px;
  border-color: ${C.border}; border-style: solid;
  pointer-events: none; z-index: 2;
  &.top-left { top: 3rem; left: 3rem; border-width: 1px 0 0 1px; }
  &.top-right { top: 3rem; right: 3rem; border-width: 1px 1px 0 0; }
  &.bottom-left { bottom: 3rem; left: 3rem; border-width: 0 0 1px 1px; }
  &.bottom-right { bottom: 3rem; right: 3rem; border-width: 0 1px 1px 0; }
`
const HeroContent = styled.div`
  position: relative; z-index: 3; max-width: 820px;
  animation: ${fadeUp} 0.9s ease both;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`
const HeroEyebrow = styled.div`
  display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }
`
const EyebrowLine = styled.div`
  height: 1px; background: ${C.gold}; animation: ${lineGrow} 1s 0.3s ease both; width: 80px;
  @media (max-width: 768px) { width: 40px; }
`
const EyebrowText = styled.span`
  font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase;
  color: ${C.gold}; font-weight: 500;
  @media (max-width: 768px) { font-size: 0.6rem; letter-spacing: 0.15em; }
`
const HeroTitle = styled.h1`
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 7vw, 6.5rem);
  font-weight: 300; color: ${C.white};
  line-height: 1.05; letter-spacing: -0.01em;
  margin-bottom: 1.5rem;
  em {
    font-style: normal;
    display: inline-block;
    background: linear-gradient(90deg, ${C.gold} 20%, ${C.goldLight} 50%, ${C.gold} 80%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${shimmerText} 3s linear infinite, ${glitch} 5s infinite;
  }
  @media (max-width: 768px) {
    font-size: clamp(2rem, 11vw, 3rem);
    line-height: 1.1;
    word-break: break-word;
    hyphens: auto;
  }
`
const HeroSub = styled.p`
  font-size: 1.05rem; color: ${C.muted}; line-height: 1.8;
  max-width: 520px; margin-bottom: 3rem; font-weight: 300;
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 2rem;
    max-width: 100%;
  }
`
const HeroCTAs = styled.div`
  display: flex; gap: 1rem; align-items: center;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`
const PrimaryBtn = styled.button`
  padding: 1rem 2.5rem;
  background: ${C.gold};
  border: none; color: ${C.obsidian};
  font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
  cursor: pointer; transition: all 0.3s;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  &:hover { background: ${C.goldLight}; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(212,175,55,0.3); }
`
const SecondaryBtn = styled.button`
  padding: 1rem 2.5rem;
  background: transparent; border: 1px solid rgba(255,255,255,0.2);
  color: ${C.white}; font-size: 0.8rem; font-weight: 500;
  letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  &:hover { border-color: ${C.gold}; color: ${C.gold}; }
`
const HeroStats = styled.div`
  position: absolute; bottom: 3rem; right: 5vw;
  display: flex; gap: 3rem; z-index: 3;
  @media(max-width:768px) { display:none; }
`
const Stat = styled.div`
  text-align: right;
  animation: ${fadeUp} 0.9s 0.5s ease both;
`
const StatNum = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem; font-weight: 600; color: ${C.white}; line-height: 1;
  span { color: ${C.gold}; }
`
const StatLabel = styled.div`
  font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
  color: ${C.muted}; margin-top: 0.3rem;
`
const ScrollIndicator = styled.div`
  position: absolute; bottom: 3rem; left: 5vw; z-index: 3;
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  @media(max-width:768px) { display:none; }
`
const ScrollLine = styled.div`
  width: 1px; height: 60px;
  background: linear-gradient(to bottom, ${C.gold}, transparent);
  animation: ${float} 2s infinite;
`
const ScrollText = styled.span`
  font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: ${C.muted}; writing-mode: vertical-rl;
`

// ── MARQUEE ──────────────────────────────────────────────
const MarqueeSection = styled.div`
  background: ${C.gold}; padding: 1rem 0; overflow: hidden;
  position: relative; z-index: 10;
`
const MarqueeInner = styled.div`
  display: flex; gap: 4rem; width: max-content;
  animation: ${marquee} 20s linear infinite;
`
const MarqueeItem = styled.span`
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: ${C.obsidian}; font-weight: 600; white-space: nowrap;
`

// ── ANIMATED STATS STRIP ──────────────────────────────────
const StatsStrip = styled.div`
  background: ${C.card};
  border-top: 1px solid ${C.border};
  border-bottom: 1px solid ${C.border};
  padding: 3.5rem 5vw;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 5;
  &::before {
    content: ''; position: absolute; inset: 0;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    background: linear-gradient(90deg, transparent, ${C.gold}, transparent) border-box;
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    animation: ${borderPulse} 4s infinite ease-in-out;
  }
  @media(max-width:600px) {
    grid-template-columns: 1fr;
  }
`
const StripStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const StripNum = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem; font-weight: 400; color: ${C.gold};
  span { color: ${C.white}; }
`
const StripLabel = styled.div`
  font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: ${C.muted};
  margin-top: 0.5rem;
`

// ── PROPERTIES SECTION ───────────────────────────────────
const Section = styled.section`
  background: ${C.ink}; padding: 7rem 5vw;
  position: relative;
  z-index: 5;
`
const SectionHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 4rem;
  @media(max-width:600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`
const SectionMeta = styled.div``
const SectionEyebrow = styled.div`
  font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase;
  color: ${C.gold}; margin-bottom: 1rem;
`
const SectionTitle = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  font-weight: 300; color: ${C.white}; line-height: 1.1;
  em { font-style: italic; color: ${C.gold}; }
`
const SectionLink = styled.button`
  background: none; border: none; cursor: pointer;
  font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
  color: ${C.gold}; display: flex; align-items: center; gap: 0.5rem;
  transition: gap 0.3s;
  &:hover { gap: 1rem; }
`
const PropertiesGrid = styled.div`
  display: flex; flex-direction: column; gap: 2.5rem;
`
const PropertyCard = styled.div`
  display: flex; background: ${C.card}; border: 1px solid ${C.borderSubtle};
  position: relative; overflow: hidden; cursor: pointer;
  min-height: 280px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  &:hover {
    border-color: ${C.gold};
    box-shadow: 0 30px 60px rgba(0,0,0,0.65), 0 0 20px rgba(212,175,55,0.05);
    transform: translateY(-4px);
  }
  @media(max-width: 768px) {
    flex-direction: column;
  }
`
const PropertyImgWrap = styled.div`
  width: 42%; position: relative; overflow: hidden;
  @media(max-width: 768px) {
    width: 100%; height: 220px;
  }
`
const PropertyImg = styled.img`
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  ${PropertyCard}:hover & { transform: scale(1.05); }
`
const PropertyOverlay = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(to right, rgba(10,10,11,0.95) 0%, transparent 100%);
  opacity: 0.7; transition: opacity 0.4s;
  ${PropertyCard}:hover & { opacity: 0.85; }
  @media(max-width: 768px) {
    background: linear-gradient(to top, rgba(10,10,11,0.95) 0%, transparent 100%);
  }
`
const PropertyInfo = styled.div`
  width: 58%; padding: 3rem; position: relative;
  display: flex; flex-direction: column; justify-content: center;
  z-index: 1;
  @media(max-width: 768px) {
    width: 100%; padding: 2rem;
  }
`
const GhostNumber = styled.div`
  position: absolute; right: 2rem; bottom: -1rem;
  font-family: 'Cormorant Garamond', serif; font-size: 9rem; font-weight: 700;
  color: rgba(255,255,255,0.015); pointer-events: none; line-height: 1; z-index: 0;
`
const PropertyBadge = styled.span`
  align-self: flex-start; padding: 0.25rem 0.8rem; margin-bottom: 1.25rem;
  border: 1px solid ${C.gold}; color: ${C.gold};
  font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
  background: rgba(212,175,55,0.05);
`
const PropertyTitle = styled.h3`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem; font-weight: 400; color: ${C.white};
  margin-bottom: 0.4rem; line-height: 1.2;
`
const PropertyLocation = styled.div`
  font-size: 0.75rem; color: rgba(255,255,255,0.5); letter-spacing: 0.1em;
  margin-bottom: 1.25rem;
`
const PropertyPrice = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem; color: ${C.gold}; font-weight: 500; margin-bottom: 1.25rem;
`
const PropertyChips = styled.div`
  display: flex; gap: 0.5rem; flex-wrap: wrap; z-index: 2;
`
const PChip = styled.span`
  font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.42); border: 1px solid rgba(255,255,255,0.12);
  padding: 0.25rem 0.75rem; background: rgba(255,255,255,0.01);
`

// ── OWNER SECTION ─────────────────────────────────────────
const OwnerSection = styled.section`
  background: ${C.surface}; padding: 7rem 5vw;
  display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center;
  position: relative; z-index: 5;
  @media(max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
`
const OwnerImageWrap = styled.div`
  position: relative;
`
const OwnerFrame = styled.div`
  position: absolute; top: -20px; left: -20px; right: 20px; bottom: 20px;
  border: 1px solid ${C.border};
`
const OwnerImg = styled.div`
  width: 100%; aspect-ratio: 3/4;
  background: ${C.card};
  position: relative; z-index: 1;
  overflow: hidden;
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
`
const OwnerImgInner = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`
const OwnerBadge = styled.div`
  position: absolute; bottom: -1.5rem; right: -1.5rem; z-index: 2;
  background: ${C.gold}; padding: 1.5rem 2rem;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
`
const OwnerBadgeNum = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem; font-weight: 600; color: ${C.obsidian}; line-height: 1;
`
const OwnerBadgeText = styled.div`
  font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${C.obsidian};
`
const OwnerContent = styled.div`animation: ${fadeUp} 0.8s ease both;`
const OwnerName = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 300; color: ${C.white};
  line-height: 1.15; margin-bottom: 0.5rem;
`
const OwnerTitle = styled.div`
  font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: ${C.gold}; margin-bottom: 2rem;
`
const OwnerBio = styled.p`
  color: ${C.muted}; font-size: 0.95rem; line-height: 1.9; margin-bottom: 2rem;
`
const OwnerStats = styled.div`
  display: flex; gap: 2.5rem; margin-bottom: 2.5rem;
  padding: 1.5rem 0; border-top: 1px solid ${C.border}; border-bottom: 1px solid ${C.border};
`
const OwnerStat = styled.div``
const OwnerStatNum = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem; color: ${C.white}; font-weight: 500;
  span { color: ${C.gold}; }
`
const OwnerStatLabel = styled.div`
  font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${C.muted};
`

// ── WHY PROPFLOW (2x2 GRID UPGRADE) ───────────────────────
const WhySection = styled.section`
  background: ${C.obsidian}; padding: 7rem 5vw;
  position: relative; z-index: 5;
`
const WhyGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 4rem;
  @media(max-width:768px) { grid-template-columns: 1fr; }
`
const WhyCard = styled.div`
  padding: 3.5rem 3rem; background: ${C.card};
  border: 1px solid ${C.borderSubtle};
  position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  &::before {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
    background: linear-gradient(90deg, transparent 10%, ${C.gold} 50%, transparent 90%);
    transform: scaleX(0); transition: transform 0.5s ease;
  }
  &:hover::before {
    transform: scaleX(1);
  }
  &:hover {
    border-color: ${C.gold};
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    transform: translateY(-2px);
  }
`
const WhyGhostNumber = styled.div`
  position: absolute; right: 2rem; top: 1.5rem;
  font-family: 'Cormorant Garamond', serif; font-size: 5rem; font-weight: 700;
  color: rgba(255,255,255,0.015); pointer-events: none; line-height: 1;
`
const WhyIconContainer = styled.div`
  width: 60px; height: 60px;
  display: flex; align-items: center; justify-content: center;
  position: relative; margin-bottom: 2rem;
  &::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(212,175,55,0.04);
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    border: 1px solid ${C.border};
  }
`
const WhyIcon = styled.div`
  font-size: 1.5rem; color: ${C.gold}; position: relative; z-index: 1;
`
const WhyTitle = styled.h3`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem; font-weight: 400; color: ${C.white}; margin-bottom: 1rem;
`
const WhyDesc = styled.p`
  font-size: 0.9rem; color: ${C.muted}; line-height: 1.8;
`

// ── TESTIMONIALS ─────────────────────────────────────────
const TestiSection = styled.section`
  background: ${C.surface}; padding: 7rem 5vw;
  position: relative; z-index: 5;
`
const TestiGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 4rem;
  @media(max-width:900px) { grid-template-columns: 1fr; gap: 2rem; }
`
const TestiCard = styled.div`
  padding: 2.5rem; background: ${C.ink};
  border-bottom: 2px solid transparent; transition: all 0.3s;
  &:hover { border-bottom-color: ${C.gold}; }
`
const TestiQuote = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem; color: ${C.gold}; line-height: 0.5; margin-bottom: 1.5rem;
`
const TestiText = styled.p`
  font-size: 0.9rem; color: ${C.muted}; line-height: 1.8; margin-bottom: 2rem;
`
const TestiAuthor = styled.div`
  display: flex; align-items: center; gap: 1rem;
`
const TestiAvatar = styled.div`
  width: 44px; height: 44px; border-radius: 50%;
  background: ${C.gold}; display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: ${C.obsidian};
`
const TestiName = styled.div`
  font-size: 0.85rem; color: ${C.white}; font-weight: 500;
`
const TestiRole = styled.div`
  font-size: 0.72rem; color: ${C.muted}; letter-spacing: 0.1em;
`

// ── DUAL CTA SECTION ─────────────────────────────────────
const DualCTASection = styled.section`
  background: ${C.ink}; padding: 7rem 5vw;
  display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 5rem; align-items: center;
  border-top: 1px solid ${C.borderSubtle};
  position: relative; z-index: 5;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
`
const CTALeft = styled.div``
const CTARight = styled.div`
  background: ${C.surface};
  border: 1px solid ${C.border};
  padding: 3rem;
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  position: relative;
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  &::before {
    content: ''; position: absolute; top: 0; left: 0; width: 40px; height: 1px; background: ${C.gold};
  }
  &::after {
    content: ''; position: absolute; top: 0; left: 0; width: 1px; height: 40px; background: ${C.gold};
  }
`
const CTAPanelTitle = styled.h4`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem; font-weight: 400; color: ${C.white}; margin-bottom: 1rem;
`
const CTAPanelSub = styled.p`
  font-size: 0.88rem; color: ${C.muted}; line-height: 1.6; margin-bottom: 2rem;
`

// ── FOOTER ───────────────────────────────────────────────
const Footer = styled.footer`
  background: ${C.obsidian}; padding: 4rem 5vw 2rem;
  border-top: 1px solid ${C.border};
  position: relative; z-index: 5;
`
const FooterTop = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 2rem; border-bottom: 1px solid ${C.border}; margin-bottom: 2rem;
  @media(max-width:600px) {
    flex-direction: column;
    gap: 2rem;
  }
`
const FooterBottom = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  @media(max-width:600px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`
const FooterCopy = styled.div`
  font-size: 0.75rem; color: ${C.muted}; letter-spacing: 0.05em;
`

// ── DATA ─────────────────────────────────────────────────
const PROPERTIES = [
  {
    _id: '1',
    title: 'Sky Penthouse, Bandra West',
    location: 'Mumbai, Maharashtra',
    price: '₹12.5 Cr',
    badge: 'For Sale',
    bhk: 4, area: '4,200', level: 'Penthouse Level',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  },
  {
    _id: '2',
    title: 'The Meridian Residences',
    location: 'Gurugram, Haryana',
    price: '₹8.9 Cr',
    badge: 'For Sale',
    bhk: 3, area: '3,100', level: 'Level 24',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  },
  {
    _id: '3',
    title: 'Palazzo del Lago',
    location: 'Hyderabad, Telangana',
    price: '₹3.2L/mo',
    badge: 'For Rent',
    bhk: 5, area: '5,800', level: 'Estate Level',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
  },
]

const MARQUEE_ITEMS = ['Exclusive Listings', 'Verified Owners', 'Zero Brokerage', 'Pan-India Network', 'White-Glove Service', 'Discreet Transactions', 'Luxury Redefined']

const TESTIMONIALS = [
  { quote: 'PropFlow found us our dream penthouse in 6 days. The level of discretion and service was unparalleled.', name: 'Arjun Mehta', role: 'Entrepreneur, Mumbai', initial: 'A' },
  { quote: 'As a developer, I needed a platform that matches our premium inventory. PropFlow delivers exactly that.', name: 'Priya Sharma', role: 'Real Estate Developer, Delhi', initial: 'P' },
  { quote: 'I sold my Worli apartment at 18% above asking. The network PropFlow brings is extraordinary.', name: 'Rohan Kapoor', role: 'Investment Banker, Mumbai', initial: 'R' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // If logged in → go to dashboard; else → go to login
  const goProtected = (path = '/properties') => {
    if (user) navigate(path)
    else navigate('/login')
  }

  const goToDashboard = () => {
    if (!user) { navigate('/login'); return }
    navigate('/dashboard')
  }

  return (
    <>
      <Nav $scrolled={scrolled}>
        <Logo onClick={() => navigate(user ? '/properties' : '/')} style={{ cursor: 'pointer' }}>Prop<span>Flow</span></Logo>
        <NavLinks>
          <NavLink onClick={() => goProtected('/properties')}>Properties</NavLink>
          <NavLink onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</NavLink>
          <NavLink onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</NavLink>
          {user
            ? <NavCTA onClick={goToDashboard}>My Dashboard</NavCTA>
            : <NavCTA onClick={() => navigate('/login')}>Sign In</NavCTA>
          }
        </NavLinks>
      </Nav>

      {/* HERO */}
      <HeroSection>
        <HeroBg />
        <HeroGrid />
        <Scanline />
        <Orb1 />
        <Orb2 />
        <Corner className="top-left" />
        <Corner className="top-right" />
        <Corner className="bottom-left" />
        <Corner className="bottom-right" />

        <HeroContent>
          <HeroEyebrow>
            <EyebrowLine />
            <HeroEyebrow>
              <EyebrowText>India's Premier Property Platform</EyebrowText>
            </HeroEyebrow>
          </HeroEyebrow>
          <HeroTitle>
            Where <em>Exceptional</em><br />Homes Find<br />Discerning Owners
          </HeroTitle>
          <HeroSub>
            Curated ultra-luxury residences across India's most coveted addresses. No brokers. No compromises. Only the finest.
          </HeroSub>
          <HeroCTAs>
            <PrimaryBtn onClick={() => goProtected('/properties')}>Explore Residences</PrimaryBtn>
            <SecondaryBtn onClick={() => goProtected('/dashboard')}>List Your Property</SecondaryBtn>
          </HeroCTAs>
        </HeroContent>
        <HeroStats>
          <Stat><StatNum>2,400<span>+</span></StatNum><StatLabel>Active Listings</StatLabel></Stat>
          <Stat><StatNum>₹18K<span>Cr+</span></StatNum><StatLabel>Properties Sold</StatLabel></Stat>
          <Stat><StatNum>14<span>+</span></StatNum><StatLabel>Cities</StatLabel></Stat>
        </HeroStats>
        <ScrollIndicator>
          <ScrollLine />
          <ScrollText>Scroll</ScrollText>
        </ScrollIndicator>
      </HeroSection>

      {/* MARQUEE */}
      <MarqueeSection>
        <MarqueeInner>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <MarqueeItem key={i}>◆ {item}</MarqueeItem>
          ))}
        </MarqueeInner>
      </MarqueeSection>

      {/* FEATURED PROPERTIES (HORIZONTAL ROW UPGRADE) */}
      <Section>
        <SectionHeader>
          <SectionMeta>
            <SectionEyebrow>Featured Collection</SectionEyebrow>
            <SectionTitle>Hand-Picked<br /><em>Residences</em></SectionTitle>
          </SectionMeta>
          <SectionLink onClick={() => goProtected('/properties')}>
            View All Properties →
          </SectionLink>
        </SectionHeader>
        <PropertiesGrid>
          {PROPERTIES.map((p, index) => (
            <PropertyCard key={p._id} onClick={() => goProtected(`/properties/${p._id}`)}>
              <PropertyImgWrap>
                <PropertyImg src={p.img} alt={p.title} loading="lazy" />
                <PropertyOverlay />
              </PropertyImgWrap>
              <PropertyInfo>
                <GhostNumber>0{index + 1}</GhostNumber>
                <PropertyBadge>{p.badge}</PropertyBadge>
                <PropertyTitle>{p.title}</PropertyTitle>
                <PropertyLocation>◆ {p.location}</PropertyLocation>
                <PropertyPrice>{p.price}</PropertyPrice>
                <PropertyChips>
                  <PChip>{p.bhk} BHK</PChip>
                  <PChip>{p.area} sq.ft</PChip>
                  <PChip>{p.level}</PChip>
                </PropertyChips>
              </PropertyInfo>
            </PropertyCard>
          ))}
        </PropertiesGrid>
      </Section>

      {/* ANIMATED STATS STRIP */}
      <StatsStrip>
        <StripStat>
          <StripNum>2,400<span>+</span></StripNum>
          <StripLabel>Luxury Properties</StripLabel>
        </StripStat>
        <StripStat>
          <StripNum>100<span>%</span></StripNum>
          <StripLabel>Direct Owner Listings</StripLabel>
        </StripStat>
        <StripStat>
          <StripNum>0<span>%</span></StripNum>
          <StripLabel>Brokerage Charged</StripLabel>
        </StripStat>
      </StatsStrip>

      {/* OWNER SPOTLIGHT */}
      <OwnerSection>
        <OwnerImageWrap>
          <OwnerFrame />
          <OwnerImg>
            <OwnerImgInner
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
              alt="Vikram Oberoi"
              loading="lazy"
            />
          </OwnerImg>
          <OwnerBadge>
            <OwnerBadgeNum>22</OwnerBadgeNum>
            <OwnerBadgeText>Years of Excellence</OwnerBadgeText>
          </OwnerBadge>
        </OwnerImageWrap>
        <OwnerContent>
          <SectionEyebrow>Featured Owner</SectionEyebrow>
          <OwnerName>Vikram Oberoi</OwnerName>
          <OwnerTitle>Portfolio Owner · Mumbai & Delhi NCR</OwnerTitle>
          <OwnerBio>
            A visionary in India's luxury real estate landscape, Vikram Oberoi has curated an extraordinary collection of ultra-premium residences across Mumbai's most sought-after neighbourhoods and Delhi's finest addresses. His portfolio is a testament to architectural excellence and investment acumen.
          </OwnerBio>
          <OwnerStats>
            <OwnerStat>
              <OwnerStatNum>34<span>+</span></OwnerStatNum>
              <OwnerStatLabel>Properties Listed</OwnerStatLabel>
            </OwnerStat>
            <OwnerStat>
              <OwnerStatNum>₹240<span>Cr</span></OwnerStatNum>
              <OwnerStatLabel>Portfolio Value</OwnerStatLabel>
            </OwnerStat>
            <OwnerStat>
              <OwnerStatNum>98<span>%</span></OwnerStatNum>
              <OwnerStatLabel>Verified Reviews</OwnerStatLabel>
            </OwnerStat>
          </OwnerStats>
          <PrimaryBtn onClick={() => goProtected('/properties')}>View His Portfolio</PrimaryBtn>
        </OwnerContent>
      </OwnerSection>

      {/* WHY PROPFLOW (2x2 GRID UPGRADE) */}
      <WhySection id="about">
        <SectionHeader>
          <SectionMeta>
            <SectionEyebrow>The PropFlow Difference</SectionEyebrow>
            <SectionTitle>Built for Those<br />Who Demand <em>More</em></SectionTitle>
          </SectionMeta>
        </SectionHeader>
        <WhyGrid>
          {[
            { icon: '◈', title: 'Verified Listings Only', desc: 'Every property undergoes a rigorous 12-point authentication before appearing on our platform.', num: '01' },
            { icon: '◇', title: 'Zero Brokerage', desc: 'Connect directly with verified owners. No middlemen, no hidden fees, no surprises.', num: '02' },
            { icon: '◆', title: 'White-Glove Support', desc: 'A dedicated concierge team available for every inquiry, site visit, and transaction.', num: '03' },
            { icon: '◉', title: 'Discreet Transactions', desc: 'Your privacy is paramount. Every transaction handled with absolute confidentiality.', num: '04' },
          ].map((item, i) => (
            <WhyCard key={i}>
              <WhyGhostNumber>{item.num}</WhyGhostNumber>
              <WhyIconContainer>
                <WhyIcon>{item.icon}</WhyIcon>
              </WhyIconContainer>
              <WhyTitle>{item.title}</WhyTitle>
              <WhyDesc>{item.desc}</WhyDesc>
            </WhyCard>
          ))}
        </WhyGrid>
      </WhySection>

      {/* TESTIMONIALS */}
      <TestiSection>
        <SectionHeader>
          <SectionMeta>
            <SectionEyebrow>Client Voices</SectionEyebrow>
            <SectionTitle>Words From<br /><em>Our Clients</em></SectionTitle>
          </SectionMeta>
        </SectionHeader>
        <TestiGrid>
          {TESTIMONIALS.map((t, i) => (
            <TestiCard key={i}>
              <TestiQuote>"</TestiQuote>
              <TestiText>{t.quote}</TestiText>
              <TestiAuthor>
                <TestiAvatar>{t.initial}</TestiAvatar>
                <div>
                  <TestiName>{t.name}</TestiName>
                  <TestiRole>{t.role}</TestiRole>
                </div>
              </TestiAuthor>
            </TestiCard>
          ))}
        </TestiGrid>
      </TestiSection>

      {/* DUAL CTA SECTION */}
      <DualCTASection id="contact">
        <CTALeft>
          <SectionEyebrow>Ready to Begin?</SectionEyebrow>
          <SectionTitle style={{ marginBottom: '1.5rem' }}>Experience the<br />Future of <em>Luxury Real Estate</em></SectionTitle>
          <p style={{ color: C.muted, lineHeight: '1.8', maxWidth: '520px', marginBottom: '2.5rem' }}>
            Whether looking to acquire a signature sky residence or present a high-value asset, our platform guarantees an efficient, broker-free process with absolute privacy.
          </p>
          <PrimaryBtn onClick={() => goProtected('/properties')}>Browse Inventory</PrimaryBtn>
        </CTALeft>
        <CTARight>
          <CTAPanelTitle>Direct Inquiries</CTAPanelTitle>
          <CTAPanelSub>Our white-glove concierge is available 24/7. Speak directly with us for bespoke needs or private walkthroughs.</CTAPanelSub>
          <a href="mailto:contact@propflow.com" style={{ textDecoration: 'none' }}>
            <PrimaryBtn style={{ width: '100%', textAlign: 'center' }}>Send Message</PrimaryBtn>
          </a>
        </CTARight>
      </DualCTASection>

      {/* FOOTER */}
      <Footer>
        <FooterTop>
          <Logo style={{ fontSize: '1.4rem' }} onClick={goToDashboard}>Prop<span>Flow</span></Logo>
          <NavLinks>
            <NavLink onClick={() => goProtected('/properties')}>Properties</NavLink>
            <NavLink onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</NavLink>
            <NavLink href="mailto:contact@propflow.com">Contact Us</NavLink>
          </NavLinks>
        </FooterTop>
        <FooterBottom>
          <FooterCopy>© 2025 PropFlow. All rights reserved.</FooterCopy>
          <FooterCopy>Crafted for the discerning few.</FooterCopy>
        </FooterBottom>
      </Footer>
    </>
  )
}