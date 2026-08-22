import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Globe, 
  DollarSign, 
  Heart, 
  Check, 
  MapPin, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProfileView() {
  const { user, setUser, destinations, toggleWishlist, formatCurrency, addToast } = useApp();

  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'alex.morgan@globetrotter.io');
  const [travelStyle, setTravelStyle] = useState(user?.travelStyle || 'Experiential & Cultural');
  const [currency, setCurrency] = useState(user?.homeCurrency || 'USD');
  const [language, setLanguage] = useState(user?.language || 'English (US)');

  const wishlistDestinations = (destinations || []).filter(d => 
    (user?.wishlistDestinations || []).includes(d.id)
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      email,
      travelStyle,
      homeCurrency: currency,
      language
    }));
    addToast("Profile Updated ✨", "Your travel preferences have been saved.", "success");
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 0' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '40px' }}>
        <span className="gt-label">EXPLORER PROFILE</span>
        <h1 className="gt-h1" style={{ marginTop: '4px' }}>SETTINGS &amp; STYLE</h1>
      </div>

      {/* ── Stats Strip ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="gt-card" style={{ padding: '24px' }}>
          <span className="gt-label">TRIPS PLANNED</span>
          <div className="gt-stat-value" style={{ marginTop: '8px' }}>
            {user?.tripsCount || 3}
          </div>
        </div>

        <div className="gt-card" style={{ padding: '24px' }}>
          <span className="gt-label">VISITED COUNTRIES</span>
          <div className="gt-stat-value" style={{ marginTop: '8px' }}>
            {user?.visitedCountries || 14}
          </div>
        </div>

        <div className="gt-card" style={{ padding: '24px' }}>
          <span className="gt-label">DAYS SCHEDULED</span>
          <div className="gt-stat-value" style={{ marginTop: '8px' }}>
            {user?.daysPlanned || 24}
          </div>
        </div>
      </div>

      {/* ── Settings Form ── */}
      <div className="gt-card" style={{ padding: '36px', borderRadius: 'var(--r-2xl)', marginBottom: '40px' }}>
        <h3 className="gt-h3" style={{ marginBottom: '24px' }}>Travel Preferences</h3>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>TRAVEL STYLE</label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="input-field"
              >
                <option value="Experiential & Cultural">Experiential &amp; Cultural</option>
                <option value="Luxury & Fast-Paced">Luxury &amp; Fast-Paced</option>
                <option value="Nature & Adventure">Nature &amp; Adventure</option>
                <option value="Culinary & Slow Travel">Culinary &amp; Slow Travel</option>
              </select>
            </div>

            <div>
              <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>HOME CURRENCY</label>
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
          </div>

          <div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-start' }}>
              <Check size={16} />
              <span>SAVE PREFERENCES</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── Saved Wishlist ── */}
      <div>
        <div style={{ marginBottom: '20px' }}>
          <span className="gt-label">SAVED PLACES</span>
          <h3 className="gt-h3" style={{ marginTop: '2px' }}>WISHLIST</h3>
        </div>

        {wishlistDestinations.length === 0 ? (
          <div style={{
            padding: '40px',
            background: 'var(--surface)',
            borderRadius: 'var(--r-xl)',
            border: '1px solid var(--border)',
            textAlign: 'center',
            color: 'var(--secondary)'
          }}>
            No saved destinations in your wishlist yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {wishlistDestinations.map(dest => (
              <div
                key={dest.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)'
                }}
              >
                <img
                  src={dest.image}
                  alt={dest.city}
                  style={{ width: '56px', height: '56px', borderRadius: 'var(--r-md)', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                    {dest.city}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--secondary)' }}>
                    {dest.country}
                  </span>
                </div>
                <button
                  onClick={() => toggleWishlist(dest.id)}
                  className="icon-btn"
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
