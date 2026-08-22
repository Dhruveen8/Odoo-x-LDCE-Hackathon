import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass, LayoutDashboard, Luggage, Map, Sparkles,
  PieChart, Calendar, Car, UserCheck, BarChart3,
  PlusCircle, Share2, User, FolderGit2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard',         icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'my-trips',          icon: Luggage,         label: 'My Trips' },
  { id: 'itinerary-builder', icon: FolderGit2,      label: 'Builder' },
  { id: 'itinerary-view',    icon: Map,             label: 'Timeline' },
  { id: 'city-search',       icon: Compass,         label: 'Explore' },
  { id: 'activity-search',   icon: Sparkles,        label: 'Experiences' },
  { id: 'vehicles',          icon: Car,             label: 'Vehicles' },
  { id: 'guides',            icon: UserCheck,       label: 'Guides' },
  { id: 'budget',            icon: PieChart,        label: 'Budget' },
  { id: 'calendar',          icon: Calendar,        label: 'Calendar' },
  { id: 'public-trip',       icon: Share2,          label: 'Share' },
  { id: 'profile',           icon: User,            label: 'Profile' },
  { id: 'admin',             icon: BarChart3,       label: 'Analytics' },
];

function NavItem({ item, isActive, onClick }) {
  const [showTip, setShowTip] = useState(false);
  const Icon = item.icon;

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 12,
          border: 'none',
          background: isActive ? 'var(--primary)' : 'transparent',
          color: isActive ? 'var(--bg)' : 'var(--nav-icon)',
          cursor: 'pointer',
          transition: 'background 0.2s, color 0.2s',
          position: 'relative',
        }}
      >
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
        {isActive && (
          <motion.span
            layoutId="sidebar-indicator"
            style={{
              position: 'absolute',
              right: -12, top: '50%', transform: 'translateY(-50%)',
              width: 3, height: 18,
              background: 'var(--primary)',
              borderRadius: 2,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              left: 'calc(100% + 18px)',
              top: '50%', transform: 'translateY(-50%)',
              background: 'var(--primary)',
              color: 'var(--bg)',
              fontSize: 12, fontWeight: 600,
              padding: '5px 10px',
              borderRadius: 8,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 200,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {item.label}
            <span style={{
              position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)',
              width: 0, height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderRight: '6px solid var(--primary)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ onOpenCreateModal }) {
  const { currentView, setCurrentView, theme } = useApp();

  return (
    <aside
      className="hidden-mobile"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 'var(--sidebar-w)',
        height: '100vh',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderRight: '1px solid var(--glass-border)',
        transition: 'background 0.3s ease',
        overflow: 'visible',
      }}
    >
      {/* Logo */}
      <div
        onClick={() => setCurrentView('dashboard')}
        style={{
          width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          marginTop: 18, marginBottom: 24,
          background: 'var(--primary)',
          borderRadius: 12,
          flexShrink: 0,
        }}
      >
        <Compass size={20} color="var(--bg)" strokeWidth={2.2} />
      </div>

      {/* New trip button */}
      <div style={{ position: 'relative', marginBottom: 8 }}>
        <NavTooltipButton
          icon={PlusCircle}
          label="New Trip"
          onClick={onOpenCreateModal}
          color="var(--accent-blue)"
          bgColor="rgba(99,102,241,0.12)"
        />
      </div>

      <div style={{ width: 32, height: 1, background: 'var(--border)', margin: '8px 0 16px' }} />

      {/* Nav items */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        overflowY: 'auto',
        overflowX: 'visible',
        scrollbarWidth: 'none',
        width: '100%',
        paddingTop: 2,
      }}>
        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.id}
            item={item}
            isActive={currentView === item.id}
            onClick={() => setCurrentView(item.id)}
          />
        ))}
      </div>

      {/* Bottom spacer */}
      <div style={{ height: 20 }} />
    </aside>
  );
}

function NavTooltipButton({ icon: Icon, label, onClick, color, bgColor }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 12,
          border: 'none',
          background: bgColor || 'var(--hover)',
          color: color || 'var(--primary)',
          cursor: 'pointer',
        }}
      >
        <Icon size={18} />
      </motion.button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              left: 'calc(100% + 18px)',
              top: '50%', transform: 'translateY(-50%)',
              background: 'var(--primary)', color: 'var(--bg)',
              fontSize: 12, fontWeight: 600,
              padding: '5px 10px', borderRadius: 8,
              whiteSpace: 'nowrap', pointerEvents: 'none',
              zIndex: 200, boxShadow: 'var(--shadow-md)',
            }}
          >
            {label}
            <span style={{
              position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)',
              width: 0, height: 0,
              borderTop: '5px solid transparent', borderBottom: '5px solid transparent',
              borderRight: '6px solid var(--primary)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
