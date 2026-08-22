import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Compass, 
  Sparkles, 
  Hotel, 
  Plane, 
  Train,
  Check,
  Eye,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import RouteMapCanvas from '../components/itinerary/RouteMapCanvas';

export default function ItineraryBuilderView() {
  const { 
    activeTrip, 
    updateTrip, 
    destinations, 
    presetActivities, 
    addStopToTrip, 
    removeStopFromTrip, 
    addActivityToStop, 
    removeActivityFromStop, 
    reorderStops,
    formatCurrency,
    setCurrentView 
  } = useApp();

  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [targetStopId, setTargetStopId] = useState(null);

  // New Activity form state
  const [actTitle, setActTitle] = useState('');
  const [actCategory, setActCategory] = useState('Sightseeing');
  const [actCost, setActCost] = useState(30);
  const [actDuration, setActDuration] = useState(2.5);
  const [actDay, setActDay] = useState(1);
  const [actTime, setActTime] = useState('10:00');
  const [actNotes, setActNotes] = useState('');

  if (!activeTrip) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>No active trip selected</h3>
        <button onClick={() => setCurrentView('my-trips')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Select a Trip
        </button>
      </div>
    );
  }

  const handleOpenAddActivity = (stopId) => {
    setTargetStopId(stopId);
    setActTitle('');
    setActNotes('');
    setIsAddActivityOpen(true);
  };

  const handleCreateActivity = (e) => {
    e.preventDefault();
    if (!targetStopId) return;

    addActivityToStop(activeTrip.id, targetStopId, {
      title: actTitle || "Custom Activity",
      category: actCategory,
      cost: Number(actCost),
      durationHours: Number(actDuration),
      day: Number(actDay),
      time: actTime,
      notes: actNotes
    });

    setIsAddActivityOpen(false);
  };

  const handleAddPresetActivity = (stopId, preset) => {
    addActivityToStop(activeTrip.id, stopId, {
      title: preset.title,
      category: preset.category,
      cost: preset.cost,
      durationHours: preset.durationHours,
      day: 1,
      time: preset.timeOfDay === 'Morning' ? '09:00' : preset.timeOfDay === 'Evening' ? '18:00' : '14:00',
      notes: preset.description
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-tag primary">Interactive Itinerary Builder</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeTrip.stops?.length || 0} Stops</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{activeTrip.title}</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCurrentView('itinerary-view')}
            className="btn btn-secondary"
          >
            <Eye size={16} />
            <span>Timeline Preview</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsAddStopOpen(true)}
            className="btn btn-primary"
            style={{ background: 'var(--brand-gradient-sunset)' }}
          >
            <Plus size={16} />
            <span>Add City Stop</span>
          </motion.button>
        </div>
      </div>

      {/* Interactive Multi-City Route Map */}
      <RouteMapCanvas stops={activeTrip.stops || []} tripTitle={activeTrip.title} />

      {/* Stops Reorderable List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AnimatePresence>
          {activeTrip.stops?.map((stop, index) => {
            const stopCost = (Number(stop.lodgingCost) || 0) + (Number(stop.transitCost) || 0) +
              (stop.activities?.reduce((acc, a) => acc + (Number(a.cost) || 0), 0) || 0);

            const availablePresets = presetActivities.filter(a => a.cityId === stop.cityId);

            return (
              <motion.div
                key={stop.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-panel"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}
              >
                {/* Stop Header & Reorder Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--brand-gradient)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{stop.cityName}, {stop.country}</h3>
                        <span className="badge-tag">{stop.stayDays} Nights</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Est. Stop Total: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(stopCost)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Reorder and Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      disabled={index === 0}
                      onClick={() => reorderStops(activeTrip.id, index, index - 1)}
                      className="btn btn-sm btn-ghost"
                      style={{ opacity: index === 0 ? 0.3 : 1 }}
                      title="Move Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      disabled={index === activeTrip.stops.length - 1}
                      onClick={() => reorderStops(activeTrip.id, index, index + 1)}
                      className="btn btn-sm btn-ghost"
                      style={{ opacity: index === activeTrip.stops.length - 1 ? 0.3 : 1 }}
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      onClick={() => removeStopFromTrip(activeTrip.id, stop.id)}
                      className="btn btn-sm btn-danger"
                      title="Remove Stop"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Stop Logistics Details (Lodging & Transit) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Hotel size={20} color="var(--brand-primary)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ACCOMMODATION</div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{stop.lodgingName || 'Hotel / Airbnb'}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatCurrency(stop.lodgingCost || 0)}</div>
                  </div>

                  <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Train size={20} color="var(--color-info)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>INCOMING TRANSIT</div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{stop.transitMode || 'Flight / Rail'}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatCurrency(stop.transitCost || 0)}</div>
                  </div>
                </div>

                {/* Activities Scheduled in this stop */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                      Scheduled Activities ({stop.activities?.length || 0})
                    </h4>
                    <button
                      onClick={() => handleOpenAddActivity(stop.id)}
                      className="btn btn-sm btn-secondary"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <Plus size={14} /> Add Custom Activity
                    </button>
                  </div>

                  {stop.activities?.length === 0 ? (
                    <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--border-subtle)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No activities scheduled for {stop.cityName} yet. Add custom experiences or pick from suggestions below!
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                      {stop.activities.map(act => (
                        <div
                          key={act.id}
                          style={{
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                            <div>
                              <span className="badge-tag primary" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                                Day {act.day} • {act.time}
                              </span>
                              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>{act.title}</h5>
                              {act.notes && (
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                  {act.notes}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeActivityFromStop(activeTrip.id, stop.id, act.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '2px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                            <span>⏱️ {act.durationHours} hrs</span>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(act.cost)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Preset Quick Recommendations */}
                  {availablePresets.length > 0 && (
                    <div style={{ marginTop: '14px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Suggested for {stop.cityName}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {availablePresets.map(preset => {
                          const isAlreadyAdded = stop.activities?.some(a => a.title === preset.title);
                          return (
                            <button
                              key={preset.id}
                              disabled={isAlreadyAdded}
                              onClick={() => handleAddPresetActivity(stop.id, preset)}
                              className="btn btn-sm btn-ghost"
                              style={{
                                background: isAlreadyAdded ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                                border: '1px solid var(--border-subtle)',
                                fontSize: '0.78rem'
                              }}
                            >
                              {isAlreadyAdded ? <Check size={12} color="var(--color-success)" /> : <Plus size={12} />}
                              <span>{preset.title} ({formatCurrency(preset.cost)})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Stop Modal */}
      <Modal isOpen={isAddStopOpen} onClose={() => setIsAddStopOpen(false)} title="Add Destination to Itinerary">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Choose a city to include in <strong>{activeTrip.title}</strong>:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', maxHeight: '360px', overflowY: 'auto' }}>
            {destinations.map(d => (
              <div
                key={d.id}
                onClick={() => {
                  addStopToTrip(activeTrip.id, d);
                  setIsAddStopOpen(false);
                }}
                className="card-travel"
                style={{ padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <img src={d.image} alt={d.city} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{d.city}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.country} • {d.costIndex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Add Activity Modal */}
      <Modal isOpen={isAddActivityOpen} onClose={() => setIsAddActivityOpen(false)} title="Add Activity / Experience">
        <form onSubmit={handleCreateActivity} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Activity Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sunset Kayaking, Museum Guided Tour"
              value={actTitle}
              onChange={(e) => setActTitle(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Category
              </label>
              <select
                value={actCategory}
                onChange={(e) => setActCategory(e.target.value)}
                className="input-field"
              >
                <option>Sightseeing</option>
                <option>Food & Dining</option>
                <option>Culture & Art</option>
                <option>Adventure & Nature</option>
                <option>Relaxation</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Cost (USD $)
              </label>
              <input
                type="number"
                min="0"
                value={actCost}
                onChange={(e) => setActCost(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Itinerary Day #
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={actDay}
                onChange={(e) => setActDay(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Scheduled Time
              </label>
              <input
                type="time"
                value={actTime}
                onChange={(e) => setActTime(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Duration (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={actDuration}
                onChange={(e) => setActDuration(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Notes / Booking Link
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Booking confirmation #8921. Meet at south entrance."
              value={actNotes}
              onChange={(e) => setActNotes(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={() => setIsAddActivityOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Add to Day {actDay}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
