// MagneticButton.tsx
// Framer Motion island: magnetic pull within 80px radius
// Spring physics: stiffness 180, damping 18
// Fill sweeps in with accent color on hover
// client:idle — low priority hydration

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type MouseEvent, type ReactNode } from 'react';

interface Props {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'filled' | 'outline' | 'ghost';
  ariaLabel?: string;
  className?: string;
}

const MAGNETIC_RADIUS = 80;
const springConfig = { stiffness: 180, damping: 18 };

export default function MagneticButton({
  href,
  onClick,
  children,
  variant = 'outline',
  ariaLabel,
  className = '',
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  function handleMouseMove(e: MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MAGNETIC_RADIUS) {
      const strength = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS;
      x.set(dx * strength * 0.45);
      y.set(dy * strength * 0.45);
    }
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6875rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    padding: '1rem 2rem',
    border: variant === 'ghost' ? 'none' : '1px solid currentColor',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'none',
    textDecoration: 'none',
  };

  const variantStyle: React.CSSProperties =
    variant === 'filled'
      ? { backgroundColor: 'var(--ink)', color: 'var(--white)', borderColor: 'var(--ink)' }
      : variant === 'ghost'
      ? { color: 'var(--ink)', border: 'none' }
      : { color: 'var(--ink)', borderColor: 'var(--ink)' };

  const motionProps = {
    ref: ref as React.RefObject<HTMLAnchorElement>,
    style: { ...baseStyle, ...variantStyle, x: sx, y: sy },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    whileHover: { color: '#FFFFFF' },
    transition: { color: { duration: 0.3 } },
    className,
    'aria-label': ariaLabel,
  };

  const inner = (
    <>
      {/* Fill sweep */}
      <motion.span
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--accent)',
          zIndex: 0,
          originY: 1,
        }}
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a href={href} {...motionProps}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      {...(motionProps as Parameters<typeof motion.button>[0])}
      onClick={onClick}
      type="button"
    >
      {inner}
    </motion.button>
  );
}

