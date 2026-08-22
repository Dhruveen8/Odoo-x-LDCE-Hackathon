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
  Coffee 
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

  // Days simulation
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
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-tag primary">
              <CalendarIcon size={14} /> Trip Calendar & Daily Schedule
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeTrip.title}</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>
            Interactive Day Planner
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Select a day from the itinerary strip to inspect or customize the hourly agenda.
          </p>
        </div>

        <button onClick={() => setCurrentView('itinerary-builder')} className="btn btn-sm btn-secondary">
          Edit Stops & Dates
        </button>
      </div>

      {/* Horizontal Day Selector Carousel */}
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
                minWidth: '130px',
                padding: '16px 14px',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? 'var(--brand-gradient)' : 'var(--bg-card)',
                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                border: `1.5px solid ${isSelected ? 'transparent' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                boxShadow: isSelected ? '0 8px 20px rgba(99, 102, 241, 0.35)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: isSelected ? 0.9 : 0.6 }}>
                DAY {d.dayNumber}
              </span>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {d.cityName}
              </div>
              <span style={{ fontSize: '0.75rem', opacity: isSelected ? 0.9 : 0.6 }}>
                {d.activities.length} Events
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Day Hourly Schedule */}
      {activeDaySchedule && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-handdrawn">Day {activeDaySchedule.dayNumber}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {activeDaySchedule.cityName}, {activeDaySchedule.country}
                </h3>
              </div>
              {activeDaySchedule.lodging && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  🏨 Lodging: {activeDaySchedule.lodging}
                </div>
              )}
            </div>

            <button onClick={() => setCurrentView('itinerary-builder')} className="btn btn-sm btn-primary">
              <Plus size={14} /> Add Activity to Day {activeDaySchedule.dayNumber}
            </button>
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
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={18} color="var(--brand-primary)" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{slot.label}</span>
                    <span className="badge-tag" style={{ fontSize: '0.72rem' }}>
                      {slotActivities.length} Scheduled
                    </span>
                  </div>

                  {slotActivities.length === 0 ? (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '28px' }}>
                      No events booked for this slot. Open time for cafe hopping or walking around.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '28px' }}>
                      {slotActivities.map(act => (
                        <div
                          key={act.id}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: 'var(--bg-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--brand-primary)' }}>
                                {act.time}
                              </span>
                              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{act.title}</span>
                              <span className="badge-tag primary" style={{ fontSize: '0.7rem' }}>{act.category}</span>
                            </div>
                            {act.notes && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {act.notes}
                              </div>
                            )}
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{formatCurrency(act.cost)}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>⏱️ {act.durationHours}h</span>
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
