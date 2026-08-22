import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  Search, 
  Star, 
  Plus, 
  Check, 
  X, 
  MapPin, 
  Languages, 
  Compass,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TourGuideView() {
  const { 
    tourGuidesData, 
    guideSpecializations, 
    guideLanguages, 
    activeTrip, 
    addGuideBookingToStop, 
    formatCurrency, 
    addToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('ALL');
  const [bookingGuide, setBookingGuide] = useState(null);

  // Booking Modal State
  const [selectedStopId, setSelectedStopId] = useState(activeTrip?.stops?.[0]?.id || '');
  const [bookingDate, setBookingDate] = useState(activeTrip?.startDate || '');
  const [duration, setDuration] = useState('Full Day (8h)');

  const stops = activeTrip?.stops || [];

  const filteredGuides = (tourGuidesData || []).filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.specialization || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpec = selectedSpec === 'ALL' || (g.specialization || '').toLowerCase().includes(selectedSpec.toLowerCase());

    return matchesSearch && matchesSpec;
  });

  const handleConfirmBooking = () => {
    if (!activeTrip) {
      addToast("No Active Trip", "Please create a trip first.", "warning");
      return;
    }
    if (!selectedStopId) {
      addToast("Select a Destination Stop", "Please choose which stop to assign the guide booking to.", "warning");
      return;
    }

    addGuideBookingToStop(activeTrip.id, selectedStopId, {
      ...bookingGuide,
      date: bookingDate || activeTrip.startDate,
      duration,
      totalCost: Number(bookingGuide.rate || bookingGuide.dailyRate || 250),
      rate: Number(bookingGuide.rate || bookingGuide.dailyRate || 250)
    });

    setBookingGuide(null);
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
          <span className="gt-label">LOCAL CONCIERGE</span>
          <h1 className="gt-h1" style={{ marginTop: '4px' }}>CERTIFIED GUIDES</h1>
        </div>

        {activeTrip && (
          <div className="gt-badge gold" style={{ padding: '8px 16px', fontSize: '12px' }}>
            TRIP: {activeTrip.title}
          </div>
        )}
      </div>

      {/* ── Search & Filter Controls ── */}
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
            placeholder="Search by guide name, city, or specialization (e.g. History, Food, Architecture)..."
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

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {['ALL', 'Historical', 'Culinary', 'Architecture', 'Nature', 'Photography'].map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--r-full)',
                border: '1px solid var(--border)',
                background: selectedSpec === spec ? 'var(--primary)' : 'var(--surface)',
                color: selectedSpec === spec ? 'var(--bg)' : 'var(--secondary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* ── Guides Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
        {filteredGuides.map(guide => (
          <motion.div
            key={guide.id}
            whileHover={{ y: -6 }}
            className="gt-card"
            style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--r-2xl)' }}
          >
            {/* Guide Photo */}
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
              <img
                src={guide.avatar || guide.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'}
                alt={guide.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
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
                  {guide.city}
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#fff',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '4px 10px',
                  borderRadius: 'var(--r-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" /> {guide.rating || 4.9}
                </span>
              </div>
            </div>

            {/* Guide Info */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>
                  {guide.name}
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--secondary)', display: 'block', marginTop: '2px' }}>
                  {guide.specialization} • {guide.experienceYears || 6}+ Years Exp
                </span>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                  {(guide.languages || ['English']).map((lang, lIdx) => (
                    <span key={lIdx} className="gt-badge" style={{ fontSize: '10px' }}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--tertiary)', fontWeight: 600, display: 'block' }}>DAILY FEE</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                    {formatCurrency(guide.rate || guide.dailyRate || 250)}
                  </span>
                </div>

                <button
                  onClick={() => setBookingGuide(guide)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>BOOK</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Booking Modal ── */}
      <AnimatePresence>
        {bookingGuide && (
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
                  <span className="gt-label">BOOK PRIVATE GUIDE</span>
                  <h3 className="gt-h3" style={{ marginTop: '2px' }}>{bookingGuide.name}</h3>
                </div>
                <button onClick={() => setBookingGuide(null)} className="icon-btn">
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Select Stop */}
                <div>
                  <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>
                    SELECT ITINERARY STOP
                  </label>
                  {stops.length === 0 ? (
                    <div style={{ padding: '12px', background: 'var(--hover)', borderRadius: 'var(--r-md)', fontSize: '13px', color: 'var(--secondary)' }}>
                      No stops in active trip. Please add a destination stop first.
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

                {/* Duration */}
                <div>
                  <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>
                    SESSION DURATION
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="input-field"
                  >
                    <option value="Half Day (4h)">Half Day (4h)</option>
                    <option value="Full Day (8h)">Full Day (8h)</option>
                    <option value="Multi-Day Tour">Multi-Day Tour</option>
                  </select>
                </div>

                {/* Summary */}
                <div style={{
                  padding: '16px',
                  background: 'var(--hover)',
                  borderRadius: 'var(--r-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>EST. TOTAL</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-blue)' }}>
                    {formatCurrency(Number(bookingGuide.rate || bookingGuide.dailyRate || 250))}
                  </span>
                </div>

                {/* Submit */}
                <button
                  onClick={handleConfirmBooking}
                  disabled={stops.length === 0}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Check size={16} />
                  <span>CONFIRM BOOKING</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
