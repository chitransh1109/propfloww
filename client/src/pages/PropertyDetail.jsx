import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'



const fadeUp = keyframes`from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}`

const C = {
  obsidian:'#0a0a0b', ink:'#111114', surface:'#16161a', card:'#1c1c22',
  border:'rgba(212,175,55,0.15)', borderSubtle:'rgba(255,255,255,0.07)',
  gold:'#d4af37', goldLight:'#f0d060', muted:'#7a7a8a', mutedLight:'#a0a0b0',
  white:'#ffffff', success:'#4ade80', successBg:'rgba(74,222,128,0.08)',
  error:'#e05252', errorBg:'rgba(224,82,82,0.08)',
}

/* ── BOGUS FALLBACK DATA ── */
const BOGUS_PROPERTIES = {
  demo_b1: {
    _id: 'demo_b1',
    title: 'Sky Penthouse, Bandra West',
    address: '3, Turner Road, Bandra West',
    city: 'Mumbai',
    type: 'apartment',
    listingType: 'sale',
    bhk: 4,
    area: 4200,
    price: 125000000,
    status: 'available',
    latitude: 19.0596,
    longitude: 72.8295,
    description: 'A breathtaking sky penthouse perched atop Mumbai\'s most coveted address. Floor-to-ceiling glass walls frame panoramic views of the Arabian Sea, while interiors by award-winning designer Studio HBA blend contemporary Italian marble with warm teak accents. Features a private rooftop infinity pool, home theatre, and dedicated staff quarters.',
    amenities: ['Infinity Pool', 'Home Theatre', 'Concierge', 'Valet Parking', 'Gym', 'Wine Cellar', 'Smart Home', 'Jacuzzi'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&q=80'
    ]
  },
  demo_b2: {
    _id: 'demo_b2',
    title: 'The Meridian Residences',
    address: 'Golf Course Road, Sector 42',
    city: 'Gurugram',
    type: 'apartment',
    listingType: 'sale',
    bhk: 3,
    area: 3100,
    price: 89000000,
    status: 'available',
    latitude: 28.4595,
    longitude: 77.0266,
    description: 'Set within Gurugram\'s most prestigious gated enclave, The Meridian offers a rare blend of privacy and prestige. Each residence features bespoke joinery, imported stone surfaces, and a private sky garden. World-class amenities across 3 acres.',
    amenities: ['Sky Garden', 'Concierge', 'Club House', 'Swimming Pool', 'Spa', 'Business Lounge', 'EV Charging'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80'
    ]
  },
  demo_b3: {
    _id: 'demo_b3',
    title: 'Palazzo del Lago Villa',
    address: 'Jubilee Hills, Road No 10',
    city: 'Hyderabad',
    type: 'villa',
    listingType: 'rent',
    bhk: 5,
    area: 5800,
    price: 320000,
    status: 'available',
    latitude: 17.4374,
    longitude: 78.4018,
    description: 'An exceptional lakeside villa in Hyderabad\'s most exclusive neighbourhood. Spread over 3 expansive floors, the villa includes dual gourmet kitchens, temperature-controlled indoor pool, private home office, and landscaped lawns directly looking out onto the lake.',
    amenities: ['Lakeside View', 'Indoor Heated Pool', 'Home Office', 'Dual Kitchens', 'Private Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80'
    ]
  },
  demo_b4: {
    _id: 'demo_b4',
    title: 'The Crown, Worli Sea Face',
    address: 'Worli Sea Face',
    city: 'Mumbai',
    type: 'apartment',
    listingType: 'sale',
    bhk: 4,
    area: 3800,
    price: 210000000,
    status: 'available',
    latitude: 19.0149,
    longitude: 72.8130,
    description: 'Hovering high above the Bandra-Worli Sea Link, The Crown is a masterpiece of contemporary sea-front living. With double-height living room ceilings and wrap-around balconies, you experience unparalleled ocean views from every room.',
    amenities: ['Sea View', 'Wrap-around Balcony', 'Double-height Ceilings', 'Spa & Sauna', 'Private Gym', '24/7 Concierge'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80'
    ]
  },
  demo_b5: {
    _id: 'demo_b5',
    title: 'Lutyens Bungalow Estate',
    address: 'Prithviraj Road, Lutyens',
    city: 'Delhi',
    type: 'villa',
    listingType: 'sale',
    bhk: 6,
    area: 8500,
    price: 450000000,
    status: 'available',
    latitude: 28.5997,
    longitude: 77.2205,
    description: 'A once-in-a-generation opportunity to own a stately colonial-style bungalow in Delhi\'s ultra-exclusive Lutyens Zone. Sited on over an acre of pristine manicured gardens, the estate features neoclassical columns, grand high-ceiling reception rooms, a private study, and separate staff quarters.',
    amenities: ['Neoclassical Architecture', 'Private Gardens', 'Colonial Verandah', 'Staff Quarters', 'Stately Library', 'Guard House'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80'
    ]
  },
  demo_b6: {
    _id: 'demo_b6',
    title: 'Prestige Leela Residences',
    address: 'HAL Old Airport Road',
    city: 'Bengaluru',
    type: 'apartment',
    listingType: 'rent',
    bhk: 3,
    area: 2600,
    price: 185000,
    status: 'available',
    latitude: 12.9602,
    longitude: 77.6482,
    description: 'Luxury apartments styled after the ornate architectural themes of the Leela Palace. With grand arches, ornate ceilings, and lush landscaped gardens, these residences redefine opulent palace-style living in India\'s IT hub.',
    amenities: ['Palace-style Interiors', 'Landscaped Courtyard', 'Valet Parking', 'Indoor Pool', 'Billiards Room'],
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'
    ]
  },
  demo_b7: {
    _id: 'demo_b7',
    title: 'The Oberoi Suites Tower',
    address: 'Koregaon Park',
    city: 'Pune',
    type: 'apartment',
    listingType: 'sale',
    bhk: 2,
    area: 1800,
    price: 32000000,
    status: 'available',
    latitude: 18.5362,
    longitude: 73.8930,
    description: 'An elegant urban suite in Pune\'s most desirable residential enclave. Perfect for corporate leaders or young professionals, the home blends high-tech convenience with minimalist architecture.',
    amenities: ['Smart Automation', 'Rooftop Bar', 'Private Gym', 'Steam & Sauna', 'Underground Parking'],
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'
    ]
  },
  demo_b8: {
    _id: 'demo_b8',
    title: 'Golf Estate Villa',
    address: 'Sector 65, Golf Course Road Extension',
    city: 'Gurugram',
    type: 'villa',
    listingType: 'sale',
    bhk: 5,
    area: 6200,
    price: 175000000,
    status: 'available',
    latitude: 28.3975,
    longitude: 77.0658,
    description: 'A spectacular modern villa bordering a world-class championship golf course. Awash in natural light, the home showcases premium Greek marble floors, designer modular kitchens, and a private glass elevator.',
    amenities: ['Golf Course View', 'Greek Marble Floors', 'Private Elevator', 'Heated Plunge Pool', 'Solar Backup'],
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80'
    ]
  },
  demo_b9: {
    _id: 'demo_b9',
    title: 'Altamount Manor',
    address: 'Altamount Road, Cumballa Hill',
    city: 'Mumbai',
    type: 'villa',
    listingType: 'rent',
    bhk: 4,
    area: 4800,
    price: 500000,
    status: 'available',
    latitude: 18.9667,
    longitude: 72.8083,
    description: 'An absolute masterpiece of private residential luxury nestled on Altamount Road, India\'s billionaire row. Featuring unparalleled skyline views and completely custom high-end millwork throughout.',
    amenities: ['Skyline Views', 'Bespoke Millwork', 'Heated Pool', 'Wine Cellar', 'Professional Kitchen', 'Bulletproof Glasing'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80'
    ]
  }
}

