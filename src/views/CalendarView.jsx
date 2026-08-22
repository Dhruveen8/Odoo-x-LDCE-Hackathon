import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Sparkles, 
  Plus, 
  Sun, 
  Moon, 
  Coffee,
  Car,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CalendarView() {
  const { activeTrip, setCurrentView, formatCurrency } = useApp();
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);

  if (!activeTrip) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>No itinerary selected for calendar view</h3>
        <button onClick={() => setCurrentView('my-trips')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Select a Trip
        </button>
      </div>
    );
  }

  // Days simulation including vehicle rentals and tour guides
  const days = [];
  let dayCounter = 1;
  activeTrip.stops?.forEach(stop => {
    for (let i = 1; i <= (stop.stayDays || 1); i++) {
      const currentDay = dayCounter;
      const dayActivities = stop.activities?.filter(a => (a.day || 1) === currentDay) || [];
      days.push({
        dayNumber: currentDay,
        cityName: stop.cityName,
        country: stop.country,
        lodging: stop.lodgingName,
        vehicles: stop.vehicleRentals || [],
        guides: stop.guideBookings || [],
        activities: dayActivities
      });
      dayCounter++;
    }
  });

  const activeDaySchedule = days.find(d => d.dayNumber === selectedDayNumber) || days[0];

  const timeSlots = [
    { label: 'Morning (08:00 - 12:00)', icon: Coffee, period: 'Morning' },
    { label: 'Afternoon (12:00 - 17:00)', icon: Sun, period: 'Afternoon' },
    { label: 'Evening & Sunset (17:00 - 21:00)', icon: Sparkles, period: 'Evening' },
    { label: 'Night (21:00+)', icon: Moon, period: 'Night' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* ── Header ── */}
      <div className="liquid-glass" style={{ padding: '24px 28px', borderRadius: 'var(--r-xl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-tag primary">
              <CalendarIcon size={14} /> Trip Calendar &amp; Daily Schedule
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeTrip.title}</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>
            Interactive Day Planner
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Select a day from the itinerary strip to inspect or customize activities, vehicle coverage, and guide sessions.
          </p>
        </div>

        <button onClick={() => setCurrentView('itinerary-builder')} className="btn btn-sm btn-secondary">
          Edit Stops &amp; Dates
        </button>
      </div>

      {/* ── Horizontal Day Selector Carousel ── */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
        {days.map(d => {
          const isSelected = d.dayNumber === selectedDayNumber;
          return (
            <motion.div
              key={d.dayNumber}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDayNumber(d.dayNumber)}
              style={{
                minWidth: '140px',
                padding: '16px 14px',
                borderRadius: 'var(--r-md)',
                background: isSelected ? 'var(--gradient-brand)' : 'rgba(255,255,255,0.04)',
                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                border: `1.5px solid ${isSelected ? 'transparent' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                boxShadow: isSelected ? '0 8px 24px rgba(99, 102, 241, 0.4)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', opacity: isSelected ? 0.9 : 0.6 }}>
                DAY {d.dayNumber}
              </span>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {d.cityName}
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.72rem', opacity: isSelected ? 0.9 : 0.6 }}>
                  {d.activities.length} Acts
                </span>
                {d.vehicles.length > 0 && <span style={{ fontSize: '0.72rem' }}>🚗</span>}
                {d.guides.length > 0 && <span style={{ fontSize: '0.72rem' }}>🧭</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Selected Day Hourly Schedule ── */}
      {activeDaySchedule && (
        <div className="liquid-glass" style={{ padding: '28px', borderRadius: 'var(--r-xl)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge-tag primary" style={{ fontSize: '0.9rem', fontWeight: 800 }}>Day {activeDaySchedule.dayNumber}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {activeDaySchedule.cityName}, {activeDaySchedule.country}
                </h3>
              </div>
              {activeDaySchedule.lodging && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  🏨 Stay: {activeDaySchedule.lodging}
                </div>
              )}
            </div>

            {/* Day Services Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {activeDaySchedule.vehicles.map(v => (
                <span key={v.id} className="badge-tag primary" style={{ background: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.3)', color: '#c4b5fd' }}>
                  🚗 Active Rental: {v.name}
                </span>
              ))}
              {activeDaySchedule.guides.map(g => (
                <span key={g.id} className="badge-tag success" style={{ background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)', color: '#6ee7b7' }}>
                  🧭 Guide Booked: {g.name} ({g.duration})
                </span>
              ))}
            </div>
          </div>

          {/* Time Slot Segments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {timeSlots.map((slot, sIdx) => {
              const Icon = slot.icon;
              const slotActivities = activeDaySchedule.activities.filter(a => {
                const hour = parseInt(a.time?.split(':')[0] || '12', 10);
                if (slot.period === 'Morning') return hour < 12;
                if (slot.period === 'Afternoon') return hour >= 12 && hour < 17;
                if (slot.period === 'Evening') return hour >= 17 && hour < 21;
                return hour >= 21;
              });

              return (
                <div
                  key={sIdx}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--r-md)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={18} color="var(--brand-indigo)" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{slot.label}</span>
                    <span className="badge-tag" style={{ fontSize: '0.72rem' }}>
                      {slotActivities.length} Scheduled
                    </span>
                  </div>

                  {slotActivities.length === 0 ? (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '28px' }}>
                      No activity scheduled for this window. Open time for city exploration or leisurely dining.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '28px' }}>
                      {slotActivities.map(act => (
                        <div
                          key={act.id}
                          style={{
                            padding: '12px 16px',
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: 'var(--r-sm)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{act.title}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              ⏰ {act.time} ({act.durationHours}h) • {act.category} {act.notes && `• "${act.notes}"`}
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
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
