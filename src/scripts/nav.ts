// src/scripts/nav.ts
// Transparent nav at top adapting to active slide theme, solid white on scroll.
// 1px sentinel IntersectionObserver, fast-scroll hide/reveal, accessible modal menu.
import gsap from 'gsap';

export interface NavTheme {
  theme: 'light' | 'dark';
}

export class NavManager {
  private nav: HTMLElement;
  private menu: HTMLElement | null;
  private hamburger: HTMLElement | null;
  private sentinel: HTMLElement | null;
  private topScrim: HTMLElement | null;

  private isScrolled = false;
  private isMenuOpen = false;
  private currentTheme: 'light' | 'dark' = 'dark';
  private lastScrollY = 0;
  private isHidden = false;

  constructor() {
    const navEl = document.getElementById('site-nav');
    if (!navEl) throw new Error('#site-nav not found');
    this.nav = navEl;

    this.menu = document.getElementById('nav-menu-overlay');
    this.hamburger = document.getElementById('nav-hamburger-btn');
    this.sentinel = document.getElementById('nav-scroll-sentinel');
    this.topScrim = document.getElementById('nav-top-scrim');

    this.init();
  }

  private init() {
    // 1. Detect when user scrolls past Hero section
    const updateScrollState = () => {
      const hero = document.getElementById('hero-slider');
      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        // Past hero when hero bottom is within or above the navbar (<= 64px)
        this.isScrolled = heroRect.bottom <= 64;
      } else {
        this.isScrolled = window.scrollY > 24;
      }
      this.updateNavState();
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });
    updateScrollState();

    // 2. Hamburger click
    this.hamburger?.addEventListener('click', () => {
      if (this.isMenuOpen) this.closeMenu();
      else this.openMenu();
    });

    // 3. Close button inside menu
    const closeBtn = document.getElementById('nav-menu-close-btn');
    closeBtn?.addEventListener('click', () => {
      this.closeMenu();
    });

    // 4. Close on ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });

    // 5. Close when clicking menu links
    this.menu?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Initial theme
    this.updateNavState();
  }

  public setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    this.updateNavState();
  }

  private updateNavState() {
    document.body.classList.toggle('scrolled', this.isScrolled);
    if (this.isScrolled) {
      this.nav.classList.add('is-scrolled');
      this.nav.classList.remove('theme-light', 'theme-dark');
      if (this.topScrim) this.topScrim.style.opacity = '0';
    } else {
      this.nav.classList.remove('is-scrolled');
      this.nav.classList.toggle('theme-light', this.currentTheme === 'light');
      this.nav.classList.toggle('theme-dark', this.currentTheme === 'dark');
      if (this.topScrim) {
        this.topScrim.style.opacity = this.currentTheme === 'dark' ? '1' : '0';
      }
    }
  }

  public openMenu() {
    this.isMenuOpen = true;
    this.hamburger?.setAttribute('aria-expanded', 'true');
    this.menu?.setAttribute('aria-hidden', 'false');
    this.menu?.classList.add('is-open');
    this.nav.classList.remove('nav-hidden');

    // Lock scroll via Lenis or standard overflow
    if ((window as any).lenis) (window as any).lenis.stop();
    document.body.style.overflow = 'hidden';

    // Staggered reveal of menu lines
    const lines = this.menu?.querySelectorAll<HTMLElement>('.menu-link-inner');
    if (lines && lines.length) {
      gsap.fromTo(
        lines,
        { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: 'power3.out', delay: 0.05 }
      );
    }
  }

  public closeMenu() {
    this.isMenuOpen = false;
    this.hamburger?.setAttribute('aria-expanded', 'false');
    this.menu?.setAttribute('aria-hidden', 'true');

    const lines = this.menu?.querySelectorAll<HTMLElement>('.menu-link-inner');
    if (lines && lines.length) {
      gsap.to(lines, {
        opacity: 0,
        yPercent: -20,
        duration: 0.25,
        stagger: 0.02,
        ease: 'power2.in',
        onComplete: () => {
          this.menu?.classList.remove('is-open');
          gsap.set(lines, { yPercent: 0, opacity: 1 });
          if ((window as any).lenis) (window as any).lenis.start();
          document.body.style.overflow = '';
        },
      });
    } else {
      this.menu?.classList.remove('is-open');
      if ((window as any).lenis) (window as any).lenis.start();
      document.body.style.overflow = '';
    }
  }
}

let navInstance: NavManager | null = null;

export function initNav(): NavManager {
  if (navInstance) return navInstance;
  navInstance = new NavManager();
  (window as any).navManager = navInstance;
  return navInstance;
}

export function setNavTheme(theme: 'light' | 'dark') {
  if (navInstance) navInstance.setTheme(theme);
}

