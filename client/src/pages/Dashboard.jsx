import React, { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'

import API from '../api/axios'
import { useAuth } from '../context/AuthContext'





const fadeUp = keyframes`from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}`

const C = {
  obsidian:'#0a0a0b', ink:'#111114', surface:'#16161a', card:'#1c1c22',
  border:'rgba(212,175,55,0.15)', borderSubtle:'rgba(255,255,255,0.07)',
  gold:'#d4af37', goldLight:'#f0d060', muted:'#7a7a8a', mutedLight:'#a0a0b0', white:'#ffffff',
  success:'#4ade80', successBg:'rgba(74,222,128,0.08)',
}

const Page = styled.div`
  animation:${fadeUp} 0.5s ease both;
  color: ${C.white};
  font-family: 'Inter', sans-serif;
`

// ── HERO SEARCH BLOCK ────────────────────────────────────
const HeroSection = styled.div`
  background: linear-gradient(135deg, ${C.surface} 0%, ${C.ink} 100%);
  border: 1px solid ${C.border};
  padding: 3.5rem 3rem;
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  &::after {
    content: ''; position: absolute; top: -50%; right: -20%; width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%);
    pointer-events: none;
  }
`
const GreetingEyebrow = styled.div`
  font-size:0.68rem; letter-spacing:0.25em; text-transform:uppercase;
  color:${C.gold}; margin-bottom:0.5rem; font-weight: 500;
`
const GreetingTitle = styled.h1`
  font-family:'Cormorant Garamond',serif; font-size:2.8rem; font-weight:300;
  color:${C.white}; margin:0 0 0.5rem; line-height:1.1;
  span { font-style: italic; color: ${C.gold}; }
`
const GreetingSub = styled.p`
  color:${C.muted}; font-size:0.9rem; margin:0; font-weight: 300;
`
const SearchContainer = styled.div`
  display: flex; background: ${C.card}; border: 1px solid ${C.borderSubtle};
  padding: 4px; max-width: 600px; width: 100%; transition: all 0.25s;
  margin-top: 1rem;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  &:focus-within { border-color: ${C.gold}; box-shadow: 0 0 10px rgba(212,175,55,0.1); }
`
const SearchInput = styled.input`
  flex: 1; background: transparent; border: none; outline: none;
  color: ${C.white}; padding: 0.85rem 1.2rem; font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  &::placeholder { color: ${C.muted}; }
`
const SearchBtn = styled.button`
  background: ${C.gold}; color: ${C.obsidian}; border: none;
  padding: 0 2rem; font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;
  transition: all 0.25s;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  &:hover { background: ${C.goldLight}; }
`

const HeaderRight = styled.div`
  display: flex; justify-content: space-between; align-items: center;
`
const ListPropertyBtn = styled.button`
  padding:0.75rem 1.8rem; background:${C.gold};
  border:none; color:${C.obsidian};
  font-size:0.72rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase;
  cursor:pointer; transition:all 0.3s;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  &:hover { background:${C.goldLight}; transform:translateY(-2px); box-shadow:0 8px 30px rgba(212,175,55,0.3); }
`

const borderPulse = keyframes`
  0%, 100% { border-color: rgba(212,175,55,0.12); box-shadow: none; }
  50% { border-color: ${C.gold}; box-shadow: 0 0 12px rgba(212,175,55,0.15); }
`

// ── STATS ROW ───────────────────────────────────────────
const StatsRow = styled.div`
  display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; margin-bottom:3rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
`
const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(28,28,34,0.6) 0%, rgba(17,17,20,0.85) 100%);
  border: 1px solid rgba(212,175,55,0.12);
  padding: 2rem 2.2rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); position: relative;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  animation: ${borderPulse} 5s infinite ease-in-out;
  &:hover {
    border-color: ${C.gold};
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.4);
  }
  &::before {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
    background: linear-gradient(90deg, transparent, ${C.gold}, transparent);
    opacity: 0.7;
  }
`
const StatNum = styled.div`
  font-family:'Cormorant Garamond',serif; font-size:2.8rem; font-weight:300;
  color:${C.white}; line-height:1; span { color:${C.gold}; font-style: italic; }
`
const StatLabel = styled.div`
  font-size:0.65rem; letter-spacing:0.18em; text-transform:uppercase; color:${C.muted}; margin-top:0.4rem;
`

// ── TABS ────────────────────────────────────────────────
const Tabs = styled.div`display:flex; border-bottom:1px solid ${C.border}; margin-bottom:2rem; overflow-x: auto;`
const Tab = styled.button`
  padding:0.75rem 1.5rem; background:none; border:none; cursor:pointer;
  font-size:0.68rem; font-weight:500; letter-spacing:0.2em; text-transform:uppercase;
  color:${p => p.$active ? C.white : C.muted};
  border-bottom:2px solid ${p => p.$active ? C.gold : 'transparent'};
  margin-bottom:-1px; transition:all 0.25s;
  white-space: nowrap;
  text-shadow: ${p => p.$active ? '0 0 8px rgba(255,255,255,0.2)' : 'none'};
  &:hover { color:${C.white}; }
