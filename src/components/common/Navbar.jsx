import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronDown, DollarSign, LogOut, User, Share2, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar({ onOpenCreateModal }) {
  const { theme, setTheme, user, setUser, currentView, setCurrentView } = useApp();
  const [scrolled,     setScrolled]    = useState(false);
  const [searchOpen,   setSearchOpen]  = useState(false);
  const [showProfile,  setShowProfile] = useState(false);
  const [showCurrency, setShowCurrency]= useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];
  const isLight = theme === 'light';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Page title map
  const titles = {
    dashboard: 'Overview', 'my-trips': 'Trips', 'itinerary-builder': 'Builder',
    'itinerary-view': 'Timeline', 'city-search': 'Explore', 'activity-search': 'Experiences',
    vehicles: 'Vehicles', guides: 'Guides', budget: 'Budget', calendar: 'Calendar',
    'public-trip': 'Share', profile: 'Profile', admin: 'Analytics',
  };
  const pageTitle = titles[currentView] || 'GlobeTrotter';

  return (
    <motion.header
      animate={{
        background: scrolled
          ? isLight ? 'rgba(247,247,245,0.92)' : 'rgba(13,13,13,0.92)'
          : 'transparent',
        borderBottomColor: scrolled ? 'var(--glass-border)' : 'transparent',
      }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 'var(--sidebar-w)',
        right: 0,
        height: 'var(--navbar-h)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: 16,
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: '1px solid transparent',
        transition: 'border-color 0.25s, backdrop-filter 0.25s',
      }}
    >
      {/* Page title */}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentView}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="gt-label"
          style={{ flexShrink: 0 }}
        >
          {pageTitle}
        </motion.span>
      </AnimatePresence>

      <div style={{ flex: 1 }} />

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Search */}
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="open"
              initial={{ width: 36, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 36, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--surface)',
                border: '1.5px solid var(--border2)',
                borderRadius: 'var(--r-full)',
                padding: '7px 14px', overflow: 'hidden',
              }}
            >
              <Search size={14} color="var(--tertiary)" style={{ flexShrink: 0 }} />
              <input
                autoFocus
                placeholder="Search..."
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '14px', width: '100%', minWidth: 0, outline: 'none' }}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
              />
              <button onClick={() => setSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tertiary)', display: 'flex', padding: 0, flexShrink: 0 }}>
                <X size={13} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="closed"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(true)}
              className="icon-btn"
            >
              <Search size={17} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`theme-toggle-btn ${theme}`}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          <motion.span
            className="theme-toggle-knob"
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </motion.span>
        </button>

        {/* Currency picker */}
        <div style={{ position: 'relative' }} className="hidden-mobile">
          <button
            onClick={() => { setShowCurrency(!showCurrency); setShowProfile(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              height: 34, padding: '0 12px',
              borderRadius: 'var(--r-full)',
              background: 'var(--surface)',
              border: '1.5px solid var(--border)',
              cursor: 'pointer',
              fontSize: '12px', fontWeight: 700,
              color: 'var(--secondary)',
              fontFamily: 'var(--font)',
              transition: 'border-color 0.2s',
            }}
          >
            <DollarSign size={12} /> {user?.homeCurrency || 'USD'} <ChevronDown size={11} />
          </button>
          <AnimatePresence>
            {showCurrency && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 14, padding: 6, minWidth: 110, zIndex: 200,
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {currencies.map(cur => (
                  <button key={cur}
                    onClick={() => { setUser(p => ({...p, homeCurrency: cur})); setShowCurrency(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '8px 12px', borderRadius: 9, border: 'none',
                      background: user?.homeCurrency === cur ? 'var(--hover)' : 'transparent',
                      color: user?.homeCurrency === cur ? 'var(--primary)' : 'var(--secondary)',
                      cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600, fontSize: '13px',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = user?.homeCurrency === cur ? 'var(--hover)' : 'transparent'}
                  >
                    {cur}
                    {user?.homeCurrency === cur && <span style={{ color: 'var(--accent-blue)' }}>✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setShowProfile(!showProfile); setShowCurrency(false); }}
            style={{
              width: 34, height: 34, borderRadius: '50%', padding: 0,
              border: '2px solid var(--border2)',
              cursor: 'pointer', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none',
              transition: 'border-color 0.2s',
            }}
          >
            <img src={user?.avatar} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16, padding: 8, minWidth: 210, zIndex: 200,
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                {/* User info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px 12px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                  <img src={user?.avatar} alt={user?.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '14px' }}>{user?.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--tertiary)' }}>{user?.email}</div>
                  </div>
                </div>

                {[
                  { label: 'Profile', icon: User,    action: () => { setCurrentView('profile'); setShowProfile(false); } },
                  { label: 'Share Trip', icon: Share2, action: () => { setCurrentView('public-trip'); setShowProfile(false); } },
                  { label: 'Sign Out',   icon: LogOut, action: () => { setCurrentView('auth'); setShowProfile(false); }, danger: true },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button key={i} onClick={item.action}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '9px 12px', borderRadius: 10, border: 'none',
                        background: 'transparent', cursor: 'pointer', fontSize: '14px',
                        fontFamily: 'var(--font)', fontWeight: 500,
                        color: item.danger ? '#EF4444' : 'var(--secondary)',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover)'; if (!item.danger) e.currentTarget.style.color = 'var(--primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = item.danger ? '#EF4444' : 'var(--secondary)'; }}
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
