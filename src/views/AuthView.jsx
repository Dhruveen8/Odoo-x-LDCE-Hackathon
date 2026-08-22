import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Mail, Lock, User, ArrowRight, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthView() {
  const { setIsAuthenticated, setUser, setCurrentView, addToast } = useApp();
  
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('alex.morgan@globetrotter.io');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Morgan');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (authMode === 'forgot') {
        addToast("Reset Link Sent", `Password reset instructions sent to ${email}`, "info");
        setAuthMode('login');
        return;
      }

      setIsAuthenticated(true);
      setUser(prev => ({
        ...prev,
        name: name || prev.name,
        email: email || prev.email
      }));
      addToast(authMode === 'login' ? "Welcome back!" : "Account created!", `Signed in as ${email}`, "success");
      setCurrentView('dashboard');
    }, 600);
  };

  const handleDemoLogin = (demoRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticated(true);
      if (demoRole === 'traveler') {
        setUser({
          id: "user-1",
          name: "Alex Morgan",
          email: "alex.morgan@globetrotter.io",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          bio: "Architect & slow traveler. Obsessed with coffee shops, train journeys, and brutalist architecture.",
          homeCurrency: "USD",
          travelStyle: "Experiential & Cultural",
          budgetPreference: "Balanced ($$)",
          language: "English (US)",
          tripsCount: 3,
          visitedCountries: 14,
          daysPlanned: 24,
          wishlistDestinations: ["dest-kyoto", "dest-reykjavik", "dest-capetown"]
        });
        setCurrentView('dashboard');
      } else {
        setUser({
          id: "user-admin",
          name: "Elena Rostova (Admin)",
          email: "admin@globetrotter.io",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
          bio: "GlobeTrotter Lead Operations & Curator.",
          homeCurrency: "EUR",
          travelStyle: "Luxury & Fast-Paced",
          budgetPreference: "Premium ($$$$)",
          language: "English (UK)",
          tripsCount: 8,
          visitedCountries: 32,
          daysPlanned: 78,
          wishlistDestinations: ["dest-tokyo", "dest-dubai"]
        });
        setCurrentView('admin');
      }
      addToast("Demo Login Successful", `Logged in as ${demoRole}`, "success");
    }, 400);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Animated Blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px',
          position: 'relative',
          zIndex: 10,
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: 'var(--brand-gradient)', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)', marginBottom: '14px' }}>
            <Compass size={32} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }} className="text-gradient">
            GlobeTrotter
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {authMode === 'login' && 'Sign in to access your travel itineraries'}
            {authMode === 'signup' && 'Create your travel account & start planning'}
            {authMode === 'forgot' && 'Reset your account password'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {authMode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@globetrotter.io"
                className="input-field"
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '6px' }}
          >
            {isLoading ? 'Processing...' : authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            <ArrowRight size={18} />
          </motion.button>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {authMode === 'login' ? (
            <div>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* 1-Click Demo Accounts */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: 700 }}>
            1-Click Demo Access
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => handleDemoLogin('traveler')}
              className="btn btn-sm btn-secondary"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <Sparkles size={14} color="var(--brand-primary)" />
              <span>Traveler Demo</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="btn btn-sm btn-secondary"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <ShieldCheck size={14} color="var(--color-success)" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
