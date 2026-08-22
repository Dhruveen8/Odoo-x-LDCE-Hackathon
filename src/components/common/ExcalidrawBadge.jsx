import React from 'react';
import { motion } from 'motion/react';

export default function ExcalidrawBadge({ label = "Hand-Drawn & AI Powered", subtitle = "Excalidraw Architecture" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, rotate: [-1, 1, -1] }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 14px',
        background: 'rgba(254, 240, 138, 0.25)',
        border: '2px dashed #eab308',
        borderRadius: '12px',
        color: 'var(--text-primary)',
        cursor: 'default'
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M4 20L8 19L19 8L15 4L4 15L4 20Z"
          stroke="#eab308"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        <motion.path
          d="M13.5 6.5L17.5 10.5"
          stroke="#eab308"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </svg>
      <div>
        <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.15rem', lineHeight: '1.1', color: '#ca8a04', fontWeight: 700 }}>
          {label}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            {subtitle}
          </div>
        )}
      </div>
    </motion.div>
  );
}
