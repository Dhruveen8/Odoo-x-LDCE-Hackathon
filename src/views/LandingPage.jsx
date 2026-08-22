/**
 * LandingPage.jsx — Self-contained. No global styles modified.
 *
 * Section 10 text fix implemented:
 *   Layer 1 (z:2)  — Full word text as ONE element: "WORLD", "JAPAN", etc.
 *   Layer 2 (z:8)  — 3D globe canvas sits ON TOP, occludes center letters
 *   Layer 3 (z:15) — CTA button, always clickable above globe
 *   Layer 4 (z:20) — Navbar, dots, highlight list — always in front
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

// ─── Slide data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 'world',
    label: 'WORLD',
    pre: 'Explore Your',
    highlights: [],
    color: '#1e6aff',
  },
  {
    id: 'japan',
    label: 'JAPAN',
    pre: 'Discover',
    highlights: ['Mount Fuji', 'Kyoto Temples', 'Shibuya Crossing', 'Arashiyama', 'Osaka Castle'],
    color: '#e8365d',
  },
  {
    id: 'italy',
    label: 'ITALY',
    pre: 'Journey Through',
    highlights: ['Colosseum', 'Venice Canals', 'Amalfi Coast', 'Tuscany Hills', 'Vatican City'],
    color: '#ff8c1a',
  },
  {
    id: 'india',
    label: 'INDIA',
    pre: 'Experience',
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

  const mountRef    = useRef(null);
  const frameRef    = useRef(null);
  const glowRef     = useRef(null);

  const [slideIdx, setSlideIdx] = useState(0);
  const [hlCount,  setHlCount]  = useState(0);
  const [loaded,   setLoaded]   = useState(false);

  const reduced = noMotion();
  const slide   = SLIDES[slideIdx];

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
  }, [slideIdx]); // eslint-disable-line

  // ── Three.js WebGL globe ───────────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth, H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 2.75;

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
    const ldr  = new THREE.TextureLoader();
    const BASE = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/';
    const eT   = ldr.load(BASE + 'earth_atmos_2048.jpg', () => setLoaded(true));
    const nT   = ldr.load(BASE + 'earth_normal_2048.jpg');
    const sT   = ldr.load(BASE + 'earth_specular_2048.jpg');
    const cT   = ldr.load(BASE + 'earth_clouds_1024.png');
    const fb   = setTimeout(() => setLoaded(true), 2500);

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
        globe.rotation.y  += 0.0015;
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
  }, []); // eslint-disable-line

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={css.root}>

      {/* Nebula ambient blobs — behind everything */}
      <div aria-hidden style={css.nebula}>
        <div style={{ ...css.blob, top:'8%',   left:'46%', width:620, height:620,
          background:'radial-gradient(circle,rgba(24,90,255,.22)0%,transparent 68%)', filter:'blur(72px)' }} />
        <div style={{ ...css.blob, top:'40%',  left:'28%', width:480, height:480,
          background:'radial-gradient(circle,rgba(60,170,255,.11)0%,transparent 68%)', filter:'blur(90px)' }} />
        <div style={{ ...css.blob, bottom:'4%', right:'8%',  width:340, height:340,
          background:`radial-gradient(circle,${slide.color}22 0%,transparent 70%)`,
          filter:'blur(60px)', transition:'background 1.2s ease' }} />
      </div>

      {/* ── LAYER 1 (z:2) — Full unbroken word text, behind globe ── */}
      <div style={css.textLayer} aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={`pre-${slideIdx}`}
            initial={{ opacity:0, y:8 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }}
            transition={{ duration:.4, ease:[.22,1,.36,1] }}
            style={css.subtitle}
          >
            {slide.pre}
          </motion.p>
        </AnimatePresence>

        {/* ★ ONE complete word — never split ★ */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`word-${slideIdx}`}
            initial={{ opacity:0, filter:'blur(10px)' }}
            animate={{ opacity: loaded ? 1 : 0, filter:'blur(0px)' }}
            exit={{ opacity:0, filter:'blur(10px)' }}
            transition={{ duration:.7, ease:[.22,1,.36,1] }}
            style={{
              ...css.headline,
              textShadow:`0 0 120px ${slide.color}44, 0 3px 0 rgba(0,0,0,.5)`,
            }}
          >
            {slide.label}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* ── LAYER 2 (z:8) — Three.js globe canvas ON TOP of text ── */}
      <div ref={mountRef} style={css.globeLayer} />

      {/* ── LAYER 3 (z:15) — CTA button, above globe, always clickable ── */}
      <div style={css.ctaLayer}>
        <motion.button
          initial={{ opacity:0, y:22 }}
          animate={{ opacity: loaded?1:0, y: loaded?0:22 }}
          transition={{ duration:.65, delay:.6, ease:[.22,1,.36,1] }}
          whileHover={{ scale:1.06 }} whileTap={{ scale:0.97 }}
          onClick={() => setCurrentView('auth')}
          style={{
            ...css.ctaBtn,
            background:`linear-gradient(135deg,${slide.color} 0%,#00bbff 100%)`,
            boxShadow:`0 8px 36px ${slide.color}55`,
            transition:'background .7s ease, box-shadow .6s ease',
          }}
        >
          Plan Your Trip →
        </motion.button>
      </div>

      {/* ── LAYER 4 (z:20) — Navbar ── */}
      <motion.nav
        initial={{ opacity:0, y:-16 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.7, delay:.15, ease:[.22,1,.36,1] }}
        style={css.nav}
      >
        <div style={css.logo}>
          <div style={{
            ...css.logoBadge,
            boxShadow:`0 0 22px ${slide.color}88`,
            transition:'box-shadow .6s',
          }}>G</div>
          <span style={css.logoText}>GLOBETROTTER</span>
        </div>

        <div style={css.navRight}>
          {['Explore', 'Destinations', 'Plan'].map(lbl => (
            <button key={lbl} style={css.navLink}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
            >{lbl}</button>
          ))}

          <div style={css.divider} />

          <button style={css.iconBtn} aria-label="Search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <button style={css.navLink}
            onClick={() => setCurrentView('auth')}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
          >Login</button>

          <motion.button
            whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
            onClick={() => setCurrentView('auth')}
            style={{
              ...css.signupBtn,
              background:`linear-gradient(135deg,${slide.color} 0%,#00aaff 100%)`,
              boxShadow:`0 4px 18px ${slide.color}55`,
              transition:'background .6s,box-shadow .6s',
            }}
          >Sign Up</motion.button>

          <button style={css.iconBtn} aria-label="Language">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* ── LAYER 4 (z:20) — Left dot navigation ── */}
      <div style={css.dots}>
        {SLIDES.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => { setSlideIdx(i); setHlCount(0); }}
            title={s.label}
            animate={{ scale: i===slideIdx?1:.65, opacity: i===slideIdx?1:.38 }}
            transition={{ duration:.35, ease:[.22,1,.36,1] }}
            style={{
              width:  i===slideIdx ? 11 : 7,
              height: i===slideIdx ? 11 : 7,
              borderRadius:'50%',
              background: i===slideIdx
                ? `linear-gradient(135deg,${slide.color},#00d4ff)`
                : 'rgba(255,255,255,.45)',
              border:'none', cursor:'pointer', padding:0,
              boxShadow: i===slideIdx ? `0 0 12px ${slide.color}99` : 'none',
              transition:'width .3s,height .3s,background .5s',
            }}
          />
        ))}
      </div>

      {/* ── LAYER 4 (z:20) — Right destination highlights ── */}
      <AnimatePresence mode="wait">
        {slide.highlights.length > 0 && (
          <motion.aside
            key={`hl-${slideIdx}`}
            initial={{ opacity:0, x:28 }}
            animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:28 }}
            transition={{ duration:.5, ease:[.22,1,.36,1] }}
            style={css.hlPanel}
            aria-label="Destination highlights"
          >
            <div style={css.hlLine} />
            {slide.highlights.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity:0, x:16 }}
                animate={{ opacity: i<hlCount?1:0, x: i<hlCount?0:16 }}
                transition={{ duration:.38, ease:[.22,1,.36,1] }}
                style={css.hlRow}
              >
                <div style={{ textAlign:'right' }}>
                  <div style={{
                    ...css.hlName,
                    color: i===0 ? '#fff' : 'rgba(255,255,255,.7)',
                    textShadow: i===0 ? `0 0 18px ${slide.color}` : 'none',
                  }}>{name}</div>
                </div>
                <div style={{
                  width:7, height:7, borderRadius:'50%', flexShrink:0,
                  background: i===0 ? slide.color : 'rgba(255,255,255,.28)',
                  boxShadow: i===0 ? `0 0 10px ${slide.color}` : 'none',
                  transition:'background .4s,box-shadow .4s',
                }} />
              </motion.div>
            ))}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── LAYER 4 (z:20) — Bottom progress bars ── */}
      <div style={css.progress}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setSlideIdx(i); setHlCount(0); }}
            aria-label={`Go to ${s.label}`}
            style={{
              width: i===slideIdx ? 36 : 8, height:3, borderRadius:3,
              border:'none', cursor:'pointer', padding:0,
              background: i===slideIdx
                ? `linear-gradient(90deg,${slide.color},#00d4ff)`
                : 'rgba(255,255,255,.2)',
              transition:'width .4s ease,background .5s ease',
              overflow:'hidden', position:'relative',
            }}
          >
            {i===slideIdx && !reduced && (
              <motion.div
                key={`pg-${slideIdx}`}
                initial={{ x:'-100%' }} animate={{ x:'0%' }}
                transition={{ duration:6.5, ease:'linear' }}
                style={{ position:'absolute', inset:0, background:'rgba(255,255,255,.42)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity: loaded ? .42 : 0 }}
        transition={{ delay:1.4, duration:.9 }}
        style={css.tagline}
      >
        Smart Travel Planning · Built for Explorers
      </motion.div>

      {/* Loading overlay */}
      <AnimatePresence>
        {!loaded && (
          <motion.div exit={{ opacity:0 }} transition={{ duration:.9 }} style={css.overlay}>
            <motion.div
              animate={{ rotate:360 }}
              transition={{ duration:2.2, repeat:Infinity, ease:'linear' }}
              style={css.spinner}
            />
            <div style={css.loadingText}>Loading Earth…</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scoped styles ─────────────────────────────────────────────────────────────
const css = {
  root: {
    position:'fixed', inset:0,
    background:'radial-gradient(ellipse 130% 110% at 58% 48%,#0d2e6e 0%,#071430 40%,#030b1c 100%)',
    fontFamily:"'Outfit','Plus Jakarta Sans',sans-serif",
    overflow:'hidden', zIndex:999,
  },
  nebula: { position:'absolute', inset:0, pointerEvents:'none' },
  blob:   { position:'absolute', borderRadius:'50%' },

  // ── Layer 1 — text (BEHIND globe) ──
  textLayer: {
    position:'absolute', inset:0,
    zIndex: 2,                          // below globe canvas (z:8)
    display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    pointerEvents:'none',
  },
  subtitle: {
    color:'rgba(255,255,255,.52)',
    fontSize:'clamp(.68rem,1.1vw,.88rem)',
    fontWeight:500, letterSpacing:'0.26em',
    textTransform:'uppercase', margin:'0 0 14px 0',
  },
  headline: {
    margin:0,
    fontSize:'clamp(64px,11vw,140px)',
    fontWeight:900, color:'#ffffff',
    lineHeight:1, userSelect:'none',
    letterSpacing:'-0.01em',
  },

  // ── Layer 2 — globe canvas (ON TOP of text) ──
  globeLayer: {
    position:'absolute', inset:0,
    zIndex: 8,                          // above text (z:2), below CTA/nav
    pointerEvents:'none',
  },

  // ── Layer 3 — CTA button (above globe) ──
  ctaLayer: {
    position:'absolute', bottom:'16%', left:0, right:0,
    zIndex: 15,
    display:'flex', justifyContent:'center',
    pointerEvents:'none',
  },
  ctaBtn: {
    pointerEvents:'auto',
    border:'none', cursor:'pointer', color:'#fff',
    fontSize:'.85rem', fontWeight:700, letterSpacing:'0.18em',
    padding:'16px 50px', borderRadius:50, textTransform:'uppercase',
  },

  // ── Layer 4 — Navbar (always on top) ──
  nav: {
    position:'absolute', top:0, left:0, right:0, zIndex:20,
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'18px 42px',
    background:'linear-gradient(to bottom,rgba(3,11,28,.68)0%,transparent 100%)',
  },
  logo:      { display:'flex', alignItems:'center', gap:10 },
  logoBadge: {
    width:38, height:38, borderRadius:'50%',
    background:'linear-gradient(135deg,#1e6aff 0%,#00ccff 100%)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontWeight:900, fontSize:17, color:'#fff', flexShrink:0,
  },
  logoText:  { color:'#fff', fontWeight:800, fontSize:'1rem', letterSpacing:'0.12em' },
  navRight:  { display:'flex', alignItems:'center', gap:26 },
  navLink:   {
    background:'none', border:'none', cursor:'pointer',
    color:'rgba(255,255,255,.6)', fontSize:'0.74rem',
    fontWeight:600, letterSpacing:'0.08em', transition:'color .2s',
  },
  divider:   { width:1, height:18, background:'rgba(255,255,255,.16)' },
  iconBtn:   {
    background:'none', border:'1px solid rgba(255,255,255,.18)',
    borderRadius:'50%', width:34, height:34,
    display:'flex', alignItems:'center', justifyContent:'center',
    cursor:'pointer', color:'rgba(255,255,255,.65)',
  },
  signupBtn: {
    border:'none', cursor:'pointer', color:'#fff',
    fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em',
    padding:'9px 22px', borderRadius:24, textTransform:'uppercase',
  },

  // Left dots
  dots: {
    position:'absolute', left:28, top:'50%', transform:'translateY(-50%)',
    display:'flex', flexDirection:'column', gap:12, zIndex:20,
  },

  // Right highlights
  hlPanel: {
    position:'absolute', right:46, top:'50%', transform:'translateY(-50%)',
    display:'flex', flexDirection:'column', gap:2, zIndex:20,
  },
  hlLine: {
    position:'absolute', right:3, top:0, bottom:0,
    width:1, background:'rgba(255,255,255,.12)',
  },
  hlRow:  { display:'flex', alignItems:'center', gap:12, padding:'7px 0' },
  hlName: { fontSize:'.67rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase' },

  // Bottom progress
  progress: {
    position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
    display:'flex', alignItems:'center', gap:10, zIndex:20,
  },

  // Tagline
  tagline: {
    position:'absolute', bottom:34, left:42, zIndex:20,
    color:'rgba(255,255,255,.42)', fontSize:'.63rem',
    letterSpacing:'.18em', textTransform:'uppercase', fontWeight:500,
  },

  // Loading
  overlay: {
    position:'absolute', inset:0, background:'#030b1c',
    display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center', zIndex:100,
  },
  spinner: {
    width:52, height:52, borderRadius:'50%',
    border:'3px solid rgba(30,106,255,.18)', borderTopColor:'#1e6aff',
    marginBottom:20,
  },
  loadingText: {
    color:'rgba(255,255,255,.42)', fontSize:'.72rem',
    letterSpacing:'.26em', textTransform:'uppercase',
  },
};
