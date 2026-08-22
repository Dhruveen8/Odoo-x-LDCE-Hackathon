import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Clock, 
  DollarSign, 
  MapPin, 
  Plus, 
  Check, 
  Filter, 
  Star 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ActivitySearchView() {
  const { 
    presetActivities, 
    activeTrip, 
    addActivityToStop, 
    formatCurrency 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');

  const categories = ['All', 'Sightseeing', 'Culture & Art', 'Food & Dining', 'Adventure & Nature', 'Relaxation'];
  
  // Unique cities in activities
  const cities = ['All', ...new Set(presetActivities.map(a => a.cityName))];

  const filteredActivities = presetActivities.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.cityName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || act.cityName === selectedCity;

    return matchesSearch && matchesCategory && matchesCity;
  });

  const handleAddActivity = (activity) => {
    if (!activeTrip || !activeTrip.stops || activeTrip.stops.length === 0) return;

    // Find the stop that matches this activity's city or default to first stop
    const matchingStop = activeTrip.stops.find(s => s.cityName.toLowerCase() === activity.cityName.toLowerCase()) || activeTrip.stops[0];

    addActivityToStop(activeTrip.id, matchingStop.id, {
      title: activity.title,
      category: activity.category,
      cost: activity.cost,
      durationHours: activity.durationHours,
      day: 1,
      time: activity.timeOfDay === 'Morning' ? '09:00' : activity.timeOfDay === 'Evening' ? '18:00' : '14:00',
      notes: activity.description
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge-tag primary">
              <Sparkles size={14} /> Local Experiences & Tours
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {presetActivities.length}+ Curated Activities
            </span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Enrich Your Journey with <span className="text-gradient">Unforgettable Moments</span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            From dawn volcanic hikes and private pasta masterclasses to skyline observatory sunsets and midnight flamenco.
          </p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search experiences (e.g. food tours, temples, sunrise hike, opera)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '48px', height: '48px', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "btn btn-sm btn-primary" : "btn btn-sm btn-secondary"}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* City Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredActivities.map((act, idx) => {
          const isAddedInActiveTrip = activeTrip?.stops?.some(s => s.activities?.some(a => a.title === act.title));

          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-travel"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img src={act.image} alt={act.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />

                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge-tag primary" style={{ background: 'rgba(15,23,42,0.75)', color: '#ffffff' }}>
                    {act.category}
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', color: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', opacity: 0.9 }}>
                    <MapPin size={14} />
                    <span>{act.cityName}</span>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{act.title}</h4>
                </div>
              </div>

              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {act.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>⭐ {act.rating} Rating</span>
                  <span>⏱️ {act.durationHours} Hours Duration</span>
                  <span>☀️ {act.timeOfDay}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>EXPERIENCE COST</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{formatCurrency(act.cost)}</div>
                  </div>

                  <button
                    disabled={isAddedInActiveTrip}
                    onClick={() => handleAddActivity(act)}
                    className={isAddedInActiveTrip ? "btn btn-sm btn-ghost" : "btn btn-sm btn-primary"}
                    style={{
                      background: isAddedInActiveTrip ? 'rgba(16, 185, 129, 0.12)' : 'var(--brand-gradient)',
                      color: isAddedInActiveTrip ? 'var(--color-success)' : '#ffffff'
                    }}
                  >
                    {isAddedInActiveTrip ? (
                      <>
                        <Check size={14} />
                        <span>Added to Trip</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>Add to Itinerary</span>
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
