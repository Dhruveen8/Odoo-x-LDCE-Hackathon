import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Car, 
  UserCheck, 
  FolderGit2, 
  Share2,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ItineraryDetailView() {
  const { activeTrip, setCurrentView, formatCurrency, computeTripFinances } = useApp();

  if (!activeTrip) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center' }}>
        <h2 className="gt-h2">No active trip selected</h2>
        <button onClick={() => setCurrentView('my-trips')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Trips
        </button>
      </div>
    );
  }

  const finances = computeTripFinances(activeTrip);
  const stops = activeTrip.stops || [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 0' }}>
      
      {/* ── Top Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button
          onClick={() => setCurrentView('my-trips')}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft size={16} />
          <span>BACK TO TRIPS</span>
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCurrentView('itinerary-builder')}
            className="btn btn-secondary btn-sm"
          >
            <FolderGit2 size={14} />
            <span>EDIT ITINERARY</span>
          </button>
          <button
            onClick={() => setCurrentView('public-trip')}
            className="btn btn-primary btn-sm"
          >
            <Share2 size={14} />
            <span>SHARE</span>
          </button>
        </div>
      </div>

      {/* ── Large Hero Cover ── */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--r-2xl)',
        overflow: 'hidden',
        height: '380px',
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
          <span className="gt-label" style={{ color: 'var(--accent-gold)' }}>CURATED ROUTE</span>
          <h1 className="gt-display" style={{ color: '#fff', marginTop: '6px', fontSize: 'clamp(36px, 5vw, 64px)' }}>
            {activeTrip.title}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
            {activeTrip.startDate} — {activeTrip.endDate} • {stops.length} Destination Stops • Est. {formatCurrency(finances.totalEstimated)}
          </p>
        </div>
      </div>

      {/* ── Timeline Stops ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {stops.map((stop, sIdx) => (
          <div key={stop.id || sIdx} style={{ position: 'relative' }}>
            
            {/* Stop Section Header */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '20px' }}>
              <span className="gt-label" style={{ fontSize: '14px', fontWeight: 900, color: 'var(--accent-gold)' }}>
                0{sIdx + 1}
              </span>
              <h2 className="gt-h2" style={{ color: 'var(--primary)' }}>
                {stop.cityName}, <span style={{ color: 'var(--tertiary)', fontWeight: 400 }}>{stop.country}</span>
              </h2>
              <span style={{ fontSize: '13px', color: 'var(--secondary)', marginLeft: 'auto' }}>
                {stop.stayDays || 3} DAYS STAY
              </span>
            </div>

            {/* Stop Content Box */}
            <div className="gt-card" style={{ padding: '28px', borderRadius: 'var(--r-xl)' }}>
              
              {/* Hotel / Lodging */}
              {stop.lodgingName && (
                <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
                  <span className="gt-label-sm">ACCOMMODATION</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>
                    {stop.lodgingName}
                  </div>
                </div>
              )}

              {/* Experiences */}
              <div style={{ marginBottom: '24px' }}>
                <span className="gt-label-sm" style={{ marginBottom: '12px', display: 'block' }}>EXPERIENCES</span>
                {(stop.activities || []).length === 0 ? (
                  <span style={{ fontSize: '13px', color: 'var(--tertiary)' }}>No activities scheduled.</span>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stop.activities.map(act => (
                      <div
                        key={act.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          borderRadius: 'var(--r-md)',
                          background: 'var(--hover)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Sparkles size={15} color="#ec4899" />
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
                )}
              </div>

              {/* Transit & Guide Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                {/* Vehicles */}
                <div>
                  <span className="gt-label-sm" style={{ marginBottom: '8px', display: 'block' }}>VEHICLE RENTALS</span>
                  {(stop.vehicleRentals || []).length === 0 ? (
                    <span style={{ fontSize: '13px', color: 'var(--tertiary)' }}>None reserved.</span>
                  ) : (
                    stop.vehicleRentals.map(v => (
                      <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                        <Car size={14} color="#10b981" />
                        <span>{v.name} ({formatCurrency(v.totalCost || v.dailyRate || 0)})</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Tour Guides */}
                <div>
                  <span className="gt-label-sm" style={{ marginBottom: '8px', display: 'block' }}>TOUR GUIDES</span>
                  {(stop.guideBookings || []).length === 0 ? (
                    <span style={{ fontSize: '13px', color: 'var(--tertiary)' }}>None booked.</span>
                  ) : (
                    stop.guideBookings.map(g => (
                      <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                        <UserCheck size={14} color="#c9a96e" />
                        <span>{g.name} ({formatCurrency(g.totalCost || g.rate || 0)})</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