const Page = styled.div`
  max-width:1280px; margin:0 auto; padding:3rem 2.5rem;
  background:${C.ink}; min-height:100vh;
  animation:${fadeUp} 0.5s ease both;
`
const BackBtn = styled.button`
  background:none; border:none; cursor:pointer; padding:0; margin-bottom:2rem;
  display:flex; align-items:center; gap:0.5rem;
  font-size:0.72rem; letter-spacing:0.15em; text-transform:uppercase;
  color:${C.muted}; transition:color 0.2s;
  position: relative;
  &::after {
    content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px;
    background: ${C.gold}; transition: width 0.3s ease;
  }
  &:hover { color:${C.gold}; }
  &:hover::after { width: 100%; }
`

const Layout = styled.div`
  display:grid; grid-template-columns:1fr 380px; gap:2.5rem; align-items:start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`
const Left = styled.div``
const Right = styled.div`
  position:sticky; top:2rem;
  @media (max-width: 900px) {
    position: static;
  }
`

/* ── GALLERY ── */
const Gallery = styled.div`
  display:grid; grid-template-columns:1fr 100px; gap:3px; margin-bottom:2rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`
const MainImg = styled.div`
  height:460px; overflow:hidden; position:relative; background:${C.card};
  display:flex; align-items:center; justify-content:center; font-size:5rem;
  background:${p => p.src ? `url(${p.src}) center/cover` : C.card};
  border: 1px solid ${C.borderSubtle};
  transition: border-color 0.3s;
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  &:hover { border-color: ${C.gold}; }
  @media (max-width: 600px) {
    height: 260px;
  }
`
const Thumbs = styled.div`
  display:flex; flex-direction:column; gap:3px;
  @media (max-width: 600px) {
    flex-direction: row;
    overflow-x: auto;
  }
`
const Thumb = styled.div`
  height:152px; cursor:pointer; overflow:hidden;
  background:${p => p.src ? `url(${p.src}) center/cover` : C.surface};
  display:flex; align-items:center; justify-content:center;
  opacity:${p => p.active ? 1 : 0.45}; transition:all 0.25s;
  border-left:2px solid ${p => p.active ? C.gold : 'transparent'};
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  &:hover { opacity:1; }
  @media (max-width: 600px) {
    height: 70px;
    flex: 1;
    min-width: 80px;
    border-left: none;
    border-bottom: 2px solid ${p => p.active ? C.gold : 'transparent'};
  }
`