`

// ── GRIDS & CARDS ───────────────────────────────────────
const Grid = styled.div`display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.5rem;`
const Card = styled.div`
  background:${C.card}; border:1px solid ${C.borderSubtle}; overflow:hidden; transition:all 0.3s;
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  &:hover { border-color:${C.border}; transform:translateY(-3px); box-shadow:0 20px 50px rgba(0,0,0,0.4); }
`
const CardImg = styled.div`
  height:180px; overflow:hidden; cursor:pointer;
  background:${C.surface}; background-image: url(${p => p.src}); background-size: cover; background-position: center;
  display:flex; align-items:center; justify-content:center; font-size:2rem;
  transition:transform 0.4s; position:relative;
  ${Card}:hover & { transform:scale(1.02); }
`
const CardBadge = styled.span`
  position:absolute; top:12px; left:12px;
  background:rgba(10,10,11,0.85); border:1px solid ${C.border};
  padding:0.2rem 0.6rem; font-size:0.58rem; letter-spacing:0.1em; text-transform:uppercase;
  color:${C.gold}; backdrop-filter:blur(4px);
`
const CardBody = styled.div`padding:1.2rem 1.5rem;`
const CardTitle = styled.h3`
  font-family:'Cormorant Garamond',serif; font-size:1.15rem; font-weight:400;
  color:${C.white}; margin: 0 0 0.3rem;
`
const CardLocation = styled.div`
  font-size:0.68rem; letter-spacing:0.08em; text-transform:uppercase; color:${C.muted};
`
const CardPrice = styled.div`
  font-family:'Cormorant Garamond',serif; color:${C.gold}; font-size:1.25rem; margin-top: 0.5rem;
`
const CardFooter = styled.div`
  display:flex; justify-content:space-between; align-items:center;
  margin-top: 1rem; padding-top:0.75rem; border-top:1px solid ${C.borderSubtle};
`
const ViewBtn = styled.button`
  padding:0.4rem 1rem; background:transparent; border:1px solid ${C.borderSubtle};
  color:${C.muted}; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase;
  cursor:pointer; transition:all 0.2s;
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
  &:hover { border-color:${C.gold}; color:${C.gold}; }
