import React from 'react';
import { motion } from 'motion/react';
import { 
  PieChart as PieIcon, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign,
  Hotel,
  Train,
  Sparkles,
  Utensils,
  Car,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BudgetCharts({ trip }) {
  const { formatCurrency, computeTripFinances } = useApp();
  const finances = computeTripFinances(trip);

  const categories = [
    { name: 'Accommodation', value: finances.lodging, color: '#6366f1', icon: Hotel },
    { name: 'Transportation', value: finances.transit, color: '#06b6d4', icon: Train },
    { name: 'Activities', value: finances.activities, color: '#ec4899', icon: Sparkles },
    { name: 'Meals & Dining', value: finances.food, color: '#f59e0b', icon: Utensils },
    { name: 'Vehicle Rental', value: finances.vehicleRentals, color: '#8b5cf6', icon: Car },
    { name: 'Tour Guide', value: finances.tourGuides, color: '#10b981', icon: Compass }
  ];

  const total = Math.max(1, finances.totalEstimated);

  // SVG Donut calculation
  let cumulativePercent = 0;
  const slices = categories.map(cat => {
    const percent = cat.value / total;
    const startAngle = cumulativePercent * 360;
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 360;
    return { ...cat, percent, startAngle, endAngle };
  });

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      
      {/* ── 6-Category Donut Chart Card ── */}
      <div className="liquid-glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieIcon size={20} color="var(--brand-indigo)" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>6-Category Cost Allocation</h4>
          </div>
          <span className="badge-tag primary">Live Ledger</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Donut graphic */}
          <div style={{ position: 'relative', width: '170px', height: '170px' }}>
            <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              {slices.map((slice, i) => {
                if (slice.value === 0) return null;
                const [startX, startY] = getCoordinatesForPercent(slice.startAngle / 360);
                const [endX, endY] = getCoordinatesForPercent(slice.endAngle / 360);
                const largeArcFlag = slice.percent > 0.5 ? 1 : 0;
                const pathData = [
                  `M ${startX} ${startY}`,
                  `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                  `L 0 0`
                ].join(' ');

                return (
                  <motion.path
                    key={i}
                    d={pathData}
                    fill={slice.color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  />
                );
              })}
              {/* Center cutout */}
              <circle r="0.68" fill="var(--bg-app)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>TOTAL COST</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{formatCurrency(finances.totalEstimated)}</div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '180px' }}>
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const percentShare = Math.round((cat.value / total) * 100) || 0;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }} />
                    <Icon size={13} color={cat.color} />
                    <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(cat.value)}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({percentShare}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Target Budget Progress & Guard Card ── */}
      <div className="liquid-glass" style={{ padding: '24px', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color={finances.isOverBudget ? "var(--brand-rose)" : "var(--brand-emerald)"} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Budget Health Target</h4>
            </div>
            <span className={`badge-tag ${finances.isOverBudget ? 'rose' : 'success'}`}>
              {finances.isOverBudget ? '⚠️ Over Budget Alert' : '✓ Within Target'}
            </span>
          </div>

          <div style={{ margin: '20px 0 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Spend vs Target:</span>
              <span style={{ fontWeight: 700 }}>
                {formatCurrency(finances.totalEstimated)} / {formatCurrency(finances.target)}
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', position: 'relative' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (finances.totalEstimated / finances.target) * 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: finances.isOverBudget ? 'var(--gradient-sunset)' : 'var(--gradient-brand)',
                  borderRadius: '999px'
                }}
              />
            </div>
          </div>

          {finances.isOverBudget ? (
            <div style={{ padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.25)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <AlertTriangle size={18} color="var(--brand-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--brand-rose)' }}>Exceeding target by {formatCurrency(Math.abs(finances.remaining))}.</strong> Consider modifying vehicle rental dates or choosing a half-day tour guide tier.
              </div>
            </div>
          ) : (
            <div style={{ padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="var(--brand-emerald)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>{formatCurrency(finances.remaining)}</strong> remaining buffer under your budget ceiling.
              </div>
            </div>
          )}
        </div>

        {/* Quick summary strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', fontSize: '0.8rem', textAlign: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Stops Planned</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '2px' }}>{trip?.stops?.length || 0} Cities</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Vehicles</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '2px' }}>{trip?.stops?.reduce((acc, s) => acc + (s.vehicleRentals?.length || 0), 0) || 0} Rented</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Tour Guides</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '2px' }}>{trip?.stops?.reduce((acc, s) => acc + (s.guideBookings?.length || 0), 0) || 0} Booked</div>
          </div>
        </div>
      </div>

    </div>
  );
}
