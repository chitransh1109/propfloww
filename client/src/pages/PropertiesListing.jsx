import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

const fadeUp = keyframes`from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); }`

const C = {
  obsidian: '#0a0a0b', ink: '#111114', surface: '#16161a', card: '#1c1c22',
  border: 'rgba(212,175,55,0.15)', borderSubtle: 'rgba(255,255,255,0.07)',
  gold: '#d4af37', goldLight: '#f0d060', muted: '#7a7a8a', mutedLight: '#a0a0b0', white: '#ffffff',
}

const Main = styled.div`
  animation: ${fadeUp} 0.5s ease both;
`

// ── HORIZONTAL FILTER BAR ─────────────────────────────────
const TopBarContainer = styled.div`
  position: relative;
  margin-bottom: 2.5rem;
`

const ActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`

const FilterToggleBtn = styled.button`
  padding: 0.65rem 1.5rem;
  background: ${p => p.$active ? 'rgba(212,175,55,0.12)' : 'transparent'};
  border: 1px solid ${p => p.$active ? C.gold : 'rgba(255, 255, 255, 0.15)'};
  color: ${p => p.$active ? C.gold : C.white};
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    border-color: ${C.gold};
    color: ${C.gold};
    background: rgba(212,175,55,0.08);
  }
`

const FilterDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 150;
  width: 380px;
  background: rgba(13, 13, 16, 0.92);
  border: 1px solid rgba(212, 175, 55, 0.15);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  border-radius: 12px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 0.5rem;
  animation: dropdownScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;

  @keyframes dropdownScale {
    from { opacity: 0; transform: translateY(-10px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${C.borderSubtle};
  margin-bottom: 0.25rem;
`

const DropdownTitle = styled.h4`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem;
  font-weight: 500;
  color: ${C.gold};
  margin: 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

const CloseIconBtn = styled.button`
  background: transparent;
  border: none;
  color: ${C.muted};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem;
  line-height: 1;
  transition: color 0.2s;
  &:hover {
    color: ${C.gold};
  }
`

const DropdownFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.25rem;
  border-top: 1px solid ${C.borderSubtle};
  margin-top: 0.25rem;
`

const FilterItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
  min-width: 150px;
`

const FilterLabel = styled.div`
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${C.gold};
`

const SearchInput = styled.input`
  width: 100%; 
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.02); 
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: ${C.white}; 
  font-size: 0.85rem; 
  outline: none;
  font-family: 'Inter', sans-serif; 
  transition: all 0.25s ease;
  border-radius: 8px;
  &::placeholder { color: ${C.muted}; }
  &:focus { 
    border-color: ${C.gold}; 
    background: rgba(212, 175, 55, 0.03);
    box-shadow: 0 0 12px rgba(212, 175, 55, 0.1);
  }
`

const Select = styled.select`
  width: 100%; 
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.02); 
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: ${C.white}; 
  font-size: 0.85rem; 
  outline: none;
  font-family: 'Inter', sans-serif; 
  cursor: pointer; 
  transition: all 0.25s ease;
  border-radius: 8px;
  option { background: ${C.ink}; color: ${C.white}; }
  &:focus { 
    border-color: ${C.gold}; 
    background: rgba(212, 175, 55, 0.03);
    box-shadow: 0 0 12px rgba(212, 175, 55, 0.1);
  }
`

const PriceRow = styled.div`
  display: flex; gap: 0.75rem; align-items: center;
`

const PriceInput = styled(SearchInput)`
  text-align: left;
`

const PriceSep = styled.span`
  color: ${C.muted}; font-size: 0.8rem;
`

const ToggleRow = styled.div`
  display: flex; gap: 6px; flex-wrap: wrap;
`

const ToggleBtn = styled.button`
  padding: 0.5rem 0.85rem; 
  border: 1px solid ${p => p.$active ? C.gold : 'rgba(255, 255, 255, 0.08)'};
  font-size: 0.68rem; 
  font-weight: 500; 
  letter-spacing: 0.08em; 
  text-transform: uppercase;
  cursor: pointer; 
  transition: all 0.25s ease;
  border-radius: 6px;
  background: ${p => p.$active ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.02)'};
  color: ${p => p.$active ? C.gold : C.muted};
  &:hover { 
    border-color: ${C.gold}; 
    color: ${C.gold};
    background: rgba(212, 175, 55, 0.08);
  }
