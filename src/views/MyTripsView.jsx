import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  Copy, 
  Trash2, 
  ArrowUpRight, 
  Share2,
  FolderGit2,
  PieChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MyTripsView({ onOpenCreateModal }) {
  const { 
    trips, 
    activeTripId, 
    setActiveTripId, 
    setCurrentView, 
    deleteTrip, 
    cloneTrip, 
    formatCurrency, 
    computeTripFinances 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'UPCOMING' | 'COMPLETED'

  const filteredTrips = (trips || []).filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.stops || []).some(s => s.cityName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'UPCOMING') return matchesSearch && trip.status !== 'Completed';
    if (filterStatus === 'COMPLETED') return matchesSearch && trip.status === 'Completed';
    return matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 0' }}>
      
      {/* ── Page Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div>
          <span className="gt-label">PORTFOLIO</span>
          <h1 className="gt-h1" style={{ marginTop: '4px' }}>YOUR TRIPS</h1>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="btn btn-primary btn-lg"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>NEW TRIP</span>
        </button>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
          <Search size={15} color="var(--tertiary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by trip or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '42px', borderRadius: 'var(--r-full)' }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-full)',
          padding: '4px'
        }}>
          {['ALL', 'UPCOMING', 'COMPLETED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--r-full)',
                border: 'none',
                background: filterStatus === status ? 'var(--primary)' : 'transparent',
                color: filterStatus === status ? 'var(--bg)' : 'var(--secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── Trips Editorial Cards Grid ── */}
      {filteredTrips.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          background: 'var(--surface)',
          borderRadius: 'var(--r-2xl)',
          border: '1px solid var(--border)'
        }}>
          <h3 className="gt-h3" style={{ color: 'var(--primary)' }}>No journeys found</h3>
          <p className="gt-body" style={{ marginTop: '8px', maxWidth: '360px', margin: '8px auto 24px' }}>
            Start planning your next escape with our multi-city itinerary builder.
          </p>
          <button onClick={onOpenCreateModal} className="btn btn-primary">
            <Plus size={16} />
            <span>CREATE FIRST TRIP</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
          {filteredTrips.map((trip) => {
            const finances = computeTripFinances(trip);
            return (
              <motion.div
                key={trip.id}
                whileHover={{ y: -6 }}
                className="gt-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 'var(--r-2xl)',
                  position: 'relative'
                }}
              >
                {/* Trip Cover Visual */}
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img
                    src={trip.coverImage || 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'}
                    alt={trip.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4) 100%)'
                  }} />

                  {/* Badges on visual */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    right: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span className="gt-badge" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                      {trip.status || 'Upcoming'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      {formatCurrency(finances.totalEstimated)}
                    </span>
                  </div>

                  <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                      {trip.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                      {trip.startDate} — {trip.endDate}
                    </p>
                  </div>
                </div>

                {/* Trip Content Info */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  
                  {/* Stops Strip */}
                  <div style={{ marginBottom: '20px' }}>
                    <span className="gt-label-sm" style={{ marginBottom: '8px', display: 'block' }}>ITINERARY STOPS</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(trip.stops || []).length === 0 ? (
                        <span style={{ fontSize: '13px', color: 'var(--tertiary)' }}>No stops added yet</span>
                      ) : (
                        trip.stops.map((stop, sIdx) => (
                          <span key={stop.id || sIdx} className="gt-badge">
                            {stop.cityName}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setActiveTripId(trip.id);
                          setCurrentView('itinerary-view');
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        <span>VIEW</span>
                        <ArrowUpRight size={14} />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTripId(trip.id);
                          setCurrentView('itinerary-builder');
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <FolderGit2 size={13} />
                        <span>BUILDER</span>
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => cloneTrip(trip)}
                        className="icon-btn"
                        title="Duplicate Trip"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="icon-btn"
                        title="Delete Trip"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
