/**
 * MERAZO — Motion System
 * GSAP + ScrollTrigger + Lenis smooth scroll
 * Scoped in gsap.context(), word-safe splitting, performance-optimized
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initTryOn } from './tryon';
import { initNav } from './nav';
import { initHero } from './hero';

gsap.registerPlugin(ScrollTrigger);

// ── Global instances & context ───────────────────────────────
let lenis: Lenis | null = null;
let masterCtx: gsap.Context | null = null;

export const ease = {
  outExpo:     'expo.out',
  outPower4:   'power4.out',
  inOutPower2: 'power2.inOut',
  inOutPower4: 'power4.inOut',
} as const;

// ── Lenis Smooth Scroll ──────────────────────────────────────
export function initLenis(): Lenis {
  if (lenis) return lenis;

  lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    syncTouch: false,
    infinite: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  (window as any).lenis = lenis;
  return lenis;
}

export function destroyLenis(): void {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

// ── Custom Cursor (Desktop Only) ─────────────────────────────
export function initCursor(): void {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  const xDot  = gsap.quickTo(dot,  'x', { duration: 0.15, ease: ease.outExpo });
  const yDot  = gsap.quickTo(dot,  'y', { duration: 0.15, ease: ease.outExpo });
  const xRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: ease.outExpo });
  const yRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: ease.outExpo });

  window.addEventListener('mousemove', (e) => {
    xDot(e.clientX);
    yDot(e.clientY);
    xRing(e.clientX);
    yRing(e.clientY);
  });

  document.querySelectorAll<HTMLElement>('[data-cursor="image"]').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-image'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-image'));
  });

  document.querySelectorAll<HTMLElement>('a, button, [data-cursor="link"], input').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
  });
}

// ── Word-Safe Text Splitting ─────────────────────────────────
// Words are kept intact inside inline-block white-space:nowrap containers
// so words never break awkwardly across lines ("EVERY" never becomes "E / VERY")
export function splitTextWords(el: HTMLElement): HTMLElement[] {
  const original = el.getAttribute('data-original-text') || el.textContent || '';
  if (!el.hasAttribute('data-original-text')) {
    el.setAttribute('data-original-text', original);
  }

  const words = original.trim().split(/\s+/);
  el.innerHTML = words
    .map(
      (w) =>
        `<span class="split-word-wrap"><span class="split-word-inner">${w}</span></span>`
    )
    .join(' ');

  return Array.from(el.querySelectorAll<HTMLElement>('.split-word-inner'));
}

// ── Heading Reveal (Word-level mask, immediateRender: false) ─
export function revealHeading(
  el: HTMLElement,
  trigger: Element | string = el,
  delay = 0
): gsap.core.Timeline {
  const inners = el.querySelectorAll<HTMLElement>('.mask-inner');
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });

  if (inners.length > 0) {
    tl.fromTo(
      inners,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.1,
        ease: ease.outExpo,
        stagger: 0.08,
        delay,
        immediateRender: false,
      }
    );
  }
  return tl;
}

// ── Image Reveal (clip-path + inner scale) ───────────────────
export function revealImage(
  wrap: HTMLElement,
  img: HTMLElement,
  trigger: Element | string = wrap,
  delay = 0
): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });

  tl.fromTo(
    wrap,
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2,
      ease: ease.outExpo,
      delay,
      immediateRender: false,
    }
  ).fromTo(
    img,
    { scale: 1.25 },
    {
      scale: 1,
      duration: 1.5,
      ease: ease.outExpo,
      immediateRender: false,
    },
    '<'
  );

  return tl;
}

// ── Parallax (scrub) ─────────────────────────────────────────
export function addParallax(
  el: HTMLElement,
  yRange = 10,
  trigger: Element | string = el
): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { yPercent: -yRange },
    {
      yPercent: yRange,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    }
  );
}

// ── Marquee (Velocity-Reactive & Reverses on Scroll-Up) ──────
export function initMarquee(): void {
  const container = document.querySelector<HTMLElement>('.marquee-container');
  const track = document.querySelector<HTMLElement>('.marquee-track');
  if (!container || !track) return;

  // Clean existing clones
  container.querySelectorAll('.marquee-clone').forEach((c) => c.remove());

  // Duplicate for seamless infinite loop
  const clone = track.cloneNode(true) as HTMLElement;
  clone.classList.add('marquee-clone');
  container.appendChild(clone);

  let currentX = 0;
  let targetVelocity = 1;
  let currentVelocity = 1;

  const tickerFunc = () => {
    currentVelocity += (targetVelocity - currentVelocity) * 0.08;
    currentX -= currentVelocity;

    const width = track.offsetWidth;
    if (width > 0) {
      if (currentX <= -width) {
        currentX += width;
      } else if (currentX >= 0) {
        currentX -= width;
      }
      gsap.set([track, clone], { x: currentX });
    }
  };

  gsap.ticker.add(tickerFunc);

  lenis?.on('scroll', (e: any) => {
    const vel = e.velocity || 0;
    const dir = vel < 0 ? -1 : 1;
    targetVelocity = (1 + Math.min(Math.abs(vel) * 0.4, 12)) * dir;
  });
}

// ── Section Progress Indicator (01 - 09) ─────────────────────
export function initSectionProgress(): void {
  const indicator = document.getElementById('section-progress');
  if (!indicator) return;

  const numberEl = indicator.querySelector<HTMLElement>('.progress-indicator__number');
  const fillEl   = indicator.querySelector<HTMLElement>('.progress-indicator__fill');

  const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section'));
  const total = sections.length;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const p = self.progress;
      if (fillEl) fillEl.style.height = `${p * 100}%`;

      const activeIdx = Math.min(Math.floor(p * total), total - 1);
      if (numberEl) {
        numberEl.textContent = String(activeIdx + 1).padStart(2, '0');
      }
    },
  });
}

// ── Preloader ────────────────────────────────────────────────
export function initPreloader(onComplete: () => void): void {
  const preloader = document.getElementById('preloader');
  if (!preloader) {
    window.dispatchEvent(new CustomEvent('merazo-preloader-done'));
    onComplete();
    return;
  }

  if (sessionStorage.getItem('merazo-visited') || new URLSearchParams(window.location.search).has('skip-preloader')) {
    preloader.classList.add('hidden');
    preloader.style.display = 'none';
    window.dispatchEvent(new CustomEvent('merazo-preloader-done'));
    onComplete();
    return;
  }

  const counter  = preloader.querySelector<HTMLElement>('.preloader__counter');
  const cards    = preloader.querySelectorAll<HTMLElement>('.preloader__card');
  const wordmark = preloader.querySelector<HTMLElement>('.preloader__wordmark');

  const tl = gsap.timeline({
    onComplete: () => {
      sessionStorage.setItem('merazo-visited', '1');
      preloader.classList.add('hidden');
      preloader.style.display = 'none';
      window.dispatchEvent(new CustomEvent('merazo-preloader-done'));
      onComplete();
    },
  });

  const obj = { val: 0 };
  tl.to(obj, {
    val: 100,
    duration: 2.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (counter) counter.textContent = String(Math.round(obj.val)).padStart(3, '0');
    },
  }, 0);

  tl.fromTo(
    cards,
    { y: '120%', rotation: () => gsap.utils.random(-15, 15) },
    {
      y: '0%',
      rotation: () => gsap.utils.random(-8, 8),
      duration: 1.1,
      ease: ease.outExpo,
      stagger: 0.15,
      immediateRender: false,
    },
    0
  );

  tl.to(
    wordmark,
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.9,
      ease: ease.outExpo,
    },
    1.3
  );

  tl.to(
    preloader,
    {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.85,
      ease: ease.outPower4,
    },
    2.1
  );
}

// ── Horizontal Showcase Pin (16:9 Panels) ────────────────────
export function initShowcase(): void {
  const showcase = document.querySelector<HTMLElement>('.showcase');
  const sticky   = document.querySelector<HTMLElement>('.showcase__sticky');
  const track    = document.querySelector<HTMLElement>('.showcase__track');
  const progress = document.querySelector<HTMLElement>('.showcase__progress');

  if (!showcase || !sticky || !track) return;

  const panels = track.querySelectorAll<HTMLElement>('.showcase__panel');
  const panelCount = panels.length;
  if (!panelCount) return;

  const scrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

  const trackTween = gsap.to(track, {
    x: () => -scrollDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: showcase,
      pin: sticky,
      pinSpacing: true,
      anticipatePin: 1,
      start: 'top top',
      end: () => `+=${scrollDistance()}`,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (progress) {
          gsap.set(progress, { scaleX: self.progress, transformOrigin: 'left' });
        }
      },
    },
  });

  // Smooth counter-parallax for each panel's image
  panels.forEach((panel) => {
    const img = panel.querySelector<HTMLElement>('.showcase__panel-bg img');
    if (img) {
      gsap.fromTo(
        img,
        { xPercent: -10, scale: 1.1 },
        {
          xPercent: 10,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: trackTween,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        }
      );
    }
  });
}

// ── Craft Section (Performance by Design Image Swap) ─────────
export function initCraftSection(): void {
  const items    = document.querySelectorAll<HTMLElement>('.craft__item');
  const pictures = document.querySelectorAll<HTMLElement>('.craft__picture');
  const badge    = document.getElementById('craft-badge');
  if (!items.length || !pictures.length) return;

  const names = [
    'LONG-STAPLE COTTON',
    'MOTHER-OF-PEARL BUTTONS',
    'FRENCH SEAMS',
    'PRE-WASHED FIT',
  ];

  function setActive(idx: number): void {
    items.forEach((item, i) => item.classList.toggle('active', i === idx));
    pictures.forEach((pic, i) => {
      pic.classList.toggle('active', i === idx);
      const img = pic.querySelector('img');
      if (img) img.classList.toggle('active', i === idx);
    });
    if (badge && names[idx]) {
      const span = badge.querySelector('span');
      if (span) span.textContent = `SPEC 0${idx + 1} / 04: ${names[idx]}`;
    }
  }

  setActive(0);

  items.forEach((item, idx) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter:     () => setActive(idx),
      onEnterBack: () => setActive(idx),
    });

    item.addEventListener('mouseenter', () => setActive(idx));
    item.addEventListener('click', () => setActive(idx));
  });
}

// (TryItOn section is handled in ./tryon.ts via initTryOn)

// ── Testimonial Word-Safe Char Reveal ────────────────────────
export function initTestimonial(): void {
  const quote = document.querySelector<HTMLElement>('.testimonial__quote');
  if (!quote) return;

  const original = quote.getAttribute('data-original-quote') || quote.textContent || '';
  if (!quote.hasAttribute('data-original-quote')) {
    quote.setAttribute('data-original-quote', original);
  }

  // Wrap words first, then characters inside
  const words = original.trim().split(/\s+/);
  quote.innerHTML = words
    .map((w) => {
      const chars = w
        .split('')
        .map((c) => `<span class="testimonial__char" aria-hidden="true">${c}</span>`)
        .join('');
      return `<span class="split-word-wrap">${chars}</span>`;
    })
    .join(' ');

  const charEls = quote.querySelectorAll<HTMLElement>('.testimonial__char');

  gsap.fromTo(
    charEls,
    { opacity: 0, y: 15 },
    {
      opacity: 1,
      y: 0,
      duration: 0.04,
      stagger: 0.02,
      ease: ease.outExpo,
      immediateRender: false,
      scrollTrigger: {
        trigger: quote,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// ── Footer Wordmark Rise ─────────────────────────────────────
export function initFooterWordmark(): void {
  const wm = document.querySelector<HTMLElement>('.footer__wordmark');
  if (!wm) return;

  gsap.fromTo(
    wm,
    { yPercent: 110 },
    {
      yPercent: 0,
      duration: 1.3,
      ease: ease.outExpo,
      immediateRender: false,
      scrollTrigger: {
        trigger: '.footer__wordmark-wrap',
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// ── Manifesto Scrub ──────────────────────────────────────────
export function initManifestoScrub(): void {
  const section = document.querySelector<HTMLElement>('.manifesto');
  const words   = document.querySelectorAll<HTMLElement>('.manifesto__word');
  if (!section || !words.length) return;

  gsap.fromTo(
    words,
    { opacity: 0.15 },
    {
      opacity: 1,
      stagger: { each: 0.06 },
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom 40%',
        scrub: 1,
      },
    }
  );
}

// ── Cleanup ──────────────────────────────────────────────────
export function cleanup(): void {
  if (masterCtx) {
    masterCtx.revert();
    masterCtx = null;
  }
  ScrollTrigger.getAll().forEach((t) => t.kill());
  destroyLenis();
}

// ── Master Init ──────────────────────────────────────────────
export async function initAll(): Promise<void> {
  cleanup();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    initLenis();
    initCursor();
  }

  // Scoped GSAP context
  masterCtx = gsap.context(() => {
    initMarquee();
    initSectionProgress();
    initCraftSection();
    initTryOn();
    initTestimonial();
    initFooterWordmark();
    initManifestoScrub();

    // Desktop only pinned effects
    ScrollTrigger.matchMedia({
      '(min-width: 769px)': () => {
        if (!prefersReduced) {
          initShowcase();
        }
      },
    });

    // Heading reveals
    document.querySelectorAll<HTMLElement>('[data-reveal-heading]').forEach((el) => {
      revealHeading(el);
    });

    // Image reveals
    document.querySelectorAll<HTMLElement>('[data-reveal-image]').forEach((wrap) => {
      const img = wrap.querySelector<HTMLElement>('img');
      if (img) revealImage(wrap, img);
    });

    // Parallax
    if (!prefersReduced) {
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const range = Number(el.dataset.parallax) || 10;
        addParallax(el, range);
      });
    }
  });

  // Initialize Navbar and Hero Slider
  initNav();
  initHero();

  // Preloader execution
  initPreloader(() => {
    window.dispatchEvent(new CustomEvent('merazo-preloader-done'));
    ScrollTrigger.refresh();
  });

  // Asynchronously refresh ScrollTrigger once fonts and images decode
  try {
    await document.fonts.ready;
    await Promise.allSettled(
      Array.from(document.images).map((img) => img.decode().catch(() => {}))
    );
    ScrollTrigger.refresh();
  } catch (e) {
    ScrollTrigger.refresh();
  }

  // Refresh on resize
  let resizeTimer: any = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });
}