/* ── INFO CARD ── */
const InfoCard = styled.div`
  background:${C.card}; border:1px solid ${C.border};
  padding:2.5rem; margin-bottom:2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  position: relative;
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  &::after {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 1px;
    background: linear-gradient(90deg, transparent, ${C.gold}, transparent);
  }
`
const StatusBadge = styled.span`
  display:inline-block; padding:0.25rem 0.85rem; margin-bottom:1rem;
  font-size:0.65rem; letter-spacing:0.2em; text-transform:uppercase; font-weight:600;
  border:1px solid ${p => p.type === 'rent' ? 'rgba(99,162,255,0.5)' : C.gold};
  color:${p => p.type === 'rent' ? '#a0c4ff' : C.gold};
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
`
const Title = styled.h1`
  font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-weight:300;
  color:${C.white}; margin-bottom:0.5rem; line-height:1.15;
`
const Price = styled.div`
  font-family:'Cormorant Garamond',serif; font-size:2.5rem; font-weight:500;
  color:${C.gold}; margin-bottom:0.75rem;
`
const Location = styled.div`
  font-size:0.78rem; letter-spacing:0.1em; text-transform:uppercase;
  color:${C.muted}; margin-bottom:1.5rem;
`
const ChipRow = styled.div`display:flex; gap:0.5rem; flex-wrap:wrap;`
const Chip = styled.span`
  padding:0.25rem 0.8rem; font-size:0.68rem; letter-spacing:0.1em; text-transform:uppercase;
  color:${C.mutedLight}; border:1px solid ${C.borderSubtle};
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
`

/* ── TABS ── */
const Tabs = styled.div`
  display:flex; gap:0; border-bottom:1px solid ${C.border}; margin-bottom:1.5rem;
`
const Tab = styled.button`
  padding:0.75rem 1.5rem; background:none; border:none; cursor:pointer;
  font-size:0.72rem; font-weight:500; letter-spacing:0.15em; text-transform:uppercase;
  color:${p => p.active ? C.gold : C.muted};
  border-bottom:1px solid ${p => p.active ? C.gold : 'transparent'};
  margin-bottom:-1px; transition:all 0.2s;
  &:hover { color:${C.gold}; }
`
const TabCard = styled.div`
  background:${C.card}; border:1px solid ${C.border}; padding:2rem;
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
`
const TabContent = styled.div`
  color:${C.mutedLight}; font-size:0.9rem; line-height:1.9;
`
const AmenityWrap = styled.div`display:flex; flex-wrap:wrap; gap:0.5rem;`
const AmenityTag = styled.span`
  padding:0.35rem 1rem; font-size:0.68rem; letter-spacing:0.12em; text-transform:uppercase;
  color:${C.gold}; border:1px solid ${C.border};
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
`

