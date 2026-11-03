import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://merazo.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
    css: {
      devSourcemap: true,
    },
    optimizeDeps: {
      include: ['gsap', 'lenis', 'react', 'react-dom', 'framer-motion'],
    },
    ssr: {
      noExternal: ['framer-motion'],
    },
    build: {
      rollupOptions: {
        external: [],
      },
    },
  },
});