`

const ClearBtn = styled.button`
  background: transparent; 
  border: 1px solid rgba(224, 82, 82, 0.4);
  color: #e05252; 
  padding: 0.5rem 1.2rem;
  font-size: 0.68rem; 
  font-weight: 500; 
  letter-spacing: 0.08em; 
  text-transform: uppercase;
  cursor: pointer; 
  transition: all 0.2s;
  border-radius: 6px;
  &:hover { 
    background: rgba(224, 82, 82, 0.08); 
    border-color: #e05252; 
  }
`

// ── CUSTOM SORT DROPDOWN ──────────────────────────────────
const SortContainer = styled.div`
  position: relative;
`

const SortToggleBtn = styled.button`
  padding: 0.65rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: ${C.white};
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    border-color: ${C.gold};
    color: ${C.gold};
    background: rgba(212, 175, 55, 0.08);
  }
`

const SortDropdownList = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 160;
  min-width: 200px;
  background: rgba(13, 13, 16, 0.95);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px);
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  animation: dropdownScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
`

const SortOption = styled.button`
  background: transparent;
  border: none;
  color: ${p => p.$active ? C.gold : C.muted};
  padding: 0.75rem 1.5rem;
  font-size: 0.72rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  &:hover {
    background: rgba(212, 175, 55, 0.08);
    color: ${C.white};
  }
`

// ── CATALOG TOP BAR ───────────────────────────────────────
const TopBar = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;
  padding-bottom: 1.5rem; border-bottom: 1px solid rgba(212, 175, 55, 0.08);
`

const ResultMeta = styled.div``

const ResultCount = styled.div`
  font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300; color: ${C.white};
  span { color: ${C.gold}; font-style: italic; }
`

const ResultSub = styled.div`
  font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${C.muted}; margin-top: 0.25rem;
`

// ── PROPERTIES GRID ───────────────────────────────────────
const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 1.5rem;
`

const Card = styled.div`
  background: ${C.card}; cursor: pointer; position: relative; overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.03);
  &:hover { 
    transform: translateY(-6px); 
    box-shadow: 0 30px 60px rgba(0,0,0,0.65), 0 0 20px rgba(212,175,55,0.08); 
    border-color: rgba(212, 175, 55, 0.25);
  }
  &:hover .card-img { transform: scale(1.04); }
`

const CardImgWrap = styled.div`height: 220px; overflow: hidden; position: relative;`

const CardImg = styled.img`
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`

const CardImgFallback = styled.div`
  width: 100%; height: 100%;
  background: ${C.surface};
  display: flex; align-items: center; justify-content: center; font-size: 3rem;
`

const CardOverlay = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(10,10,11,0.85) 0%, transparent 60%);
`

const CardBadge = styled.span`
  position: absolute; top: 14px; left: 14px;
  padding: 0.25rem 0.75rem; font-size: 0.6rem;
  letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;
  border: 1px solid ${p => p.$type === 'rent' ? 'rgba(99,162,255,0.5)' : C.gold};
  color: ${p => p.$type === 'rent' ? '#a0c4ff' : C.gold};
  background: rgba(10,10,11,0.8); backdrop-filter: blur(6px);
`

const HeartBtn = styled.button`
  position: absolute; top: 12px; right: 12px;
  background: rgba(10,10,11,0.6); border: 1px solid ${C.borderSubtle};
  width: 36px; height: 36px; cursor: pointer; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(6px); transition: all 0.25s;
  color: ${p => p.$saved ? '#e05252' : C.white};
  &:hover { border-color: ${C.gold}; background: rgba(212,175,55,0.15); }
`

const CardBody = styled.div`padding: 1.5rem;`

const CardTitle = styled.h3`
  font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 400;
  color: ${C.white}; margin-bottom: 0.35rem; line-height: 1.2;
`

const CardLocation = styled.div`
  font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${C.muted}; margin-bottom: 1.2rem;
