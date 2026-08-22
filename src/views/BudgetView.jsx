import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PieChart, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Building, 
  Plane, 
  Sparkles, 
  Utensils, 
  Car, 
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BudgetView() {
  const { trips, activeTrip, setActiveTripId, formatCurrency, computeTripFinances } = useApp();

  const currentTrip = activeTrip || trips[0];
  const finances = computeTripFinances(currentTrip);

  const categories = [
    { key: 'lodging', label: 'STAY', icon: Building, amount: finances.lodging, color: '#6366F1' },
    { key: 'transit', label: 'TRANSIT', icon: Plane, amount: finances.transit, color: '#38BDF8' },
    { key: 'activities', label: 'EXPERIENCES', icon: Sparkles, amount: finances.activities, color: '#EC4899' },
    { key: 'food', label: 'DINING', icon: Utensils, amount: finances.food, color: '#F59E0B' },
    { key: 'vehicleRentals', label: 'VEHICLES', icon: Car, amount: finances.vehicleRentals, color: '#10B981' },
    { key: 'tourGuides', label: 'GUIDES', icon: UserCheck, amount: finances.tourGuides, color: '#C9A96E' },
  ];

  const total = finances.totalEstimated || 1;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 0' }}>
      
      {/* ── Header & Trip Switcher ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div>
          <span className="gt-label">FINANCIAL ENGINE</span>
          <h1 className="gt-h1" style={{ marginTop: '4px' }}>TRIP BUDGET</h1>
        </div>

        {/* Trip Selector */}
        <div style={{ position: 'relative' }}>
          <select
            value={currentTrip?.id}
            onChange={(e) => setActiveTripId(e.target.value)}
            className="input-field"
            style={{
              paddingRight: '36px',
              fontWeight: 700,
              fontSize: '14px',
              borderRadius: 'var(--r-full)'
            }}
          >
            {(trips || []).map(t => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Main Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Total Estimated */}
        <div className="gt-card" style={{ padding: '32px' }}>
          <span className="gt-label">EST. TOTAL EXPENSE</span>
          <div style={{ fontSize: '44px', fontWeight: 900, color: 'var(--primary)', marginTop: '8px', letterSpacing: '-0.03em' }}>
            {formatCurrency(finances.totalEstimated)}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--secondary)', marginTop: '6px', display: 'block' }}>
            Calculated across {currentTrip?.stops?.length || 0} stops
          </span>
        </div>

        {/* Target Budget */}
        <div className="gt-card" style={{ padding: '32px' }}>
          <span className="gt-label">TARGET ALLOCATION</span>
          <div style={{ fontSize: '44px', fontWeight: 900, color: 'var(--primary)', marginTop: '8px', letterSpacing: '-0.03em' }}>
            {formatCurrency(finances.target)}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--secondary)', marginTop: '6px', display: 'block' }}>
            Trip target ceiling
          </span>
        </div>

        {/* Balance Status */}
        <div className="gt-card" style={{ padding: '32px', background: finances.isOverBudget ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)' }}>
          <span className="gt-label" style={{ color: finances.isOverBudget ? '#ef4444' : '#10b981' }}>
            {finances.isOverBudget ? 'OVER BUDGET' : 'REMAINING BUFFER'}
          </span>
          <div style={{ 
            fontSize: '44px', 
            fontWeight: 900, 
            color: finances.isOverBudget ? '#ef4444' : '#10b981', 
            marginTop: '8px', 
            letterSpacing: '-0.03em' 
          }}>
            {formatCurrency(Math.abs(finances.remaining))}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--secondary)', marginTop: '6px', display: 'block' }}>
            {finances.isOverBudget ? 'Exceeding target' : 'Available cushion'}
          </span>
        </div>
      </div>

      {/* ── Visual Breakdown Progress Bar ── */}
      <div className="gt-card" style={{ padding: '32px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="gt-label">CATEGORY ALLOCATION</span>
          <span style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600 }}>
            6 LIVE EXPENSE CATEGORIES
          </span>
        </div>

        {/* Multi-segment bar */}
        <div style={{
          height: '12px',
          borderRadius: '999px',
          background: 'var(--hover)',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '28px'
        }}>
          {categories.map(cat => {
            const pct = (cat.amount / total) * 100;
            if (pct <= 0) return null;
            return (
              <div
                key={cat.key}
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: cat.color,
                  transition: 'width 0.4s ease'
                }}
                title={`${cat.label}: ${formatCurrency(cat.amount)} (${pct.toFixed(0)}%)`}
              />
            );
          })}
        </div>

        {/* Category List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            const pct = ((cat.amount / total) * 100).toFixed(0);
            return (
              <div
                key={cat.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: 'var(--r-lg)',
                  background: 'var(--hover)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cat.color,
                  border: '1px solid var(--border)'
                }}>
                  <Icon size={18} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                      {cat.label}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--tertiary)' }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                    {formatCurrency(cat.amount)}
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
