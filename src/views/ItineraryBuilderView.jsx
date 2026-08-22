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
  ChevronRight,
  Car,
  Users,
  ShieldCheck,
  Fuel,
  Gauge,
  Globe,
  Star,
  Edit3,
  X
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
    setCurrentView,
    setSelectedStopContext
  } = useApp();

  // Modals state
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isVehiclePickerOpen, setIsVehiclePickerOpen] = useState(false);
  const [isGuidePickerOpen, setIsGuidePickerOpen] = useState(false);
  const [targetStopId, setTargetStopId] = useState(null);

  // Active Tab for each stop: { [stopId]: 'activities' | 'vehicles' | 'guides' }
  const [stopActiveTabs, setStopActiveTabs] = useState({});

  // New Activity form state
  const [actTitle, setActTitle] = useState('');
  const [actCategory, setActCategory] = useState('Sightseeing');
  const [actCost, setActCost] = useState(30);
  const [actDuration, setActDuration] = useState(2.5);
  const [actDay, setActDay] = useState(1);
  const [actTime, setActTime] = useState('10:00');
  const [actNotes, setActNotes] = useState('');

  // Quick Vehicle Booking form state inside modal
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehStartDate, setVehStartDate] = useState('');
  const [vehEndDate, setVehEndDate] = useState('');

  // Quick Guide Booking form state inside modal
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guideDate, setGuideDate] = useState('');
  const [guideDuration, setGuideDuration] = useState('Full Day (8h)');
  const [guideNotes, setGuideNotes] = useState('');

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

  const getStopTab = (stopId) => stopActiveTabs[stopId] || 'activities';
  const setStopTab = (stopId, tab) => setStopActiveTabs(prev => ({ ...prev, [stopId]: tab }));

  // Handlers for Activity
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

  // Handlers for Quick Vehicle Rental Picker
  const handleOpenVehiclePicker = (stop) => {
    setTargetStopId(stop.id);
    const available = vehiclesData.filter(v => v.cityId === stop.cityId);
    setSelectedVehicle(available[0] || vehiclesData[0]);
    setVehStartDate(stop.arrivalDate || activeTrip.startDate);
    setVehEndDate(stop.departureDate || activeTrip.endDate);
    setIsVehiclePickerOpen(true);
  };

  const handleConfirmVehicleRental = (e) => {
    e.preventDefault();
    if (!targetStopId || !selectedVehicle) return;

    const s = new Date(vehStartDate || activeTrip.startDate);
    const end = new Date(vehEndDate || activeTrip.endDate);
    const diff = Math.ceil((end - s) / (1000 * 60 * 60 * 24));
    const rentalDays = diff > 0 ? diff : 1;
    const totalCost = selectedVehicle.pricePerDay * rentalDays;

    addVehicleRentalToStop(activeTrip.id, targetStopId, {
      vehicleId: selectedVehicle.id,
      name: selectedVehicle.name,
      model: selectedVehicle.model,
      type: selectedVehicle.type,
      seats: selectedVehicle.seats,
      transmission: selectedVehicle.transmission,
      fuelType: selectedVehicle.fuelType,
      provider: selectedVehicle.provider,
      rating: selectedVehicle.rating,
      image: selectedVehicle.image,
      startDate: vehStartDate,
      endDate: vehEndDate,
      rentalDays,
      dailyRate: selectedVehicle.pricePerDay,
      totalCost
    });

    setIsVehiclePickerOpen(false);
  };

  // Handlers for Quick Guide Booking Picker
  const handleOpenGuidePicker = (stop) => {
    setTargetStopId(stop.id);
    const available = tourGuidesData.filter(g => g.cityId === stop.cityId);
    setSelectedGuide(available[0] || tourGuidesData[0]);
    setGuideDate(stop.arrivalDate || activeTrip.startDate);
    setGuideDuration('Full Day (8h)');
    setGuideNotes('Excited to explore the city highlights with a local expert!');
    setIsGuidePickerOpen(true);
  };

  const handleConfirmGuideBooking = (e) => {
    e.preventDefault();
    if (!targetStopId || !selectedGuide) return;

    let fee = selectedGuide.pricePerDay;
    if (guideDuration.includes('Half Day')) fee = Math.round(selectedGuide.pricePerDay * 0.6);
    if (guideDuration.includes('Sunset')) fee = Math.round(selectedGuide.pricePerDay * 0.5);

    addGuideBookingToStop(activeTrip.id, targetStopId, {
      guideId: selectedGuide.id,
      name: selectedGuide.name,
      avatar: selectedGuide.avatar,
      specialization: selectedGuide.specialization,
      languages: selectedGuide.languages,
      rating: selectedGuide.rating,
      date: guideDate,
      duration: guideDuration,
      rate: fee,
      totalCost: fee,
      notes: guideNotes
    });

    setIsGuidePickerOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* ── Header Bar ── */}
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
          >
            <Plus size={16} />
            <span>Add City Stop</span>
          </motion.button>
        </div>
      </div>

      {/* ── Interactive Multi-City Route Map ── */}
      <RouteMapCanvas stops={activeTrip.stops || []} tripTitle={activeTrip.title} />

      {/* ── Stops List with Integrated Activities, Vehicle Rental & Tour Guides ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <AnimatePresence>
          {activeTrip.stops?.map((stop, index) => {
            const currentTab = getStopTab(stop.id);
            const stopActivities = stop.activities || [];
            const stopVehicles = stop.vehicleRentals || [];
            const stopGuides = stop.guideBookings || [];

            // Calculate total stop cost
            const actTotal = stopActivities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
            const vehTotal = stopVehicles.reduce((sum, v) => sum + (Number(v.totalCost) || 0), 0);
            const guideTotal = stopGuides.reduce((sum, g) => sum + (Number(g.totalCost) || 0), 0);
            const stopTotal = (Number(stop.lodgingCost) || 0) + (Number(stop.transitCost) || 0) + actTotal + vehTotal + guideTotal;

            const cityPresetActivities = presetActivities.filter(p => p.cityId === stop.cityId);
            const cityVehicles = vehiclesData.filter(v => v.cityId === stop.cityId);
            const cityGuides = tourGuidesData.filter(g => g.cityId === stop.cityId);

            return (
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="liquid-glass"
                style={{
                  borderRadius: 'var(--r-xl)',
                  overflow: 'hidden',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                {/* ── Stop Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--gradient-brand)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.05rem', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
                      {index + 1}
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stop.cityName}, {stop.country}</h3>
                        <span className="badge-tag primary">{stop.stayDays} Nights</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        📅 {stop.arrivalDate} → {stop.departureDate}
                      </div>
                    </div>
                  </div>

                  {/* Reorder and Delete controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right', marginRight: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stop Subtotal</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {formatCurrency(stopTotal)}
                      </div>
                    </div>

                    <button
                      onClick={() => reorderStops(activeTrip.id, index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="btn btn-sm btn-secondary"
                      style={{ padding: '6px 10px', opacity: index === 0 ? 0.3 : 1 }}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => reorderStops(activeTrip.id, index, Math.min((activeTrip.stops?.length || 1) - 1, index + 1))}
                      disabled={index === (activeTrip.stops?.length || 1) - 1}
                      className="btn btn-sm btn-secondary"
                      style={{ padding: '6px 10px', opacity: index === (activeTrip.stops?.length || 1) - 1 ? 0.3 : 1 }}
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => removeStopFromTrip(activeTrip.id, stop.id)}
                      className="btn btn-sm btn-danger"
                      style={{ padding: '6px 10px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* ── Lodging & Transit Mini Badges ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: 'var(--r-md)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Hotel size={16} color="var(--brand-indigo)" />
                    <div style={{ flex: 1 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Stay:</span> <strong>{stop.lodgingName}</strong>
                    </div>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(stop.lodgingCost)}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Train size={16} color="var(--brand-sky)" />
                    <div style={{ flex: 1 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Transit:</span> <strong>{stop.transitMode}</strong>
                    </div>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(stop.transitCost)}</span>
                  </div>
                </div>

                {/* ── Stop Segment Tabs: Activities | Vehicle Rental | Tour Guide ── */}
                <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <button
                    onClick={() => setStopTab(stop.id, 'activities')}
                    className={`btn btn-sm ${currentTab === 'activities' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.84rem', padding: '6px 16px' }}
                  >
                    <Sparkles size={14} />
                    <span>Activities ({stopActivities.length})</span>
                  </button>

                  <button
                    onClick={() => setStopTab(stop.id, 'vehicles')}
                    className={`btn btn-sm ${currentTab === 'vehicles' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.84rem', padding: '6px 16px' }}
                  >
                    <Car size={14} />
                    <span>Vehicle Rental ({stopVehicles.length})</span>
                  </button>

                  <button
                    onClick={() => setStopTab(stop.id, 'guides')}
                    className={`btn btn-sm ${currentTab === 'guides' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.84rem', padding: '6px 16px' }}
                  >
                    <Compass size={14} />
                    <span>Tour Guide ({stopGuides.length})</span>
                  </button>
                </div>

                {/* ── TAB 1: ACTIVITIES ── */}
                {currentTab === 'activities' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {stopActivities.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--r-md)', border: '1px dashed var(--border-subtle)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No custom activities planned for {stop.cityName} yet.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                        {stopActivities.map(act => (
                          <div
                            key={act.id}
                            style={{
                              padding: '14px',
                              borderRadius: 'var(--r-md)',
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid var(--border-subtle)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <span className="badge-tag" style={{ fontSize: '0.7rem' }}>{act.category}</span>
                                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginTop: '4px' }}>{act.title}</h4>
                              </div>
                              <button
                                onClick={() => removeActivityFromStop(activeTrip.id, stop.id, act.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                              <span>⏱ Day {act.day || 1} • {act.time} ({act.durationHours}h)</span>
                              <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(act.cost)}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Presets & Add Activity Action */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Add:</span>
                        {cityPresetActivities.slice(0, 3).map(preset => (
                          <button
                            key={preset.id}
                            onClick={() => handleAddPresetActivity(stop.id, preset)}
                            className="badge-tag"
                            style={{ cursor: 'pointer', background: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.25)', color: '#c4b5fd' }}
                          >
                            + {preset.title.split(' ')[0]} {preset.title.split(' ')[1]} ({formatCurrency(preset.cost)})
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handleOpenAddActivity(stop.id)}
                        className="btn btn-sm btn-primary"
                        style={{ background: 'var(--brand-gradient-ocean)' }}
                      >
                        <Plus size={14} />
                        <span>Add Custom Activity</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: VEHICLE RENTAL ── */}
                {currentTab === 'vehicles' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {stopVehicles.length === 0 ? (
                      <div
                        style={{
                          padding: '28px',
                          textAlign: 'center',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: 'var(--r-md)',
                          border: '1px dashed var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <Car size={36} color="var(--brand-sky)" />
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>No rental vehicle reserved for {stop.cityName}</h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                            Explore {stop.cityName} and surrounding scenic routes with a convertible, SUV, or luxury sedan.
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenVehiclePicker(stop)}
                          className="btn btn-sm btn-primary"
                          style={{ background: 'var(--gradient-ocean)', marginTop: '4px' }}
                        >
                          <Car size={15} />
                          <span>Browse &amp; Rent Vehicle for {stop.cityName}</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stopVehicles.map(veh => (
                          <div
                            key={veh.id}
                            style={{
                              padding: '16px 20px',
                              borderRadius: 'var(--r-md)',
                              background: 'rgba(99,102,241,0.08)',
                              border: '1px solid rgba(99,102,241,0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '16px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <img
                                src={veh.image}
                                alt={veh.name}
                                style={{ width: '84px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{veh.name}</h4>
                                  <span className="badge-tag primary" style={{ fontSize: '0.7rem' }}>{veh.type}</span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                  👥 {veh.seats} Seats • ⚙️ {veh.transmission} • ⛽ {veh.fuelType} • 🏢 {veh.provider}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--brand-sky)', marginTop: '2px' }}>
                                  📅 {veh.startDate} → {veh.endDate} ({veh.rentalDays} days)
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a5b4fc' }}>
                                  {formatCurrency(veh.totalCost)}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {formatCurrency(veh.dailyRate)}/day
                                </div>
                              </div>

                              <button
                                onClick={() => removeVehicleRentalFromStop(activeTrip.id, stop.id, veh.id)}
                                className="btn btn-sm btn-danger"
                                style={{ padding: '8px 12px' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => handleOpenVehiclePicker(stop)}
                          className="btn btn-sm btn-secondary"
                          style={{ alignSelf: 'flex-start' }}
                        >
                          <Plus size={14} />
                          <span>Add Another Vehicle</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TAB 3: TOUR GUIDE ── */}
                {currentTab === 'guides' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {stopGuides.length === 0 ? (
                      <div
                        style={{
                          padding: '28px',
                          textAlign: 'center',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: 'var(--r-md)',
                          border: '1px dashed var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <Compass size={36} color="var(--brand-emerald)" />
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>No tour guide hired for {stop.cityName}</h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                            Gain VIP skip-the-line museum access, secret foodie alleys, and cultural storytelling.
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenGuidePicker(stop)}
                          className="btn btn-sm btn-primary"
                          style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)', marginTop: '4px' }}
                        >
                          <Compass size={15} />
                          <span>Hire a Certified Guide for {stop.cityName}</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stopGuides.map(guide => (
                          <div
                            key={guide.id}
                            style={{
                              padding: '16px 20px',
                              borderRadius: 'var(--r-md)',
                              background: 'rgba(16,185,129,0.08)',
                              border: '1px solid rgba(16,185,129,0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '16px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <img
                                src={guide.avatar}
                                alt={guide.name}
                                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-emerald)' }}
                              />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{guide.name}</h4>
                                  <span className="badge-tag success" style={{ fontSize: '0.7rem' }}>⭐ {guide.rating}</span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                  🧭 {guide.specialization} • 🗣️ {guide.languages?.join(', ')}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '2px' }}>
                                  📅 {guide.date} ({guide.duration}) — "{guide.notes}"
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6ee7b7' }}>
                                  {formatCurrency(guide.totalCost)}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Guide Fee
                                </div>
                              </div>

                              <button
                                onClick={() => removeGuideBookingFromStop(activeTrip.id, stop.id, guide.id)}
                                className="btn btn-sm btn-danger"
                                style={{ padding: '8px 12px' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => handleOpenGuidePicker(stop)}
                          className="btn btn-sm btn-secondary"
                          style={{ alignSelf: 'flex-start' }}
                        >
                          <Plus size={14} />
                          <span>Add Another Tour Guide</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── MODAL: Add City Stop ── */}
      <Modal
        isOpen={isAddStopOpen}
        onClose={() => setIsAddStopOpen(false)}
        title="Add City Stop to Itinerary"
        subtitle="Choose from our curated global destinations"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
          {destinations.map(dest => (
            <motion.div
              key={dest.id}
              whileHover={{ y: -3 }}
              onClick={() => {
                addStopToTrip(activeTrip.id, dest);
                setIsAddStopOpen(false);
              }}
              style={{
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              <img src={dest.image} alt={dest.city} style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
              <div style={{ padding: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{dest.city}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dest.country}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Modal>

      {/* ── MODAL: Add Custom Activity ── */}
      <Modal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        title="Add Custom Activity"
        subtitle="Schedule a new experience for your itinerary stop"
      >
        <form onSubmit={handleCreateActivity} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Activity Title:</label>
            <input
              type="text"
              value={actTitle}
              onChange={(e) => setActTitle(e.target.value)}
              placeholder="e.g. Sunset Sailing or Secret Speakeasy Tour"
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Category:</label>
              <select value={actCategory} onChange={(e) => setActCategory(e.target.value)} className="input-field">
                <option value="Sightseeing">Sightseeing</option>
                <option value="Culture & Art">Culture &amp; Art</option>
                <option value="Food & Dining">Food &amp; Dining</option>
                <option value="Adventure & Nature">Adventure &amp; Nature</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Estimated Cost ($):</label>
              <input
                type="number"
                value={actCost}
                onChange={(e) => setActCost(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Day Number:</label>
              <input
                type="number"
                min="1"
                value={actDay}
                onChange={(e) => setActDay(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Start Time:</label>
              <input
                type="time"
                value={actTime}
                onChange={(e) => setActTime(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Notes &amp; Booking Confirmation:</label>
            <textarea
              value={actNotes}
              onChange={(e) => setActNotes(e.target.value)}
              placeholder="e.g. Bring camera, confirmation code #98234"
              className="input-field"
              rows={2}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={() => setIsAddActivityOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Activity</button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: Quick Vehicle Rental Picker ── */}
      <Modal
        isOpen={isVehiclePickerOpen}
        onClose={() => setIsVehiclePickerOpen(false)}
        title="Select &amp; Rent Vehicle"
        subtitle="Choose a rental vehicle for this stop"
      >
        <form onSubmit={handleConfirmVehicleRental} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Select Available Vehicle:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
              {vehiclesData.map(veh => {
                const isSelected = selectedVehicle?.id === veh.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => setSelectedVehicle(veh)}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--r-sm)',
                      background: isSelected ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${isSelected ? 'var(--brand-indigo)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <img src={veh.image} alt={veh.name} style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{veh.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{veh.type} • {formatCurrency(veh.pricePerDay)}/d</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Pickup Date:</label>
              <input
                type="date"
                value={vehStartDate}
                onChange={(e) => setVehStartDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Drop-off Date:</label>
              <input
                type="date"
                value={vehEndDate}
                onChange={(e) => setVehEndDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {selectedVehicle && (
            <div style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.12)', borderRadius: 'var(--r-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedVehicle.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selectedVehicle.provider} • {selectedVehicle.seats} Seats</div>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a5b4fc' }}>
                {formatCurrency(selectedVehicle.pricePerDay)}/day
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setIsVehiclePickerOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!selectedVehicle}>Confirm &amp; Add Vehicle</button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: Quick Tour Guide Picker ── */}
      <Modal
        isOpen={isGuidePickerOpen}
        onClose={() => setIsGuidePickerOpen(false)}
        title="Hire Certified Tour Guide"
        subtitle="Select a verified local expert for your stop"
      >
        <form onSubmit={handleConfirmGuideBooking} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Select Local Guide:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
              {tourGuidesData.map(guide => {
                const isSelected = selectedGuide?.id === guide.id;
                return (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--r-sm)',
                      background: isSelected ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${isSelected ? 'var(--brand-emerald)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <img src={guide.avatar} alt={guide.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{guide.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {guide.cityName} • {formatCurrency(guide.pricePerDay)}/d</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Tour Date:</label>
              <input
                type="date"
                value={guideDate}
                onChange={(e) => setGuideDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Duration:</label>
              <select
                value={guideDuration}
                onChange={(e) => setGuideDuration(e.target.value)}
                className="input-field"
              >
                <option value="Half Day (4h)">Half Day (4h)</option>
                <option value="Full Day (8h)">Full Day (8h)</option>
                <option value="Sunset Special (3h)">Sunset Special (3h)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Tour Focus / Notes:</label>
            <input
              type="text"
              value={guideNotes}
              onChange={(e) => setGuideNotes(e.target.value)}
              placeholder="e.g. VIP museum tour, historic walking route..."
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setIsGuidePickerOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!selectedGuide}>Confirm &amp; Hire Guide</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
