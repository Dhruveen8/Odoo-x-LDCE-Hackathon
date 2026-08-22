import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Heart, 
  Plus, 
  ArrowUpRight, 
  Star, 
  Sparkles, 
  Compass,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CitySearchView() {
  const { 
    destinations, 
    activeTrip, 
    addStopToTrip, 
    user, 
    toggleWishlist, 
    formatCurrency, 
    addToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedCityModal, setSelectedCityModal] = useState(null);

  const tags = ['ALL', 'CULTURAL', 'BEACH', 'NATURE', 'LUXURY', 'HERITAGE'];

  const filteredDestinations = (destinations || []).filter(dest => {
    const matchesSearch = dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTag === 'ALL') return matchesSearch;
    return matchesSearch && (dest.tags || []).some(t => t.toUpperCase() === selectedTag);
  });

  const handleAddStop = (city) => {
    if (!activeTrip) {
      addToast("No Active Trip", "Please create or select a trip first.", "warning");
      return;
    }
    addStopToTrip(activeTrip.id, city);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 0' }}>
      
      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div>
          <span className="gt-label">GLOBAL DESTINATIONS</span>
          <h1 className="gt-h1" style={{ marginTop: '4px' }}>EXPLORE CITIES</h1>
        </div>

        {/* Active Trip Context pill */}
        {activeTrip && (
          <div className="gt-badge gold" style={{ padding: '8px 16px', fontSize: '12px' }}>
            ADDING TO: {activeTrip.title}
          </div>
        )}
      </div>

      {/* ── Search & Tag Filter Strip ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {/* Full-width Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} color="var(--tertiary)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by city, country or experience (e.g. Paris, Tokyo, Goa)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '52px',
              height: '52px',
              fontSize: '16px',
              borderRadius: 'var(--r-full)'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--r-full)',
                border: '1px solid var(--border)',
                background: selectedTag === tag ? 'var(--primary)' : 'var(--surface)',
                color: selectedTag === tag ? 'var(--bg)' : 'var(--secondary)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Destinations Visual Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
        {filteredDestinations.map((dest) => {
          const isWishlisted = (user?.wishlistDestinations || []).includes(dest.id);
          const isAlreadyInTrip = (activeTrip?.stops || []).some(s => s.cityName.toLowerCase() === dest.city.toLowerCase());

          return (
            <motion.div
              key={dest.id}
              whileHover={{ y: -6 }}
              className="gt-img-card"
              style={{ height: '420px' }}
            >
              <img
                src={dest.image || 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'}
                alt={dest.city}
                loading="lazy"
              />

              {/* Top Floating Badges */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                right: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 2
              }}>
                <span className="gt-badge" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                  {dest.country}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(dest.id);
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isWishlisted ? '#ef4444' : '#fff',
                    transition: 'transform 0.2s'
                  }}
                >
                  <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} />
                </button>
              </div>

              {/* Bottom Editorial Content */}
              <div className="gt-img-card-overlay">
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {dest.city}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', marginTop: '6px' }}>
                  {dest.tagline || 'Rich cultural experiences, architectural marvels, and authentic culinary journeys.'}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', fontWeight: 600 }}>EST. DAILY</span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      {formatCurrency(dest.avgDailyCost || 180)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddStop(dest);
                    }}
                    className="btn btn-sm btn-white"
                  >
                    {isAlreadyInTrip ? (
                      <>
                        <Check size={14} color="var(--primary)" />
                        <span>ADDED</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>ADD TO TRIP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
