import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Calendar, 
  MapPin, 
  Copy, 
  Trash2, 
  Edit3, 
  Eye, 
  DollarSign, 
  Share2,
  Luggage
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
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.stops?.some(s => s.cityName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>My Saved Itineraries</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Manage, duplicate, and review your multi-city journeys
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenCreateModal}
          className="btn btn-primary"
          style={{ background: 'var(--brand-gradient-sunset)' }}
        >
          <Plus size={18} />
          <span>Plan New Trip</span>
        </motion.button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Search Field */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by trip name or city (e.g. Paris, Tokyo)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '42px', paddingRight: '16px' }}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {['All', 'Upcoming', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? "btn btn-sm btn-primary" : "btn btn-sm btn-secondary"}
              style={{ fontSize: '0.82rem' }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              background: viewMode === 'grid' ? 'var(--bg-secondary)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--brand-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              background: viewMode === 'list' ? 'var(--bg-secondary)' : 'transparent',
              color: viewMode === 'list' ? 'var(--brand-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <List size={16} />
          </button>
        </div>

      </div>

      {/* Trips Display */}
      {filteredTrips.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Luggage size={48} color="var(--text-muted)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>No trips matched your search</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
            Try adjusting your search filters or start a brand new personalized adventure.
          </p>
          <button onClick={onOpenCreateModal} className="btn btn-primary">
            <Plus size={16} /> Plan New Trip
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          <AnimatePresence>
            {filteredTrips.map((trip, idx) => {
              const finances = computeTripFinances(trip);
              return (
                <motion.div
                  key={trip.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="card-travel"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                    <img
                      src={trip.coverImage}
                      alt={trip.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />

                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span className={`badge-tag ${trip.status === 'Upcoming' ? 'primary' : 'success'}`} style={{ background: 'rgba(15, 23, 42, 0.8)', color: '#ffffff' }}>
                        {trip.status}
                      </span>
                    </div>

                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => cloneTrip(trip)}
                        title="Duplicate Trip"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.5)',
                          backdropFilter: 'blur(6px)',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        title="Delete Trip"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(239,68,68,0.7)',
                          backdropFilter: 'blur(6px)',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', color: '#ffffff' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{trip.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>
                        <span>📅 {trip.startDate} to {trip.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {trip.description}
                    </p>

                    {/* Stops badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {trip.stops?.map(stop => (
                        <span key={stop.id} className="badge-tag">
                          📍 {stop.cityName} ({stop.stayDays}d)
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ESTIMATED COST</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{formatCurrency(finances.totalEstimated)}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setActiveTripId(trip.id);
                            setCurrentView('itinerary-view');
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTripId(trip.id);
                            setCurrentView('itinerary-builder');
                          }}
                          className="btn btn-sm btn-primary"
                        >
                          <Edit3 size={14} />
                          <span>Builder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* List View */
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', divideY: '1px solid var(--border-subtle)' }}>
            {filteredTrips.map(trip => {
              const finances = computeTripFinances(trip);
              return (
                <div
                  key={trip.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '240px' }}>
                    <img
                      src={trip.coverImage}
                      alt={trip.title}
                      style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{trip.title}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {trip.startDate} - {trip.endDate} • {trip.stops?.length || 0} Cities
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>EST. BUDGET</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{formatCurrency(finances.totalEstimated)}</div>
                    </div>

                    <span className={`badge-tag ${trip.status === 'Upcoming' ? 'primary' : 'success'}`}>
                      {trip.status}
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setActiveTripId(trip.id);
                          setCurrentView('itinerary-view');
                        }}
                        className="btn btn-sm btn-secondary"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTripId(trip.id);
                          setCurrentView('itinerary-builder');
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => cloneTrip(trip)}
                        className="btn btn-sm btn-ghost"
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="btn btn-sm btn-danger"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