`

const ChipRow = styled.div`display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.2rem;`

const Chip = styled.span`
  padding: 0.2rem 0.65rem; font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${C.muted}; border: 1px solid ${C.borderSubtle}; background: rgba(255,255,255,0.01);
`

const CardFooter = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 1rem; border-top: 1px solid ${C.borderSubtle};
`

const Price = styled.div`
  font-family: 'Cormorant Garamond', serif; color: ${C.gold}; font-weight: 500; font-size: 1.35rem;
`

const ViewBtn = styled.button`
  padding: 0.45rem 1.2rem; background: transparent;
  border: 1px solid ${C.gold}; color: ${C.gold};
  font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
  cursor: pointer; transition: all 0.25s;
  &:hover { background: ${C.gold}; color: ${C.obsidian}; }
`

const EmptyState = styled.div`
  grid-column: 1/-1; text-align: center; padding: 6rem 2rem;
  color: ${C.muted}; font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300;
`

const EmptyGold = styled.span`color: ${C.gold}; cursor: pointer; text-decoration: underline; margin-left: 0.5rem;`

// BOGUS DATA
const BOGUS = [
  { _id:'demo_b1', title:'Sky Penthouse, Bandra West', city:'Mumbai', type:'apartment', listingType:'sale', bhk:4, area:4200, price:125000000, images:['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80'] },
  { _id:'demo_b2', title:'The Meridian Residences', city:'Gurugram', type:'apartment', listingType:'sale', bhk:3, area:3100, price:89000000, images:['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80'] },
  { _id:'demo_b3', title:'Palazzo del Lago Villa', city:'Hyderabad', type:'villa', listingType:'rent', bhk:5, area:5800, price:320000, images:['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=80'] },
  { _id:'demo_b4', title:'The Crown, Worli Sea Face', city:'Mumbai', type:'apartment', listingType:'sale', bhk:4, area:3800, price:210000000, images:['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80'] },
  { _id:'demo_b5', title:'Lutyens Bungalow Estate', city:'Delhi', type:'villa', listingType:'sale', bhk:6, area:8500, price:450000000, images:['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700&q=80'] },
  { _id:'demo_b6', title:'Prestige Leela Residences', city:'Bengaluru', type:'apartment', listingType:'rent', bhk:3, area:2600, price:185000, images:['https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=700&q=80'] },
  { _id:'demo_b7', title:'The Oberoi Suites Tower', city:'Pune', type:'apartment', listingType:'sale', bhk:2, area:1800, price:32000000, images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80'] },
  { _id:'demo_b8', title:'Golf Estate Villa', city:'Gurugram', type:'villa', listingType:'sale', bhk:5, area:6200, price:175000000, images:['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&q=80'] },
  { _id:'demo_b9', title:'Altamount Manor', city:'Mumbai', type:'villa', listingType:'rent', bhk:4, area:4800, price:500000, images:['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=80'] },
]

const resolveImg = (url) => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const apiHost = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '')
  return `${apiHost}${url.startsWith('/') ? '' : '/'}${url}`
}

