/**
 * LandingPage.jsx — Self-contained Three.js 3D Globe with animated "Explore World With Us"
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Compass, Globe } from 'lucide-react';

// ─── Slide data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 'world',
    label: 'WORLD',
    pre: 'Curated Expeditions',
    highlights: ['Swiss Alps', 'Santorini', 'Kyoto', 'Amalfi Coast', 'Bali'],
    color: '#38bdf8',
  },
  {
    id: 'japan',
    label: 'JAPAN',
    pre: 'Ancient & Futuristic',
    highlights: ['Mount Fuji', 'Kyoto Temples', 'Shibuya Crossing', 'Arashiyama', 'Osaka Castle'],
    color: '#e8365d',
  },
  {
    id: 'italy',
    label: 'ITALY',
    pre: 'Renaissance & Coastlines',
    highlights: ['Colosseum', 'Venice Canals', 'Amalfi Coast', 'Tuscany Hills', 'Vatican City'],
    color: '#ff8c1a',
  },
  {
    id: 'india',
    label: 'INDIA',
    pre: 'Royal Palaces & Ghats',
    highlights: ['Taj Mahal', 'Varanasi Ghats', 'Kerala Backwaters', 'Rajasthan Forts', 'Hampi Ruins'],
    color: '#ff6b35',
  },
];

const noMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { setCurrentView } = useApp();

  const mountRef = useRef(null);
  const frameRef = useRef(null);
  const glowRef = useRef(null);

  const [slideIdx, setSlideIdx] = useState(0);
  const [hlCount, setHlCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const reduced = noMotion();
  const slide = SLIDES[slideIdx];

  // ── Auto-cycle slides every 6.5 s ─────────────────────────────────────────
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setSlideIdx(i => (i + 1) % SLIDES.length);
      setHlCount(0);
    }, 6500);
    return () => clearInterval(id);
  }, [reduced]);

  // ── Stagger highlight items in when slide changes ──────────────────────────
  useEffect(() => {
    setHlCount(0);
    if (!slide.highlights.length) return;
    const timers = slide.highlights.map((_, i) =>
      setTimeout(() => setHlCount(n => Math.max(n, i + 1)), 600 + i * 280)
    );
    return () => timers.forEach(clearTimeout);
  }, [slideIdx]);

  // ── Three.js WebGL globe ───────────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth, H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 2.85;

    // Stars
    const N = 2400, sp = new Float32Array(N * 3);
    for (let i = 0; i < N * 3; i++) sp[i] = (Math.random() - 0.5) * 90;
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.07, transparent: true, opacity: 0.72,
    })));

    // Lights
    scene.add(new THREE.AmbientLight(0x1a2f5e, 2.2));
    const sun = new THREE.DirectionalLight(0x88ccff, 4.2);
    sun.position.set(5, 2, 3);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x4488ff, 1.6);
    rim.position.set(-4, -1, -3);
    scene.add(rim);

    // Textures
    const ldr = new THREE.TextureLoader();
    const BASE = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/';
    const eT = ldr.load(BASE + 'earth_atmos_2048.jpg', () => setLoaded(true));
    const nT = ldr.load(BASE + 'earth_normal_2048.jpg');
    const sT = ldr.load(BASE + 'earth_specular_2048.jpg');
    const cT = ldr.load(BASE + 'earth_clouds_1024.png');
    const fb = setTimeout(() => setLoaded(true), 2500);

    // Globe mesh
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 72, 72),
      new THREE.MeshPhongMaterial({
        map: eT, normalMap: nT, specularMap: sT,
        specular: new THREE.Color(0x3366bb), shininess: 28,
      })
    );
    scene.add(globe);

    // Clouds
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.013, 72, 72),
      new THREE.MeshPhongMaterial({ map: cT, transparent: true, opacity: 0.38, depthWrite: false })
    );
    scene.add(clouds);

    // Inner atmosphere
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.07, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0x1144bb, transparent: true, opacity: 0.14,
        side: THREE.FrontSide, depthWrite: false,
      })
    ));

    // Outer glow halo
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.22, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x2255ff, transparent: true, opacity: 0.07, side: THREE.BackSide })
    );
    scene.add(glow);
    glowRef.current = glow;

    // Animation
    let t = 0;
    const tick = () => {
      frameRef.current = requestAnimationFrame(tick);
      t += 0.005;
      if (!reduced) {
        globe.rotation.y += 0.0015;
        clouds.rotation.y += 0.002;
      }
      glow.material.opacity = 0.055 + Math.sin(t * 1.4) * 0.032;
      renderer.render(scene, camera);
    };
    tick();

    // Resize
    const onResize = () => {
      const W = el.clientWidth, H = el.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(fb);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={css.root}>

      {/* ── Nebula Ambient Glows ── */}
      <div aria-hidden style={css.nebula}>
        <div style={{ ...css.blob, top:'8%', left:'46%', width:620, height:620,
          background:'radial-gradient(circle,rgba(24,90,255,.22)0%,transparent 68%)', filter:'blur(72px)' }} />
        <div style={{ ...css.blob, top:'40%', left:'28%', width:480, height:480,
          background:'radial-gradient(circle,rgba(60,170,255,.11)0%,transparent 68%)', filter:'blur(90px)' }} />
        <div style={{ ...css.blob, bottom:'4%', right:'8%', width:340, height:340,
          background:`radial-gradient(circle,${slide.color}22 0%,transparent 70%)`,
          filter:'blur(60px)', transition:'background 1.2s ease' }} />
      </div>

      {/* ── 3D Globe Canvas (z:5) ── */}
      <div ref={mountRef} style={css.globeLayer} />

      {/* ── Prominent Animated "Explore World With Us" Hero Typography (z:12) ── */}
      <div style={css.heroContainer}>
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : -24 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pointerEvents: 'none' }}
        >
          {/* Animated Eyebrow Badge */}
          <motion.div
            key={`badge-${slideIdx}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              marginBottom: '16px',
              boxShadow: `0 0 20px ${slide.color}33`,
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: slide.color, boxShadow: `0 0 8px ${slide.color}` }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' }}>
              {slide.pre} • {slide.label}
            </span>
          </motion.div>

          {/* ★ BIG ANIMATED HEADLINE: "EXPLORE WORLD WITH US" ★ */}
          <motion.h1
            animate={{
              y: [0, -8, 0],
              textShadow: [
                `0 0 50px rgba(0, 180, 255, 0.4), 0 0 90px ${slide.color}40`,
                `0 0 70px rgba(0, 180, 255, 0.7), 0 0 120px ${slide.color}60`,
                `0 0 50px rgba(0, 180, 255, 0.4), 0 0 90px ${slide.color}40`
              ]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 'clamp(48px, 7.5vw, 108px)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: '#ffffff',
              margin: '0 auto',
              textTransform: 'uppercase',
              userSelect: 'none',
              filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.85))',
              textAlign: 'center'
            }}
          >
            Explore World <br />
            <span style={{
              background: `linear-gradient(135deg, #ffffff 0%, ${slide.color} 50%, #38bdf8 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              With Us
            </span>
          </motion.h1>
        </motion.div>
      </div>

      {/* ── CTA Layer (z:18) ── */}
      <div style={css.ctaLayer}>
        <motion.button
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 22 }}
          transition={{ duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06, boxShadow: `0 12px 40px ${slide.color}77` }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCurrentView('auth')}
          style={{
            ...css.ctaBtn,
            background: `linear-gradient(135deg, ${slide.color} 0%, #00bbff 100%)`,
            boxShadow: `0 8px 36px ${slide.color}55`,
            transition: 'background .7s ease, box-shadow .6s ease',
          }}
        >
          <span>PLAN YOUR ESCAPE</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* ── Top Navbar (z:25) ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={css.nav}
      >
        <div style={css.logo}>
          <div style={{
            ...css.logoBadge,
            boxShadow: `0 0 22px ${slide.color}88`,
            transition: 'box-shadow .6s',
          }}>
            <Compass size={20} color="#fff" />
          </div>
          <span style={css.logoText}>GLOBETROTTER</span>
        </div>

        <div style={css.navRight}>
          {['Explore', 'Destinations', 'Fleet', 'Guides'].map(lbl => (
            <button
              key={lbl}
              style={css.navLink}
              onClick={() => setCurrentView('auth')}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
            >
              {lbl}
            </button>
          ))}

          <div style={css.divider} />

          <button
            style={css.navLink}
            onClick={() => setCurrentView('auth')}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
          >
            Login
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentView('auth')}
            style={{
              ...css.signupBtn,
              background: `linear-gradient(135deg, ${slide.color} 0%, #00aaff 100%)`,
              boxShadow: `0 4px 18px ${slide.color}55`,
              transition: 'background .6s, box-shadow .6s',
            }}
          >
            Sign Up
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Left Indicator Dots (z:20) ── */}
      <div style={css.dots}>
        {SLIDES.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => { setSlideIdx(i); setHlCount(0); }}
            title={s.label}
            animate={{ scale: i === slideIdx ? 1 : 0.65, opacity: i === slideIdx ? 1 : 0.38 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: i === slideIdx ? 11 : 7,
              height: i === slideIdx ? 11 : 7,
              borderRadius: '50%',
              background: i === slideIdx
                ? `linear-gradient(135deg, ${slide.color}, #00d4ff)`
                : 'rgba(255,255,255,.45)',
              border: 'none', cursor: 'pointer', padding: 0,
              boxShadow: i === slideIdx ? `0 0 12px ${slide.color}99` : 'none',
              transition: 'width .3s, height .3s, background .5s',
            }}
          />
        ))}
      </div>

      {/* ── Right Destination Highlights (z:20) ── */}
      <AnimatePresence mode="wait">
        {slide.highlights.length > 0 && (
          <motion.aside
            key={`hl-${slideIdx}`}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={css.hlPanel}
            aria-label="Destination highlights"
          >
            <div style={css.hlLine} />
            {slide.highlights.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: i < hlCount ? 1 : 0, x: i < hlCount ? 0 : 16 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                style={css.hlRow}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    ...css.hlName,
                    color: i === 0 ? '#fff' : 'rgba(255,255,255,.7)',
                    textShadow: i === 0 ? `0 0 18px ${slide.color}` : 'none',
                  }}>{name}</div>
                </div>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? slide.color : 'rgba(255,255,255,.28)',
                  boxShadow: i === 0 ? `0 0 10px ${slide.color}` : 'none',
                  transition: 'background .4s, box-shadow .4s',
                }} />
              </motion.div>
            ))}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Bottom Progress Bars (z:20) ── */}
      <div style={css.progress}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setSlideIdx(i); setHlCount(0); }}
            aria-label={`Go to ${s.label}`}
            style={{
              width: i === slideIdx ? 36 : 8, height: 3, borderRadius: 3,
              border: 'none', cursor: 'pointer', padding: 0,
              background: i === slideIdx
                ? `linear-gradient(90deg, ${slide.color}, #00d4ff)`
                : 'rgba(255,255,255,.2)',
              transition: 'width .4s ease, background .5s ease',
              overflow: 'hidden', position: 'relative',
            }}
          >
            {i === slideIdx && !reduced && (
              <motion.div
                key={`pg-${slideIdx}`}
                initial={{ x: '-100%' }} animate={{ x: '0%' }}
                transition={{ duration: 6.5, ease: 'linear' }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.42)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tagline Bottom Left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 0.6 : 0 }}
        transition={{ delay: 1.4, duration: 0.9 }}
        style={css.tagline}
      >
        GLOBETROTTER · INTELLIGENT TRAVEL PLANNING
      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {!loaded && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.9 }} style={css.overlay}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              style={css.spinner}
            />
            <div style={css.loadingText}>INITIALIZING EXPEDITIONS…</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scoped Styles ─────────────────────────────────────────────────────────────
