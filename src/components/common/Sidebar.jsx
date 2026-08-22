import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Luggage, Map, Compass, Sparkles,
  PieChart, Calendar, Share2, User, BarChart3,
  PlusCircle, FolderGit2, Palmtree, Car, UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard',         label: 'Dashboard',      icon: LayoutDashboard },
      { id: 'my-trips',          label: 'My Saved Trips', icon: Luggage,   count: 3 },
    ]
  },
  {
    label: 'Trip Planning & Services',
    items: [
      { id: 'itinerary-builder', label: 'Itinerary Builder', icon: FolderGit2 },
      { id: 'itinerary-view',    label: 'Timeline & Route', icon: Map },
      { id: 'vehicles',          label: 'Vehicle Rentals', icon: Car },
      { id: 'guides',            label: 'Tour Guides',     icon: UserCheck },
      { id: 'budget',            label: 'Budget Ledger',   icon: PieChart },
      { id: 'calendar',          label: 'Trip Calendar',   icon: Calendar },
      { id: 'public-trip',       label: 'Shareable Link',  icon: Share2 },
    ]
  },
  {
    label: 'Explore Catalog',
    items: [
      { id: 'city-search',       label: 'Explore Cities', icon: Compass },
      { id: 'activity-search',   label: 'Experiences',    icon: Sparkles },
      { id: 'profile',           label: 'Profile & Style', icon: User },
      { id: 'admin',             label: 'Analytics Hub',  icon: BarChart3 },
    ]
  }
];

