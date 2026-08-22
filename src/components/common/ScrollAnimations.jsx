import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence
} from 'motion/react';

/* ── Reusable scroll-reveal wrapper ── */
export function FadeInUp({ children, delay = 0, distance = 48, once = true, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-80px 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Fade in from left / right ── */
export function FadeInSide({ children, from = 'left', delay = 0, once = true, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-80px 0px' });
  const x = from === 'left' ? -60 : 60;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Scale-in on scroll ── */
export function ScaleIn({ children, delay = 0, once = true, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-80px 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Staggered children (parent provides container) ── */
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};
export const staggerItem = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

/* ── Parallax image (used in hero / banners) ── */
export function ParallaxImage({ src, alt, speed = 0.25, height = '100%', style = {} }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);
  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', height, ...style }}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, width: '100%', height: '120%', objectFit: 'cover', position: 'absolute', top: '-10%', left: 0 }}
      />
    </div>
  );
}

/* ── Counter that animates when it enters view ── */
export function CountUp({ from = 0, to, suffix = '', duration = 1.8, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      style={style}
    >
      {inView ? (
        <motion.span>
          {/* animated number via keyframes on opacity + we just render end value with spring */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
          >
            {to}{suffix}
          </motion.span>
        </motion.span>
      ) : `${from}${suffix}`}
    </motion.span>
  );
}
