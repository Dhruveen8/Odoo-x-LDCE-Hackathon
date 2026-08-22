import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  Luggage, 
  Car, 
  UserCheck, 
  DollarSign, 
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminDashboardView() {
  const { adminStats, trips, formatCurrency } = useApp();

  const stats = [
    { label: 'ACTIVE EXPLORERS', value: '18,420', change: '+12%', icon: Users },
    { label: 'SCHEDULED TRIPS', value: String(trips?.length || 4), change: '+8%', icon: Luggage },
    { label: 'VEHICLE RESERVATIONS', value: '1,280', change: '+24%', icon: Car },
    { label: 'GUIDE BOOKINGS', value: '840', change: '+18%', icon: UserCheck },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 0' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '40px' }}>
        <span className="gt-label">SYSTEM CONSOLE</span>
        <h1 className="gt-h1" style={{ marginTop: '4px' }}>ANALYTICS &amp; OPS</h1>
      </div>

      {/* ── Key Metric Stats ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="gt-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="gt-label">{stat.label}</span>
                <Icon size={16} color="var(--tertiary)" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', marginTop: '6px', display: 'block' }}>
                {stat.change} vs last month
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Platform Logs / Recent Bookings ── */}
      <div className="gt-card" style={{ padding: '32px', borderRadius: 'var(--r-2xl)' }}>
        <h3 className="gt-h3" style={{ marginBottom: '20px' }}>Recent System Events</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { type: 'TRIP', desc: 'New multi-city route created: "Alpine & Lakes Expedition"', time: '12m ago', badge: 'Route' },
            { type: 'VEHICLE', desc: 'BMW X1 reservation confirmed for Stop: Zurich (3 Days)', time: '44m ago', badge: 'Vehicle' },
            { type: 'GUIDE', desc: 'Private Guide Booking: Sarah Khan (Paris - Full Day)', time: '2h ago', badge: 'Guide' },
            { type: 'BUDGET', desc: 'Financial alert: 6-category allocation recalculated for User user-1', time: '4h ago', badge: 'Budget' }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                borderRadius: 'var(--r-md)',
                background: 'var(--hover)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="gt-badge">{item.badge}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
                  {item.desc}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--tertiary)' }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
