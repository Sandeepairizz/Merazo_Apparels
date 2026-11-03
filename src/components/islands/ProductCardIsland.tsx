// ProductCardIsland.tsx
// Framer Motion React island:
// - 3D tilt on hover (max 6deg)
// - y: -6 lift
// - layout transition for Men/Women toggle
// client:visible — only hydrates when in viewport

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, type MouseEvent } from 'react';

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  imagePrimary: string;
  imageSecondary: string;
  colors: string[];
  href: string;
}

interface Props {
  product: Product;
}

export default function ProductCardIsland({ product }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Spring-based motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 18 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width  - 0.5;
    const py = (e.clientY - rect.top)  / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="product-card"
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      whileHover={{ y: -6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image container */}
      <div
        className="product-card__img-wrap"
        data-cursor="image"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <img
          src={product.imagePrimary}
          alt={`${product.name} — primary view`}
          className="product-card__img-primary"
          width="480"
          height="600"
          loading="lazy"
          decoding="async"
        />
        <img
          src={product.imageSecondary}
          alt={`${product.name} — alternate view`}
          className="product-card__img-secondary"
          width="480"
          height="600"
          loading="lazy"
          decoding="async"
        />

        {/* Quick Add overlay */}
        <div className="product-card__quick-add" role="button" tabIndex={0} aria-label={`Quick add ${product.name} to bag`}>
          + Quick Add
        </div>

        {/* Category tag */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          backgroundColor: 'rgba(10,10,10,0.6)',
          color: '#fff',
          padding: '0.3em 0.6em',
          backdropFilter: 'blur(4px)',
        }}>
          {product.category}
        </div>
      </div>

      {/* Product info */}
      <div className="product-card__info">
        <div>
          <p className="product-card__name">{product.name}</p>
          {/* Color swatches */}
          <div className="product-card__dots" role="group" aria-label="Available colors">
            {product.colors.map((color, i) => (
              <button
                key={i}
                className="color-dot"
                style={{ backgroundColor: color }}
                aria-label={`Color option ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <p className="product-card__price">{product.price}</p>
      </div>
    </motion.div>
  );
}

