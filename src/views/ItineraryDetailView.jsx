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
  CheckCircle2
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

  // Group all activities by Day across the trip
  const allDaysMap = {};
  let currentDayCounter = 1;

  activeTrip.stops?.forEach(stop => {
    for (let d = 1; d <= (stop.stayDays || 1); d++) {
      const dayKey = currentDayCounter;
      if (!allDaysMap[dayKey]) {
        allDaysMap[dayKey] = {
          dayNumber: dayKey,
          cityName: stop.cityName,
          country: stop.country,
          lodging: stop.lodgingName,
          activities: []
        };
      }
      currentDayCounter++;
    }

    stop.activities?.forEach(act => {
      const targetDay = act.day || 1;
      if (allDaysMap[targetDay]) {
        allDaysMap[targetDay].activities.push(act);
      } else {
        // fallback to day 1
        allDaysMap[1]?.activities.push(act);
      }
    });
  });

  const dayList = Object.values(allDaysMap);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Profile with Cover Image */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '240px', position: 'relative' }}>
          <img src={activeTrip.coverImage} alt={activeTrip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 50%, transparent 100%)' }} />

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
              <span>Edit Stops</span>
            </button>
          </div>

          <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-tag primary" style={{ background: 'rgba(99,102,241,0.8)', color: '#ffffff' }}>
                {activeTrip.status}
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                📅 {activeTrip.startDate} - {activeTrip.endDate}
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>{activeTrip.title}</h1>
            <p style={{ fontSize: '0.95rem', opacity: 0.85, maxWidth: '720px', marginTop: '4px' }}>
              {activeTrip.description}
            </p>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>DESTINATIONS</span>
              <div style={{ fontWeight: 700 }}>{activeTrip.stops?.length || 0} Cities</div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TOTAL DURATION</span>
              <div style={{ fontWeight: 700 }}>{dayList.length} Days</div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TOTAL BUDGET</span>
              <div style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>{formatCurrency(finances.totalEstimated)}</div>
            </div>
          </div>

          {/* View Modes */}
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '4px', gap: '4px' }}>
            {[
              { id: 'timeline', label: 'Day Timeline', icon: Calendar },
              { id: 'by-city', label: 'City Groups', icon: Layers },
              { id: 'map', label: 'Route Map', icon: Map }
            ].map(vm => {
              const Icon = vm.icon;
              return (
                <button
                  key={vm.id}
                  onClick={() => setViewFormat(vm.id)}
                  className="btn btn-sm"
                  style={{
                    background: viewFormat === vm.id ? 'var(--brand-primary)' : 'transparent',
                    color: viewFormat === vm.id ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    padding: '6px 12px'
                  }}
                >
                  <Icon size={14} />
                  <span>{vm.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area Based on View Format */}
      {viewFormat === 'map' ? (
        <RouteMapCanvas stops={activeTrip.stops || []} tripTitle={activeTrip.title} />
      ) : viewFormat === 'timeline' ? (
        /* Day-Wise Timeline View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
          
          {/* Vertical timeline backbone line */}
          <div style={{ position: 'absolute', left: '28px', top: '20px', bottom: '20px', width: '2px', background: 'var(--border-subtle)', zIndex: 0 }} />

          {dayList.map((day, idx) => (
            <motion.div
              key={day.dayNumber}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 1 }}
            >
              {/* Day Circle Marker */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--brand-gradient)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                fontWeight: 800
              }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', lineHeight: 1 }}>DAY</span>
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{day.dayNumber}</span>
              </div>

              {/* Day Schedule Content Card */}
              <div className="glass-panel" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={18} color="var(--brand-primary)" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{day.cityName}, {day.country}</h3>
                  </div>
                  {day.lodging && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      🏨 {day.lodging}
                    </span>
                  )}
                </div>

                {/* Day's Activities */}
                {day.activities.length === 0 ? (
                  <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    ☀️ Free exploration & leisure day in {day.cityName}. Stroll the local neighborhood cafes!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {day.activities.map(act => (
                      <div
                        key={act.id}
                        style={{
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Clock size={20} color="var(--brand-primary)" />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-primary)' }}>{act.time}</span>
                              <span className="badge-tag primary" style={{ fontSize: '0.7rem' }}>{act.category}</span>
                            </div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '2px' }}>{act.title}</h4>
                            {act.notes && (
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {act.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '1rem' }}>{formatCurrency(act.cost)}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱️ {act.durationHours}h</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Grouped by City View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {activeTrip.stops?.map((stop, sIdx) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.08 }}
              className="glass-panel"
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--brand-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {sIdx + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stop.cityName}, {stop.country}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stop.stayDays} Days Stay • Hotel: {stop.lodgingName}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge-tag success">Transit: {stop.transitMode}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {stop.activities?.map(act => (
                  <div
                    key={act.id}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span className="badge-tag primary" style={{ fontSize: '0.7rem' }}>Day {act.day} • {act.time}</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '6px 0 4px' }}>{act.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{act.notes}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Duration: {act.durationHours}h</span>
                      <span style={{ color: 'var(--brand-primary)' }}>{formatCurrency(act.cost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
