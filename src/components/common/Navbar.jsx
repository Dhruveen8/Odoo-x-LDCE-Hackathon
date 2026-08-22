import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass, Plus, Sun, Moon, Search, ChevronDown,
  MapPin, DollarSign, LogOut, Sparkles, Layers,
  Calendar, PieChart, ShieldAlert, Palmtree, Share2, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_TABS = [
  { id: 'dashboard',        label: 'Home',         icon: Compass   },
  { id: 'my-trips',         label: 'Trips',         icon: Layers    },
  { id: 'city-search',      label: 'Destinations',  icon: MapPin    },
  { id: 'activity-search',  label: 'Experiences',   icon: Sparkles  },
  { id: 'budget',           label: 'Budget',        icon: PieChart  },
  { id: 'calendar',         label: 'Calendar',      icon: Calendar  },
  { id: 'admin',            label: 'Analytics',     icon: ShieldAlert },
];

export default function Navbar({ onOpenCreateModal }) {
  const { theme, setTheme, user, setUser, currentView, setCurrentView } = useApp();

  const [scrolled,         setScrolled]        = useState(false);
  const [showProfile,      setShowProfile]     = useState(false);
  const [showCurrency,     setShowCurrency]    = useState(false);
  const [searchOpen,       setSearchOpen]      = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDashboard   = currentView === 'dashboard';
  const isHeroVisible = isDashboard && !scrolled;

  return (
    <motion.header
      animate={{
        /* Liquid glass solidifies slightly as user scrolls */
        background: isHeroVisible
          ? 'rgba(10,9,20,0.30)'
          : 'rgba(10,9,20,0.72)',
      }}
      transition={{ duration: 0.38, ease: [0.22,1,0.36,1] }}
      style={{
        position:  'fixed',
        top:       0,
        /* Left offset = sidebar width so bar starts after sidebar */
        left:      'var(--sidebar-w)',
        right:     0,
        height:    'var(--navbar-h)',
        zIndex:    50,
        display:   'flex',
        alignItems:'center',
        backdropFilter: 'blur(48px) saturate(200%)',
        WebkitBackdropFilter: 'blur(48px) saturate(200%)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.09)'
          : '1px solid transparent',
        boxShadow: scrolled ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.50)' : 'none',
        padding: '0 24px',
        gap: 16,
      }}
    >
      {/* Specular top-rim highlight */}
      <div style={{
        position:'absolute', top:0, left:'15%', right:'15%', height:1,
        background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.18) 40%,rgba(255,255,255,0.18) 60%,transparent)',
        pointerEvents:'none'
      }}/>

      {/* Violet tint wash */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'rgba(99,102,241,0.04)',
      }}/>

      {/* ── Logo (only visible when sidebar is hidden on mobile) ── */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setCurrentView('dashboard')}
        className="hidden-mobile"
        style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', flexShrink:0 }}
      >
        {/* Already shown in sidebar — hide on desktop */}
      </motion.div>

      {/* ── Nav tabs — centred, pill-active indicator ── */}
      <nav style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {NAV_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              style={{
                position:    'relative',
                display:     'flex',
                alignItems:  'center',
                gap:         6,
                padding:     '8px 16px',
                borderRadius: 'var(--r-full)',
                border:      'none',
                cursor:      'pointer',
                background:  'transparent',
                color:       isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                fontFamily:  'var(--font-modern)',
                fontWeight:  isActive ? 700 : 500,
                fontSize:    '0.88rem',
                whiteSpace:  'nowrap',
                transition:  'color 0.22s',
                zIndex:      1,
              }}
            >
              {/* Animated active background */}
              {isActive && (
                <motion.span
                  layoutId="navbar-active"
                  style={{
                    position:   'absolute', inset: 0,
                    borderRadius: 'var(--r-full)',
                    background:  'var(--gradient-brand)',
                    boxShadow:   '0 4px 18px rgba(99,102,241,0.55)',
                    zIndex:      -1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon size={15} style={{ flexShrink: 0 }} />
              <span className="hidden-mobile">{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* ── Right actions ── */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>

        {/* Search */}
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="search-open"
              initial={{ width: 38, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 38, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.09)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 'var(--r-full)',
                padding: '7px 14px', overflow: 'hidden',
                backdropFilter: 'blur(16px)',
              }}
            >
              <Search size={14} style={{ color:'rgba(255,255,255,0.45)', flexShrink:0 }} />
              <input autoFocus placeholder="Search…"
                style={{ background:'transparent', border:'none', color:'#fff', fontSize:'0.87rem', width:'100%', minWidth:0 }}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
              />
              <button onClick={() => setSearchOpen(false)}
                style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.45)', display:'flex', padding:0 }}>
                <X size={13} />
              </button>
            </motion.div>
          ) : (
            <motion.button key="search-icon"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(true)}
              style={{
                width:34, height:34, borderRadius:'50%',
                background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                color:'rgba(255,255,255,0.65)',
              }}
            >
              <Search size={15} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9, rotate: 20 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            width:34, height:34, borderRadius:'50%',
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          }}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark'
              ? <motion.span key="sun"  initial={{scale:0.6,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.6,opacity:0}}><Sun  size={15} color="#fcd34d"/></motion.span>
              : <motion.span key="moon" initial={{scale:0.6,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.6,opacity:0}}><Moon size={15} color="#a78bfa"/></motion.span>
            }
          </AnimatePresence>
        </motion.button>

        {/* Currency */}
        <div style={{ position:'relative' }} className="hidden-mobile">
          <button onClick={() => { setShowCurrency(!showCurrency); setShowProfile(false); }}
            style={{
              height:34, padding:'0 12px', borderRadius:'var(--r-full)',
              background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
              cursor:'pointer', display:'flex', alignItems:'center', gap:5,
              color:'rgba(255,255,255,0.70)', fontFamily:'var(--font-modern)', fontWeight:700, fontSize:'0.8rem',
            }}>
            <DollarSign size={13} />
            {user.homeCurrency || 'USD'}
            <ChevronDown size={12} />
          </button>
          <AnimatePresence>
            {showCurrency && (
              <motion.div
                initial={{ opacity:0, y:6, scale:0.94 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, y:6, scale:0.94 }}
                transition={{ duration:0.2 }}
                className="liquid-glass"
                style={{
                  position:'absolute', top:'calc(100% + 8px)', right:0,
                  borderRadius:14, padding:6, minWidth:120, zIndex:200
                }}
              >
                {currencies.map(cur => (
                  <button key={cur}
                    onClick={() => { setUser(p => ({...p, homeCurrency:cur})); setShowCurrency(false); }}
                    style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      width:'100%', padding:'8px 12px', borderRadius:10, border:'none',
                      background: user.homeCurrency===cur ? 'rgba(99,102,241,0.28)' : 'transparent',
                      color: user.homeCurrency===cur ? '#a5b4fc' : 'rgba(255,255,255,0.70)',
                      cursor:'pointer', fontFamily:'var(--font-modern)', fontWeight:600, fontSize:'0.85rem',
                    }}>
                    {cur}
                    {user.homeCurrency===cur && <span style={{color:'#a5b4fc'}}>✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Plan Escape CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onOpenCreateModal}
          className="btn btn-primary btn-sm"
          style={{ fontWeight:800 }}
        >
          <Plus size={14} />
          <span className="hidden-mobile">Plan Escape</span>
        </motion.button>

        {/* Avatar + dropdown */}
        <div style={{ position:'relative' }}>
          <motion.button
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.94 }}
            onClick={() => { setShowProfile(!showProfile); setShowCurrency(false); }}
            style={{
              width:34, height:34, borderRadius:'50%', padding:0, border:'2px solid rgba(99,102,241,0.55)',
              cursor:'pointer', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center',
              background:'none',
            }}
          >
            <img src={user.avatar} alt={user.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity:0, y:8, scale:0.92 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, y:8, scale:0.92 }}
                transition={{ duration:0.2 }}
                className="liquid-glass"
                style={{
                  position:'absolute', top:'calc(100% + 10px)', right:0,
                  borderRadius:20, padding:10, minWidth:220, zIndex:200
                }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 8px 12px', borderBottom:'1px solid rgba(255,255,255,0.08)', marginBottom:6 }}>
                  <img src={user.avatar} alt={user.name} style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(99,102,241,0.50)' }} />
                  <div>
                    <div style={{ fontWeight:700, color:'#fff', fontSize:'0.9rem' }}>{user.name}</div>
                    <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.40)' }}>{user.email}</div>
                  </div>
                </div>
                {[
                  { label:'Profile & Settings', icon:Compass, action:() => { setCurrentView('profile'); setShowProfile(false); } },
                  { label:'Shareable Link',     icon:Share2,  action:() => { setCurrentView('public-trip'); setShowProfile(false); } },
                  { label:'Sign Out',           icon:LogOut,  action:() => { setCurrentView('auth'); setShowProfile(false); }, danger:true },
                ].map((item,i) => {
                  const Icon = item.icon;
                  return (
                    <button key={i} onClick={item.action}
                      style={{
                        display:'flex', alignItems:'center', gap:10,
                        width:'100%', padding:'9px 12px', borderRadius:12, border:'none',
                        background:'transparent', cursor:'pointer', fontSize:'0.87rem',
                        fontFamily:'var(--font-modern)', fontWeight:600,
                        color: item.danger ? '#fda4af' : 'rgba(255,255,255,0.80)',
                        transition: 'background 0.18s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <Icon size={15} />
                      {item.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
