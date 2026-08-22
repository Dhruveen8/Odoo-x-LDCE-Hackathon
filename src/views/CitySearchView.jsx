import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Plus, 
  Heart, 
  DollarSign, 
  Star, 
  Compass, 
  Sparkles, 
  Calendar, 
  Check, 
  Globe 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CitySearchView() {
  const { 
    destinations, 
    user, 
    toggleWishlist, 
    activeTrip, 
    addStopToTrip, 
    setCurrentView,
    formatCurrency 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [costFilter, setCostFilter] = useState('All');

  const regions = ['All', 'Europe', 'Asia', 'North America', 'Africa', 'Oceania', 'Middle East'];
  const costTiers = ['All', '$', '$$', '$$$', '$$$$'];

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
    const matchesCost = costFilter === 'All' || dest.costIndex === costFilter;

    return matchesSearch && matchesRegion && matchesCost;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge-tag primary">
              <Globe size={14} /> Global City Explorer
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {destinations.length} Verified Hotspots
            </span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Find Your Next <span className="text-gradient">Dream Stop</span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Discover curated cities, local cost benchmarks, popular travel seasons, and seamlessly inject them into your multi-city route.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Search input */}
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search cities, countries, or styles (e.g. Kyoto, Beach, Temples, France)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '48px', height: '48px', fontSize: '1rem' }}
          />
        </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Region Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {regions.map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={selectedRegion === reg ? "btn btn-sm btn-primary" : "btn btn-sm btn-secondary"}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Cost Index Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cost:</span>
            {costTiers.map(cost => (
              <button
                key={cost}
                onClick={() => setCostFilter(cost)}
                className={costFilter === cost ? "btn btn-sm btn-primary" : "btn btn-sm btn-ghost"}
                style={{ fontSize: '0.8rem', padding: '4px 10px' }}
              >
                {cost}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Destination Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {filteredDestinations.map((dest, idx) => {
          const isWishlisted = user.wishlistDestinations?.includes(dest.id);
          const isAlreadyInTrip = activeTrip?.stops?.some(s => s.cityId === dest.id);

          return (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-travel"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {/* Photo & badges */}
              <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                <img src={dest.image} alt={dest.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />

                <button
                  onClick={() => toggleWishlist(dest.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={18} color={isWishlisted ? '#ef4444' : '#ffffff'} fill={isWishlisted ? '#ef4444' : 'none'} />
                </button>

                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                  <span className="badge-tag" style={{ background: 'rgba(0,0,0,0.6)', color: '#ffffff', backdropFilter: 'blur(6px)' }}>
                    {dest.region}
                  </span>
                  <span className="badge-tag" style={{ background: 'rgba(0,0,0,0.6)', color: '#ffffff', backdropFilter: 'blur(6px)' }}>
                    {dest.costIndex} Tier
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', color: '#ffffff' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>{dest.city}, {dest.country}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>
                    <span>⭐ {dest.rating}</span>
                    <span>🔥 {dest.popularity}% Popularity</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {dest.description}
                </p>

                {/* Highlights */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Top Highlights
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {dest.highlights.map((hl, hIdx) => (
                      <span key={hIdx} className="badge-tag" style={{ fontSize: '0.75rem' }}>
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics & Add Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AVG. DAILY SPEND</div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{formatCurrency(dest.avgDailyCost)}/day</div>
                  </div>

                  {activeTrip ? (
                    <button
                      disabled={isAlreadyInTrip}
                      onClick={() => addStopToTrip(activeTrip.id, dest)}
                      className={isAlreadyInTrip ? "btn btn-sm btn-ghost" : "btn btn-sm btn-primary"}
                      style={{
                        background: isAlreadyInTrip ? 'var(--bg-tertiary)' : 'var(--brand-gradient-sunset)',
                        color: isAlreadyInTrip ? 'var(--text-muted)' : '#ffffff'
                      }}
                    >
                      {isAlreadyInTrip ? (
                        <>
                          <Check size={14} />
                          <span>In Itinerary</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Add to Trip</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button onClick={() => setCurrentView('my-trips')} className="btn btn-sm btn-secondary">
                      Select Trip
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
