import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'



const fadeUp = keyframes`from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); }`
const shimmer = keyframes`0%,100% { opacity: 0.4; } 50% { opacity: 1; }`
const float = keyframes`0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); }`
const lineGrow = keyframes`from { width: 0; } to { width: 80px; }`

// ── TOKENS ──────────────────────────────────────────────
const C = {
  obsidian: '#0a0a0b',
  ink: '#111114',
  surface: '#16161a',
  card: '#1c1c22',
  border: 'rgba(212,175,55,0.15)',
  gold: '#d4af37',
  goldLight: '#f0d060',
  goldMuted: 'rgba(212,175,55,0.6)',
  cream: '#f5f0e8',
  muted: '#7a7a8a',
  white: '#ffffff',
}

// ── NAV ─────────────────────────────────────────────────
const Nav = styled.nav`
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.5rem 5vw;
  background: linear-gradient(to bottom, rgba(10,10,11,0.95), transparent);
  backdrop-filter: blur(12px);
`
const Logo = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.7rem; font-weight: 600; color: ${C.white};
  letter-spacing: 0.04em; cursor: pointer;
  span { color: ${C.gold}; }
`
const NavLinks = styled.div`
  display: flex; gap: 2.5rem; align-items: center;
`
const NavLink = styled.a`
  color: ${C.muted}; font-size: 0.82rem; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none;
  cursor: pointer; transition: color 0.3s;
  &:hover { color: ${C.gold}; }
`
const NavCTA = styled.button`
  padding: 0.6rem 1.6rem;
  background: transparent;
  border: 1px solid ${C.gold};
  color: ${C.gold};
  font-size: 0.78rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; transition: all 0.3s;
  &:hover { background: ${C.gold}; color: ${C.obsidian}; }
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
    radial-gradient(ellipse 80% 60% at 60% 40%, rgba(212,175,55,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 20% 80%, rgba(212,175,55,0.04) 0%, transparent 50%);
`
const HeroGrid = styled.div`
  position: absolute; inset: 0; opacity: 0.04;
  background-image: linear-gradient(${C.gold} 1px, transparent 1px), linear-gradient(90deg, ${C.gold} 1px, transparent 1px);
  background-size: 80px 80px;
`
const HeroContent = styled.div`
  position: relative; z-index: 1; max-width: 800px;
  animation: ${fadeUp} 0.9s ease both;
`
const HeroEyebrow = styled.div`
  display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
`
const EyebrowLine = styled.div`
  height: 1px; background: ${C.gold}; animation: ${lineGrow} 1s 0.3s ease both; width: 80px;
`
const EyebrowText = styled.span`
  font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase;
  color: ${C.gold}; font-weight: 500;
`
const HeroTitle = styled.h1`
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.5rem, 7vw, 6.5rem);
  font-weight: 300; color: ${C.white};
  line-height: 1.05; letter-spacing: -0.01em;
  margin-bottom: 1.5rem;
  em { font-style: italic; color: ${C.gold}; }
`
const HeroSub = styled.p`
  font-size: 1.05rem; color: ${C.muted}; line-height: 1.8;
  max-width: 520px; margin-bottom: 3rem; font-weight: 300;
`
const HeroCTAs = styled.div`display: flex; gap: 1rem; align-items: center;`
const PrimaryBtn = styled.button`
  padding: 1rem 2.5rem;
  background: ${C.gold};
  border: none; color: ${C.obsidian};
  font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
  cursor: pointer; transition: all 0.3s;
  &:hover { background: ${C.goldLight}; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(212,175,55,0.3); }
`
const SecondaryBtn = styled.button`
  padding: 1rem 2.5rem;
  background: transparent; border: 1px solid rgba(255,255,255,0.2);
  color: ${C.white}; font-size: 0.8rem; font-weight: 500;
  letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s;
  &:hover { border-color: ${C.gold}; color: ${C.gold}; }
`
const HeroStats = styled.div`
  position: absolute; bottom: 3rem; right: 5vw;
  display: flex; gap: 3rem; z-index: 1;
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
  position: absolute; bottom: 3rem; left: 5vw; z-index: 1;
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
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
const marquee = keyframes`from { transform: translateX(0); } to { transform: translateX(-50%); }`
const MarqueeSection = styled.div`
  background: ${C.gold}; padding: 1rem 0; overflow: hidden;
`
const MarqueeInner = styled.div`
  display: flex; gap: 4rem; width: max-content;
  animation: ${marquee} 20s linear infinite;
`
const MarqueeItem = styled.span`
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: ${C.obsidian}; font-weight: 600; white-space: nowrap;
`

// ── PROPERTIES SECTION ───────────────────────────────────
const Section = styled.section`
  background: ${C.ink}; padding: 7rem 5vw;
`
const SectionHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 4rem;
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
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
`
const PropertyCard = styled.div`
  position: relative; overflow: hidden; cursor: pointer;
  aspect-ratio: 3/4;
  background: ${C.card};
  &:hover .overlay { opacity: 1; }
  &:hover img { transform: scale(1.06); }
`
const PropertyImg = styled.img`
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.6s ease; display: block;
`
const PropertyOverlay = styled.div`
  className: overlay;
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(10,10,11,0.95) 0%, rgba(10,10,11,0.3) 60%, transparent 100%);
  opacity: 0.7; transition: opacity 0.4s;
`
const PropertyInfo = styled.div`
  position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem;
`
const PropertyBadge = styled.span`
  display: inline-block; padding: 0.25rem 0.8rem; margin-bottom: 0.75rem;
  border: 1px solid ${C.gold}; color: ${C.gold};
  font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
