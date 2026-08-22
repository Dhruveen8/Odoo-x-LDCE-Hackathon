import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Globe, 
  DollarSign, 
  Heart, 
  Trash2, 
  Save, 
  Compass, 
  Sun, 
  Moon, 
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProfileView() {
  const { user, setUser, theme, setTheme, destinations, toggleWishlist, addToast, setCurrentView } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');
  const [currency, setCurrency] = useState(user.homeCurrency || 'USD');
  const [travelStyle, setTravelStyle] = useState(user.travelStyle || 'Experiential & Cultural');
  const [language, setLanguage] = useState(user.language || 'English (US)');

  const handleSave = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      email,
      bio,
      homeCurrency: currency,
      travelStyle,
      language
    }));
    addToast("Profile Saved! 👤", "Your travel preferences have been updated.", "success");
  };

  const wishlistDestinations = destinations.filter(d => user.wishlistDestinations?.includes(d.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--brand-primary)', boxShadow: 'var(--shadow-lg)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user.name}</h2>
              <span className="badge-tag primary">{user.travelStyle}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '10px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user.tripsCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TRIPS</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user.visitedCountries}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>COUNTRIES</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user.daysPlanned}d</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PLANNED</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Settings Form */}
        <form onSubmit={handleSave} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            Profile & Travel Settings
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
              Bio & Travel Persona
            </label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Home Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-field"
              >
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>French (FR)</option>
                <option>Spanish (ES)</option>
                <option>Japanese (JP)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
              Travel Pace & Style
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="input-field"
            >
              <option>Experiential & Cultural</option>
              <option>Fast-Paced Explorer</option>
              <option>Relaxed & Slow Travel</option>
              <option>Backpacker & Budget</option>
              <option>Luxury & Fine Dining</option>
            </select>
          </div>

          {/* Theme Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>
              Color Theme
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className="btn btn-secondary"
                style={{ borderColor: theme === 'light' ? 'var(--brand-primary)' : 'var(--border-subtle)' }}
              >
                <Sun size={16} color="#f59e0b" />
                <span>Light Mode</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className="btn btn-secondary"
                style={{ borderColor: theme === 'dark' ? 'var(--brand-primary)' : 'var(--border-subtle)' }}
              >
                <Moon size={16} color="#6366f1" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '6px' }}
          >
            <Save size={18} />
            <span>Save Preferences</span>
          </motion.button>
        </form>

        {/* Saved Bucket List Destinatios */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={18} color="#ef4444" fill="#ef4444" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Bucket List Wishlist</h3>
            </div>
            <span className="badge-tag">{wishlistDestinations.length} Saved</span>
          </div>

          {wishlistDestinations.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No saved cities yet. Browse destinations and click the heart icon to save for future trips!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
              {wishlistDestinations.map(dest => (
                <div
                  key={dest.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={dest.image} alt={dest.city} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{dest.city}, {dest.country}</h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {dest.region} • {dest.costIndex} • ⭐ {dest.rating}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleWishlist(dest.id)}
                    className="btn btn-sm btn-ghost"
                    style={{ color: 'var(--color-danger)', padding: '6px' }}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setCurrentView('city-search')}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: 'auto' }}
          >
            <Compass size={16} />
            <span>Discover More Destinations</span>
          </button>
        </div>

      </div>

    </div>
  );
}
