import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Plus, 
  MapPin, 
  Calendar, 
  Compass, 
  Car, 
  UserCheck, 
  Sparkles,
  PieChart,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardView({ onOpenCreateModal }) {
  const { 
    trips, 
    activeTrip, 
    setActiveTripId, 
    setCurrentView, 
    destinations, 
    user, 
    formatCurrency, 
    computeTripFinances 
  } = useApp();

  const [hoveredDest, setHoveredDest] = useState(null);
  const featuredTrip = activeTrip || trips[0];
  const finances = computeTripFinances(featuredTrip);

  // Top destinations for showcase
  const topDestinations = (destinations || []).slice(0, 6);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── 1. HERO SECTION: Large Immersive Visual & Minimal Bold Typography ── */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(32px, 6vw, 72px)',
        overflow: 'hidden',
        background: '#0D0D0D',
        color: '#FFFFFF'
      }}>
        {/* Full-bleed background imagery with subtle zoom */}
        <motion.div
          initial={{ scale: 1.08, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 0.75 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: featuredTrip?.coverImage 
              ? `url(${featuredTrip.coverImage})` 
              : 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
        {/* Editorial gradient overlays */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(13,13,13,0.35) 0%, rgba(13,13,13,0.2) 40%, rgba(13,13,13,0.85) 100%)',
          zIndex: 1
        }} />

        {/* Hero Top Bar */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: 'var(--accent-gold)' 
            }} />
            <span className="gt-label-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              GLOBETROTTER EDITORIAL
            </span>
          </div>

          <div className="hidden-mobile" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
              {user?.name || 'Explorer'} • {user?.travelStyle || 'Curated Journeys'}
            </span>
          </div>
        </div>

        {/* Hero Center Editorial Headlines */}
        <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0 40px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="gt-label" style={{ color: 'var(--accent-gold)', marginBottom: '12px', display: 'block' }}>
              SUMMER / AUTUMN 2026
            </span>
            <h1 className="gt-display" style={{ color: '#FFFFFF', maxWidth: '900px' }}>
              EXPLORE<br />THE WORLD.
            </h1>
          </motion.div>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '16px', 
            marginTop: '36px', 
            alignItems: 'center' 
          }}>
            <button
              onClick={onOpenCreateModal}
              className="btn btn-xl btn-white"
              style={{ borderRadius: 'var(--r-full)' }}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>PLAN A TRIP</span>
            </button>

            <button
              onClick={() => setCurrentView('city-search')}
              className="btn btn-xl"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                borderRadius: 'var(--r-full)'
              }}
            >
              <span>EXPLORE DESTINATIONS</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Hero Bottom Meta Strip */}
        {featuredTrip && (
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '20px',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '24px'
          }}>
            <div>
              <span className="gt-label-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>CURRENT ESCAPE</span>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
                {featuredTrip.title}
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>
                {featuredTrip.startDate} — {featuredTrip.endDate} • {featuredTrip.stops?.length || 0} Destinations
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setActiveTripId(featuredTrip.id);
                  setCurrentView('itinerary-view');
                }}
                className="btn btn-sm btn-white"
              >
                <span>VIEW ITINERARY</span>
                <ArrowUpRight size={14} />
              </button>
              <button
                onClick={() => {
                  setActiveTripId(featuredTrip.id);
                  setCurrentView('budget');
                }}
                className="btn btn-sm"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
              >
                <span>EST. {formatCurrency(finances.totalEstimated)}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── 2. FEATURED ITINERARY PREVIEW ── */}
      {featuredTrip && (
        <section className="gt-section" style={{ background: 'var(--bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <span className="gt-label">CURRENT JOURNEY</span>
              <h2 className="gt-h2" style={{ marginTop: '6px' }}>{featuredTrip.title}</h2>
            </div>
            <button
              onClick={() => {
                setActiveTripId(featuredTrip.id);
                setCurrentView('itinerary-builder');
              }}
              className="btn btn-secondary btn-sm"
            >
              <span>EDIT ITINERARY</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Stops Horizontal Timeline Strip */}
          <div className="gt-hscroll" style={{ gap: '20px' }}>
            {(featuredTrip.stops || []).map((stop, idx) => (
              <motion.div
                key={stop.id || idx}
                whileHover={{ y: -6 }}
                onClick={() => {
                  setActiveTripId(featuredTrip.id);
                  setCurrentView('itinerary-builder');
                }}
                style={{
                  minWidth: '280px',
                  maxWidth: '320px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-xl)',
                  padding: '24px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '200px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="gt-badge gold">STOP 0{idx + 1}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--secondary)' }}>
                      {stop.stayDays || 3} DAYS
                    </span>
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)' }}>
                    {stop.cityName}
                  </h3>
                  <span style={{ fontSize: '13px', color: 'var(--secondary)' }}>{stop.country}</span>
                </div>

                <div style={{ 
                  borderTop: '1px solid var(--border)', 
                  paddingTop: '16px', 
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: 'var(--secondary)'
                }}>
                  <span>{stop.activities?.length || 0} Experiences</span>
                  <ArrowUpRight size={14} color="var(--primary)" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── 3. YOUR SAVED TRIPS EDITORIAL LIST ── */}
      <section className="gt-section-sm" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <span className="gt-label">YOUR TRIPS</span>
            <h2 className="gt-h3" style={{ marginTop: '4px' }}>PLANNED ESCAPES</h2>
          </div>
          <button
            onClick={() => setCurrentView('my-trips')}
            className="btn btn-ghost btn-sm"
          >
            <span>VIEW ALL ({trips?.length || 0})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(trips || []).slice(0, 4).map((t, idx) => {
            const tFin = computeTripFinances(t);
            return (
              <motion.div
                key={t.id}
                whileHover={{ backgroundColor: 'var(--hover)' }}
                onClick={() => {
                  setActiveTripId(t.id);
                  setCurrentView('itinerary-view');
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1.5fr 1fr 1fr auto',
                  alignItems: 'center',
                  padding: '20px 16px',
                  borderBottom: idx < trips.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  borderRadius: 'var(--r-md)',
                  transition: 'background-color 0.2s',
                  gap: '16px'
                }}
              >
                <span className="gt-label" style={{ color: 'var(--tertiary)' }}>
                  0{idx + 1}
                </span>

                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
                    {t.title}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--secondary)' }}>
                    {t.stops?.length || 0} STOPS • {t.status || 'Planned'}
                  </span>
                </div>

                <div className="hidden-mobile">
                  <span style={{ fontSize: '13px', color: 'var(--secondary)' }}>
                    {t.startDate} — {t.endDate}
                  </span>
                </div>

                <div className="hidden-mobile">
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                    {formatCurrency(tFin.totalEstimated)}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--tertiary)', display: 'block' }}>
                    EST. BUDGET
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowRight size={16} color="var(--tertiary)" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 4. POPULAR DESTINATIONS: Full-Bleed Editorial Grid ── */}
      <section className="gt-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
          <div>
            <span className="gt-label">CURATED COLLECTION</span>
            <h2 className="gt-h2" style={{ marginTop: '6px' }}>DESTINATIONS</h2>
          </div>
          <button
            onClick={() => setCurrentView('city-search')}
            className="btn btn-secondary btn-sm"
          >
            <span>EXPLORE ALL</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Asymmetric 3-Column Visual Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {topDestinations.map((dest, i) => (
            <motion.div
              key={dest.id || i}
              whileHover={{ y: -6 }}
              className="gt-img-card"
              style={{ height: i % 3 === 0 ? '420px' : '360px' }}
              onClick={() => setCurrentView('city-search')}
            >
              <img
                src={dest.image || 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'}
                alt={dest.city}
                loading="lazy"
              />
              <div className="gt-img-card-overlay">
                <span className="gt-badge" style={{ alignSelf: 'flex-start', marginBottom: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                  {dest.country}
                </span>
                <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  {dest.city}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                  {dest.tagline || 'Experience cultural heritage & modern elegance.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    FROM {formatCurrency(dest.avgDailyCost || 150)} / DAY
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    EXPLORE <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. INTEGRATED TRAVEL SERVICES: Vehicles & Tour Guides ── */}
      <section className="gt-section-sm" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '28px' }}>
          <span className="gt-label">PREMIUM SERVICES</span>
          <h2 className="gt-h3" style={{ marginTop: '4px' }}>CONCIERGE &amp; TRANSIT</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Vehicle Rental Card */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setCurrentView('vehicles')}
            style={{
              position: 'relative',
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              height: '240px',
              cursor: 'pointer'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"
              alt="Vehicles"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', marginBottom: '4px' }}>
                <Car size={16} />
                <span className="gt-label-sm" style={{ color: 'var(--accent-gold)' }}>LUXURY FLEET</span>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>Vehicle Rentals</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>
                SUVs, convertibles &amp; sedans for seamless multi-city transit.
              </p>
            </div>
          </motion.div>

          {/* Tour Guide Card */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setCurrentView('guides')}
            style={{
              position: 'relative',
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              height: '240px',
              cursor: 'pointer'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80"
              alt="Tour Guides"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', marginBottom: '4px' }}>
                <UserCheck size={16} />
                <span className="gt-label-sm" style={{ color: 'var(--accent-gold)' }}>LOCAL EXPERTS</span>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>Certified Guides</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>
                Architecture, food, and historical private guides.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 6. MINIMAL FOOTER ── */}
      <footer style={{
        padding: '48px clamp(24px, 5vw, 64px)',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={16} color="var(--bg)" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            GlobeTrotter
          </span>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--tertiary)' }}>
          © 2026 GlobeTrotter. Editorial travel intelligence.
        </span>
      </footer>

    </div>
  );
}
