import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Share2, 
  Copy, 
  Check, 
  Heart, 
  QrCode, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Sparkles,
  Users,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import RouteMapCanvas from '../components/itinerary/RouteMapCanvas';
import Modal from '../components/common/Modal';

export default function PublicTripView() {
  const { activeTrip, cloneTrip, formatCurrency, computeTripFinances, addToast, setCurrentView } = useApp();

  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(activeTrip?.likesCount || 128);
  const [hasLiked, setHasLiked] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  if (!activeTrip) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>No itinerary selected for public preview</h3>
        <button onClick={() => setCurrentView('my-trips')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Select a Trip
        </button>
      </div>
    );
  }

  const finances = computeTripFinances(activeTrip);
  const shareableUrl = `https://globetrotter.io/trips/${activeTrip.shareSlug || 'itinerary-2026'}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareableUrl);
    setCopied(true);
    addToast("Link Copied!", "Shareable public link copied to clipboard.", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      addToast("Trip Liked! ❤️", "Thanks for showing love to this itinerary.", "success");
    }
  };

  const handleCopyTrip = () => {
    cloneTrip(activeTrip);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
    setCurrentView('my-trips');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Public Share Controls Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-tag success">
              <Share2 size={12} /> Public Community Itinerary
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Read-Only Presentation View</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>
            Share or Clone this Itinerary
          </h3>
        </div>

        {/* Share actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary"
            style={{ gap: '8px' }}
          >
            {copied ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
            <span>{copied ? 'Copied URL!' : 'Copy Share Link'}</span>
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className="btn btn-secondary"
            title="Show QR Code"
          >
            <QrCode size={16} />
            <span>QR Code</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleCopyTrip}
            className="btn btn-primary"
            style={{ background: 'var(--brand-gradient-sunset)' }}
          >
            <Sparkles size={16} />
            <span>Copy to My Trips</span>
          </motion.button>
        </div>
      </div>

      {/* Main Cover & Overview */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ height: '300px', position: 'relative' }}>
          <img src={activeTrip.coverImage} alt={activeTrip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)' }} />

          <div style={{ position: 'absolute', bottom: '28px', left: '28px', right: '28px', color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span className="badge-tag primary" style={{ background: 'rgba(99,102,241,0.85)', color: '#ffffff' }}>
                Curated Itinerary
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                📅 {activeTrip.startDate} to {activeTrip.endDate}
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>{activeTrip.title}</h1>
            <p style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '780px', marginTop: '6px' }}>
              {activeTrip.description}
            </p>
          </div>
        </div>

        {/* Social Meta Bar */}
        <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={handleLike}
              className="btn btn-sm btn-secondary"
              style={{ gap: '6px', color: hasLiked ? '#ef4444' : 'inherit' }}
            >
              <Heart size={16} color={hasLiked ? '#ef4444' : 'currentColor'} fill={hasLiked ? '#ef4444' : 'none'} />
              <span>{likes} Travelers Liked</span>
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              📍 {activeTrip.stops?.length || 0} Destinations • {formatCurrency(finances.totalEstimated)} Total Cost
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=Check out this incredible itinerary on GlobeTrotter: ${encodeURIComponent(shareableUrl)}`, '_blank');
              }}
              className="btn btn-sm btn-ghost"
              style={{ fontSize: '0.8rem' }}
            >
              Share to X / Twitter
            </button>
            <button
              onClick={() => {
                window.open(`https://api.whatsapp.com/send?text=Check out this trip: ${encodeURIComponent(shareableUrl)}`, '_blank');
              }}
              className="btn btn-sm btn-ghost"
              style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}
            >
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Multi-City Journey Route Map */}
      <RouteMapCanvas stops={activeTrip.stops || []} tripTitle={activeTrip.title} />

      {/* Stop by Stop Overview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Complete Journey Schedule</h3>
        
        {activeTrip.stops?.map((stop, sIdx) => (
          <div
            key={stop.id}
            className="glass-panel"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--brand-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  {sIdx + 1}
                </span>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{stop.cityName}, {stop.country}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stop.stayDays} Days Stay • Stay at {stop.lodgingName}</div>
                </div>
              </div>

              <span className="badge-tag success">Transit: {stop.transitMode}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {stop.activities?.map(act => (
                <div
                  key={act.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <span className="badge-tag primary" style={{ fontSize: '0.7rem' }}>Day {act.day} • {act.time}</span>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', margin: '4px 0 2px' }}>{act.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{act.notes}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="Scan & Open on Mobile" maxWidth="400px">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <div style={{ width: '200px', height: '200px', background: '#ffffff', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              {/* Simulated QR Code SVG pattern */}
              <rect x="0" y="0" width="30" height="30" fill="#000000" />
              <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
              <rect x="10" y="10" width="10" height="10" fill="#000000" />
              <rect x="70" y="0" width="30" height="30" fill="#000000" />
              <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
              <rect x="80" y="10" width="10" height="10" fill="#000000" />
              <rect x="0" y="70" width="30" height="30" fill="#000000" />
              <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
              <rect x="10" y="80" width="10" height="10" fill="#000000" />
              <rect x="40" y="10" width="10" height="20" fill="#000000" />
              <rect x="40" y="40" width="20" height="20" fill="#000000" />
              <rect x="10" y="40" width="20" height="10" fill="#000000" />
              <rect x="70" y="40" width="20" height="20" fill="#000000" />
              <rect x="40" y="70" width="20" height="20" fill="#000000" />
              <rect x="70" y="70" width="20" height="20" fill="#000000" />
            </svg>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Scan with your phone's camera to immediately access this live itinerary.
          </p>
          <button onClick={() => setShowQrModal(false)} className="btn btn-secondary" style={{ width: '100%' }}>
            Done
          </button>
        </div>
      </Modal>

    </div>
  );
}
