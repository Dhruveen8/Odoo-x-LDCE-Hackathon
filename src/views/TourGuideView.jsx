import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Search,
  Star,
  Globe,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Sparkles,
  Layers,
  MessageSquare,
  BadgeCheck,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

export default function TourGuideView() {
  const {
    tourGuidesData,
    guideSpecializations,
    guideLanguages,
    destinations,
    activeTrip,
    addGuideBookingToStop,
    formatCurrency,
    setCurrentView,
    selectedStopContext,
    setSelectedStopContext
  } = useApp();

  // Filter States
  const [selectedCity, setSelectedCity] = useState(selectedStopContext?.cityId || 'all');
  const [selectedSpec, setSelectedSpec] = useState('All Specializations');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [minRating, setMinRating] = useState(4.5);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(300);

  // Modal Booking State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [targetStopId, setTargetStopId] = useState(
    selectedStopContext?.stopId || (activeTrip?.stops?.[0]?.id || '')
  );

  // Booking Form State
  const defaultDate = activeTrip?.startDate || new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState(defaultDate);
  const [bookingDuration, setBookingDuration] = useState('Full Day (8h)');
  const [customNotes, setCustomNotes] = useState('');

  // Filtered Tour Guides
  const filteredGuides = useMemo(() => {
    return tourGuidesData.filter(g => {
      // City
      if (selectedCity !== 'all' && g.cityId !== selectedCity) return false;
      // Specialization
      if (selectedSpec !== 'All Specializations' && g.specialization !== selectedSpec) return false;
      // Language
      if (selectedLanguage !== 'All Languages' && !g.languages.includes(selectedLanguage)) return false;
      // Rating
      if (g.rating < minRating) return false;
      // Price
      if (g.pricePerDay > maxPrice) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = g.name.toLowerCase().includes(q);
        const matchesCity = g.cityName.toLowerCase().includes(q);
        const matchesBio = g.bio.toLowerCase().includes(q);
        const matchesSpec = g.specialization.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesBio && !matchesSpec) return false;
      }
      return true;
    });
  }, [tourGuidesData, selectedCity, selectedSpec, selectedLanguage, minRating, maxPrice, searchQuery]);

  // Dynamic cost calculation based on duration
  const estimatedCost = useMemo(() => {
    if (!selectedGuide) return 0;
    if (bookingDuration.includes('Half Day')) {
      return Math.round(selectedGuide.pricePerDay * 0.6);
    }
    if (bookingDuration.includes('Sunset')) {
      return Math.round(selectedGuide.pricePerDay * 0.5);
    }
    return selectedGuide.pricePerDay;
  }, [selectedGuide, bookingDuration]);

  const handleOpenBooking = (guide) => {
    setSelectedGuide(guide);
    if (activeTrip?.stops?.length) {
      const matchStop = activeTrip.stops.find(s => s.cityId === guide.cityId) || activeTrip.stops[0];
      setTargetStopId(matchStop.id);
      if (matchStop.arrivalDate) {
        setBookingDate(matchStop.arrivalDate);
      }
    }
    setCustomNotes(`Excited for a guided experience with ${guide.name}!`);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!activeTrip || !targetStopId || !selectedGuide) return;

    addGuideBookingToStop(activeTrip.id, targetStopId, {
      guideId: selectedGuide.id,
      name: selectedGuide.name,
      avatar: selectedGuide.avatar,
      specialization: selectedGuide.specialization,
      languages: selectedGuide.languages,
      rating: selectedGuide.rating,
      date: bookingDate,
      duration: bookingDuration,
      rate: estimatedCost,
      totalCost: estimatedCost,
      notes: customNotes
    });

    setIsModalOpen(false);
    setSelectedStopContext(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* ── Banner Header ── */}
      <div
        className="liquid-glass"
        style={{
          padding: '32px',
          borderRadius: 'var(--r-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge-tag primary">
              <Compass size={14} /> Certified Local Experts
            </span>
            {activeTrip && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Active Trip: <strong>{activeTrip.title}</strong>
              </span>
            )}
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            Local Tour Guides &amp; Private Curators
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.95rem' }}>
            Unlock VIP access, private museum tours, and hidden culinary gems with top-rated certified local guides. Easily add personalized guided days to your itinerary with automatic budget tracking.
          </p>
        </div>

        {activeTrip?.stops?.length > 0 && (
          <button
            onClick={() => setCurrentView('itinerary-builder')}
            className="btn btn-secondary"
            style={{ backdropFilter: 'blur(16px)' }}
          >
            <Layers size={16} />
            <span>Back to Itinerary Builder</span>
          </button>
        )}
      </div>

      {/* ── Filter Bar ── */}
      <div
        className="liquid-glass"
        style={{
          padding: '24px',
          borderRadius: 'var(--r-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        {/* Row 1: Search & City & Specialization */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {/* Search box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search guides by name, bio, specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '38px', height: '42px' }}
            />
          </div>

          {/* City filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="input-field"
              style={{ height: '42px' }}
            >
              <option value="all">🌍 All Destinations ({destinations.length})</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>📍 {d.city}, {d.country}</option>
              ))}
            </select>
          </div>

          {/* Specialization */}
          <div>
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="input-field"
              style={{ height: '42px' }}
            >
              {guideSpecializations.map(sp => (
                <option key={sp} value={sp}>🧭 {sp}</option>
              ))}
            </select>
          </div>

          {/* Language filter */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="input-field"
              style={{ height: '42px' }}
            >
              {guideLanguages.map(l => (
                <option key={l} value={l}>🗣️ {l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          {/* Rating filter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Min Rating:</span>
            {[4.5, 4.8, 4.9].map(r => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className={`badge-tag ${minRating === r ? 'primary' : ''}`}
                style={{ cursor: 'pointer', padding: '5px 12px' }}
              >
                ★ {r}+
              </button>
            ))}
          </div>

          {/* Price range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Max: <strong>{formatCurrency(maxPrice)}/day</strong>
            </span>
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ accentColor: 'var(--brand-indigo)', width: '120px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* ── Guides Grid ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Featured Local Guides <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>({filteredGuides.length} verified)</span>
          </h3>
          {(selectedCity !== 'all' || selectedSpec !== 'All Specializations' || selectedLanguage !== 'All Languages' || minRating > 4.5) && (
            <button
              onClick={() => {
                setSelectedCity('all');
                setSelectedSpec('All Specializations');
                setSelectedLanguage('All Languages');
                setMinRating(4.5);
                setMaxPrice(300);
                setSearchQuery('');
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredGuides.length === 0 ? (
          <div className="liquid-glass" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
            <Compass size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No tour guides found</h4>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>
              Try adjusting your language or specialization filters to see more verified guides.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredGuides.map(guide => (
              <motion.div
                key={guide.id}
                whileHover={{ y: -6 }}
                className="liquid-glass-card"
                style={{
                  borderRadius: 'var(--r-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  padding: '24px'
                }}
              >
                {/* Header: Avatar, Name, Rating */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={guide.avatar}
                      alt={guide.name}
                      style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid var(--brand-indigo)' }}
                    />
                    <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'var(--brand-emerald)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={13} color="#fff" />
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{guide.name}</h4>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--brand-sky)', fontWeight: 600 }}>
                      📍 {guide.cityName} • {guide.experienceYears} yrs experience
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontSize: '0.82rem', fontWeight: 700 }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span>{guide.rating}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({guide.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Specialization Badge & Languages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0 12px' }}>
                  <div>
                    <span className="badge-tag primary" style={{ fontSize: '0.78rem' }}>
                      🧭 {guide.specialization}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <Globe size={14} color="var(--brand-violet)" />
                    <span>Speaks: <strong>{guide.languages.join(', ')}</strong></span>
                  </div>
                </div>

                {/* Bio snippet */}
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, flex: 1, marginBottom: '14px' }}>
                  "{guide.bio}"
                </p>

                {/* Highlights List */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {guide.highlights.map((hl, hli) => (
                    <span key={hli} style={{ fontSize: '0.72rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px' }}>
                      ✨ {hl}
                    </span>
                  ))}
                </div>

                {/* Price & Booking Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatCurrency(guide.pricePerDay)}
                      <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}> / day</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      ~{formatCurrency(guide.pricePerHour)}/hr rate
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleOpenBooking(guide)}
                    className="btn btn-sm btn-primary"
                  >
                    <Plus size={14} />
                    <span>Book Guide</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Guide Booking Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Hire Local Tour Guide"
        subtitle={selectedGuide ? `${selectedGuide.name} • ${selectedGuide.cityName}` : ''}
      >
        {selectedGuide && (
          <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Guide Card Header */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                borderRadius: 'var(--r-md)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                alignItems: 'center'
              }}
            >
              <img
                src={selectedGuide.avatar}
                alt={selectedGuide.name}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-indigo)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selectedGuide.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {selectedGuide.specialization} • {selectedGuide.experienceYears} Years Exp
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--brand-sky)', marginTop: '2px' }}>
                  🗣️ {selectedGuide.languages.join(', ')}
                </div>
              </div>
            </div>

            {/* Target Stop Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Bind to Itinerary Stop:
              </label>
              {activeTrip?.stops?.length > 0 ? (
                <select
                  value={targetStopId}
                  onChange={(e) => {
                    setTargetStopId(e.target.value);
                    const matchStop = activeTrip.stops.find(s => s.id === e.target.value);
                    if (matchStop?.arrivalDate) {
                      setBookingDate(matchStop.arrivalDate);
                    }
                  }}
                  className="input-field"
                  required
                >
                  {activeTrip.stops.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      Stop {idx + 1}: {s.cityName}, {s.country} ({s.stayDays} days)
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--brand-amber)' }}>
                  ⚠️ Your active trip has no stops yet. Please add a city stop in the Itinerary Builder first.
                </div>
              )}
            </div>

            {/* Date & Duration Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Tour Date:
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Tour Duration:
                </label>
                <select
                  value={bookingDuration}
                  onChange={(e) => setBookingDuration(e.target.value)}
                  className="input-field"
                >
                  {selectedGuide.availableDurations.map(dur => (
                    <option key={dur} value={dur}>{dur}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Notes & Special Requests */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Special Requests / Tour Preferences:
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Focus on secret photo spots, skip-the-line museums, or food allergy restrictions..."
                className="input-field"
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>

            {/* Total Estimated Cost Panel */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--r-md)',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(99,102,241,0.15) 100%)',
                border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Duration: {bookingDuration}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Estimated Guide Fee
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6ee7b7', fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(estimatedCost)}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!activeTrip || !targetStopId}
              >
                <CheckCircle2 size={16} />
                <span>Confirm &amp; Add Guide</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
