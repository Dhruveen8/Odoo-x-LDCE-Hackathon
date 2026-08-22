import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence
} from 'motion/react';
import {
  Plus, Compass, Calendar, MapPin, ArrowRight, Sparkles,
  Luggage, PieChart, Heart, DollarSign, Star, Check,
  ChevronRight, Phone, Mail, Palmtree,
  Play, ChevronDown, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  FadeInUp, FadeInSide, ScaleIn,
  staggerContainer, staggerItem, ParallaxImage
} from '../components/common/ScrollAnimations';
import ExcalidrawBadge from '../components/common/ExcalidrawBadge';

/* ── small helpers ── */
const Divider = () => (
  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 0 8px' }}>
    <div style={{ width: 60, height: 3, borderRadius: 99, background: 'var(--brand-gradient-ocean)' }} />
  </div>
);

const SectionLabel = ({ children }) => (
  <p style={{
    fontFamily: 'var(--font-modern)',
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: 'var(--brand-primary)',
    marginBottom: 10
  }}>
    {children}
  </p>
);

const FEATURED_ROOMS = [
  {
    id: 'r1', name: 'Grand Oceanfront Pool Villa', tag: 'Sea Breeze Suite',
    price: 480, rating: 4.98, reviews: 312,
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
    features: ['Private Infinity Pool', 'Lagoon Access', 'Personal Butler', 'Outdoor Shower'],
    desc: 'Wake to panoramic turquoise horizons. Our flagship villa blends open-air living with curated luxury.'
  },
  {
    id: 'r2', name: 'Royal Mediterranean Terrace', tag: 'Clifftop Heritage',
    price: 620, rating: 4.96, reviews: 198,
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    features: ['Panoramic Coastal Views', 'Private Chef', 'Marble Spa', 'Helipad'],
    desc: 'Perched above the Adriatic — a statement in understated grandeur with chef-curated dining nightly.'
  },
  {
    id: 'r3', name: 'Kyoto Zen Garden Machiya', tag: 'Forest Sanctuary',
    price: 390, rating: 4.95, reviews: 274,
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
    features: ['Private Rock Garden', 'Hinoki Onsen', 'Tea Ceremony Room', 'Gion Concierge'],
    desc: 'Ancient cedar beams and paper lanterns frame your private retreat within Kyoto\'s living heritage.'
  },
];

const TESTIMONIALS = [
  {
    name: 'Sophia & Marcus Vance', location: 'London, UK',
    trip: 'Mediterranean Odyssey 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: '"Planning our 14-day European coast trip was effortless. Automatic daily budgets, live route maps and the calendar kept us completely stress-free."'
  },
  {
    name: 'Priya Krishnamurthy', location: 'Mumbai, India',
    trip: 'Bali Wellness Retreat 2026',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
    quote: '"The curated activity library found experiences I never would have discovered myself — a dawn volcano trek followed by an aerial yoga session above the rice terraces."'
  },
  {
    name: 'Ethan & Chloe Williams', location: 'New York, USA',
    trip: 'Japan Neon & Zen 2026',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    quote: '"The budget breakdown feature literally saved us $600. When we were over-budget it suggested swapping one hotel for an equally gorgeous ryokan."'
  }
];

const STATS = [
  { val: '18,420+', label: 'Itineraries Created' },
  { val: '148',     label: 'Global Destinations' },
  { val: '8,930',   label: 'Happy Travelers' },
  { val: '$340',    label: 'Avg. Budget Saved' }
];

