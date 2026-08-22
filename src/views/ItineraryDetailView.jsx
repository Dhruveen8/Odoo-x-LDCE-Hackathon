import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Hotel, 
  Train, 
  Share2, 
  Edit3, 
  PieChart, 
  Sparkles,
  Layers,
  Map,
  CheckCircle2,
  Car,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import RouteMapCanvas from '../components/itinerary/RouteMapCanvas';

export default function ItineraryDetailView() {
  const { activeTrip, setCurrentView, formatCurrency, computeTripFinances } = useApp();
  const [viewFormat, setViewFormat] = useState('timeline'); // 'timeline' | 'by-city' | 'map'

  if (!activeTrip) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>No itinerary selected</h3>
        <button onClick={() => setCurrentView('my-trips')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Choose a Trip
        </button>
      </div>
    );
  }

  const finances = computeTripFinances(activeTrip);

  // Group all activities, vehicles, and guides by Day across the trip
  const allDaysMap = {};
  let currentDayCounter = 1;

  activeTrip.stops?.forEach(stop => {
    const startDay = currentDayCounter;
    for (let d = 1; d <= (stop.stayDays || 1); d++) {
      const dayKey = currentDayCounter;
      if (!allDaysMap[dayKey]) {
        allDaysMap[dayKey] = {
          dayNumber: dayKey,
          cityName: stop.cityName,
          country: stop.country,
          lodging: stop.lodgingName,
          vehicles: stop.vehicleRentals || [],
          guides: stop.guideBookings || [],
          activities: []
        };
      }
      currentDayCounter++;
    }

    stop.activities?.forEach(act => {
      const targetDay = (startDay - 1) + (Number(act.day) || 1);
      if (allDaysMap[targetDay]) {
        allDaysMap[targetDay].activities.push(act);
      } else {
        allDaysMap[startDay]?.activities.push(act);
      }
    });
  });

  const dayList = Object.values(allDaysMap);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* ── Header Profile with Cover Image ── */}
      <div className="liquid-glass" style={{ padding: 0, overflow: 'hidden', position: 'relative', borderRadius: 'var(--r-xl)' }}>
        <div style={{ height: '240px', position: 'relative' }}>
          <img src={activeTrip.coverImage} alt={activeTrip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,13,26,0.95) 0%, rgba(14,13,26,0.4) 50%, transparent 100%)' }} />

          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCurrentView('public-trip')}
              className="btn btn-sm btn-secondary"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Share2 size={14} />
              <span>Share Itinerary</span>
            </button>
            <button
              onClick={() => setCurrentView('itinerary-builder')}
              className="btn btn-sm btn-primary"
            >
              <Edit3 size={14} />
              <span>Edit Stops &amp; Bookings</span>
            </button>
          </div>

          <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-tag primary" style={{ background: 'rgba(99,102,241,0.8)', color: '#ffffff' }}>
                {activeTrip.status}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                {activeTrip.stops?.length || 0} Cities • {activeTrip.startDate} to {activeTrip.endDate}
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800 }}>{activeTrip.title}</h2>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div style={{ padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Spend</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrency(finances.totalEstimated)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Budget</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrency(finances.target)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vehicle Rentals</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-violet)' }}>
              {activeTrip.stops?.reduce((acc, s) => acc + (s.vehicleRentals?.length || 0), 0) || 0} Rented
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tour Guides</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>
              {activeTrip.stops?.reduce((acc, s) => acc + (s.guideBookings?.length || 0), 0) || 0} Hired
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Health</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: finances.isOverBudget ? "var(--brand-rose)" : "var(--brand-emerald)" }}>
              {finances.isOverBudget ? 'Over Budget' : 'On Track'}
            </div>
          </div>
        </div>
      </div>

      {/* ── View Switcher Buttons ── */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setViewFormat('timeline')}
          className={`btn btn-sm ${viewFormat === 'timeline' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Calendar size={15} />
          <span>Timeline View</span>
        </button>
        <button
          onClick={() => setViewFormat('by-city')}
          className={`btn btn-sm ${viewFormat === 'by-city' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Layers size={15} />
          <span>By-City Cards</span>
        </button>
        <button
          onClick={() => setViewFormat('map')}
          className={`btn btn-sm ${viewFormat === 'map' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Map size={15} />
          <span>Interactive Map</span>
        </button>
      </div>

      {/* ── FORMAT 1: TIMELINE VIEW ── */}
      {viewFormat === 'timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {dayList.map((day) => (
            <motion.div
              key={day.dayNumber}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="liquid-glass"
              style={{
                borderRadius: 'var(--r-lg)',
                padding: '24px',
                display: 'flex',
                gap: '20px'
              }}
            >
              {/* Day Marker */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>DAY</span>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-indigo)', lineHeight: 1 }}>{day.dayNumber}</span>
                <div style={{ width: '2px', flex: 1, background: 'var(--border-subtle)', margin: '10px 0' }} />
              </div>

              {/* Day Content */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>📍 {day.cityName}, {day.country}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stay: {day.lodging}</span>
                  </div>
                </div>

                {/* Day Vehicles and Guides Badges */}
                {(day.vehicles.length > 0 || day.guides.length > 0) && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {day.vehicles.map(v => (
                      <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#c4b5fd' }}>
                        <Car size={13} />
                        <span><strong>Rental:</strong> {v.name} ({formatCurrency(v.dailyRate)}/day)</span>
                      </div>
                    ))}
                    {day.guides.map(g => (
                      <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#6ee7b7' }}>
                        <Compass size={13} />
                        <span><strong>Tour Guide:</strong> {g.name} ({g.specialization})</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Activities list */}
                {day.activities.length === 0 ? (
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--r-sm)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    No scheduled activities for this day yet. Free time for exploration!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {day.activities.map(act => (
                      <div
                        key={act.id}
                        style={{
                          padding: '12px 16px',
                          background: 'rgba(255,255,255,0.04)',
                          borderRadius: 'var(--r-md)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{act.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            ⏱ {act.time} ({act.durationHours}h) • {act.category} {act.notes && `• "${act.notes}"`}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {formatCurrency(act.cost)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── FORMAT 2: BY-CITY VIEW ── */}
      {viewFormat === 'by-city' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeTrip.stops?.map((stop, sIdx) => (
            <div key={stop.id} className="liquid-glass" style={{ padding: '24px', borderRadius: 'var(--r-xl)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--gradient-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {sIdx + 1}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{stop.cityName}, {stop.country}</h3>
                </div>
                <span className="badge-tag primary">{stop.stayDays} Nights ({stop.arrivalDate} → {stop.departureDate})</span>
              </div>

              {/* Stop Services Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {/* Stay */}
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>🏨 ACCOMMODATION</div>
                  <div style={{ fontWeight: 700 }}>{stop.lodgingName}</div>
                  <div style={{ fontSize: '0.85rem', color: '#a5b4fc', marginTop: '2px' }}>{formatCurrency(stop.lodgingCost)}</div>
                </div>

                {/* Transit */}
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>🚆 TRANSIT</div>
                  <div style={{ fontWeight: 700 }}>{stop.transitMode}</div>
                  <div style={{ fontSize: '0.85rem', color: '#a5b4fc', marginTop: '2px' }}>{formatCurrency(stop.transitCost)}</div>
                </div>

                {/* Vehicle */}
                <div style={{ padding: '14px', background: 'rgba(139,92,246,0.08)', borderRadius: 'var(--r-md)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>🚗 VEHICLE RENTAL</div>
                  {stop.vehicleRentals?.length > 0 ? (
                    <>
                      <div style={{ fontWeight: 700 }}>{stop.vehicleRentals[0].name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#c4b5fd', marginTop: '2px' }}>
                        {formatCurrency(stop.vehicleRentals[0].totalCost)} ({stop.vehicleRentals[0].rentalDays} days)
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None rented</div>
                  )}
                </div>

                {/* Tour Guide */}
                <div style={{ padding: '14px', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--r-md)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>🧭 TOUR GUIDE</div>
                  {stop.guideBookings?.length > 0 ? (
                    <>
                      <div style={{ fontWeight: 700 }}>{stop.guideBookings[0].name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6ee7b7', marginTop: '2px' }}>
                        {formatCurrency(stop.guideBookings[0].totalCost)} ({stop.guideBookings[0].duration})
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None booked</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── FORMAT 3: MAP VIEW ── */}
      {viewFormat === 'map' && (
        <RouteMapCanvas stops={activeTrip.stops || []} tripTitle={activeTrip.title} />
      )}

    </div>
  );
}
