import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  Clock, 
  Plus, 
  Check, 
  MapPin, 
  Star,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ActivitySearchView() {
  const { 
    presetActivities, 
    activeTrip, 
    addActivityToStop, 
    formatCurrency, 
    addToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [addingAct, setAddingAct] = useState(null);
  const [selectedStopId, setSelectedStopId] = useState(activeTrip?.stops?.[0]?.id || '');
  const [targetDay, setTargetDay] = useState(1);

  const stops = activeTrip?.stops || [];
  const categories = ['ALL', 'Culture', 'Dining', 'Adventure', 'Sightseeing', 'Nature', 'Wellness'];

  const filteredActivities = (presetActivities || []).filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || (act.category || '').toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCat;
  });

  const handleConfirmAdd = () => {
    if (!activeTrip) {
      addToast("No Active Trip", "Please create or select a trip first.", "warning");
      return;
    }
    if (!selectedStopId) {
      addToast("Select a Stop", "Please choose which stop to assign this experience to.", "warning");
      return;
    }

    addActivityToStop(activeTrip.id, selectedStopId, {
      title: addingAct.title,
      category: addingAct.category || 'Sightseeing',
      cost: Number(addingAct.cost || 0),
      durationHours: Number(addingAct.durationHours || 2),
      day: Number(targetDay),
      time: '11:00 AM'
    });

    setAddingAct(null);
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
          <span className="gt-label">CURATED EXPERIENCES</span>
          <h1 className="gt-h1" style={{ marginTop: '4px' }}>ACTIVITIES</h1>
        </div>

        {activeTrip && (
          <div className="gt-badge gold" style={{ padding: '8px 16px', fontSize: '12px' }}>
            TARGET TRIP: {activeTrip.title}
          </div>
        )}
      </div>

      {/* ── Search & Filters ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '36px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} color="var(--tertiary)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search experiences (e.g. Scuba diving, Museum tour, Sunset cruise)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '52px',
              height: '50px',
              borderRadius: 'var(--r-full)'
            }}
          />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--r-full)',
                border: '1px solid var(--border)',
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--surface)',
                color: selectedCategory === cat ? 'var(--bg)' : 'var(--secondary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredActivities.map((act) => (
          <motion.div
            key={act.id}
            whileHover={{ y: -6 }}
            className="gt-card"
            style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--r-xl)' }}
          >
            {/* Image */}
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
              <img
                src={act.image || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'}
                alt={act.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span className="gt-badge" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                  {act.category || 'Experience'}
                </span>
                {act.city && (
                  <span className="gt-badge" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                    {act.city}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2 }}>
                  {act.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                  {act.description || 'Curated local experience with certified local hosts and flexible schedules.'}
                </p>
              </div>

              {/* Price & Action */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatCurrency(act.cost || 0)}
                </span>

                <button
                  onClick={() => setAddingAct(act)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>ADD</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Add to Stop Modal ── */}
      <AnimatePresence>
        {addingAct && (
          <div className="gt-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="gt-modal"
              style={{ padding: '32px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <span className="gt-label">ADD TO ITINERARY</span>
                  <h3 className="gt-h3" style={{ marginTop: '2px' }}>{addingAct.title}</h3>
                </div>
                <button onClick={() => setAddingAct(null)} className="icon-btn">
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>SELECT STOP</label>
                  {stops.length === 0 ? (
                    <div style={{ padding: '12px', background: 'var(--hover)', borderRadius: 'var(--r-md)', fontSize: '13px', color: 'var(--secondary)' }}>
                      No destination stops in active trip. Please add a stop first.
                    </div>
                  ) : (
                    <select
                      value={selectedStopId}
                      onChange={(e) => setSelectedStopId(e.target.value)}
                      className="input-field"
                    >
                      {stops.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.cityName} ({s.country})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>DAY OF STOP</label>
                  <input
                    type="number"
                    min="1"
                    value={targetDay}
                    onChange={(e) => setTargetDay(Number(e.target.value))}
                    className="input-field"
                  />
                </div>

                <button
                  onClick={handleConfirmAdd}
                  disabled={stops.length === 0}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  <Check size={16} />
                  <span>CONFIRM ADDITION</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
