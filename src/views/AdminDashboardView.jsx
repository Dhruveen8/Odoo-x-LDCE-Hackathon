import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Luggage, 
  Globe, 
  Sparkles, 
  Activity, 
  BarChart3, 
  DollarSign, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminDashboardView() {
  const { adminStats, destinations } = useApp();

  const maxGrowth = Math.max(...adminStats.monthlyTripsGrowth.map(m => m.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-tag warning">
              <ShieldAlert size={14} /> Admin Intelligence & Telemetry
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Live Platform Analytics</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>
            GlobeTrotter Executive Dashboard
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Monitor trip creations, global destination adoption, active planner retention, and budget trends.
          </p>
        </div>

        <span className="badge-handdrawn" style={{ fontSize: '1rem' }}>
          Real-time Engine Active
        </span>
      </div>

      {/* Primary KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Itineraries Built', value: adminStats.totalTrips.toLocaleString(), icon: Luggage, color: 'var(--brand-primary)', sub: '+24% vs last month' },
          { label: 'Active Global Planners', value: adminStats.activeUsers.toLocaleString(), icon: Users, color: 'var(--color-success)', sub: '94% satisfaction' },
          { label: 'Destinations Explored', value: `${adminStats.destinationsCovered} Cities`, icon: Globe, color: 'var(--color-info)', sub: 'Across 62 countries' },
          { label: 'Avg. Traveler Savings', value: adminStats.averageBudgetSaved, icon: DollarSign, color: 'var(--color-warning)', sub: 'Per planned itinerary' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass-panel"
              style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={24} color={kpi.color} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{kpi.label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.2 }}>{kpi.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-success)', marginTop: '2px' }}>{kpi.sub}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Growth Charts & City Popularity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Monthly Trips Created Bar Chart */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Monthly Itinerary Volume (2026)</h3>
            </div>
            <span className="badge-tag primary">Active Growth</span>
          </div>

          {/* SVG Bar Chart */}
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingTop: '20px' }}>
            {adminStats.monthlyTripsGrowth.map((item, idx) => {
              const heightPercent = (item.count / maxGrowth) * 100;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {item.count}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    style={{
                      width: '100%',
                      background: idx === adminStats.monthlyTripsGrowth.length - 1 ? 'var(--brand-gradient-sunset)' : 'var(--brand-gradient)',
                      borderRadius: '6px 6px 0 0'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Destination Hotspots Progress */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="var(--color-info)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Top Traveled Cities</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Share of Bookings</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {adminStats.popularCities.map((pc, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700 }}>{pc.city}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{pc.count.toLocaleString()} trips ({pc.percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pc.percentage}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.08 }}
                    style={{ height: '100%', background: pc.color, borderRadius: '999px' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Experience Category Distribution */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Popular Experience Categories</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {adminStats.categoryBreakdown.map((cat, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.name}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>{cat.value}%</div>
              </div>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: cat.color }} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