/* ── MAP ── */
const MapContainer = styled.div`
  width:100%; height:320px; margin-top:1rem;
  border:1px solid ${C.border}; overflow:hidden;
  position:relative;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
`
const MapIframe = styled.iframe`
  width:100%; height:100%; border:0;
  filter:grayscale(0.3) contrast(1.1);
`
const MapMeta = styled.div`
  display:flex; justify-content:space-between; align-items:center;
  margin-top:1rem; flex-wrap:wrap; gap:0.75rem;
`
const CoordBadge = styled.div`
  display:flex; align-items:center; gap:0.5rem;
  font-size:0.7rem; letter-spacing:0.1em; color:${C.muted};
  span { color:${C.gold}; font-weight:500; }
`
const DirectionsBtn = styled.a`
  display:inline-flex; align-items:center; gap:0.5rem;
  padding:0.5rem 1.2rem;
  border:1px solid ${C.gold}; color:${C.gold};
  font-size:0.68rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase;
  text-decoration:none; transition:all 0.25s;
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
  &:hover { background:${C.gold}; color:${C.obsidian}; }
`
const NoMapMsg = styled.div`
  padding:2.5rem; text-align:center; color:${C.muted};
  font-size:0.85rem; border:1px dashed ${C.borderSubtle}; margin-top:1rem;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
`

/* ── ENQUIRY CARD ── */
const EnquiryCard = styled.div`
  background:${C.surface}; border:1px solid ${C.border}; padding:2rem;
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
`
const EnquiryEyebrow = styled.div`
  font-size:0.65rem; letter-spacing:0.22em; text-transform:uppercase;
  color:${C.gold}; margin-bottom:0.5rem;
`
const EnquiryTitle = styled.h3`
  font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:300;
  color:${C.white}; margin-bottom:1.5rem; line-height:1.2;
`
const Input = styled.input`
  width:100%; padding:0.8rem 1rem; margin-bottom:0.75rem;
  background:rgba(255, 255, 255, 0.02); border:1px solid rgba(255, 255, 255, 0.06);
  color:${C.white}; font-size:0.88rem; outline:none;
  font-family:'Inter',sans-serif; transition:all 0.25s; border-radius:4px;
  &::placeholder { color:${C.muted}; }
  &:focus { border-color:${C.gold}; background:rgba(212,175,55,0.03); }
`
const Textarea = styled.textarea`
  width:100%; padding:0.8rem 1rem; margin-bottom:0.75rem;
  background:rgba(255, 255, 255, 0.02); border:1px solid rgba(255, 255, 255, 0.06);
  color:${C.white}; font-size:0.88rem; outline:none; resize:vertical; min-height:90px;
  font-family:'Inter',sans-serif; transition:all 0.25s; border-radius:4px;
  &::placeholder { color:${C.muted}; }
  &:focus { border-color:${C.gold}; background:rgba(212,175,55,0.03); }
`
const SubmitBtn = styled.button`
  width:100%; padding:1rem; background:${C.gold}; border:none;
  color:${C.obsidian}; font-size:0.78rem; font-weight:600;
  letter-spacing:0.18em; text-transform:uppercase; cursor:pointer; transition:all 0.3s;
  margin-bottom:0.75rem;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  &:hover { background:${C.goldLight}; transform:translateY(-2px); box-shadow:0 8px 30px rgba(212,175,55,0.3); }
  &:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
`
const SaveBtn = styled.button`
  width:100%; padding:0.9rem; background:transparent;
  border:1px solid ${C.border}; color:${C.muted};
  font-size:0.78rem; font-weight:500; letter-spacing:0.15em; text-transform:uppercase;
  cursor:pointer; transition:all 0.25s;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  &:hover { border-color:${C.gold}; color:${C.gold}; }
`
const SuccessMsg = styled.div`
  color:${C.success}; background:${C.successBg}; border:1px solid rgba(74,222,128,0.2);
  padding:0.75rem 1rem; font-size:0.82rem; margin-bottom:0.75rem; letter-spacing:0.02em;
`
const ErrMsg = styled.div`
  color:${C.error}; background:${C.errorBg}; border:1px solid rgba(224,82,82,0.2);
  padding:0.75rem 1rem; font-size:0.82rem; margin-bottom:0.75rem;
`
const OwnerCard = styled.div`
  background:${C.card}; border:1px solid ${C.border};
  padding:1.5rem; margin-top:1rem; display:flex; align-items:center; gap:1rem;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
`
const OwnerAvatar = styled.div`
  width:48px; height:48px;
  background:${C.gold}; display:flex; align-items:center; justify-content:center;
  font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:${C.obsidian}; flex-shrink:0;
  border-radius: 50%;
`
const OwnerAvatarImg = styled.img`
  width:48px; height:48px; object-fit: cover; flex-shrink:0;
  border-radius: 50%;
`
const OwnerName = styled.div`color:${C.white}; font-size:0.9rem; font-weight:500;`
const OwnerRole = styled.div`color:${C.muted}; font-size:0.72rem; letter-spacing:0.08em;`
const Divider = styled.div`height:1px; background:${C.border}; margin:1rem 0;`

