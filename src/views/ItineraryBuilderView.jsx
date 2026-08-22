import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Car, 
  UserCheck, 
  X, 
  Check, 
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ItineraryBuilderView() {
  const { 
    activeTrip, 
    updateTrip, 
    destinations, 
    vehiclesData,
    tourGuidesData,
    addStopToTrip, 
    removeStopFromTrip, 
    addActivityToStop, 
    removeActivityFromStop,
    addVehicleRentalToStop,
    removeVehicleRentalFromStop,
    addGuideBookingToStop,
    removeGuideBookingFromStop,
    reorderStops,
    formatCurrency,
    setCurrentView
  } = useApp();

  // Modals
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isAddActOpen, setIsAddActOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddGuideOpen, setIsAddGuideOpen] = useState(false);
  const [activeStopId, setActiveStopId] = useState(null);

  // Tab per stop
  const [stopTabs, setStopTabs] = useState({});

  // Activity form
  const [actTitle, setActTitle] = useState('');
  const [actCategory, setActCategory] = useState('Sightseeing');
  const [actCost, setActCost] = useState(40);
  const [actDay, setActDay] = useState(1);
  const [actTime, setActTime] = useState('10:00 AM');

  // Vehicle form
  const [selectedVehId, setSelectedVehId] = useState('');
  const [vehDays, setVehDays] = useState(3);

  // Guide form
  const [selectedGuideId, setSelectedGuideId] = useState('');
  const [guideDuration, setGuideDuration] = useState('Full Day (8h)');

  if (!activeTrip) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center' }}>
        <h2 className="gt-h2">No active trip selected</h2>
        <button onClick={() => setCurrentView('dashboard')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Overview
        </button>
      </div>
    );
  }

  const stops = activeTrip.stops || [];

  const handleAddActivity = () => {
    if (!actTitle.trim() || !activeStopId) return;
    addActivityToStop(activeTrip.id, activeStopId, {
      title: actTitle,
      category: actCategory,
      cost: Number(actCost),
      day: Number(actDay),
      time: actTime
    });
    setActTitle('');
    setIsAddActOpen(false);
  };

  const handleAddVehicle = () => {
    const veh = (vehiclesData || []).find(v => v.id === selectedVehId);
    if (!veh || !activeStopId) return;
    addVehicleRentalToStop(activeTrip.id, activeStopId, {
      ...veh,
      rentalDays: Number(vehDays),
      totalCost: Number(veh.pricePerDay) * Number(vehDays),
      dailyRate: Number(veh.pricePerDay)
    });
    setIsAddVehicleOpen(false);
  };

  const handleAddGuide = () => {
    const g = (tourGuidesData || []).find(guide => guide.id === selectedGuideId);
    if (!g || !activeStopId) return;
    addGuideBookingToStop(activeTrip.id, activeStopId, {
      ...g,
      duration: guideDuration,
      totalCost: Number(g.rate || g.dailyRate || 250),
      rate: Number(g.rate || g.dailyRate || 250)
    });
    setIsAddGuideOpen(false);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 0' }}>
      
      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div>
          <span className="gt-label">ROUTING &amp; SCHEDULING</span>
          <h1 className="gt-h1" style={{ marginTop: '4px' }}>ITINERARY BUILDER</h1>
          <p style={{ fontSize: '14px', color: 'var(--secondary)', marginTop: '4px' }}>
            {activeTrip.title} • {stops.length} Stops Planned
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsAddStopOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>ADD DESTINATION</span>
          </button>

          <button
            onClick={() => setCurrentView('itinerary-view')}
            className="btn btn-secondary"
          >
            <span>TIMELINE VIEW</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Stops Timeline ── */}
      {stops.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          background: 'var(--surface)',
          borderRadius: 'var(--r-2xl)',
          border: '1px solid var(--border)'
        }}>
          <h3 className="gt-h3">Your itinerary is currently empty</h3>
          <p className="gt-body" style={{ marginTop: '8px', maxWidth: '380px', margin: '8px auto 24px' }}>
            Add your first destination stop to begin scheduling experiences, vehicle rentals, and private guides.
          </p>
          <button onClick={() => setIsAddStopOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>ADD FIRST STOP</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {stops.map((stop, idx) => {
            const currentTab = stopTabs[stop.id] || 'activities';

            return (
              <motion.div
                key={stop.id}
                className="gt-card"
                style={{ borderRadius: 'var(--r-2xl)', overflow: 'hidden' }}
              >
                {/* Stop Top Bar */}
                <div style={{
                  padding: '24px',
                  background: 'var(--hover)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="gt-badge gold">STOP 0{idx + 1}</span>
                    <div>
                      <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
                        {stop.cityName}
                      </h3>
                      <span style={{ fontSize: '13px', color: 'var(--secondary)' }}>
                        {stop.country} • {stop.stayDays || 3} Days Stay
                      </span>
                    </div>
                  </div>

                  {/* Reorder & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => idx > 0 && reorderStops(activeTrip.id, idx, idx - 1)}
                      disabled={idx === 0}
                      className="icon-btn"
                      title="Move Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => idx < stops.length - 1 && reorderStops(activeTrip.id, idx, idx + 1)}
                      disabled={idx === stops.length - 1}
                      className="icon-btn"
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      onClick={() => removeStopFromTrip(activeTrip.id, stop.id)}
                      className="icon-btn"
                      style={{ color: '#ef4444' }}
                      title="Remove Stop"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Sub-Tabs: Experiences | Vehicles | Guides */}
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid var(--border)',
                  padding: '0 24px',
                  gap: '24px',
                  background: 'var(--surface)'
                }}>
                  {[
                    { id: 'activities', label: `Experiences (${stop.activities?.length || 0})` },
                    { id: 'vehicles', label: `Vehicles (${stop.vehicleRentals?.length || 0})` },
                    { id: 'guides', label: `Guides (${stop.guideBookings?.length || 0})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setStopTabs(p => ({ ...p, [stop.id]: tab.id }))}
                      style={{
                        padding: '16px 0',
                        border: 'none',
                        background: 'transparent',
                        color: currentTab === tab.id ? 'var(--primary)' : 'var(--tertiary)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      {tab.label}
                      {currentTab === tab.id && (
                        <motion.div
                          layoutId={`tab-line-${stop.id}`}
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: 'var(--primary)'
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div style={{ padding: '24px' }}>
                  
                  {/* 1. Activities Tab */}
                  {currentTab === 'activities' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span className="gt-label-sm">SCHEDULED EXPERIENCES</span>
                        <button
                          onClick={() => {
                            setActiveStopId(stop.id);
                            setIsAddActOpen(true);
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          <Plus size={14} />
                          <span>ADD EXPERIENCE</span>
                        </button>
                      </div>

                      {(stop.activities || []).length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--tertiary)', fontSize: '13px' }}>
                          No experiences scheduled for this stop yet.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {stop.activities.map((act) => (
                            <div
                              key={act.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '14px 18px',
                                borderRadius: 'var(--r-md)',
                                background: 'var(--hover)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Sparkles size={16} color="#ec4899" />
                                <div>
                                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {act.title}
                                  </span>
                                  <span style={{ fontSize: '12px', color: 'var(--secondary)', display: 'block' }}>
                                    Day {act.day || 1} • {act.time || '10:00 AM'} • {act.category || 'Sightseeing'}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>
                                  {formatCurrency(act.cost || 0)}
                                </span>
                                <button
                                  onClick={() => removeActivityFromStop(activeTrip.id, stop.id, act.id)}
                                  className="icon-btn"
                                  style={{ color: '#ef4444' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Vehicles Tab */}
                  {currentTab === 'vehicles' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span className="gt-label-sm">RESERVED TRANSIT</span>
                        <button
                          onClick={() => {
                            setActiveStopId(stop.id);
                            setIsAddVehicleOpen(true);
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          <Plus size={14} />
                          <span>RESERVE VEHICLE</span>
                        </button>
                      </div>

                      {(stop.vehicleRentals || []).length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--tertiary)', fontSize: '13px' }}>
                          No rental vehicles attached to this stop.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {stop.vehicleRentals.map((v) => (
                            <div
                              key={v.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '14px 18px',
                                borderRadius: 'var(--r-md)',
                                background: 'var(--hover)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Car size={16} color="#10b981" />
                                <div>
                                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {v.name} ({v.type})
                                  </span>
                                  <span style={{ fontSize: '12px', color: 'var(--secondary)', display: 'block' }}>
                                    {v.rentalDays || 1} Days • {v.transmission} • {v.provider}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>
                                  {formatCurrency(v.totalCost || v.dailyRate || 0)}
                                </span>
                                <button
                                  onClick={() => removeVehicleRentalFromStop(activeTrip.id, stop.id, v.id)}
                                  className="icon-btn"
                                  style={{ color: '#ef4444' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Guides Tab */}
                  {currentTab === 'guides' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span className="gt-label-sm">BOOKED LOCAL GUIDES</span>
                        <button
                          onClick={() => {
                            setActiveStopId(stop.id);
                            setIsAddGuideOpen(true);
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          <Plus size={14} />
                          <span>BOOK GUIDE</span>
                        </button>
                      </div>

                      {(stop.guideBookings || []).length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--tertiary)', fontSize: '13px' }}>
                          No private tour guides booked for this stop.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {stop.guideBookings.map((g) => (
                            <div
                              key={g.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '14px 18px',
                                borderRadius: 'var(--r-md)',
                                background: 'var(--hover)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <UserCheck size={16} color="#c9a96e" />
                                <div>
                                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {g.name}
                                  </span>
                                  <span style={{ fontSize: '12px', color: 'var(--secondary)', display: 'block' }}>
                                    {g.specialization} • {g.duration || 'Full Day'}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>
                                  {formatCurrency(g.totalCost || g.rate || 0)}
                                </span>
                                <button
                                  onClick={() => removeGuideBookingFromStop(activeTrip.id, stop.id, g.id)}
                                  className="icon-btn"
                                  style={{ color: '#ef4444' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Modal: Add Destination Stop ── */}
      <AnimatePresence>
        {isAddStopOpen && (
          <div className="gt-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="gt-modal"
              style={{ padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <span className="gt-label">SELECT DESTINATION</span>
                  <h3 className="gt-h3" style={{ marginTop: '2px' }}>ADD STOP</h3>
                </div>
                <button onClick={() => setIsAddStopOpen(false)} className="icon-btn">
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                {(destinations || []).map(dest => (
                  <div
                    key={dest.id}
                    onClick={() => {
                      addStopToTrip(activeTrip.id, dest);
                      setIsAddStopOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px',
                      borderRadius: 'var(--r-lg)',
                      background: 'var(--hover)',
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      transition: 'border-color 0.2s'
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
                        {dest.country} • From {formatCurrency(dest.avgDailyCost || 180)}/day
                      </span>
                    </div>
                    <Plus size={18} color="var(--primary)" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Add Experience ── */}
      <AnimatePresence>
        {isAddActOpen && (
          <div className="gt-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="gt-modal"
              style={{ padding: '32px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <span className="gt-label">NEW EXPERIENCE</span>
                  <h3 className="gt-h3" style={{ marginTop: '2px' }}>SCHEDULE ACTIVITY</h3>
                </div>
                <button onClick={() => setIsAddActOpen(false)} className="icon-btn">
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>ACTIVITY NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Louvre Museum &amp; Tuileries Garden"
                    value={actTitle}
                    onChange={(e) => setActTitle(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>CATEGORY</label>
                    <select
                      value={actCategory}
                      onChange={(e) => setActCategory(e.target.value)}
                      className="input-field"
                    >
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Dining">Dining</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Culture">Culture</option>
                    </select>
                  </div>

                  <div>
                    <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>DAY OF STOP</label>
                    <input
                      type="number"
                      min="1"
                      value={actDay}
                      onChange={(e) => setActDay(Number(e.target.value))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>EST. COST</label>
                    <input
                      type="number"
                      min="0"
                      value={actCost}
                      onChange={(e) => setActCost(Number(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>TIME</label>
                    <input
                      type="text"
                      placeholder="10:00 AM"
                      value={actTime}
                      onChange={(e) => setActTime(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddActivity}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  <Check size={16} />
                  <span>ADD TO STOP</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Add Vehicle ── */}
      <AnimatePresence>
        {isAddVehicleOpen && (
          <div className="gt-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="gt-modal"
              style={{ padding: '32px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <span className="gt-label">RENTAL TRANSIT</span>
                  <h3 className="gt-h3" style={{ marginTop: '2px' }}>SELECT VEHICLE</h3>
                </div>
                <button onClick={() => setIsAddVehicleOpen(false)} className="icon-btn">
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>CHOOSE VEHICLE</label>
                  <select
                    value={selectedVehId}
                    onChange={(e) => setSelectedVehId(e.target.value)}
                    className="input-field"
                  >
                    <option value="">-- Choose a Vehicle --</option>
                    {(vehiclesData || []).map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.type}) • {formatCurrency(v.pricePerDay)}/day
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>RENTAL DAYS</label>
                  <input
                    type="number"
                    min="1"
                    value={vehDays}
                    onChange={(e) => setVehDays(Number(e.target.value))}
                    className="input-field"
                  />
                </div>

                <button
                  onClick={handleAddVehicle}
                  disabled={!selectedVehId}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  <Check size={16} />
                  <span>ATTACH VEHICLE</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Add Guide ── */}
      <AnimatePresence>
        {isAddGuideOpen && (
          <div className="gt-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="gt-modal"
              style={{ padding: '32px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <span className="gt-label">LOCAL GUIDE</span>
                  <h3 className="gt-h3" style={{ marginTop: '2px' }}>BOOK GUIDE</h3>
                </div>
                <button onClick={() => setIsAddGuideOpen(false)} className="icon-btn">
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>CHOOSE GUIDE</label>
                  <select
                    value={selectedGuideId}
                    onChange={(e) => setSelectedGuideId(e.target.value)}
                    className="input-field"
                  >
                    <option value="">-- Choose a Tour Guide --</option>
                    {(tourGuidesData || []).map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.specialization}) • {formatCurrency(g.rate || g.dailyRate || 250)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="gt-label" style={{ marginBottom: '6px', display: 'block' }}>DURATION</label>
                  <select
                    value={guideDuration}
                    onChange={(e) => setGuideDuration(e.target.value)}
                    className="input-field"
                  >
                    <option value="Half Day (4h)">Half Day (4h)</option>
                    <option value="Full Day (8h)">Full Day (8h)</option>
                  </select>
                </div>

                <button
                  onClick={handleAddGuide}
                  disabled={!selectedGuideId}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  <Check size={16} />
                  <span>ATTACH GUIDE</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
