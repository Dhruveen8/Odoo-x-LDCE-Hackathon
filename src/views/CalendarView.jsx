import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Sparkles, 
  Car, 
  UserCheck, 
  ChevronRight, 
  Clock,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CalendarView() {
  const { trips, activeTrip, setActiveTripId, formatCurrency } = useApp();
  const currentTrip = activeTrip || trips[0];

  const [expandedDay, setExpandedDay] = useState(1);

  // Generate day-by-day timeline from stops
  const daysList = [];
  let dayCounter = 1;

  (currentTrip?.stops || []).forEach((stop) => {
    const stayDays = Number(stop.stayDays) || 3;
    for (let d = 1; d <= stayDays; d++) {
      daysList.push({
        dayNumber: dayCounter,
        dayOfStop: d,
        stopId: stop.id,
        cityName: stop.cityName,
        country: stop.country,
        lodging: stop.lodgingName,
        activities: (stop.activities || []).filter(a => Number(a.day) === d || (!a.day && d === 1)),
        vehicles: (stop.vehicleRentals || []),
        guides: (stop.guideBookings || [])
      });
      dayCounter++;
    }
  });

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
          <span className="gt-label">DAY-BY-DAY TIMELINE</span>
          <h1 className="gt-h1" style={{ marginTop: '4px' }}>TRIP CALENDAR</h1>
        </div>

        {/* Trip Selector */}
        <select
          value={currentTrip?.id}
          onChange={(e) => setActiveTripId(e.target.value)}
          className="input-field"
          style={{ width: 'auto', fontWeight: 700, borderRadius: 'var(--r-full)' }}
        >
          {(trips || []).map(t => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* ── Editorial Days Timeline ── */}
      {daysList.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          background: 'var(--surface)',
          borderRadius: 'var(--r-2xl)',
          border: '1px solid var(--border)'
        }}>
          <h3 className="gt-h3">No itinerary days found</h3>
          <p className="gt-body" style={{ marginTop: '8px' }}>
            Add stops to this trip to populate the timeline.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {daysList.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;
            const totalItems = day.activities.length + day.vehicles.length + day.guides.length;

            return (
              <motion.div
                key={day.dayNumber}
                className="gt-card"
                style={{
                  borderRadius: 'var(--r-xl)',
                  overflow: 'hidden',
                  borderColor: isExpanded ? 'var(--primary)' : 'var(--border)'
                }}
              >
                {/* Day Header Row */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '24px',
                    cursor: 'pointer',
                    background: isExpanded ? 'var(--hover)' : 'var(--surface)',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span className="gt-label" style={{ 
                      fontSize: '14px', 
                      fontWeight: 900, 
                      color: isExpanded ? 'var(--primary)' : 'var(--tertiary)',
                      minWidth: '60px'
                    }}>
                      DAY 0{day.dayNumber}
                    </span>

                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                        {day.cityName}
                      </h3>
                      <span style={{ fontSize: '13px', color: 'var(--secondary)' }}>
                        {day.country} • Stop Day {day.dayOfStop}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="gt-badge" style={{ fontSize: '11px' }}>
                      {totalItems} {totalItems === 1 ? 'Event' : 'Events'}
                    </span>
                    <ChevronRight
                      size={18}
                      color="var(--tertiary)"
                      style={{
                        transform: isExpanded ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s'
                      }}
                    />
                  </div>
                </div>

                {/* Day Expanded Events */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                        
                        {/* Lodging Item */}
                        {day.lodging && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '14px 18px',
                            borderRadius: 'var(--r-md)',
                            background: 'var(--hover)',
                            border: '1px solid var(--border)'
                          }}>
                            <Building size={16} color="var(--accent-blue)" />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
                                {day.lodging}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--tertiary)', display: 'block' }}>
                                ACCOMMODATION
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Activities */}
                        {day.activities.map((act, aIdx) => (
                          <div
                            key={act.id || aIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '14px 18px',
                              borderRadius: 'var(--r-md)',
                              background: 'var(--hover)',
                              border: '1px solid var(--border)'
                            }}
                          >
                            <Sparkles size={16} color="#ec4899" />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
                                {act.title}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--tertiary)', display: 'block' }}>
                                {act.category || 'Experience'} • {act.time || '10:00 AM'}
                              </span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                              {formatCurrency(act.cost || 0)}
                            </span>
                          </div>
                        ))}

                        {/* Vehicles */}
                        {day.vehicles.map((v, vIdx) => (
                          <div
                            key={v.id || vIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '14px 18px',
                              borderRadius: 'var(--r-md)',
                              background: 'var(--hover)',
                              border: '1px solid var(--border)'
                            }}
                          >
                            <Car size={16} color="#10b981" />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
                                {v.name} ({v.type})
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--tertiary)', display: 'block' }}>
                                TRANSIT RENTAL • {v.provider}
                              </span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                              {formatCurrency(v.totalCost || v.dailyRate || 0)}
                            </span>
                          </div>
                        ))}

                        {/* Guides */}
                        {day.guides.map((g, gIdx) => (
                          <div
                            key={g.id || gIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '14px 18px',
                              borderRadius: 'var(--r-md)',
                              background: 'var(--hover)',
                              border: '1px solid var(--border)'
                            }}
                          >
                            <UserCheck size={16} color="#c9a96e" />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
                                {g.name}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--tertiary)', display: 'block' }}>
                                PRIVATE LOCAL GUIDE • {g.duration || 'Full Day'}
                              </span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                              {formatCurrency(g.totalCost || g.rate || 0)}
                            </span>
                          </div>
                        ))}

                        {totalItems === 0 && !day.lodging && (
                          <span style={{ fontSize: '13px', color: 'var(--tertiary)', padding: '8px 0' }}>
                            Free day. Add experiences or transit via the Itinerary Builder.
                          </span>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
