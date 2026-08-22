import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Calendar, DollarSign, Image, Sparkles, MapPin, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import Modal from '../components/common/Modal';
import { useApp } from '../context/AppContext';

const COVER_PRESETS = [
  { name: "Europe Coast", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80" },
  { name: "Tokyo Skyline", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80" },
  { name: "Bali Sanctuary", url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80" },
  { name: "Iceland Auroras", url: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80" },
  { name: "Dubai Dunes", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80" }
];

export default function CreateTripModal({ isOpen, onClose }) {
  const { createTrip, destinations, setCurrentView } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0]);
  const [targetBudget, setTargetBudget] = useState(2500);
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [selectedCities, setSelectedCities] = useState(['dest-paris', 'dest-rome']);

  const toggleCitySelection = (cityId) => {
    if (selectedCities.includes(cityId)) {
      setSelectedCities(selectedCities.filter(id => id !== cityId));
    } else {
      setSelectedCities([...selectedCities, cityId]);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    
    // Auto populate initial stops based on selected destinations
    const stops = selectedCities.map((cId, idx) => {
      const d = destinations.find(dest => dest.id === cId) || { city: "City", country: "Country" };
      return {
        id: `stop-${Date.now()}-${idx}`,
        cityId: cId,
        cityName: d.city,
        country: d.country,
        arrivalDate: startDate,
        departureDate: endDate,
        stayDays: 3,
        lodgingName: `${d.city} Boutique Loft`,
        lodgingCost: 380,
        transitMode: "Flight / Express Train",
        transitCost: 140,
        order: idx + 1,
        activities: []
      };
    });

    const newTrip = createTrip({
      title: title || "New Custom Itinerary",
      description: description || "Exciting multi-city travel adventure.",
      startDate,
      endDate,
      targetBudget: Number(targetBudget),
      coverImage,
      stops
    });

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // Confetti fallback
    }

    onClose();
    setCurrentView('itinerary-builder');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Plan a New Multi-City Trip" maxWidth="720px">
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Trip Title */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
            Trip Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Nordic Fjords & Aurora Chase, Spanish Sun & Tapas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Date Ranges */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              End Date
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Target Budget */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
            Target Total Budget (USD $)
          </label>
          <input
            type="number"
            min="100"
            step="50"
            value={targetBudget}
            onChange={(e) => setTargetBudget(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
            Trip Overview & Inspiration
          </label>
          <textarea
            rows="3"
            placeholder="What is the vibe or purpose of this trip? (e.g. Romantic food crawl, hiking & photography, solo retreat)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Initial Destination Stops Picker */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
            Select Initial Destinations to Include
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', maxHeight: '160px', overflowY: 'auto', padding: '4px' }}>
            {destinations.map(d => {
              const isSelected = selectedCities.includes(d.id);
              return (
                <div
                  key={d.id}
                  onClick={() => toggleCitySelection(d.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-tertiary)',
                    border: `1.5px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <span>{d.city}</span>
                  {isSelected && <Check size={14} color="var(--brand-primary)" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cover Photo Presets */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
            Choose Cover Image
          </label>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
            {COVER_PRESETS.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => setCoverImage(preset.url)}
                style={{
                  position: 'relative',
                  width: '100px',
                  height: '60px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: coverImage === preset.url ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  flexShrink: 0
                }}
              >
                <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {coverImage === preset.url && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(99, 102, 241, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={16} color="#ffffff" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ background: 'var(--brand-gradient-sunset)' }}>
            <Sparkles size={16} />
            <span>Generate Itinerary</span>
          </button>
        </div>

      </form>
    </Modal>
  );
}
