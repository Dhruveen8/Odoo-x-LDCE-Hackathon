import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PieChart as PieIcon, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Hotel, 
  Train, 
  Sparkles, 
  Utensils, 
  Car,
  Compass,
  Sliders, 
  CreditCard,
  Building2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import BudgetCharts from '../components/budget/BudgetCharts';

export default function BudgetView() {
  const { activeTrip, updateTrip, formatCurrency, computeTripFinances, user, setCurrentView } = useApp();

  const [editBudget, setEditBudget] = useState(activeTrip?.targetBudget || 3500);

  if (!activeTrip) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>No itinerary selected for budget analysis</h3>
        <button onClick={() => setCurrentView('my-trips')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Select a Trip
        </button>
      </div>
    );
  }

  const finances = computeTripFinances(activeTrip);

  const handleUpdateTarget = (e) => {
    e.preventDefault();
    updateTrip(activeTrip.id, {
      targetBudget: Number(editBudget)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* ── Header Banner ── */}
      <div className="liquid-glass" style={{ padding: '28px', borderRadius: 'var(--r-xl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-tag primary">
              <PieIcon size={14} /> 6-Category Financial Engine
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeTrip.title}</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>
            Trip Budget &amp; Comprehensive Expense Ledger
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Real-time tracking for Transportation, Accommodation, Activities, Meals, Vehicle Rentals, and Tour Guides.
          </p>
        </div>

        {/* Set Target Budget Form */}
        <form onSubmit={handleUpdateTarget} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="number"
              value={editBudget}
              onChange={(e) => setEditBudget(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '32px', width: '150px', height: '40px' }}
              placeholder="Target Budget"
            />
          </div>
          <button type="submit" className="btn btn-sm btn-primary">
            Save Target
          </button>
        </form>
      </div>

      {/* ── Executive 6-Category Summary Matrix ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Transportation', value: finances.transit, icon: Train, color: '#06b6d4' },
          { label: 'Accommodation', value: finances.lodging, icon: Hotel, color: '#6366f1' },
          { label: 'Activities', value: finances.activities, icon: Sparkles, color: '#ec4899' },
          { label: 'Meals & Dining', value: finances.food, icon: Utensils, color: '#f59e0b' },
          { label: 'Vehicle Rental', value: finances.vehicleRentals, icon: Car, color: '#8b5cf6' },
          { label: 'Tour Guide', value: finances.tourGuides, color: '#10b981', icon: Compass },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="liquid-glass-card"
              style={{
                padding: '18px 20px',
                borderRadius: 'var(--r-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</span>
                <Icon size={16} color={item.color} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {formatCurrency(item.value)}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Interactive SVG Donut & Bar Charts Component ── */}
      <BudgetCharts trip={activeTrip} />

      {/* ── Granular Expense Ledger by Stop (Including Vehicles & Guides) ── */}
      <div className="liquid-glass" style={{ padding: '28px', borderRadius: 'var(--r-xl)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Stop-by-Stop Financial Ledger</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Detailed breakdown for every destination in your route</p>
          </div>
          <span className="badge-tag primary">Display Currency: {user.homeCurrency || 'USD'}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {activeTrip.stops?.map((stop, sIdx) => {
            const stopActTotal = stop.activities?.reduce((acc, a) => acc + (Number(a.cost) || 0), 0) || 0;
            const stopVehTotal = stop.vehicleRentals?.reduce((acc, v) => acc + (Number(v.totalCost) || 0), 0) || 0;
            const stopGuideTotal = stop.guideBookings?.reduce((acc, g) => acc + (Number(g.totalCost) || 0), 0) || 0;
            const stopGrandTotal = (Number(stop.lodgingCost) || 0) + (Number(stop.transitCost) || 0) + stopActTotal + stopVehTotal + stopGuideTotal;

            return (
              <div
                key={stop.id}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--r-lg)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {/* Stop Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--gradient-brand)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800 }}>
                      {sIdx + 1}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{stop.cityName}, {stop.country}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{stop.stayDays} Nights • {stop.arrivalDate} → {stop.departureDate}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Stop Total</span>
                    <strong style={{ fontSize: '1.25rem', color: '#a5b4fc' }}>{formatCurrency(stopGrandTotal)}</strong>
                  </div>
                </div>

                {/* Breakdown Grid with 5 Service Lines */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '0.85rem' }}>
                  {/* Lodging */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <Hotel size={15} color="#6366f1" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Stay</span>
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{stop.lodgingName}</span>
                    </div>
                    <strong>{formatCurrency(stop.lodgingCost || 0)}</strong>
                  </div>

                  {/* Transit */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <Train size={15} color="#06b6d4" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Transit</span>
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{stop.transitMode}</span>
                    </div>
                    <strong>{formatCurrency(stop.transitCost || 0)}</strong>
                  </div>

                  {/* Activities */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <Sparkles size={15} color="#ec4899" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Activities ({stop.activities?.length || 0})</span>
                      <span style={{ fontWeight: 600 }}>Planned</span>
                    </div>
                    <strong>{formatCurrency(stopActTotal)}</strong>
                  </div>

                  {/* Vehicle Rental */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(139,92,246,0.08)', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <Car size={15} color="#8b5cf6" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Vehicle Rental</span>
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {stop.vehicleRentals?.[0]?.name || 'None Rented'}
                      </span>
                    </div>
                    <strong>{formatCurrency(stopVehTotal)}</strong>
                  </div>

                  {/* Tour Guide */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Compass size={15} color="#10b981" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Tour Guide</span>
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {stop.guideBookings?.[0]?.name || 'None Hired'}
                      </span>
                    </div>
                    <strong>{formatCurrency(stopGuideTotal)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
