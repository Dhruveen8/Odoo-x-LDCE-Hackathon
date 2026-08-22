import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Sparkles,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CreateTripModal({ isOpen, onClose }) {
  const { createTrip, destinations, formatCurrency, setCurrentView } = useApp();

  const [step, setStep] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [tripTitle, setTripTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [targetBudget, setTargetBudget] = useState(3000);
  const [searchCity, setSearchCity] = useState('');

  if (!isOpen) return null;

  const filteredCities = (destinations || []).filter(d => 
    d.city.toLowerCase().includes(searchCity.toLowerCase()) ||
    d.country.toLowerCase().includes(searchCity.toLowerCase())
  );

  const handleFinishCreate = () => {
    const newTrip = createTrip({
      title: tripTitle || `${selectedDestination?.city || 'European'} Getaway`,
      coverImage: selectedDestination?.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      startDate,
      endDate,
      targetBudget: Number(targetBudget),
      stops: selectedDestination ? [{
        id: `stop-${Date.now()}`,
        cityId: selectedDestination.id,
        cityName: selectedDestination.city,
        country: selectedDestination.country,
        arrivalDate: startDate,
        departureDate: endDate,
        stayDays: 4,
        lodgingName: `${selectedDestination.city} Grand Hotel`,
        lodgingCost: 400,
        transitCost: 150,
        activities: [],
        vehicleRentals: [],
        guideBookings: []
      }] : []
    });

    onClose();
    setStep(1);
    setSelectedDestination(null);
    setCurrentView('itinerary-builder');
  };

  return (
    <div className="gt-overlay">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="gt-modal"
        style={{ maxWidth: '640px', padding: '40px' }}
      >
        {/* Top Progress & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="gt-badge gold">STEP 0{step} OF 03</span>
          </div>
          <button onClick={onClose} className="icon-btn">
            <X size={18} />
          </button>
        </div>

        {/* ── STEP 1: WHERE? ── */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <span className="gt-label">DESTINATION</span>
            <h2 className="gt-h2" style={{ marginTop: '4px', marginBottom: '24px' }}>
              WHERE TO?
            </h2>

            <input
              type="text"
              placeholder="Search destination city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="input-field"
              style={{ marginBottom: '16px', borderRadius: 'var(--r-full)' }}
              autoFocus
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxHeight: '240px', overflowY: 'auto', marginBottom: '28px' }}>
              {filteredCities.slice(0, 6).map(dest => {
                const isSelected = selectedDestination?.id === dest.id;
                return (
                  <div
                    key={dest.id}
                    onClick={() => {
                      setSelectedDestination(dest);
                      setTripTitle(`${dest.city} Discovery`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: 'var(--r-lg)',
                      background: isSelected ? 'var(--primary)' : 'var(--hover)',
                      color: isSelected ? 'var(--bg)' : 'var(--primary)',
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <img
                      src={dest.image}
                      alt={dest.city}
                      style={{ width: '40px', height: '40px', borderRadius: 'var(--r-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800 }}>{dest.city}</div>
                      <div style={{ fontSize: '11px', opacity: 0.75 }}>{dest.country}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedDestination}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <span>CONTINUE TO DATES</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* ── STEP 2: WHEN? ── */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <span className="gt-label">DATES</span>
            <h2 className="gt-h2" style={{ marginTop: '4px', marginBottom: '24px' }}>
              WHEN ARE YOU TRAVELING?
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div>
                <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>START DATE</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>END DATE</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary btn-lg">
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
              >
                <span>CONTINUE TO BUDGET</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: TITLE & BUDGET ── */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <span className="gt-label">TRIP DETAILS</span>
            <h2 className="gt-h2" style={{ marginTop: '4px', marginBottom: '24px' }}>
              NAME &amp; BUDGET
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>TRIP TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Autumn in Zurich &amp; Lucerne"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>TARGET BUDGET ($)</label>
                <input
                  type="number"
                  min="500"
                  step="250"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} className="btn btn-secondary btn-lg">
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={handleFinishCreate}
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
              >
                <Check size={16} />
                <span>GENERATE ITINERARY</span>
              </button>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
