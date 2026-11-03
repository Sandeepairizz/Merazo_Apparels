// MobileMenu.tsx
// Framer Motion island: full-screen menu with staggered line reveals
// Controlled by the hamburger button in Nav.astro
// client:visible

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navItems = [
  { href: '#collection', label: 'Shop',       num: '01' },
  { href: '#showcase',   label: 'Collection', num: '02' },
  { href: '#craft',      label: 'Craft',      num: '03' },
  { href: '#lookbook',   label: 'Journal',    num: '04' },
  { href: '#newsletter', label: 'Contact',    num: '05' },
];

const containerVariants = {
  closed: { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
  open:   { clipPath: 'inset(0 0 0% 0)',   transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const itemVariants = {
  closed: { y: '110%', opacity: 0 },
  open: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.05 + i * 0.07,
    },
  }),
};

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          width: '24px',
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          padding: 0,
          color: 'var(--white)',
        }}
      >
        <motion.span
          animate={open ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          style={{ display: 'block', height: '1px', background: 'currentColor', transformOrigin: 'center' }}
        />
        <motion.span
          animate={open ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          style={{ display: 'block', height: '1px', background: 'currentColor', transformOrigin: 'center' }}
        />
      </button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--ink)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(6rem, 15vw, 10rem) clamp(1rem, 6vw, 3rem) clamp(2rem, 6vw, 4rem)',
            }}
          >
            <nav aria-label="Mobile navigation">
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {navItems.map((item, i) => (
                  <li key={item.href} style={{ overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <motion.a
                      href={item.href}
                      custom={i}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit={{ y: '110%', opacity: 0, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } }}
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 7vw, 4.5rem)',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        color: 'var(--white)',
                        padding: '0.4em 0',
                        textDecoration: 'none',
                      }}
                      whileHover={{ color: 'var(--accent)' }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        letterSpacing: '0.08em',
                        color: 'var(--accent)',
                        flexShrink: 0,
                      }}>
                        {item.num}
                      </span>
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer social links */}
            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {['Instagram', 'Twitter', 'Pinterest'].map((s) => (
                  <a key={s} href="#" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                    {s}
                  </a>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                © 2024
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