const LoadingPage = styled.div`
  display:flex; align-items:center; justify-content:center; min-height:100vh;
  background:${C.ink}; font-family:'Cormorant Garamond',serif;
  font-size:1.5rem; font-weight:300; color:${C.muted}; letter-spacing:0.1em;
`

const resolveImg = (url) => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const apiHost = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '')
  return `${apiHost}${url.startsWith('/') ? '' : '/'}${url}`
}

function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [property, setProperty] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (id && id.startsWith('demo_')) {
      const bogus = BOGUS_PROPERTIES[id]
      if (bogus) {
        setProperty(bogus)
      } else {
        navigate('/properties')
      }
    } else {
      API.get(`/properties/${id}`)
        .then(res => setProperty(res.data))
        .catch(() => {
          navigate('/properties')
        })
    }

    if (user) {
      API.get('/auth/profile').then(res => {
        const savedList = res.data.savedProperties || []
        setSaved(savedList.some(p => {
          if (!p) return false
          const pId = p._id || p
          return pId.toString() === id.toString()
        }))
      }).catch(() => {})
    }
  }, [id])

  const handleEnquire = async () => {
    if (!user) { navigate('/login'); return }
    if (!form.name || !form.email || !form.phone) { setError('Please fill all required fields.'); return }
    setLoading(true); setError('')
    setTimeout(() => {
      setSuccess('Your enquiry has been submitted. Our concierge will contact you shortly.')
      setForm({ name:'', email:'', phone:'', message:'' })
      setLoading(false)
    }, 600)
  }

  const toggleSave = async () => {
    if (!user) { navigate('/login'); return }
    try {
      await API.post(`/auth/save/${id}`)
      setSaved(!saved)
    } catch (err) {
      console.error('Toggle save failed:', err)
    }
  }

  const fmtPrice = (p, lt) => {
    if (!p) return '—'
    if (lt === 'rent') return `₹${(p/1000).toFixed(0)}K/mo`
    if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Cr`
    if (p >= 100000) return `₹${(p/100000).toFixed(1)} L`
    return `₹${p.toLocaleString()}`
  }

  if (!property) return <LoadingPage>Loading residence…</LoadingPage>

  const images = property.images?.length ? property.images : [null, null, null]

  return (
    <>
      <Page>
        {/* ✅ FIX 1: navigate(-1) goes back linearly through browser history */}
        <BackBtn onClick={() => navigate(-1)}>← Back</BackBtn>

        <Layout>
          <Left>
            <Gallery>
              <MainImg src={resolveImg(images[activeImg])}>{!images[activeImg] && '🏛️'}</MainImg>
              <Thumbs>
                {images.slice(0, 3).map((img, i) => (
                  <Thumb key={i} src={resolveImg(img)} active={activeImg === i} onClick={() => setActiveImg(i)}>
                    {!img && '🏛️'}
                  </Thumb>
                ))}
              </Thumbs>
            </Gallery>

            <InfoCard>
              <StatusBadge type={property.listingType}>
                {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
              </StatusBadge>
              <Title>{property.title}</Title>
              <Price>{fmtPrice(property.price, property.listingType)}</Price>
              <Location>◆ {property.address}, {property.city}</Location>
              <ChipRow>
                {property.bhk && <Chip>{property.bhk} BHK</Chip>}
                <Chip>{property.type}</Chip>
                {property.area && <Chip>{property.area} sq.ft</Chip>}
                <Chip style={{ borderColor: property.status === 'available' ? 'rgba(74,222,128,0.3)' : 'rgba(224,82,82,0.3)', color: property.status === 'available' ? '#4ade80' : '#e05252' }}>
                  {property.status}
                </Chip>
              </ChipRow>
            </InfoCard>

            <TabCard>
              <Tabs>
                {['overview','amenities','location'].map(t => (
                  <Tab key={t} active={activeTab === t} onClick={() => setActiveTab(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Tab>
                ))}
              </Tabs>
              <TabContent>
                {activeTab === 'overview' && <p>{property.description || 'No description provided.'}</p>}
                {activeTab === 'amenities' && (
                  <AmenityWrap>
                    {property.amenities?.length
                      ? property.amenities.map((a, i) => <AmenityTag key={i}>{a}</AmenityTag>)
                      : <p style={{ color: C.muted }}>No amenities listed.</p>}
                  </AmenityWrap>
                )}
                {activeTab === 'location' && (
                  <div>
                    <p style={{ marginBottom: '0.5rem' }}>◆ {property.address}</p>
                    <p style={{ color: C.muted }}>City: {property.city}</p>

                    {property.latitude && property.longitude ? (
                      <>
                        <MapContainer>
                          <MapIframe
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01},${property.latitude - 0.008},${property.longitude + 0.01},${property.latitude + 0.008}&layer=mapnik&marker=${property.latitude},${property.longitude}`}
                            title="Property Location"
                            loading="lazy"
                            allowFullScreen
                          />
                        </MapContainer>
                        <MapMeta>
                          <CoordBadge>
                            📍 <span>{Number(property.latitude).toFixed(6)}, {Number(property.longitude).toFixed(6)}</span>
                          </CoordBadge>
                          <DirectionsBtn
                            href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Get Directions →
                          </DirectionsBtn>
                        </MapMeta>
                      </>
                    ) : (
                      <NoMapMsg>
                        📍 Exact map location not provided by the owner.
                      </NoMapMsg>
                    )}
                  </div>
                )}
              </TabContent>
            </TabCard>
          </Left>

          <Right>
            <EnquiryCard>
              <EnquiryEyebrow>Private Enquiry</EnquiryEyebrow>
              <EnquiryTitle>Request More Information</EnquiryTitle>
              {success && <SuccessMsg>{success}</SuccessMsg>}
              {error && <ErrMsg>{error}</ErrMsg>}
              <Input placeholder="Your Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <Textarea placeholder="Your message (optional)" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              <SubmitBtn onClick={handleEnquire} disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Enquiry'}
              </SubmitBtn>
              <SaveBtn onClick={toggleSave}>
                {saved ? '♥  Saved to Wishlist' : '♡  Save to Wishlist'}
              </SaveBtn>
              <Divider />
              <OwnerCard>
                {property.owner?.profileImage ? (
                  <OwnerAvatarImg src={resolveImg(property.owner.profileImage)} alt={property.owner.name} />
                ) : (
                  <OwnerAvatar>{property.owner?.name?.charAt(0) || 'V'}</OwnerAvatar>
                )}
                <div>
                  <OwnerName>{property.owner?.name || 'Verified Owner'}</OwnerName>
                  <OwnerRole>Verified Owner · PropFlow Elite</OwnerRole>
                </div>
              </OwnerCard>
            </EnquiryCard>
          </Right>
        </Layout>
      </Page>
    </>
  )
}

export default PropertyDetail