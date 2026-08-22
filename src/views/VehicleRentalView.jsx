import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  Search, 
  SlidersHorizontal, 
  Users, 
  Fuel, 
  Settings2, 
  Star, 
  Plus, 
  Check, 
  X, 
  MapPin,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VehicleRentalView() {
  const { 
    vehiclesData, 
    vehicleTypes, 
    transmissionTypes, 
    fuelTypes, 
    seatOptions, 
    activeTrip, 
    addVehicleRentalToStop, 
    formatCurrency, 
    addToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedTransmission, setSelectedTransmission] = useState('ALL');
  const [selectedFuel, setSelectedFuel] = useState('ALL');
  const [selectedSeats, setSelectedSeats] = useState('ALL');
  const [selectedCityFilter, setSelectedCityFilter] = useState('ALL');
  const [bookingVehicle, setBookingVehicle] = useState(null);

  // Booking Modal State
  const [selectedStopId, setSelectedStopId] = useState(activeTrip?.stops?.[0]?.id || '');
  const [rentalDays, setRentalDays] = useState(3);

  // Available stops in active trip
  const stops = activeTrip?.stops || [];

  // Filter vehicles
  const filteredVehicles = (vehiclesData || []).filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'ALL' || v.type === selectedType;
    const matchesTrans = selectedTransmission === 'ALL' || v.transmission === selectedTransmission;
    const matchesFuel = selectedFuel === 'ALL' || v.fuelType === selectedFuel;
    const matchesSeats = selectedSeats === 'ALL' || String(v.seats) === String(selectedSeats);
    const matchesCity = selectedCityFilter === 'ALL' || v.city.toLowerCase() === selectedCityFilter.toLowerCase();

    return matchesSearch && matchesType && matchesTrans && matchesFuel && matchesSeats && matchesCity;
  });

  const handleConfirmRental = () => {
    if (!activeTrip) {
      addToast("No Active Trip", "Please create a trip first.", "warning");
      return;
    }
    if (!selectedStopId) {
      addToast("Select a Destination Stop", "Please choose which stop to assign the rental to.", "warning");
      return;
    }

    addVehicleRentalToStop(activeTrip.id, selectedStopId, {
      ...bookingVehicle,
      rentalDays: Number(rentalDays),
      totalCost: Number(bookingVehicle.pricePerDay) * Number(rentalDays),
      dailyRate: Number(bookingVehicle.pricePerDay)
    });

    setBookingVehicle(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 0' }}>
      
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
          <span className="gt-label">LUXURY FLEET &amp; TRANSIT</span>
          <h1 className="gt-h1" style={{ marginTop: '4px' }}>VEHICLE RENTALS</h1>
        </div>

        {activeTrip && (
          <div className="gt-badge gold" style={{ padding: '8px 16px', fontSize: '12px' }}>
            TRIP: {activeTrip.title} ({stops.length} STOPS)
          </div>
        )}
      </div>

      {/* ── Search & Filter Controls ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '36px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} color="var(--tertiary)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by vehicle model, city, or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '52px',
              height: '50px',
              borderRadius: 'var(--r-full)'
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {['ALL', 'SUV', 'Sedan', 'Convertible', 'Luxury', 'Electric', 'Van'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--r-full)',
                border: '1px solid var(--border)',
                background: selectedType === type ? 'var(--primary)' : 'var(--surface)',
                color: selectedType === type ? 'var(--bg)' : 'var(--secondary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ── Vehicles Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
        {filteredVehicles.map(vehicle => (
          <motion.div
            key={vehicle.id}
            whileHover={{ y: -6 }}
            className="gt-card"
            style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--r-2xl)' }}
          >
            {/* Vehicle Image */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <img
                src={vehicle.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'}
                alt={vehicle.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                right: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span className="gt-badge" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                  {vehicle.city}
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#fff',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '4px 10px',
                  borderRadius: 'var(--r-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" /> {vehicle.rating}
                </span>
              </div>
            </div>

            {/* Vehicle Information */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
                      {vehicle.name}
                    </h3>
                    <span style={{ fontSize: '13px', color: 'var(--secondary)' }}>
                      {vehicle.model} • {vehicle.provider}
                    </span>
                  </div>
                </div>

                {/* Specs Strip */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '16px',
                  padding: '12px 0',
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '12px',
                  color: 'var(--secondary)'
                }}>
                  <span>{vehicle.seats} Seats</span>
                  <span>•</span>
                  <span>{vehicle.transmission}</span>
                  <span>•</span>
                  <span>{vehicle.fuelType}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--tertiary)', fontWeight: 600, display: 'block' }}>DAILY RATE</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                    {formatCurrency(vehicle.pricePerDay)}
                  </span>
                </div>

                <button
                  onClick={() => setBookingVehicle(vehicle)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>RESERVE</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Reservation Modal ── */}
      <AnimatePresence>
        {bookingVehicle && (
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
                  <span className="gt-label">RESERVE VEHICLE</span>
                  <h3 className="gt-h3" style={{ marginTop: '2px' }}>{bookingVehicle.name}</h3>
                </div>
                <button onClick={() => setBookingVehicle(null)} className="icon-btn">
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Select Stop */}
                <div>
                  <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>
                    SELECT ITINERARY STOP
                  </label>
                  {stops.length === 0 ? (
                    <div style={{ padding: '12px', background: 'var(--hover)', borderRadius: 'var(--r-md)', fontSize: '13px', color: 'var(--secondary)' }}>
                      No stops in active trip. Please add a destination stop first.
                    </div>
                  ) : (
                    <select
                      value={selectedStopId}
                      onChange={(e) => setSelectedStopId(e.target.value)}
                      className="input-field"
                    >
                      {stops.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.cityName} ({s.country})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Rental Duration */}
                <div>
                  <label className="gt-label" style={{ marginBottom: '8px', display: 'block' }}>
                    RENTAL DURATION (DAYS)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Math.max(1, Number(e.target.value)))}
                    className="input-field"
                  />
                </div>

                {/* Summary */}
                <div style={{
                  padding: '16px',
                  background: 'var(--hover)',
                  borderRadius: 'var(--r-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>EST. TOTAL COST</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-blue)' }}>
                    {formatCurrency(Number(bookingVehicle.pricePerDay) * Number(rentalDays))}
                  </span>
                </div>

                {/* Submit */}
                <button
                  onClick={handleConfirmRental}
                  disabled={stops.length === 0}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Check size={16} />
                  <span>ADD TO ITINERARY</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