`
const RemoveBtn = styled(ViewBtn)`
  &:hover { border-color:#e05252; color:#e05252; }
`
const SectionHeading = styled.h2`
  font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 300;
  color:${C.white}; margin: 0 0 1.5rem;
  span { color: ${C.gold}; font-style: italic; }
`

// ── MY LISTINGS STYLE ───────────────────────────────────
const PCard = styled(Card)``
const PCardImg = styled(CardImg)``
const PCardImgTag = styled.img`
  width:100%; height:100%; object-fit:cover; object-position:center;
  position:absolute; inset:0; display:block;
`
const PCardBody = styled(CardBody)``
const PCardTitle = styled(CardTitle)``
const PCardMeta = styled.div`
  font-size:0.68rem; letter-spacing:0.1em; text-transform:uppercase;
  color:${C.muted}; margin-bottom:0.75rem;
`
const PCardFooter = styled.div`
  display:flex; justify-content:space-between; align-items:center;
  padding-top:0.75rem; border-top:1px solid ${C.borderSubtle};
`
const PCardPrice = styled(CardPrice)`margin-top:0;`
const PCardStatus = styled.span`
  padding:0.18rem 0.7rem; font-size:0.6rem; letter-spacing:0.15em; text-transform:uppercase;
  border:1px solid;
  border-color:${p => p.s === 'available' ? 'rgba(74,222,128,0.4)' : 'rgba(212,175,55,0.4)'};
  color:${p => p.s === 'available' ? '#4ade80' : C.gold};
`
const LeadsBadge = styled.div`
  font-size:0.68rem; color:${C.muted}; margin-top: 0.2rem;
  span { color:${C.gold}; font-weight:500; }
`
const PCardActions = styled.div`
  display:flex; gap:0.5rem; margin-top:0.75rem;
`
const ActionBtn = styled.button`
  flex:1; padding:0.45rem; background:transparent;
  border:1px solid ${C.borderSubtle}; color:${C.muted};
  font-size:0.62rem; letter-spacing:0.12em; text-transform:uppercase;
  cursor:pointer; transition:all 0.2s;
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
  &:hover { border-color:${C.gold}; color:${C.gold}; }
`
const DeleteBtn = styled(ActionBtn)`
  &:hover { border-color:#e05252; color:#e05252; }
`

// ── TABLES ──────────────────────────────────────────────
const Table = styled.table`
  width:100%; border-collapse:collapse; background:rgba(28,28,34,0.3); border:1px solid ${C.border};
  box-shadow: 0 15px 35px rgba(0,0,0,0.3);
  @media (max-width: 768px) { display: block; overflow-x: auto; }
  tbody tr {
    transition: background 0.25s ease;
    &:hover {
      background: rgba(212, 175, 55, 0.02);
    }
  }
`
const Th = styled.th`
  padding:1.1rem 1.5rem; text-align:left;
  font-size:0.62rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase;
  color:${C.gold}; background:#0c0c0e; border-bottom:1px solid ${C.border};
`
const Td = styled.td`
  padding:1.1rem 1.5rem; font-size:0.85rem; color:${C.mutedLight};
  border-bottom:1px solid ${C.borderSubtle};
`

const StatusSelect = styled.select`
  background: ${C.surface}; border: 1px solid ${C.borderSubtle}; color: ${C.white};
  padding: 0.2rem 0.4rem; font-size: 0.7rem; outline: none; cursor: pointer;
  &:focus { border-color: ${C.gold}; }
`
const Empty = styled.div`
  text-align:center; padding:5rem 2rem;
  font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:300; color:${C.muted};
`
const EmptyLink = styled.span`
  color: ${C.gold}; cursor: pointer; text-decoration: underline; margin-left: 0.5rem;
  &:hover { color: ${C.goldLight}; }
`

// ── LEAD DETAIL POPUP ────────────────────────────────────
const LeadPopupOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75);
  z-index: 250; display: flex; align-items: center; justify-content: center;
  padding: 2rem; backdrop-filter: blur(8px);
  animation: fadeIn 0.2s ease both;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`
const LeadPopupCard = styled.div`
  background: rgba(22, 22, 26, 0.97);
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.06);
  backdrop-filter: blur(40px);
  width: 100%; max-width: 520px;
  padding: 2.5rem; position: relative;
  animation: popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.95) translateY(12px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`
const LeadPopupClose = styled.button`
  position: absolute; top: 1.25rem; right: 1.25rem;
  background: transparent; border: none; color: ${C.muted};
  font-size: 1.4rem; cursor: pointer; line-height: 1;
  transition: color 0.2s;
  &:hover { color: ${C.gold}; }
`
const LeadPopupEyebrow = styled.div`
  font-size: 0.6rem; font-weight: 600; letter-spacing: 0.25em;
  text-transform: uppercase; color: ${C.gold}; margin-bottom: 0.75rem;
`
const LeadPopupTitle = styled.h3`
  font-family: 'Cormorant Garamond', serif; font-size: 1.6rem;
  font-weight: 400; color: ${C.white}; margin: 0 0 0.3rem; line-height: 1.2;
`
const LeadPopupPropName = styled.div`
  font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: ${C.muted}; margin-bottom: 2rem; padding-bottom: 1.25rem;
  border-bottom: 1px solid ${C.borderSubtle};
`
const LeadDetailGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 2rem;
  margin-bottom: 2rem;
`
const LeadDetailItem = styled.div`
  &.full-width { grid-column: 1 / -1; }
`
const LeadDetailLabel = styled.div`
  font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em;
  text-transform: uppercase; color: ${C.gold}; margin-bottom: 0.4rem;
`
const LeadDetailValue = styled.div`
  font-size: 0.92rem; color: ${C.white}; line-height: 1.55;
  word-break: break-word;
`
const LeadPopupFooter = styled.div`
  display: flex; justify-content: flex-end; align-items: center;
  padding-top: 1.5rem; border-top: 1px solid ${C.borderSubtle}; gap: 0.75rem;
`
const LeadPopupBtn = styled.button`
  padding: 0.65rem 1.8rem; background: ${C.gold}; border: none;
  color: ${C.obsidian}; font-size: 0.68rem; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; transition: all 0.25s;
  &:hover { background: ${C.goldLight}; transform: translateY(-1px); }
`
const LeadPopupSecBtn = styled.button`
  padding: 0.65rem 1.5rem; background: transparent;
  border: 1px solid ${C.borderSubtle}; color: ${C.muted};
  font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
  text-transform: uppercase; cursor: pointer; transition: all 0.2s;
  &:hover { border-color: ${C.gold}; color: ${C.gold}; }
`

// ── MODAL ──
const ModalOverlay = styled.div`
  position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:200;
  display:flex; align-items:center; justify-content:center; padding:2rem;
  backdrop-filter:blur(6px);
`
const Modal = styled.div`
  background:${C.surface}; border:1px solid ${C.border};
  width:100%; max-width:640px; max-height:90vh; overflow-y:auto;
  padding:2.5rem;
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  &::-webkit-scrollbar { width:3px; }
  &::-webkit-scrollbar-thumb { background:${C.border}; }
`
const ConfirmCard = styled.div`
  background:${C.surface}; border:1px solid ${C.border};
  width:100%; max-width:400px; padding:2.5rem; text-align:center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.8);
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
`
const ModalTitle = styled.h2`
  font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:300;
  color:${C.white}; margin-bottom:0.25rem;
`
const ModalSub = styled.p`color:${C.muted}; font-size:0.82rem; margin-bottom:2rem;`
const FormGrid = styled.div`display:grid; grid-template-columns:1fr 1fr; gap:1rem;`
const FormGroup = styled.div`margin-bottom:1rem; ${p => p.full ? 'grid-column:1/-1;' : ''}`
const Label = styled.label`
  display:block; font-size:0.65rem; font-weight:500; letter-spacing:0.18em; text-transform:uppercase;
  color:${C.muted}; margin-bottom:0.45rem;
`
const Input = styled.input`
  width:100%; padding:0.85rem 1rem; background:rgba(255, 255, 255, 0.02); border:1px solid rgba(255, 255, 255, 0.06);
  color:${C.white}; font-size:0.88rem; outline:none; font-family:'Inter',sans-serif;
  transition:all 0.25s; box-sizing:border-box; border-radius:4px;
  &::placeholder { color:${C.muted}; }
  &:focus { border-color:${C.gold}; background:rgba(212,175,55,0.03); }
`
const Select = styled.select`
  width:100%; padding:0.85rem 1rem; background:rgba(255, 255, 255, 0.02); border:1px solid rgba(255, 255, 255, 0.06);
  color:${C.white}; font-size:0.88rem; outline:none; font-family:'Inter',sans-serif; cursor:pointer;
  transition:all 0.25s; border-radius:4px;
  option { background: ${C.ink}; color: ${C.white}; }
  &:focus { border-color:${C.gold}; background:rgba(212,175,55,0.03); }
`
const Textarea = styled.textarea`
  width:100%; padding:0.85rem 1rem; background:rgba(255, 255, 255, 0.02); border:1px solid rgba(255, 255, 255, 0.06);
  color:${C.white}; font-size:0.88rem; outline:none; resize:vertical; min-height:80px;
  font-family:'Inter',sans-serif; box-sizing:border-box; transition:all 0.25s; border-radius:4px;
  &::placeholder { color:${C.muted}; }
  &:focus { border-color:${C.gold}; background:rgba(212,175,55,0.03); }
`
const ModalBtns = styled.div`display:flex; gap:1rem; margin-top:1.5rem;`
const SaveBtn = styled.button`
  flex:1; padding:0.9rem; background:${C.gold}; border:none;
  color:${C.obsidian}; font-size:0.75rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase;
  cursor:pointer; transition:all 0.3s;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  &:hover { background:${C.goldLight}; }
  &:disabled { opacity:0.5; cursor:not-allowed; }
`
const CancelBtn = styled.button`
  flex:1; padding:0.9rem; background:transparent; border:1px solid ${C.borderSubtle};
  color:${C.muted}; font-size:0.75rem; letter-spacing:0.15em; text-transform:uppercase;
  cursor:pointer; transition:all 0.2s;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  &:hover { border-color:${C.gold}; color:${C.gold}; }
`
const ErrMsg = styled.div`
  color:#e05252; background:rgba(224,82,82,0.08); border:1px solid rgba(224,82,82,0.2);
  padding:0.7rem 1rem; font-size:0.82rem; margin-bottom:1rem;
`

// Image upload
const ImageUploadArea = styled.div`
  width:100%; border:2px dashed ${p => p.$dragover ? C.gold : C.borderSubtle};
  background:${p => p.$dragover ? 'rgba(212,175,55,0.05)' : C.card};
  padding:1.5rem; cursor:pointer; transition:all 0.2s; box-sizing:border-box;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem;
  &:hover { border-color:${C.gold}; background:rgba(212,175,55,0.03); }
`
const UploadIcon = styled.div`font-size:1.8rem;`
const UploadText = styled.div`
  font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; color:${C.muted};
  text-align:center;
  span { color:${C.gold}; }
`
const UploadSub = styled.div`font-size:0.68rem; color:${C.muted}; opacity:0.7;`
const ImagePreviewGrid = styled.div`
  display:grid; grid-template-columns:repeat(4, 1fr); gap:0.5rem; margin-top:0.75rem;
`
const ImagePreviewItem = styled.div`
  position:relative; aspect-ratio:1; overflow:hidden; background:${C.surface};
`
const PreviewImg = styled.img`
  width:100%; height:100%; object-fit:cover;
`
const RemoveImgBtn = styled.button`
  position:absolute; top:4px; right:4px;
  background:rgba(0,0,0,0.7); border:none; color:#e05252;
  width:20px; height:20px; cursor:pointer; font-size:0.75rem;
  display:flex; align-items:center; justify-content:center;
  border-radius:50%; transition:all 0.2s;
  &:hover { background:#e05252; color:white; }
`
const UploadProgress = styled.div`
  font-size:0.72rem; color:${C.gold}; letter-spacing:0.08em; margin-top:0.5rem; text-align:center;
`

const resolveImg = (url) => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const apiHost = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '')
  return `${apiHost}${url.startsWith('/') ? '' : '/'}${url}`
}

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  // Tabs: 'explore', 'listings'
  const [tab, setTab] = useState('listings')
  
  // Buyer states
  const [savedProps, setSavedProps] = useState([])
  const [recommended, setRecommended] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  // Seller states
  const [properties, setProperties] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [editId, setEditId] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploadingCount, setUploadingCount] = useState(0)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  const [form, setForm] = useState({
    title:'', city:'', address:'', type:'apartment', listingType:'sale',
    bhk:'', area:'', price:'', description:'', amenities:'',
    mapLink:'', latitude:'', longitude:'',
  })

  // Extract lat/lng from a Google Maps link
  const parseMapLink = (link) => {
    if (!link) return null
    // Pattern: @lat,lng or ?q=lat,lng or /place/lat,lng
    const atMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (atMatch) return { lat: atMatch[1], lng: atMatch[2] }
    const qMatch = link.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (qMatch) return { lat: qMatch[1], lng: qMatch[2] }
    const placeMatch = link.match(/\/(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (placeMatch) return { lat: placeMatch[1], lng: placeMatch[2] }
    return null
  }

  const handleMapLinkChange = (link) => {
    setForm(p => ({ ...p, mapLink: link }))
    const coords = parseMapLink(link)
    if (coords) {
      setForm(p => ({ ...p, mapLink: link, latitude: coords.lat, longitude: coords.lng }))
    }
  }

  // Fetch all dashboard data
  useEffect(() => {
    // 1. Fetch wishlist
    API.get('/auth/profile').then(({ data }) => {
      if (data.savedProperties?.length) setSavedProps(data.savedProperties)
    }).catch(() => {})

    // 3. Fetch recommended properties (all properties)
    API.get('/properties').then(({ data }) => {
      if (data?.length) setRecommended(data.slice(0, 3))
    }).catch(() => {})

    // 4. Fetch user's own properties listed
    API.get('/properties/my').then(({ data }) => {
      setProperties(Array.isArray(data) ? data : [])
    }).catch((err) => {
      console.error('Failed to load your properties:', err)
      setProperties([])
    })
  }, [])

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Wishlist actions
  const unsave = async (id) => {
    try { await API.post(`/auth/save/${id}`) } catch (err) { console.error('Unsave failed:', err) }
    setSavedProps(prev => prev.filter(p => (p._id || p) !== id))
  }

  // Search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/properties?city=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/properties')
    }
  }

  // Listing actions
  const uploadFile = async (file) => {
    const fd = new FormData()
    fd.append('image', file)
    const { data } = await API.post('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data.url
  }

  const handleFiles = async (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!valid.length) return
    if (uploadedImages.length + valid.length > 8) {
      setFormError('Maximum 8 images allowed.')
      return
    }
    setFormError('')

    const previews = valid.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      url: null,
      uploading: true,
    }))
    setUploadedImages(prev => [...prev, ...previews])
    setUploadingCount(valid.length)

    const results = await Promise.allSettled(valid.map(uploadFile))

    setUploadedImages(prev => {
      const updated = [...prev]
      let idx = updated.length - valid.length
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          updated[idx + i] = { ...updated[idx + i], url: result.value, uploading: false }
        } else {
          updated[idx + i] = { ...updated[idx + i], uploading: false, failed: true }
        }
      })
      return updated
    })
    setUploadingCount(0)
  }

  const removeImage = (index) => {
    setUploadedImages(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const editProperty = (p) => {
    setEditId(p._id)
    setForm({
      title: p.title || '',
      city: p.city || '',
      address: p.address || '',
      type: p.type || 'apartment',
      listingType: p.listingType || 'sale',
      bhk: p.bhk || '',
      area: p.area || '',
      price: p.price || '',
      description: p.description || '',
      amenities: p.amenities ? p.amenities.join(', ') : '',
      mapLink: (p.latitude && p.longitude) ? `https://www.google.com/maps?q=${p.latitude},${p.longitude}` : '',
      latitude: p.latitude || '',
      longitude: p.longitude || '',
    })
    if (p.images?.length) {
      setUploadedImages(p.images.map(imgUrl => ({
        file: null,
        preview: resolveImg(imgUrl),
        url: imgUrl,
        uploading: false,
      })))
    } else {
      setUploadedImages([])
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.city || !form.price) { setFormError('Title, city and price are required.'); return }
    if (uploadingCount > 0) { setFormError('Please wait for images to finish uploading.'); return }

    setSaving(true); setFormError('')
    try {
      const imageUrls = uploadedImages
        .filter(img => img.url && !img.failed)
        .map(img => img.url)

      const { mapLink, ...formData } = form
      const payload = {
        ...formData,
        price: Number(form.price),
        bhk: Number(form.bhk),
        area: Number(form.area),
        amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
        images: imageUrls,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      }

      if (editId) {
        const { data } = await API.put(`/properties/${editId}`, payload)
        setProperties(prev => prev.map(item => item._id === editId ? data : item))
      } else {
        const { data } = await API.post('/properties', payload)
        setProperties(prev => [data, ...prev])
      }

      closeModal()
    } catch (e) {
      console.error('Save property failed:', e)
      setFormError(e.response?.data?.message || 'Failed to save property.')
    }
    setSaving(false)
  }

  const closeModal = () => {
    // Revoke object URLs to prevent memory leaks
    uploadedImages.forEach(img => {
      if (img.preview && img.preview.startsWith('blob:')) {
        URL.revokeObjectURL(img.preview)
      }
    })
    setShowModal(false)
    setEditId(null)
    setUploadedImages([])
    setFormError('')
    setForm({ title:'', city:'', address:'', type:'apartment', listingType:'sale', bhk:'', area:'', price:'', description:'', amenities:'', mapLink:'', latitude:'', longitude:'' })
  }

  // Listing properties requires the 'owner' role (enforced server-side too).
  // Buyers get sent to Settings to switch roles instead of hitting a 403 from the API.
  const openAddPropertyModal = () => {
    if (user?.role !== 'owner') {
      navigate('/settings', { state: { roleNotice: true } })
      return
    }
    setShowModal(true)
  }

  const deleteProperty = (id) => {
    setDeleteTargetId(id)
  }

  const executeDeleteProperty = async () => {
    if (!deleteTargetId) return
    try {
      await API.delete(`/properties/${deleteTargetId}`)
      setProperties(prev => prev.filter(p => p._id !== deleteTargetId))
    } catch (err) {
      console.error('Delete property failed:', err)
      alert(err?.response?.data?.message || 'Failed to delete this listing. Please try again.')
    } finally {
      setDeleteTargetId(null)
    }
  }



  const fmtPrice = (p, lt) => {
    if (!p) return '—'
    if (lt === 'rent') return `₹${(p/1000).toFixed(0)}K/mo`
    if (p >= 10000000) return `₹${(p/10000000).toFixed(1)} Cr`
    return `₹${(p/100000).toFixed(1)} L`
  }

  const wishlistValue = savedProps.reduce((s, p) => s + (p.price || 0), 0)
  const portfolioValue = properties.filter(p => p.status === 'available').reduce((s, p) => s + (p.price || 0), 0)

  return (
    <Page>

      
      {/* ── STUNNING HERO SECTION WITH SEARCH ── */}
      <HeroSection>
        <HeaderRight>
          <GreetingEyebrow>Elite Resident Center</GreetingEyebrow>
          <ListPropertyBtn onClick={() => { setTab('listings'); openAddPropertyModal() }}>+ List Property</ListPropertyBtn>
        </HeaderRight>
        
        <div>
          <GreetingTitle>Welcome back, <span>{user?.name || 'Valued Member'}</span></GreetingTitle>
          <GreetingSub>Browse listings, manage your properties, and review active enquiries from one workspace.</GreetingSub>
        </div>

        <SearchContainer>
          <SearchInput 
            placeholder="Search by city (e.g. Mumbai, Gurugram, Delhi)..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <SearchBtn onClick={handleSearch}>Find Residence</SearchBtn>
        </SearchContainer>
      </HeroSection>

      {/* ── UNIFIED STATS ROW ── */}
      <StatsRow>
        <StatCard>
          <StatNum>{savedProps.length}</StatNum>
          <StatLabel>Saved Residences</StatLabel>
        </StatCard>
        <StatCard>
          <StatNum>{properties.length}</StatNum>
          <StatLabel>My Listed Properties</StatLabel>
        </StatCard>
        <StatCard>
          <StatNum>
            {portfolioValue >= 10000000 
              ? <>{(portfolioValue/10000000).toFixed(1)}<span>Cr</span></>
              : <>{(portfolioValue/100000).toFixed(0)}<span>L</span></>
            }
          </StatNum>
          <StatLabel>Portfolio Value</StatLabel>
        </StatCard>
      </StatsRow>

      {/* ── NAVIGATION TABS ── */}
      <Tabs>
        <Tab $active={tab === 'listings'} onClick={() => setTab('listings')}>
          My Listings ({properties.length})
        </Tab>
        <Tab $active={tab === 'explore'} onClick={() => setTab('explore')}>
          Saved Wishlist ({savedProps.length})
        </Tab>
      </Tabs>

      {/* ── SAVED WISHLIST TAB ── */}
      {tab === 'explore' && (
        <>
          <SectionHeading>Your <span>Saved Wishlist</span> ({savedProps.length})</SectionHeading>
          {savedProps.length === 0 ? (
            <Empty>
              No saved residences yet.
              <EmptyLink onClick={() => navigate('/properties')}>Browse Collection →</EmptyLink>
            </Empty>
          ) : (
            <Grid>
              {savedProps.map(p => (
                <Card key={p._id}>
                  <CardImg src={resolveImg(p.images?.[0])} onClick={() => navigate(`/properties/${p._id}`)}>
                    {p.listingType === 'rent' ? <CardBadge>For Rent</CardBadge> : <CardBadge>For Sale</CardBadge>}
                    {!p.images?.[0] && '🏛️'}
                  </CardImg>
                  <CardBody>
                    <div>
                      <CardTitle>{p.title}</CardTitle>
                      <CardLocation>◆ {p.city}</CardLocation>
                    </div>
                    <CardFooter>
                      <CardPrice>{fmtPrice(p.price, p.listingType)}</CardPrice>
                      <RemoveBtn onClick={() => unsave(p._id)}>Remove Wishlist</RemoveBtn>
                    </CardFooter>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* ── MY LISTINGS TAB ── */}
      {tab === 'listings' && (
        properties.length === 0 ? (
          <Empty>
            No active listings.
            <EmptyLink onClick={openAddPropertyModal}>List your first property now →</EmptyLink>
          </Empty>
        ) : (
          <Grid>
            {properties.map(p => (
              <PCard key={p._id}>
                <PCardImg onClick={() => navigate(`/properties/${p._id}`)}>
                    {p.images?.[0] ? (
                    <PCardImgTag src={resolveImg(p.images[0])} alt={p.title} loading="lazy" onError={e => { e.target.style.display = 'none' }} />
                  ) : (
                    <span style={{fontSize:'2.5rem'}}>🏛️</span>
                  )}
                </PCardImg>
                <PCardBody>
                  <PCardTitle>{p.title}</PCardTitle>
                  <PCardMeta>◆ {p.city} · {p.bhk} BHK · {p.area} sq.ft</PCardMeta>
                  <PCardFooter>
                    <PCardPrice>{fmtPrice(p.price, p.listingType)}</PCardPrice>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.3rem' }}>
                      <PCardStatus s={p.status}>{p.status}</PCardStatus>
                    </div>
                  </PCardFooter>
                  <PCardActions>
                    <ActionBtn onClick={() => navigate(`/properties/${p._id}`)}>View</ActionBtn>
                    <ActionBtn onClick={() => editProperty(p)}>Edit</ActionBtn>
                    <DeleteBtn onClick={() => deleteProperty(p._id)}>Remove</DeleteBtn>
                  </PCardActions>
                </PCardBody>
              </PCard>
            ))}
          </Grid>
        )
      )}


      {/* ── ADD/EDIT PROPERTY MODAL ── */}
      {showModal && (
        <ModalOverlay onClick={e => e.target === e.currentTarget && closeModal()}>
          <Modal>
            <ModalTitle>{editId ? 'Modify Property Details' : 'List a New Residence'}</ModalTitle>
            <ModalSub>{editId ? 'Update your listing details below.' : 'Add a premium listing to the PropFlow luxury marketplace.'}</ModalSub>
            {formError && <ErrMsg>{formError}</ErrMsg>}
            <FormGrid>
              <FormGroup full>
                <Label>Property Title</Label>
                <Input placeholder="e.g. Sky Penthouse, Bandra West" value={form.title} onChange={e => f('title', e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label>City</Label>
                <Input placeholder="e.g. Mumbai" value={form.city} onChange={e => f('city', e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label>Address</Label>
                <Input placeholder="e.g. Road No 12, Worli" value={form.address} onChange={e => f('address', e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label>Property Type</Label>
                <Select value={form.type} onChange={e => f('type', e.target.value)}>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Listing Type</Label>
                <Select value={form.listingType} onChange={e => f('listingType', e.target.value)}>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>BHK</Label>
                <Input type="number" placeholder="e.g. 3" value={form.bhk} onChange={e => f('bhk', e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label>Area (sq.ft)</Label>
                <Input type="number" placeholder="e.g. 2400" value={form.area} onChange={e => f('area', e.target.value)} />
              </FormGroup>
              <FormGroup full>
                <Label>Price (₹)</Label>
                <Input type="number" placeholder="e.g. 15000000" value={form.price} onChange={e => f('price', e.target.value)} />
              </FormGroup>
              <FormGroup full>
                <Label>Description</Label>
                <Textarea placeholder="Describe the premium highlights of this property..." value={form.description} onChange={e => f('description', e.target.value)} />
              </FormGroup>
              <FormGroup full>
                <Label>Amenities (comma-separated)</Label>
                <Input placeholder="Pool, Gym, Concierge, High-speed Lift, Servant Room" value={form.amenities} onChange={e => f('amenities', e.target.value)} />
              </FormGroup>

              {/* ── Map Location ── */}
              <FormGroup full>
                <Label>📍 Map Location (paste Google Maps link)</Label>
                <Input
                  placeholder="https://maps.google.com/...  — coordinates auto-extracted"
                  value={form.mapLink}
                  onChange={e => handleMapLinkChange(e.target.value)}
                />
                {form.latitude && form.longitude && (
                  <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginTop:'0.5rem', fontSize:'0.72rem', color: C.success, letterSpacing:'0.08em' }}>
                    ✓ Coordinates detected: {Number(form.latitude).toFixed(6)}, {Number(form.longitude).toFixed(6)}
                  </div>
                )}
              </FormGroup>
              <FormGroup>
                <Label>Latitude</Label>
                <Input type="number" step="any" placeholder="e.g. 19.0760" value={form.latitude} onChange={e => f('latitude', e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label>Longitude</Label>
                <Input type="number" step="any" placeholder="e.g. 72.8777" value={form.longitude} onChange={e => f('longitude', e.target.value)} />
              </FormGroup>

              {/* Advanced Image Upload */}
              <FormGroup full>
                <Label>Property Images ({uploadedImages.length}/8)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => handleFiles(e.target.files)}
                />
                <ImageUploadArea
                  $dragover={dragOver}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <UploadIcon>🏛️</UploadIcon>
                  <UploadText>
                    <span>Click to upload images</span> or drag & drop files
                  </UploadText>
                  <UploadSub>JPG, PNG, WEBP · Max 8 images · 10MB each</UploadSub>
                </ImageUploadArea>

                {uploadingCount > 0 && (
                  <UploadProgress>Uploading {uploadingCount} image{uploadingCount > 1 ? 's' : ''}…</UploadProgress>
                )}

                {uploadedImages.length > 0 && (
                  <ImagePreviewGrid>
                    {uploadedImages.map((img, i) => (
                      <ImagePreviewItem key={i}>
                        <PreviewImg src={img.preview} alt={`upload-${i}`} />
                        {img.uploading && (
                          <div style={{
                            position:'absolute', inset:0, background:'rgba(0,0,0,0.6)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'0.65rem', color: C.gold, letterSpacing:'0.1em'
                          }}>
                            Uploading…
                          </div>
                        )}
                        {img.failed && (
                          <div style={{
                            position:'absolute', inset:0, background:'rgba(224,82,82,0.3)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'0.65rem', color:'#e05252'
                          }}>
                            Failed
                          </div>
                        )}
                        <RemoveImgBtn onClick={e => { e.stopPropagation(); removeImage(i) }}>×</RemoveImgBtn>
                      </ImagePreviewItem>
                    ))}
                  </ImagePreviewGrid>
                )}
              </FormGroup>
            </FormGrid>

            <ModalBtns>
              <CancelBtn onClick={closeModal}>Cancel</CancelBtn>
              <SaveBtn onClick={handleSave} disabled={saving || uploadingCount > 0}>
                {saving ? 'Saving…' : uploadingCount > 0 ? 'Uploading…' : editId ? 'Save Changes' : 'List Property'}
              </SaveBtn>
            </ModalBtns>
          </Modal>
        </ModalOverlay>
      )}

      {deleteTargetId && (
        <ModalOverlay onClick={() => setDeleteTargetId(null)}>
          <ConfirmCard onClick={e => e.stopPropagation()}>
            <ModalTitle style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Remove Listing?</ModalTitle>
            <ModalSub style={{ marginBottom: '1.5rem' }}>Are you sure you want to remove this property listing? This action cannot be undone.</ModalSub>
            <ModalBtns>
              <CancelBtn onClick={() => setDeleteTargetId(null)}>Cancel</CancelBtn>
              <SaveBtn style={{ background: '#e05252', color: '#ffffff' }} onClick={executeDeleteProperty}>Yes, Remove</SaveBtn>
            </ModalBtns>
          </ConfirmCard>
        </ModalOverlay>
      )}

    </Page>
  )
}

export default Dashboard