function PropertiesListing() {
  const navigate = useNavigate()
  const auth = useAuth()
  const user = auth?.user ?? null
  const [searchParams] = useSearchParams()
  const [properties, setProperties] = useState(BOGUS)
  const [saved, setSaved] = useState([])
  const [sort, setSort] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)
  
  const filterDropdownRef = useRef(null)
  const sortDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Filter dropdown click outside
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        const toggleBtn = document.getElementById('filter-toggle-btn')
        if (toggleBtn && !toggleBtn.contains(event.target)) {
          setShowFilters(false)
        }
      }
      // Sort dropdown click outside
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        const toggleBtn = document.getElementById('sort-toggle-btn')
        if (toggleBtn && !toggleBtn.contains(event.target)) {
          setShowSort(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: '', 
    bhk: '',
    listingType: searchParams.get('listingType') || '',
    minPrice: '', 
    maxPrice: '',
  })

  useEffect(() => {
    API.get('/properties').then(({ data }) => {
      if (data?.length) {
        setProperties(data)
      } else {
        setProperties(BOGUS)
      }
    }).catch(() => {
      setProperties(BOGUS)
    })
    
    if (user) {
      API.get('/auth/profile').then(res => {
        setSaved(res.data.savedProperties?.map(p => p._id || p) || [])
      }).catch(() => {})
    }
  }, [])

  const toggleSave = async (e, id) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    try {
      await API.post(`/auth/save/${id}`)
      setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    } catch (err) {
      console.error('Toggle save failed:', err)
    }
  }

  const filtered = properties.filter(p => {
    if (filters.city && !p.city?.toLowerCase().includes(filters.city.toLowerCase())) return false
    if (filters.type && p.type !== filters.type) return false
    if (filters.bhk) {
      if (filters.bhk === '4') {
        if (p.bhk < 4) return false
      } else {
        if (String(p.bhk) !== filters.bhk) return false
      }
    }
    if (filters.listingType && p.listingType !== filters.listingType) return false
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'low') return a.price - b.price
    if (sort === 'high') return b.price - a.price
    if (sort === 'new') return new Date(b.createdAt) - new Date(a.createdAt)
    return 0
  })

  const clearFilters = () => setFilters({ city:'', type:'', bhk:'', listingType:'', minPrice:'', maxPrice:'' })

  const fmtPrice = (p, lt) => {
    if (lt === 'rent') return `₹${(p/1000).toFixed(0)}K/mo`
    if (p >= 10000000) return `₹${(p/10000000).toFixed(1)} Cr`
    if (p >= 100000) return `₹${(p/100000).toFixed(1)} L`
    return `₹${p.toLocaleString()}`
  }

  return (
    <Main>
      <TopBarContainer>
        <TopBar>
          <ResultMeta>
            <ResultCount><span>{sorted.length}</span> Residences</ResultCount>
            <ResultSub>Curated luxury collection</ResultSub>
          </ResultMeta>
          <ActionsRow>
            <FilterToggleBtn 
              id="filter-toggle-btn" 
              $active={showFilters} 
              onClick={() => {
                setShowFilters(!showFilters);
                setShowSort(false);
              }}
            >
              Refine Search {showFilters ? '▲' : '▼'}
            </FilterToggleBtn>
            
            <SortContainer ref={sortDropdownRef}>
              <SortToggleBtn 
                id="sort-toggle-btn" 
                onClick={() => {
                  setShowSort(!showSort);
                  setShowFilters(false);
                }}
              >
                {sort === 'low' ? 'Price: Low to High' :
                 sort === 'high' ? 'Price: High to Low' :
                 sort === 'new' ? 'Newest First' : 'Sort: Default'}
                <span style={{ fontSize: '0.55rem', marginLeft: '0.2rem', opacity: 0.8 }}>{showSort ? '▲' : '▼'}</span>
              </SortToggleBtn>
              {showSort && (
                <SortDropdownList>
                  <SortOption $active={sort === ''} onClick={() => { setSort(''); setShowSort(false); }}>
                    Default
                  </SortOption>
                  <SortOption $active={sort === 'low'} onClick={() => { setSort('low'); setShowSort(false); }}>
                    Price: Low to High
                  </SortOption>
                  <SortOption $active={sort === 'high'} onClick={() => { setSort('high'); setShowSort(false); }}>
                    Price: High to Low
                  </SortOption>
                  <SortOption $active={sort === 'new'} onClick={() => { setSort('new'); setShowSort(false); }}>
                    Newest First
                  </SortOption>
                </SortDropdownList>
              )}
            </SortContainer>
          </ActionsRow>
        </TopBar>

        {showFilters && (
          <FilterDropdown ref={filterDropdownRef}>
            <DropdownHeader>
              <DropdownTitle>Refine Search</DropdownTitle>
              <CloseIconBtn onClick={() => setShowFilters(false)}>×</CloseIconBtn>
            </DropdownHeader>

            <FilterItem>
              <FilterLabel>Location</FilterLabel>
              <SearchInput 
                placeholder="e.g. Mumbai, Roorkee" 
                value={filters.city}
                onChange={e => setFilters({ ...filters, city: e.target.value })} 
              />
            </FilterItem>

            <FilterItem>
              <FilterLabel>Listing Type</FilterLabel>
              <ToggleRow>
                {['','sale','rent'].map(v => (
                  <ToggleBtn key={v} $active={filters.listingType === v}
                    onClick={() => setFilters({ ...filters, listingType: v })}>
                    {v === '' ? 'All' : v === 'sale' ? 'Buy' : 'Rent'}
                  </ToggleBtn>
                ))}
              </ToggleRow>
            </FilterItem>

            <FilterItem>
              <FilterLabel>Budget (₹)</FilterLabel>
              <PriceRow>
                <PriceInput placeholder="Min" value={filters.minPrice}
                  onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
                <PriceSep>—</PriceSep>
                <PriceInput placeholder="Max" value={filters.maxPrice}
                  onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
              </PriceRow>
            </FilterItem>

            <FilterItem>
              <FilterLabel>BHK Configurations</FilterLabel>
              <ToggleRow>
                {[
                  { label: 'All', value: '' },
                  { label: '1 BHK', value: '1' },
                  { label: '2 BHK', value: '2' },
                  { label: '3 BHK', value: '3' },
                  { label: '4+ BHK', value: '4' }
                ].map(item => (
                  <ToggleBtn 
                    key={item.value} 
                    $active={filters.bhk === item.value}
                    onClick={() => setFilters({ ...filters, bhk: item.value })}
                  >
                    {item.label}
                  </ToggleBtn>
                ))}
              </ToggleRow>
            </FilterItem>

            <FilterItem>
              <FilterLabel>Property Type</FilterLabel>
              <ToggleRow>
                {[
                  { label: 'All', value: '' },
                  { label: 'Apartment', value: 'apartment' },
                  { label: 'Villa', value: 'villa' },
                  { label: 'Plot', value: 'plot' }
                ].map(item => (
                  <ToggleBtn 
                    key={item.value} 
                    $active={filters.type === item.value}
                    onClick={() => setFilters({ ...filters, type: item.value })}
                  >
                    {item.label}
                  </ToggleBtn>
                ))}
              </ToggleRow>
            </FilterItem>

            <DropdownFooter>
              <ClearBtn onClick={clearFilters}>Clear Filters</ClearBtn>
              <FilterToggleBtn $active={true} onClick={() => setShowFilters(false)} style={{ padding: '0.55rem 1.5rem' }}>
                Apply Filters
              </FilterToggleBtn>
            </DropdownFooter>
          </FilterDropdown>
        )}
      </TopBarContainer>

      <Grid>
        {sorted.length === 0 && (
          <EmptyState>
            No residences match your criteria.
            <EmptyGold onClick={clearFilters}>Clear filters →</EmptyGold>
          </EmptyState>
        )}
        {sorted.map(p => (
          <Card key={p._id} onClick={() => navigate(`/properties/${p._id}`)}>
            <CardImgWrap>
              {resolveImg(p.images?.[0]) ? (
                <CardImg className="card-img" src={resolveImg(p.images[0])} alt={p.title} loading="lazy" />
              ) : (
                <CardImgFallback className="card-img">🏛️</CardImgFallback>
              )}
              <CardOverlay />
              <CardBadge $type={p.listingType}>
                {p.listingType === 'rent' ? 'For Rent' : 'For Sale'}
              </CardBadge>
              <HeartBtn $saved={saved.includes(p._id)} onClick={e => toggleSave(e, p._id)}>
                {saved.includes(p._id) ? '♥' : '♡'}
              </HeartBtn>
            </CardImgWrap>
            <CardBody>
              <CardTitle>{p.title}</CardTitle>
              <CardLocation>◆ {p.city}</CardLocation>
              <ChipRow>
                {p.bhk && <Chip>{p.bhk} BHK</Chip>}
                <Chip>{p.type}</Chip>
                {p.area && <Chip>{p.area} sq.ft</Chip>}
              </ChipRow>
              <CardFooter>
                <Price>{fmtPrice(p.price, p.listingType)}</Price>
                <ViewBtn onClick={() => navigate(`/properties/${p._id}`)}>View</ViewBtn>
              </CardFooter>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Main>
  )
}

export default PropertiesListing