import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Share2, 
  Copy, 
  Check, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Car, 
  UserCheck, 
  ArrowUpRight,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PublicTripView() {
  const { activeTrip, cloneTrip, formatCurrency, computeTripFinances, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!activeTrip) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center' }}>
        <h2 className="gt-h2">No trip available to share</h2>
      </div>
    );
  }

  const finances = computeTripFinances(activeTrip);
  const stops = activeTrip.stops || [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast("Link Copied 🔗", "Public itinerary link copied to clipboard.", "success");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 0' }}>
      
      {/* ── Share Action Strip ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--surface)',
        padding: '16px 24px',
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--border)',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Share2 size={16} color="var(--accent-blue)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
            PUBLIC ITINERARY LINK
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary btn-sm"
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'COPIED' : 'COPY LINK'}</span>
          </button>

          <button
            onClick={() => cloneTrip(activeTrip)}
            className="btn btn-primary btn-sm"
          >
            <span>CLONE TO MY TRIPS</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Editorial Hero ── */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--r-2xl)',
        overflow: 'hidden',
        height: '420px',
        marginBottom: '48px'
      }}>
        <img
          src={activeTrip.coverImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85'}
          alt={activeTrip.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '40px'
        }}>
          <span className="gt-label" style={{ color: 'var(--accent-gold)' }}>GLOBETROTTER EDITORIAL</span>
          <h1 className="gt-display" style={{ color: '#fff', marginTop: '6px', fontSize: 'clamp(36px, 5vw, 64px)' }}>
            {activeTrip.title}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
            {activeTrip.startDate} — {activeTrip.endDate} • {stops.length} Destination Stops • Est. {formatCurrency(finances.totalEstimated)}
          </p>
        </div>
      </div>

      {/* ── Route Stop Timeline ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {stops.map((stop, sIdx) => (
          <div key={stop.id || sIdx} className="gt-card" style={{ padding: '32px', borderRadius: 'var(--r-2xl)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <span className="gt-label" style={{ fontSize: '14px', fontWeight: 900, color: 'var(--accent-gold)' }}>
                  0{sIdx + 1}
                </span>
                <h2 className="gt-h2" style={{ color: 'var(--primary)' }}>
                  {stop.cityName}
                </h2>
                <span style={{ fontSize: '14px', color: 'var(--secondary)' }}>{stop.country}</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                {stop.stayDays || 3} DAYS
              </span>
            </div>

            {/* Activities list */}
            {(stop.activities || []).length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <span className="gt-label-sm" style={{ marginBottom: '12px', display: 'block' }}>EXPERIENCES</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {stop.activities.map(act => (
                    <div
                      key={act.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'var(--hover)',
                        borderRadius: 'var(--r-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles size={14} color="#ec4899" />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
                          {act.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                        {formatCurrency(act.cost || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vehicles & Guides */}
            {((stop.vehicleRentals || []).length > 0 || (stop.guideBookings || []).length > 0) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                {(stop.vehicleRentals || []).map(v => (
                  <span key={v.id} className="gt-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Car size={13} color="#10b981" /> {v.name} ({formatCurrency(v.totalCost || v.dailyRate || 0)})
                  </span>
                ))}
                {(stop.guideBookings || []).map(g => (
                  <span key={g.id} className="gt-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={13} color="#c9a96e" /> {g.name} ({formatCurrency(g.totalCost || g.rate || 0)})
                  </span>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
