import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Notification() {
  const { toasts, removeToast } = useApp();

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', width: '100%' }}>
      <AnimatePresence>
        {toasts.map(toast => {
          let Icon = Info;
          let iconColor = "var(--brand-primary)";
          let borderColor = "var(--border-subtle)";

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            iconColor = "var(--color-success)";
            borderColor = "rgba(16, 185, 129, 0.4)";
          } else if (toast.type === 'warning') {
            Icon = AlertCircle;
            iconColor = "var(--color-warning)";
            borderColor = "rgba(245, 158, 11, 0.4)";
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                borderLeft: `4px solid ${iconColor}`,
                borderColor: borderColor,
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <Icon size={20} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {toast.title}
                </div>
                {toast.message && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {toast.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
