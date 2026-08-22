import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '640px' }) {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(11, 15, 23, 0.65)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 100
            }}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="glass-panel"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 101,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border-subtle)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-xl)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h3>
              <button
                onClick={onClose}
                className="btn btn-ghost"
                style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              {children}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
