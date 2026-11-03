/// <reference path="../.astro/types.d.ts" />
// env.d.ts — Astro/TypeScript type declarations
/// <reference types="astro/client" />

interface Window {
  // GSAP is bundled, no global needed
}

// Extend ImportMeta for env variables
interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