export default function Sidebar({ onOpenCreateModal }) {
  const { currentView, setCurrentView, trips } = useApp();
  const activeTrip = trips?.[0];

  return (
    <aside
      className="hidden-mobile"
      style={{
        position:   'fixed',
        top:        0,
        left:       0,
        width:      'var(--sidebar-w)',
        height:     '100vh',
        zIndex:     60,
        display:    'flex',
        flexDirection: 'column',

        /* ── Liquid glass base ── */
        background: 'rgba(10,9,20,0.78)',
        backdropFilter: 'blur(48px) saturate(200%) brightness(0.90)',
        WebkitBackdropFilter: 'blur(48px) saturate(200%) brightness(0.90)',
        borderRight: '1px solid rgba(255,255,255,0.09)',
        boxShadow:
          'inset -1px 0 0 rgba(255,255,255,0.05), ' +
          '8px 0 32px rgba(0,0,0,0.45)',

        /* Violet tint wash done via pseudo-ish overlay below */
        overflow: 'hidden',
      }}
    >
      {/* Violet tint wash */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'rgba(99,102,241,0.05)',
      }}/>
      {/* Right-edge specular line */}
      <div style={{
        position:'absolute', top:'10%', bottom:'10%', right:0,
        width:1,
        background:'linear-gradient(180deg,transparent,rgba(255,255,255,0.10) 30%,rgba(255,255,255,0.10) 70%,transparent)',
        pointerEvents:'none'
      }}/>

      {/* ── Brand Logo ── */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => setCurrentView('dashboard')}
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        12,
          padding:    '22px 18px 20px',
          cursor:     'pointer',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position:   'relative', zIndex:1,
          flexShrink: 0,
        }}
      >
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5, type: 'spring' }}
          style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99,102,241,0.50)',
            flexShrink: 0,
          }}
        >
          <Palmtree size={20} color="#fff" />
        </motion.div>
        <div>
          <div style={{
            fontSize:'1.05rem', fontWeight:800, fontFamily:'var(--font-heading)',
            color:'#fff', lineHeight:1.1, letterSpacing:'-0.01em'
          }}>
            GlobeTrotter
          </div>
          <div style={{
            fontSize:'0.60rem', fontWeight:700, textTransform:'uppercase',
            letterSpacing:'0.14em', color:'rgba(255,255,255,0.38)',
            fontFamily:'var(--font-modern)', marginTop:2
          }}>
            Sea &amp; River View
          </div>
        </div>
      </motion.div>

      {/* ── Navigation Groups ── */}
      <div style={{
        flex: 1, overflowY:'auto', overflowX:'hidden',
        padding:'16px 10px',
        display:'flex', flexDirection:'column', gap:24,
        position:'relative', zIndex:1,
      }}>
        {NAV_GROUPS.map((grp, gi) => (
          <div key={gi} style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {/* Section label */}
            <div style={{
              fontSize:'0.65rem', fontWeight:800, textTransform:'uppercase',
              letterSpacing:'0.16em', color:'rgba(255,255,255,0.28)',
              fontFamily:'var(--font-modern)',
              padding:'0 10px 6px',
            }}>
              {grp.label}
            </div>

            {grp.items.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  whileHover={{ x: isActive ? 0 : 3 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    position:    'relative',
                    display:     'flex',
                    alignItems:  'center',
                    gap:         10,
                    padding:     '10px 12px',
                    borderRadius: 12,
                    border:      'none',
                    cursor:      'pointer',
                    width:       '100%',
                    background:  'transparent',
                    transition:  'background 0.2s',
                    overflow:    'hidden',
                  }}
                >
                  {/* Active pill bg */}
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      style={{
                        position:    'absolute', inset: 0,
                        borderRadius: 12,
                        background:  'var(--gradient-brand)',
                        boxShadow:   '0 4px 18px rgba(99,102,241,0.45)',
                        zIndex:      0,
                      }}
                      transition={{ type:'spring', stiffness:380, damping:32 }}
                    />
                  )}
                  {/* Hover bg (non-active) */}
                  {!isActive && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        position:'absolute', inset:0, borderRadius:12,
                        background:'rgba(255,255,255,0.07)',
                        zIndex:0, pointerEvents:'none'
                      }}
                    />
                  )}

                  {/* Icon */}
                  <span style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', flexShrink:0 }}>
                    <Icon size={17} color={isActive ? '#fff' : 'rgba(255,255,255,0.52)'} />
                  </span>

                  {/* Label */}
                  <span style={{
                    position:'relative', zIndex:1,
                    fontSize:'0.90rem',
                    fontWeight: isActive ? 700 : 500,
                    fontFamily:'var(--font-modern)',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                    flex:1, textAlign:'left',
                  }}>
                    {item.label}
                  </span>

                  {/* Badge count */}
                  {item.count && (
                    <span style={{
                      position:'relative', zIndex:1,
                      fontSize:'0.70rem', fontWeight:800,
                      background: isActive ? 'rgba(255,255,255,0.22)' : 'rgba(99,102,241,0.40)',
                      color:'#fff', padding:'2px 8px', borderRadius:999,
                      fontFamily:'var(--font-modern)',
                    }}>
                      {item.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Active Trip Card ── */}
      <div style={{ padding:'0 10px 10px', position:'relative', zIndex:1, flexShrink:0 }}>
        <AnimatePresence>
          {activeTrip && (
            <motion.div
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:8 }}
              onClick={() => setCurrentView('itinerary-view')}
              style={{
                padding:'12px 14px',
                borderRadius:14,
                background:'rgba(99,102,241,0.14)',
                border:'1px solid rgba(99,102,241,0.28)',
                backdropFilter:'blur(16px)',
                cursor:'pointer',
                marginBottom:10,
              }}
            >
              <div style={{
                fontSize:'0.60rem', fontWeight:800, textTransform:'uppercase',
                letterSpacing:'0.15em', color:'rgba(255,255,255,0.32)',
                fontFamily:'var(--font-modern)', marginBottom:5
              }}>
                Active Trip
              </div>
              <div style={{
                fontWeight:700, fontSize:'0.88rem', color:'#e0d9ff',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                fontFamily:'var(--font-modern)',
              }}>
                {activeTrip.title}
              </div>
              <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.38)', marginTop:3, fontFamily:'var(--font-modern)' }}>
                {activeTrip.stops?.length || 0} cities · {activeTrip.status}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Trip Button */}
        <motion.button
          whileHover={{ scale:1.03, boxShadow:'0 8px 28px rgba(99,102,241,0.60)' }}
          whileTap={{ scale:0.97 }}
          onClick={onOpenCreateModal}
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            width:'100%', padding:'12px 16px',
            borderRadius:12, border:'none', cursor:'pointer',
            background:'var(--gradient-brand)',
            boxShadow:'0 4px 20px rgba(99,102,241,0.45)',
            fontFamily:'var(--font-modern)', fontWeight:800,
            fontSize:'0.92rem', color:'#fff',
            transition:'box-shadow 0.25s',
          }}
        >
          <PlusCircle size={17} />
          New Trip
        </motion.button>
      </div>
    </aside>
  );
}