`
const PropertyTitle = styled.h3`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem; font-weight: 400; color: ${C.white};
  margin-bottom: 0.3rem; line-height: 1.2;
`
const PropertyLocation = styled.div`
  font-size: 0.75rem; color: rgba(255,255,255,0.5); letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
`
const PropertyPrice = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem; color: ${C.gold}; font-weight: 500;
`
const PropertyChips = styled.div`
  display: flex; gap: 0.5rem; margin-top: 0.5rem;
`
const PChip = styled.span`
  font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.12);
  padding: 0.2rem 0.6rem;
`

// ── OWNER SECTION ─────────────────────────────────────────
const OwnerSection = styled.section`
  background: ${C.surface}; padding: 7rem 5vw;
  display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center;
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
`
const OwnerImgInner = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`
const OwnerBadge = styled.div`
  position: absolute; bottom: -1.5rem; right: -1.5rem; z-index: 2;
  background: ${C.gold}; padding: 1.5rem 2rem;
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

// ── WHY US ───────────────────────────────────────────────
const WhySection = styled.section`
  background: ${C.obsidian}; padding: 7rem 5vw;
`
const WhyGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 4rem;
`
const WhyCard = styled.div`
  padding: 3rem 2rem; background: ${C.ink};
  border-top: 1px solid ${C.border}; transition: all 0.3s;
  &:hover { background: ${C.card}; border-top-color: ${C.gold}; }
`
const WhyIcon = styled.div`
  font-size: 2rem; margin-bottom: 1.5rem;
  animation: ${shimmer} 3s infinite;
`
const WhyTitle = styled.h3`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem; font-weight: 400; color: ${C.white}; margin-bottom: 1rem;
`
const WhyDesc = styled.p`
  font-size: 0.85rem; color: ${C.muted}; line-height: 1.8;
`

// ── TESTIMONIALS ─────────────────────────────────────────
const TestiSection = styled.section`
  background: ${C.surface}; padding: 7rem 5vw;
`
const TestiGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 4rem;
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

// ── FOOTER ───────────────────────────────────────────────
const Footer = styled.footer`
  background: ${C.obsidian}; padding: 4rem 5vw 2rem;
  border-top: 1px solid ${C.border};
`
const FooterTop = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 2rem; border-bottom: 1px solid ${C.border}; margin-bottom: 2rem;
`
const FooterBottom = styled.div`
  display: flex; justify-content: space-between; align-items: center;
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
    bhk: 4, area: '4,200',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  },
  {
    _id: '2',
    title: 'The Meridian Residences',
    location: 'Gurugram, Haryana',
    price: '₹8.9 Cr',
    badge: 'For Sale',
    bhk: 3, area: '3,100',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  },
  {
    _id: '3',
    title: 'Palazzo del Lago',
    location: 'Hyderabad, Telangana',
    price: '₹3.2L/mo',
    badge: 'For Rent',
    bhk: 5, area: '5,800',
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


      <Nav>
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
        <HeroContent>
          <HeroEyebrow>
            <EyebrowLine />
            <EyebrowText>India's Premier Property Platform</EyebrowText>
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

      {/* FEATURED PROPERTIES */}
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
          {PROPERTIES.map(p => (
            <PropertyCard key={p._id} onClick={() => goProtected(`/properties/${p._id}`)}>
              <PropertyImg src={p.img} alt={p.title} loading="lazy" />
              <PropertyOverlay className="overlay" />
              <PropertyInfo>
                <PropertyBadge>{p.badge}</PropertyBadge>
                <PropertyTitle>{p.title}</PropertyTitle>
                <PropertyLocation>◆ {p.location}</PropertyLocation>
                <PropertyPrice>{p.price}</PropertyPrice>
                <PropertyChips>
                  <PChip>{p.bhk} BHK</PChip>
                  <PChip>{p.area} sq.ft</PChip>
                </PropertyChips>
              </PropertyInfo>
            </PropertyCard>
          ))}
        </PropertiesGrid>
      </Section>

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

      {/* WHY PROPFLOW */}
      <WhySection id="about">
        <SectionHeader>
          <SectionMeta>
            <SectionEyebrow>The PropFlow Difference</SectionEyebrow>
            <SectionTitle>Built for Those<br />Who Demand <em>More</em></SectionTitle>
          </SectionMeta>
        </SectionHeader>
        <WhyGrid>
          {[
            { icon: '◈', title: 'Verified Listings Only', desc: 'Every property undergoes a rigorous 12-point authentication before appearing on our platform.' },
            { icon: '◇', title: 'Zero Brokerage', desc: 'Connect directly with verified owners. No middlemen, no hidden fees, no surprises.' },
            { icon: '◆', title: 'White-Glove Support', desc: 'A dedicated concierge team available for every inquiry, site visit, and transaction.' },
            { icon: '◉', title: 'Discreet Transactions', desc: 'Your privacy is paramount. Every transaction handled with absolute confidentiality.' },
          ].map((item, i) => (
            <WhyCard key={i}>
              <WhyIcon>{item.icon}</WhyIcon>
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

      {/* FOOTER */}
      <Footer id="contact">
        <FooterTop>
          <Logo style={{ fontSize: '1.4rem' }} onClick={goToDashboard}>Prop<span>Flow</span></Logo>
          <NavLinks>
            <NavLink onClick={() => goProtected('/properties')}>Properties</NavLink>
            <NavLink onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</NavLink>
            <NavLink onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</NavLink>
            <NavLink onClick={() => navigate('/login')}>Privacy</NavLink>
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