export default function DashboardView({ onOpenCreateModal }) {
  const { user, trips, setActiveTripId, setCurrentView,
          destinations, presetActivities, formatCurrency,
          toggleWishlist, computeTripFinances } = useApp();

  const heroRef     = useRef(null);
  const [activeRoom, setActiveRoom] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  /* Hero parallax */
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef, offset: ['start start', 'end start']
  });
  const heroImgY   = useTransform(heroScroll, [0, 1], ['0%', '30%']);
  const heroTextY  = useTransform(heroScroll, [0, 1], ['0%', '18%']);
  const heroOpacity= useTransform(heroScroll, [0, 0.6], [1, 0]);

  const activeTrip     = trips[0];
  const activeFinances = computeTripFinances(activeTrip);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ═══════════════════════════════════════════════
          SECTION 1 · CINEMATIC HERO — Sea & River View
      ═══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: 640,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden'
        }}
      >
        {/* Parallax BG */}
        <motion.div
          style={{ y: heroImgY, position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=90"
            alt="Tropical Turquoise Lagoon"
            style={{ width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center 60%' }}
          />
        </motion.div>

        {/* Deep gradient overlay for liquid glass readability */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(180deg, rgba(10,9,20,0.45) 0%, rgba(10,9,20,0.25) 45%, rgba(10,9,20,0.92) 100%)'
        }}/>

        {/* Hero Content Wrapper */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          minHeight: '100vh',
          padding: '120px 4vw 48px',
          boxSizing: 'border-box'
        }}>
          {/* Hero Text Block */}
          <motion.div
            style={{ y: heroTextY, opacity: heroOpacity, maxWidth: 840 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-modern)',
                textTransform: 'uppercase',
                letterSpacing: '0.24em',
                color: '#c4b5fd',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: 12
              }}
            >
              Secret Lagoon Tours · Free With Every Booking
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22,1,0.36,1] }}
              style={{
                fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.12,
                textShadow: '0 4px 30px rgba(0,0,0,0.5)'
              }}
            >
              You Will{' '}
              <span style={{
                fontStyle: 'italic',
                fontWeight: 400,
                background: 'linear-gradient(90deg,#c4b5fd,#818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Love
              </span>{' '}
              Our Backyard
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '1.08rem',
                marginTop: 16,
                maxWidth: 580,
                lineHeight: 1.65
              }}
            >
              Where turquoise waters meet intelligent multi-city planning. Build custom itineraries, track every dollar, and discover secret local experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              style={{ display: 'flex', gap: 14, marginTop: 26, flexWrap: 'wrap', alignItems: 'center' }}
            >
              <button
                onClick={onOpenCreateModal}
                className="btn btn-white btn-lg"
                style={{ fontWeight: 800 }}
              >
                Book Now
              </button>
              <button
                onClick={() => setCurrentView('city-search')}
                className="btn btn-lg"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.28)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <Play size={16} style={{ fill: '#fff' }} />
                Explore Destinations
              </button>
            </motion.div>
          </motion.div>

          {/* Liquid Glass Booking Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.8, ease: [0.22,1,0.36,1] }}
            className="liquid-glass"
            style={{
              marginTop: 40,
              borderRadius: 'var(--r-xl)',
              padding: '16px 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr)) 180px',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.16)',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(18, 17, 32, 0.85)',
              backdropFilter: 'blur(36px) saturate(190%)',
              WebkitBackdropFilter: 'blur(36px) saturate(190%)',
            }}
          >
            {[
              { label: 'Check-In', placeholder: '25 / July', icon: '📅' },
              { label: 'Check-Out', placeholder: '27 / July', icon: '📅' },
              { label: 'Guests', placeholder: '02 Adults', icon: '👥' },
            ].map((field, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                  paddingRight: i < 2 ? 16 : 0
                }}
              >
                <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)' }}>
                  {field.icon} {field.label}
                </span>
                <input
                  defaultValue={field.placeholder}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    color: '#fff',
                    padding: 0
                  }}
                />
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenCreateModal}
              className="btn btn-primary"
              style={{
                fontWeight: 800,
                fontSize: '0.92rem',
                borderRadius: 'var(--r-full)',
                padding: '14px 20px',
                width: '100%'
              }}
            >
              Check Availability
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{
            position: 'absolute', bottom: 24, right: '4vw', zIndex: 5,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'var(--font-modern)', fontWeight: 700
          }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} />
          </motion.div>
          Scroll
        </motion.div>
      </section>

      {/* Content sections — constrained width */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '60px 28px 100px', width: '100%', display: 'flex', flexDirection: 'column', gap: 100 }}>

        {/* ═══════════════════════════════════════════
            SECTION 2 · ABOUT / LITTLE PARADISE
        ═══════════════════════════════════════════ */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 56, alignItems: 'center' }}>
          {/* Left — stacked images */}
          <FadeInSide from="left">
            <div style={{ position: 'relative', height: 480 }}>
              {/* Large bg image */}
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '100%' }}>
                <img
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80"
                  alt="Tropical Pool"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Floating inset image */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  position: 'absolute', bottom: -28, right: -28,
                  width: 200, height: 150,
                  borderRadius: 'var(--radius-md)', overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '4px solid #fff'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80"
                  alt="Villa"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </motion.div>

              {/* Rotating stamp */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', top: 20, left: 20,
                  width: 90, height: 90, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)', border: '1.5px dashed var(--brand-primary)'
                }}
              >
                <div style={{ textAlign: 'center', fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-primary)', letterSpacing: '0.05em', lineHeight: 1.4 }}>
                  ★ 2026 ★<br />GLOBETROTTER<br />AWARD
                </div>
              </motion.div>
            </div>
          </FadeInSide>

          {/* Right — editorial copy */}
          <FadeInSide from="right" delay={0.15}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <SectionLabel>Little About Us</SectionLabel>
              <Divider />
              <h2 style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 800, lineHeight: 1.2 }}>
                Luxury Living in{' '}
                <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand-primary)' }}>Paradise</em>
              </h2>
              <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Designed for curious explorers. Whether charting a multi-city voyage across European capitals or unwinding in private tropical sanctuaries, GlobeTrotter harmonises itinerary logistics with bespoke luxury — giving you the clarity to truly disappear.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  'Automated Multi-City Budgeting',
                  'Private Villa & Transit Bookings',
                  'Interactive Route Maps',
                  'Curated Secret Experiences',
                  'Real-time Budget Alerts',
                  'Public Shareable Itineraries'
                ].map((item, i) => (
                  <FadeInUp key={i} delay={0.05 * i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 600 }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(99,102,241,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={13} color="var(--brand-primary)" />
                      </span>
                      {item}
                    </div>
                  </FadeInUp>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03, x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentView('city-search')}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', marginTop: 8, background: 'var(--brand-gradient)' }}
              >
                Explore Destinations <ArrowRight size={16} />
              </motion.button>
            </div>
          </FadeInSide>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 3 · STATS STRIP
        ═══════════════════════════════════════════ */}
        <FadeInUp>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 0,
            borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)'
          }}>
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{
                  padding: '36px 24px',
                  textAlign: 'center',
                  borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                }}
              >
                <div style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  {s.val}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.72)', marginTop: 6, fontFamily: 'var(--font-modern)' }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInUp>

        {/* ═══════════════════════════════════════════
            SECTION 4 · FEATURED ROOMS SHOWCASE
        ═══════════════════════════════════════════ */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <FadeInUp>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <SectionLabel>Curated Stays</SectionLabel>
                <Divider />
                <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800 }}>
                  Our Signature{' '}
                  <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand-primary)' }}>Rooms</em>
                </h2>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {FEATURED_ROOMS.map((r, i) => (
                  <button key={r.id} onClick={() => setActiveRoom(i)}
                    className={activeRoom === i ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-secondary'}
                    style={{ fontSize: '0.82rem' }}>
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </FadeInUp>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoom}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 32, alignItems: 'center' }}
            >
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 380, position: 'relative', boxShadow: 'var(--shadow-xl)' }}>
                <motion.img
                  src={FEATURED_ROOMS[activeRoom].img}
                  alt={FEATURED_ROOMS[activeRoom].name}
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', top: 18, left: 18 }}>
                  <span className="badge-tag success" style={{ background: 'rgba(99,102,241,0.85)', color: '#fff', borderColor: 'transparent' }}>
                    {FEATURED_ROOMS[activeRoom].tag}
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: 18, right: 18, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: 999, color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                  ⭐ {FEATURED_ROOMS[activeRoom].rating}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--brand-primary)', marginBottom: 6 }}>
                    {FEATURED_ROOMS[activeRoom].reviews} Verified Reviews
                  </p>
                  <h3 style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 800, lineHeight: 1.2 }}>
                    {FEATURED_ROOMS[activeRoom].name}
                  </h3>
                </div>

                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {FEATURED_ROOMS[activeRoom].desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {FEATURED_ROOMS[activeRoom].features.map((f, i) => (
                    <span key={i} className="badge-tag success">✓ {f}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--brand-primary)', fontFamily: 'var(--font-heading)' }}>
                    {formatCurrency(FEATURED_ROOMS[activeRoom].price)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/night</span>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={onOpenCreateModal} className="btn btn-primary"
                    style={{ background: 'var(--brand-gradient)' }}>
                    <Plus size={16} /> Add to My Itinerary
                  </motion.button>
                  <button onClick={() => setCurrentView('itinerary-view')} className="btn btn-secondary">
                    View Itinerary
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 5 · FULL-BLEED POOL BANNER
        ═══════════════════════════════════════════ */}
      </div>

      {/* Full-width pool mosaic section */}
      <FadeInUp>
        <section style={{ position: 'relative', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <ParallaxImage
            src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2000&q=80"
            alt="Azure Mosaic Pool"
            speed={0.2}
            height="100%"
            style={{ position: 'absolute', inset: 0 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(79,70,229,0.72)', mixBlendMode: 'multiply' }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '80px 24px', maxWidth: 680, color: '#fff' }}>
            <SectionLabel><span style={{ color: '#a5f3fc' }}>Our Guest Promise</span></SectionLabel>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, fontStyle: 'italic', lineHeight: 1.22, marginBottom: 16, color: '#fff' }}>
              "A vacation where you have nothing to do &amp; all day to do it."
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1.05rem', marginBottom: 32 }}>
              Let GlobeTrotter orchestrate timelines, routes, and finances while you bask in serenity.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenCreateModal}
              className="btn btn-white btn-lg"
              style={{ fontWeight: 800 }}
            >
              <Sparkles size={18} />
              Start Planning My Escape
            </motion.button>
          </div>
        </section>
      </FadeInUp>

      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px', width: '100%', display: 'flex', flexDirection: 'column', gap: 100, paddingBottom: 100, paddingTop: 100 }}>

        {/* ═══════════════════════════════════════════
            SECTION 6 · CURATED EXPERIENCES GRID
        ═══════════════════════════════════════════ */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <FadeInUp>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <SectionLabel>Island Wonders</SectionLabel>
                <Divider />
                <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800 }}>
                  Curated{' '}
                  <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand-teal)' }}>Experiences</em>
                </h2>
              </div>
              <button onClick={() => setCurrentView('activity-search')} className="btn btn-secondary">
                Browse All <ArrowRight size={16} />
              </button>
            </div>
          </FadeInUp>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px 0px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 28 }}
          >
            {presetActivities.slice(0, 4).map((act, i) => (
              <motion.div key={act.id} variants={staggerItem} className="card-travel"
                whileHover={{ y: -8, boxShadow: 'var(--shadow-xl)' }}
                style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <motion.img
                    src={act.image} alt={act.title}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className="badge-tag success">{act.category}</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.68)', padding: '3px 12px', borderRadius: 999, color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>
                    {formatCurrency(act.cost)}
                  </div>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-teal)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    📍 {act.cityName}
                  </p>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{act.title}</h4>
                  <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    {act.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>⏱ {act.durationHours} hrs · {act.timeOfDay}</span>
                    <button onClick={() => setCurrentView('activity-search')} className="btn btn-ghost btn-sm" style={{ padding: '4px 0', color: 'var(--brand-primary)', fontWeight: 700 }}>
                      Add to trip →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 7 · TESTIMONIALS CAROUSEL
        ═══════════════════════════════════════════ */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center' }}>
          <FadeInUp style={{ textAlign: 'center', maxWidth: 560 }}>
            <SectionLabel>Happy Travelers</SectionLabel>
            <Divider />
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
              What Our Guests{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand-teal)' }}>Say</em>
            </h2>
          </FadeInUp>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel"
              style={{ maxWidth: 760, width: '100%', padding: '40px 44px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
            >
              <div style={{ display: 'flex', gap: 4, color: '#f59e0b', fontSize: '1.3rem' }}>
                {'★★★★★'}
              </div>
              <p style={{ fontFamily: 'var(--font-subheading)', fontSize: 'clamp(1.1rem,2vw,1.35rem)', fontStyle: 'italic', lineHeight: 1.65, color: 'var(--text-primary)' }}>
                {TESTIMONIALS[activeTestimonial].quote}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={TESTIMONIALS[activeTestimonial].avatar} alt={TESTIMONIALS[activeTestimonial].name}
                  style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid var(--brand-teal)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{TESTIMONIALS[activeTestimonial].name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {TESTIMONIALS[activeTestimonial].location} · {TESTIMONIALS[activeTestimonial].trip}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 10 }}>
            {TESTIMONIALS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                animate={{ width: activeTestimonial === i ? 32 : 10, background: activeTestimonial === i ? 'var(--brand-teal)' : 'var(--border-strong)' }}
                transition={{ duration: 0.35 }}
                style={{ height: 10, border: 'none', borderRadius: 999, cursor: 'pointer' }}
              />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 8 · DESTINATIONS GRID
        ═══════════════════════════════════════════ */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <FadeInUp>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <SectionLabel>Trending 2026</SectionLabel>
                <Divider />
                <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800 }}>
                  Recommended{' '}
                  <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand-teal)' }}>Destinations</em>
                </h2>
              </div>
              <button onClick={() => setCurrentView('city-search')} className="btn btn-secondary">
                Browse All {destinations.length} Cities <ArrowRight size={16} />
              </button>
            </div>
          </FadeInUp>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}
          >
            {destinations.slice(0, 6).map((dest) => {
              const isWished = user.wishlistDestinations?.includes(dest.id);
              return (
                <motion.div key={dest.id} variants={staggerItem} className="card-travel"
                  whileHover={{ y: -7 }} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: 170, overflow: 'hidden' }}>
                    <motion.img
                      src={dest.image} alt={dest.city}
                      whileHover={{ scale: 1.09 }}
                      transition={{ duration: 0.6 }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <button onClick={() => toggleWishlist(dest.id)}
                      style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(6px)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Heart size={17} color={isWished ? '#ef4444' : '#fff'} fill={isWished ? '#ef4444' : 'none'} />
                    </button>
                    <div style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(0,0,0,0.6)', padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', color: '#fff', fontWeight: 700 }}>
                      {dest.costIndex} · {dest.currency}
                    </div>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{dest.city}, {dest.country}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>{dest.tagline}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>⭐ {dest.rating}</span>
                      <span>{formatCurrency(dest.avgDailyCost)}/day</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setCurrentView('city-search')}
                      className="btn btn-sm btn-secondary"
                      style={{ width: '100%', marginTop: 4 }}>
                      <Plus size={14} /> Add to Itinerary
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 9 · CONTACT / CONCIERGE CTA
        ═══════════════════════════════════════════ */}
        <ScaleIn>
          <div style={{
            background: 'var(--brand-gradient-ocean)',
            borderRadius: 'var(--radius-xl)',
            padding: '56px 48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
            gap: 32,
            alignItems: 'center',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ color: '#fff' }}>
              <span className="badge-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)', marginBottom: 14, display: 'inline-block' }}>
                24 / 7 Concierge
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#fff', marginBottom: 10 }}>
                Need Bespoke Itinerary Assistance?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.80)', lineHeight: 1.65 }}>
                Our travel designers and AI engine are standing by to craft your perfect personalised escape.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: <Phone size={18} />, label: '+1 (800) 849-2026', desc: 'Call Our Concierge' },
                { icon: <Mail size={18} />, label: 'concierge@globetrotter.io', desc: 'Email Our Team' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius-md)', padding: '14px 20px', border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                  <span style={{ color: '#fff' }}>{c.icon}</span>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-modern)' }}>{c.desc}</div>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{c.label}</div>
                  </div>
                </div>
              ))}
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={onOpenCreateModal}
                className="btn btn-white btn-lg"
                style={{ fontWeight: 800 }}>
                Plan My Escape Now
              </motion.button>
            </div>
          </div>
        </ScaleIn>

      </div>
    </div>
  );
}
