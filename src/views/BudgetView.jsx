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
  Coffee, 
  Sliders, 
  CreditCard 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import BudgetCharts from '../components/budget/BudgetCharts';

export default function BudgetView() {
  const { activeTrip, updateTrip, formatCurrency, computeTripFinances, user, setCurrentView } = useApp();

  const [editBudget, setEditBudget] = useState(activeTrip?.targetBudget || 3000);
  const [foodDailyBudget, setFoodDailyBudget] = useState(60);

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
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-tag primary">
              <PieIcon size={14} /> Financial Intelligence
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeTrip.title}</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>
            Trip Budget & Cost Breakdown
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Real-time multi-category tracking, daily burn-rate estimates, and smart overbudget alerts.
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

      {/* Interactive SVG Donut & Bar Charts Component */}
      <BudgetCharts trip={activeTrip} />

      {/* Granular Expense Ledger by Stop */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Stop-by-Stop Financial Ledger</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Currency: {user.homeCurrency || 'USD'}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTrip.stops?.map((stop, sIdx) => {
            const stopActTotal = stop.activities?.reduce((acc, a) => acc + (Number(a.cost) || 0), 0) || 0;
            const stopTotal = (Number(stop.lodgingCost) || 0) + (Number(stop.transitCost) || 0) + stopActTotal;

            return (
              <div
                key={stop.id}
                style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--brand-gradient)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
                      {sIdx + 1}
                    </span>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{stop.cityName}, {stop.country}</h4>
                    <span className="badge-tag">{stop.stayDays} Nights</span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                    {formatCurrency(stopTotal)}
                  </div>
                </div>

                {/* Breakdown items */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <Hotel size={16} color="var(--brand-primary)" />
                    <div style={{ flex: 1 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Stay:</span> {stop.lodgingName}
                    </div>
                    <strong>{formatCurrency(stop.lodgingCost || 0)}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <Train size={16} color="var(--color-info)" />
                    <div style={{ flex: 1 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Transit:</span> {stop.transitMode}
                    </div>
                    <strong>{formatCurrency(stop.transitCost || 0)}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <Sparkles size={16} color="var(--color-warning)" />
                    <div style={{ flex: 1 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Activities:</span> {stop.activities?.length || 0} Tours
                    </div>
                    <strong>{formatCurrency(stopActTotal)}</strong>
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
