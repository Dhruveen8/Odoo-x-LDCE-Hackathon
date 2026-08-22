import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Compass, Plane, Train } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinations';

export default function RouteMapCanvas({ stops = [], tripTitle = "" }) {
  const [hoveredStop, setHoveredStop] = useState(null);

  // Map coordinates projection simulation
  // Latitude (-90 to 90), Longitude (-180 to 180) mapped to SVG 800x400
  const projectCoords = (lat, lng) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  const stopCoords = stops.map((stop, index) => {
    const dest = DESTINATIONS.find(d => d.id === stop.cityId) || {
      lat: 45 + (index * 5),
      lng: 10 + (index * 15)
    };
    const { x, y } = projectCoords(dest.lat, dest.lng);
    return {
      ...stop,
      x: Math.max(60, Math.min(740, x)),
      y: Math.max(60, Math.min(340, y)),
      image: dest.image,
      tagline: dest.tagline
    };
  });

  return (
    <div className="glass-panel" style={{ padding: '20px', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="var(--brand-primary)" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Interactive Journey Route</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Animated multi-city route connecting {stops.length} destinations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge-tag primary">
            <Plane size={12} /> Flight paths
          </span>
          <span className="badge-tag success">
            <Train size={12} /> Rail links
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ width: '100%', height: '320px', background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)', borderRadius: 'var(--radius-md)', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
        
        {/* World Grid subtle lines */}
        <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Dynamic Route Polyline and markers */}
        <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0 }}>
          
          {/* Animated Connecting Lines */}
          {stopCoords.map((stop, i) => {
            if (i === stopCoords.length - 1) return null;
            const nextStop = stopCoords[i + 1];
            
            // Curved path midpoint
            const midX = (stop.x + nextStop.x) / 2;
            const midY = (stop.y + nextStop.y) / 2 - 35;

            const pathD = `M ${stop.x} ${stop.y} Q ${midX} ${midY} ${nextStop.x} ${nextStop.y}`;

            return (
              <g key={`path-${i}`}>
                {/* Glow layer */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.3)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Animated dash line */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  initial={{ strokeDashoffset: 50 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </g>
            );
          })}

          {/* City Nodes */}
          {stopCoords.map((stop, index) => (
            <g
              key={stop.id}
              transform={`translate(${stop.x}, ${stop.y})`}
              onMouseEnter={() => setHoveredStop(stop)}
              onMouseLeave={() => setHoveredStop(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer pulsing beacon */}
              <motion.circle
                r="18"
                fill="rgba(99, 102, 241, 0.2)"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.4 }}
              />

              {/* Node pin */}
              <circle r="9" fill="var(--brand-primary)" stroke="#ffffff" strokeWidth="2.5" />
              
              {/* Stop Number */}
              <text
                textAnchor="middle"
                dy="3.5"
                fill="#ffffff"
                fontSize="9"
                fontWeight="800"
                fontFamily="var(--font-heading)"
              >
                {index + 1}
              </text>

              {/* City Label */}
              <text
                textAnchor="middle"
                dy="24"
                fill="var(--text-primary)"
                fontSize="12"
                fontWeight="700"
                fontFamily="var(--font-heading)"
              >
                {stop.cityName}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Information Popup */}
        {hoveredStop && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              padding: '12px 16px',
              maxWidth: '240px',
              zIndex: 10,
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem' }}>
              <MapPin size={14} color="var(--brand-primary)" />
              <span>{hoveredStop.cityName}, {hoveredStop.country}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {hoveredStop.stayDays} days stay • {hoveredStop.activities?.length || 0} activities scheduled
            </div>
            {hoveredStop.lodgingName && (
              <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', marginTop: '4px', fontWeight: 600 }}>
                🏨 {hoveredStop.lodgingName}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
