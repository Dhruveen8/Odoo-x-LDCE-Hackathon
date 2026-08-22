import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Car,
  Search,
  Filter,
  Star,
  Users,
  Fuel,
  Gauge,
  Calendar,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  Clock,
  X,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

export default function VehicleRentalView() {
  const {
    vehiclesData,
    vehicleTypes,
    transmissionTypes,
    fuelTypes,
    seatOptions,
    destinations,
    activeTrip,
    addVehicleRentalToStop,
    formatCurrency,
    setCurrentView,
    selectedStopContext,
    setSelectedStopContext
  } = useApp();

  // Filters State
  const [selectedCity, setSelectedCity] = useState(selectedStopContext?.cityId || 'all');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedSeats, setSelectedSeats] = useState('All Seats');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);

  // Modal Booking State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [targetStopId, setTargetStopId] = useState(
    selectedStopContext?.stopId || (activeTrip?.stops?.[0]?.id || '')
  );

  // Booking Form dates
  const defaultStart = activeTrip?.startDate || new Date().toISOString().split('T')[0];
  const defaultEnd = activeTrip?.endDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [insuranceTier, setInsuranceTier] = useState('Standard (Included)');
  const [driverOption, setDriverOption] = useState('Self-Drive');

  // Calculate rental days
  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [startDate, endDate]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehiclesData.filter(v => {
      // City filter
      if (selectedCity !== 'all' && v.cityId !== selectedCity) return false;
      // Type filter
      if (selectedType !== 'All Types' && v.type !== selectedType) return false;
      // Transmission
      if (selectedTransmission !== 'All' && v.transmission !== selectedTransmission) return false;
      // Fuel
      if (selectedFuel !== 'All' && v.fuelType !== selectedFuel) return false;
      // Seats
      if (selectedSeats === '2 Seats' && v.seats !== 2) return false;
      if (selectedSeats === '4-5 Seats' && (v.seats < 4 || v.seats > 5)) return false;
      if (selectedSeats === '7+ Seats' && v.seats < 7) return false;
      // Price
      if (v.pricePerDay > maxPrice) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesModel = v.model.toLowerCase().includes(q);
        const matchesCity = v.cityName.toLowerCase().includes(q);
        const matchesProvider = v.provider.toLowerCase().includes(q);
        if (!matchesName && !matchesModel && !matchesCity && !matchesProvider) return false;
      }
      return true;
    });
  }, [vehiclesData, selectedCity, selectedType, selectedTransmission, selectedFuel, selectedSeats, maxPrice, searchQuery]);

  const handleOpenBooking = (vehicle) => {
    setSelectedVehicle(vehicle);
    // Sync default dates with target stop if selected
    if (activeTrip?.stops?.length) {
      const matchStop = activeTrip.stops.find(s => s.cityId === vehicle.cityId) || activeTrip.stops[0];
      setTargetStopId(matchStop.id);
      if (matchStop.arrivalDate && matchStop.departureDate) {
        setStartDate(matchStop.arrivalDate);
        setEndDate(matchStop.departureDate);
      }
    }
    setIsModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!activeTrip || !targetStopId || !selectedVehicle) return;

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
      startDate,
      endDate,
      rentalDays,
      dailyRate: selectedVehicle.pricePerDay,
      totalCost
    });

    setIsModalOpen(false);
    setSelectedStopContext(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* ── Banner Header ── */}
      <div
        className="liquid-glass"
        style={{
          padding: '32px',
          borderRadius: 'var(--r-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge-tag primary">
              <Car size={14} /> Luxury & Premium Fleet
            </span>
            {activeTrip && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Active Trip: <strong>{activeTrip.title}</strong>
              </span>
            )}
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            Vehicle Rental &amp; Road Trips
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.95rem' }}>
            Reserve verified rental vehicles for any stop in your itinerary. Choose from convertibles, 4x4 SUVs, executive sedans, and eco-friendly electrics with automatic budget integration.
          </p>
        </div>

        {activeTrip?.stops?.length > 0 && (
          <button
            onClick={() => setCurrentView('itinerary-builder')}
            className="btn btn-secondary"
            style={{ backdropFilter: 'blur(16px)' }}
          >
            <Layers size={16} />
            <span>Back to Itinerary Builder</span>
          </button>
        )}
      </div>

      {/* ── Filter Bar ── */}
      <div
        className="liquid-glass"
        style={{
          padding: '24px',
          borderRadius: 'var(--r-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        {/* Row 1: Search & City select */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {/* Search box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by model, brand, provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '38px', height: '42px' }}
            />
          </div>

          {/* City filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="input-field"
              style={{ height: '42px' }}
            >
              <option value="all">🌍 All Destinations ({destinations.length})</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>📍 {d.city}, {d.country}</option>
              ))}
            </select>
          </div>

          {/* Vehicle Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
              style={{ height: '42px' }}
            >
              {vehicleTypes.map(t => (
                <option key={t} value={t}>🚗 {t}</option>
              ))}
            </select>
          </div>

          {/* Seats filter */}
          <div>
            <select
              value={selectedSeats}
              onChange={(e) => setSelectedSeats(e.target.value)}
              className="input-field"
              style={{ height: '42px' }}
            >
              {seatOptions.map(s => (
                <option key={s} value={s}>👥 {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          {/* Transmission & Fuel pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Transmission:</span>
            {transmissionTypes.map(tr => (
              <button
                key={tr}
                onClick={() => setSelectedTransmission(tr)}
                className={`badge-tag ${selectedTransmission === tr ? 'primary' : ''}`}
                style={{ cursor: 'pointer', padding: '5px 12px' }}
              >
                {tr}
              </button>
            ))}

            <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 4px' }} />

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fuel:</span>
            {fuelTypes.map(f => (
              <button
                key={f}
                onClick={() => setSelectedFuel(f)}
                className={`badge-tag ${selectedFuel === f ? 'primary' : ''}`}
                style={{ cursor: 'pointer', padding: '5px 12px' }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Max: <strong>{formatCurrency(maxPrice)}/day</strong>
            </span>
            <input
              type="range"
              min="40"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ accentColor: 'var(--brand-indigo)', width: '120px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* ── Vehicle Cards Grid ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Available Vehicles <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>({filteredVehicles.length} found)</span>
          </h3>
          {(selectedCity !== 'all' || selectedType !== 'All Types' || selectedTransmission !== 'All' || selectedFuel !== 'All') && (
            <button
              onClick={() => {
                setSelectedCity('all');
                setSelectedType('All Types');
                setSelectedTransmission('All');
                setSelectedFuel('All');
                setSelectedSeats('All Seats');
                setMaxPrice(500);
                setSearchQuery('');
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="liquid-glass" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
            <Car size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No vehicles match your criteria</h4>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>
              Try broadening your filter preferences or choosing another destination city.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredVehicles.map(veh => (
              <motion.div
                key={veh.id}
                whileHover={{ y: -6 }}
                className="liquid-glass-card"
                style={{
                  borderRadius: 'var(--r-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                {/* Vehicle Image Banner */}
                <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                  <img
                    src={veh.image}
                    alt={veh.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,13,26,0.85) 0%, transparent 60%)' }} />

                  {/* Top badges */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                    <span className="badge-tag primary" style={{ backdropFilter: 'blur(8px)' }}>
                      {veh.type}
                    </span>
                  </div>

                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.8rem', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <span>{veh.rating}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>({veh.reviewsCount})</span>
                  </div>

                  {/* City name in image footer */}
                  <div style={{ position: 'absolute', bottom: '10px', left: '14px', display: 'flex', alignItems: 'center', gap: '5px', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>📍 {veh.cityName}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>• {veh.provider}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{veh.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{veh.model}</div>
                  </div>

                  {/* Specs Strip */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: 'var(--r-sm)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <Users size={14} color="var(--brand-sky)" />
                      <span>{veh.seats} Seats</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <Gauge size={14} color="var(--brand-violet)" />
                      <span>{veh.transmission}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <Fuel size={14} color="var(--brand-emerald)" />
                      <span>{veh.fuelType}</span>
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {veh.features.slice(0, 3).map((f, fi) => (
                      <span key={fi} style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                        ✓ {f}
                      </span>
                    ))}
                  </div>

                  {/* Pricing and Action */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {formatCurrency(veh.pricePerDay)}
                        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}> / day</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--brand-emerald)' }}>✓ {veh.cancellationPolicy.split(' ')[0]} Cancel</div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleOpenBooking(veh)}
                      className="btn btn-sm btn-primary"
                    >
                      <Plus size={14} />
                      <span>Add to Trip</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Booking Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Reserve Rental Vehicle"
        subtitle={selectedVehicle ? `${selectedVehicle.name} • ${selectedVehicle.cityName}` : ''}
      >
        {selectedVehicle && (
          <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Vehicle Summary Card */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                padding: '14px',
                borderRadius: 'var(--r-md)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.name}
                style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{selectedVehicle.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {selectedVehicle.type} • {selectedVehicle.seats} Seats • {selectedVehicle.transmission}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-indigo)', marginTop: '4px' }}>
                  {formatCurrency(selectedVehicle.pricePerDay)} / day
                </div>
              </div>
            </div>

            {/* Target Stop Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Bind to Itinerary Stop:
              </label>
              {activeTrip?.stops?.length > 0 ? (
                <select
                  value={targetStopId}
                  onChange={(e) => {
                    setTargetStopId(e.target.value);
                    const matchStop = activeTrip.stops.find(s => s.id === e.target.value);
                    if (matchStop?.arrivalDate && matchStop?.departureDate) {
                      setStartDate(matchStop.arrivalDate);
                      setEndDate(matchStop.departureDate);
                    }
                  }}
                  className="input-field"
                  required
                >
                  {activeTrip.stops.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      Stop {idx + 1}: {s.cityName}, {s.country} ({s.stayDays} days)
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--brand-amber)' }}>
                  ⚠️ Your active trip has no stops yet. Please add a city stop in the Itinerary Builder first.
                </div>
              )}
            </div>

            {/* Date Range Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Pickup Date:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Drop-off Date:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Driver & Protection Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Driving Option:
                </label>
                <select
                  value={driverOption}
                  onChange={(e) => setDriverOption(e.target.value)}
                  className="input-field"
                >
                  <option value="Self-Drive">Self-Drive</option>
                  <option value="Chauffeur / Private Driver">With Private Chauffeur</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Insurance Tier:
                </label>
                <select
                  value={insuranceTier}
                  onChange={(e) => setInsuranceTier(e.target.value)}
                  className="input-field"
                >
                  <option value="Standard (Included)">Standard CDW (Included)</option>
                  <option value="Full Comprehensive Coverage (Zero Excess)">Zero Excess VIP</option>
                </select>
              </div>
            </div>

            {/* Total Cost Computation Panel */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--r-md)',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%)',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {formatCurrency(selectedVehicle.pricePerDay)} × {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Total Estimated Rental
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#a5b4fc', fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(selectedVehicle.pricePerDay * rentalDays)}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!activeTrip || !targetStopId}
              >
                <CheckCircle2 size={16} />
                <span>Confirm &amp; Add to Trip</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
