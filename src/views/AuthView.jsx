import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const SLIDES = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=90', label: 'Swiss Alps' },
  { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=90', label: 'Santorini, Greece' },
  { url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?auto=format&fit=crop&w=1600&q=90', label: 'Bali, Indonesia' },
  { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=90', label: 'Paris, France' },
  { url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1600&q=90', label: 'Japan' },
];

function getStrength(pass) {
  if (!pass) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pass.length >= 8) s++;
  if (/[A-Z]/.test(pass)) s++;
  if (/\d/.test(pass)) s++;
  if (/[^A-Za-z0-9]/.test(pass)) s++;
  const map = [
    { label: 'Weak', color: '#f43f5e' },
    { label: 'Fair', color: '#f59e0b' },
    { label: 'Good', color: '#6366f1' },
    { label: 'Strong', color: '#10b981' },
  ];
  return { score: s, ...map[Math.max(0, s - 1)] };
}

function Field({ icon: Icon, error, success, children }) {
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: error ? '#f43f5e' : success ? '#10b981' : 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
        {children}
        {success && <CheckCircle2 size={15} color="#10b981" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />}
      </div>
      {error && (
        <p style={{ margin: '5px 0 0', fontSize: '0.73rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

export default function AuthView() {
  const { setIsAuthenticated, setUser, setCurrentView, addToast } = useApp();
  const [mode, setMode] = useState('login');
  const [slide, setSlide] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { setErrors({}); setTouched({}); }, [mode]);

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validate = (field, val) => {
    if (field === 'name' && mode === 'signup' && val.trim().length < 2) return 'At least 2 characters';
    if (field === 'email' && !emailRx.test(val.trim())) return 'Enter a valid email';
    if (field === 'password' && val.length < 8) return 'Minimum 8 characters';
    if (field === 'confirm' && val !== password) return 'Passwords do not match';
    return '';
  };

  const touch = field => {
    setTouched(p => ({ ...p, [field]: true }));
    const val = { name, email, password, confirm }[field];
    setErrors(p => ({ ...p, [field]: validate(field, val) }));
  };

  const live = (field, val) => {
    if (!touched[field]) return;
    setErrors(p => ({ ...p, [field]: validate(field, val) }));
  };

  const validateAll = () => {
    const fields = mode === 'signup' ? ['name', 'email', 'password', 'confirm'] : ['email', 'password'];
    const vals = { name, email, password, confirm };
    const errs = {};
    fields.forEach(f => { const e = validate(f, vals[f]); if (e) errs[f] = e; });
    setErrors(errs);
    setTouched(Object.fromEntries(fields.map(f => [f, true])));
    return Object.keys(errs).length === 0;
  };

  const isOk = field => touched[field] && !errors[field] && { name, email, password, confirm }[field];

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsAuthenticated(true);
      setUser(prev => ({ ...prev, name: mode === 'signup' ? name : (prev?.name || 'Traveler'), email }));
      addToast(mode === 'login' ? 'Welcome Back! ✈️' : 'Account Created! 🎉', `Logged in as ${email}`, 'success');
      setCurrentView('dashboard');
    }, 750);
  };

  const demoLogin = role => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsAuthenticated(true);
      if (role === 'traveler') {
        setUser({ id: 'user-1', name: 'Alex Morgan', email: 'alex.morgan@globetrotter.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', tripsCount: 3, visitedCountries: 14, daysPlanned: 24, wishlistDestinations: ['dest-udaipur', 'dest-goa', 'dest-kerala'] });
        setCurrentView('dashboard');
      } else {
        setUser({ id: 'user-admin', name: 'Elena Rostova', email: 'admin@globetrotter.io', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', tripsCount: 8, visitedCountries: 32, daysPlanned: 78 });
        setCurrentView('admin');
      }
      addToast('Demo Access ⚡', `Signed in as ${role}`, 'success');
    }, 450);
  };

  const strength = getStrength(password);

  const inputStyle = field => ({
    width: '100%',
    height: 46,
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${errors[field] ? 'rgba(244,63,94,0.7)' : isOk(field) ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: 12,
    color: '#ffffff',
    fontSize: '0.9rem',
    paddingLeft: 40,
    paddingRight: (field === 'password' || field === 'confirm') ? 42 : 14,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Slideshow background */}
      <AnimatePresence mode="crossfade">
        <motion.div
          key={slide}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `url(${SLIDES[slide].url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(135deg, rgba(5,4,15,0.80) 0%, rgba(10,8,30,0.65) 100%)', backdropFilter: 'blur(2px)' }} />

      {/* Glow orbs */}
      <motion.div animate={{ x: [0, 60, 0], y: [0, -40, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '-10%', left: '5%', zIndex: 1, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <motion.div animate={{ x: [0, -50, 0], y: [0, 50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: '-10%', right: '5%', zIndex: 1, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      {/* Location badge */}
      <AnimatePresence mode="wait">
        <motion.div key={`badge-${slide}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }} style={{ position: 'absolute', bottom: 32, left: 40, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 100, padding: '8px 18px', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
          {SLIDES[slide].label}
        </motion.div>
      </AnimatePresence>

      {/* Slide dots */}
      <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 6 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 20 : 6, height: 6, borderRadius: 3, background: i === slide ? '#6366f1' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
        ))}
      </div>

      {/* Glass card */}
      <motion.div initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440, margin: '0 20px', background: 'rgba(12, 10, 28, 0.72)', backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 24, boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18)', padding: '36px 36px 32px' }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(99,102,241,0.5)' }}>
            <Compass size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.01em' }}>GlobeTrotter</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(165,180,252,0.85)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Travel Planner</div>
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {[['login', 'Sign In'], ['signup', 'Create Account']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: '9px 0', borderRadius: 9, border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.22s ease', background: mode === m ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent', color: mode === m ? '#fff' : 'rgba(255,255,255,0.45)', boxShadow: mode === m ? '0 4px 14px rgba(99,102,241,0.45)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form key={mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: 'easeOut' }} onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {mode === 'signup' && (
              <Field icon={User} error={errors.name} success={isOk('name')}>
                <input type="text" placeholder="Full name" value={name} onChange={e => { setName(e.target.value); live('name', e.target.value); }} onBlur={() => touch('name')} style={inputStyle('name')} />
              </Field>
            )}

            <Field icon={Mail} error={errors.email} success={isOk('email')}>
              <input type="email" placeholder="Email address" value={email} onChange={e => { setEmail(e.target.value); live('email', e.target.value); }} onBlur={() => touch('email')} style={inputStyle('email')} />
            </Field>

            <Field icon={Lock} error={errors.password} success={isOk('password')}>
              <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); live('password', e.target.value); }} onBlur={() => touch('password')} style={inputStyle('password')} />
              <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 2 }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </Field>

            {mode === 'signup' && password && (
              <div style={{ marginTop: -6 }}>
                <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, width: `${(strength.score / 4) * 100}%`, background: strength.color, transition: 'width 0.3s ease, background 0.3s ease' }} />
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: strength.color, fontWeight: 600, textAlign: 'right' }}>{strength.label}</p>
              </div>
            )}

            {mode === 'signup' && (
              <Field icon={Lock} error={errors.confirm} success={isOk('confirm')}>
                <input type={showCf ? 'text' : 'password'} placeholder="Confirm password" value={confirm} onChange={e => { setConfirm(e.target.value); live('confirm', e.target.value); }} onBlur={() => touch('confirm')} style={inputStyle('confirm')} />
                <button type="button" onClick={() => setShowCf(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 2 }}>
                  {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </Field>
            )}

            <motion.button whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(99,102,241,0.55)' }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading} style={{ marginTop: 4, height: 48, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1, boxShadow: '0 8px 24px rgba(99,102,241,0.4)', transition: 'opacity 0.2s' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'authSpin 0.7s linear infinite' }} />
                  Please wait…
                </span>
              ) : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'}<ArrowRight size={16} /></>
              )}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        {/* Demo */}
        <div style={{ marginTop: 24 }}>
          <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Quick Demo</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[{ role: 'traveler', label: '🎒 Traveler' }, { role: 'admin', label: '👑 Admin' }].map(({ role, label }) => (
              <motion.button key={role} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => demoLogin(role)} disabled={loading} style={{ height: 38, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                {label}
              </motion.button>
            ))}
          </div>
        </div>

      </motion.div>

      <style>{`
        @keyframes authSpin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.28); }
        input:focus { outline: none; border-color: rgba(99,102,241,0.7) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.18); }
      `}</style>
    </div>
  );
}