const css = {
  root: {
    position: 'fixed', inset: 0,
    background: 'radial-gradient(ellipse 130% 110% at 50% 50%, #0d2e6e 0%, #071430 40%, #030b1c 100%)',
    fontFamily: "'Inter', -apple-system, sans-serif",
    overflow: 'hidden', zIndex: 999,
  },
  nebula: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 },
  blob: { position: 'absolute', borderRadius: '50%' },

  // 3D Globe Layer
  globeLayer: {
    position: 'absolute', inset: 0,
    zIndex: 5,
    pointerEvents: 'none',
  },

  // Hero Text Container — Perfectly Centered in Viewport
  heroContainer: {
    position: 'absolute',
    inset: 0,
    zIndex: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    padding: '0 24px',
    marginTop: '-20px',
  },

  // CTA Layer
  ctaLayer: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    right: 0,
    zIndex: 18,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  ctaBtn: {
    pointerEvents: 'auto',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    fontSize: '0.88rem',
    fontWeight: 800,
    letterSpacing: '0.14em',
    padding: '16px 44px',
    borderRadius: 50,
    textTransform: 'uppercase',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
  },

  // Navbar
  nav: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 25,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 42px',
    background: 'linear-gradient(to bottom, rgba(3,11,28,.7) 0%, transparent 100%)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  logoBadge: {
    width: 36, height: 36, borderRadius: '10px',
    background: 'linear-gradient(135deg, #1e6aff 0%, #00ccff 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: { color: '#fff', fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.12em' },
  navRight: { display: 'flex', alignItems: 'center', gap: 24 },
  navLink: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'rgba(255,255,255,.65)', fontSize: '0.8rem',
    fontWeight: 600, letterSpacing: '0.06em', transition: 'color .2s',
  },
  divider: { width: 1, height: 18, background: 'rgba(255,255,255,.16)' },
  signupBtn: {
    border: 'none', cursor: 'pointer', color: '#fff',
    fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.1em',
    padding: '9px 24px', borderRadius: 24, textTransform: 'uppercase',
  },

  // Left dots
  dots: {
    position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)',
    display: 'flex', flexDirection: 'column', gap: 12, zIndex: 20,
  },

  // Right highlights
  hlPanel: {
    position: 'absolute', right: 46, top: '50%', transform: 'translateY(-50%)',
    display: 'flex', flexDirection: 'column', gap: 2, zIndex: 20,
  },
  hlLine: {
    position: 'absolute', right: 3, top: 0, bottom: 0,
    width: 1, background: 'rgba(255,255,255,.12)',
  },
  hlRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0' },
  hlName: { fontSize: '.68rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' },

  // Bottom progress
  progress: {
    position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
    display: 'flex', alignItems: 'center', gap: 10, zIndex: 20,
  },

  // Tagline
  tagline: {
    position: 'absolute', bottom: 34, left: 42, zIndex: 20,
    color: 'rgba(255,255,255,.5)', fontSize: '.65rem',
    letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 600,
  },

  // Loading
  overlay: {
    position: 'absolute', inset: 0, background: '#030b1c',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  spinner: {
    width: 52, height: 52, borderRadius: '50%',
    border: '3px solid rgba(30,106,255,.18)', borderTopColor: '#1e6aff',
    marginBottom: 20,
  },
  loadingText: {
    color: 'rgba(255,255,255,.42)', fontSize: '.72rem',
    letterSpacing: '.26em', textTransform: 'uppercase',
  },
};
