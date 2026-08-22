import React from 'react';
import { motion } from 'motion/react';
import { PieChart as PieIcon, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BudgetCharts({ trip }) {
  const { formatCurrency, computeTripFinances } = useApp();
  const finances = computeTripFinances(trip);

  const categories = [
    { name: 'Lodging / Stay', value: finances.lodging, color: '#6366f1' },
    { name: 'Transit & Flights', value: finances.transit, color: '#06b6d4' },
    { name: 'Activities & Tours', value: finances.activities, color: '#ec4899' },
    { name: 'Meals & Dining', value: finances.food, color: '#f59e0b' }
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
      
      {/* Category Donut Chart Card */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieIcon size={20} color="var(--brand-primary)" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Expense Breakdown</h4>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Categorized</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Donut graphic */}
          <div style={{ position: 'relative', width: '160px', height: '160px' }}>
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
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                );
              })}
              {/* Center cutout */}
              <circle r="0.65" fill="var(--bg-secondary)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL</div>
              <div style={{ fontSize: '1rem', fontWeight: 800 }}>{formatCurrency(finances.totalEstimated)}</div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '160px' }}>
            {categories.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                </div>
                <span style={{ fontWeight: 700 }}>{formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Budget Progress & Overbudget Guard */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color={finances.isOverBudget ? "var(--color-danger)" : "var(--color-success)"} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Budget Health Target</h4>
            </div>
            <span className={`badge-tag ${finances.isOverBudget ? 'warning' : 'success'}`}>
              {finances.isOverBudget ? 'Over Budget Alert' : 'Within Budget'}
            </span>
          </div>

          <div style={{ margin: '20px 0 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated vs Target:</span>
              <span style={{ fontWeight: 700 }}>
                {formatCurrency(finances.totalEstimated)} / {formatCurrency(finances.target)}
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '12px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden', position: 'relative' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (finances.totalEstimated / finances.target) * 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: finances.isOverBudget ? 'var(--brand-gradient-sunset)' : 'var(--brand-gradient-emerald)',
                  borderRadius: '999px'
                }}
              />
            </div>
          </div>

          {finances.isOverBudget ? (
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <AlertTriangle size={18} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--color-danger)' }}>Exceeding target by {formatCurrency(Math.abs(finances.remaining))}.</strong> Consider swapping premium activities or choosing boutique rail options.
              </div>
            </div>
          ) : (
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--color-success)' }}>You have {formatCurrency(finances.remaining)} buffer remaining.</strong> Your budget is healthy and ready for spontaneous adventures!
              </div>
            </div>
          )}
        </div>

        {/* Quick financial metric footers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg. Daily Spend</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {formatCurrency(Math.round(finances.totalEstimated / Math.max(1, trip.stops?.reduce((acc, s) => acc + (s.stayDays || 1), 0) || 1)))}/day
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Stops Planned</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {trip.stops?.length || 0} Cities
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
