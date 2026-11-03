// src/scripts/hero.ts
// Merazo — Full-Screen Auto-Playing GSAP Horizontal Slider Hero
// Flat horizontal push (right→left), inner image parallax, per-slide typography,
// segmented progress line with play/pause, glass store tile, nav sync.

import gsap from 'gsap';
import { setNavTheme } from './nav';

export class HeroSlider {
  private heroEl: HTMLElement;
  private slides: HTMLElement[];
  private slideImgs: HTMLElement[];
  private progressBars: HTMLElement[];
  private playPauseBtn: HTMLButtonElement | null;
  private prevBtn: HTMLButtonElement | null;
  private nextBtn: HTMLButtonElement | null;

  private total: number;
  private currentIndex = 0;
  private state = { p: 0 };
  private isAnimating = false;
  private isPaused = false;
  private holdDuration = 6.0; // 6 seconds per slide
  private transitionDuration = 1.2; // 1.2s power3.inOut

  private holdTween: gsap.core.Tween | null = null;
  private transitionTween: gsap.core.Tween | null = null;
  private wrapFn: (val: number) => number;

  private dragStartX = 0;
  private isDragging = false;

  constructor() {
    const el = document.getElementById('hero-slider');
    if (!el) throw new Error('#hero-slider not found');
    this.heroEl = el;

    this.slides = Array.from(el.querySelectorAll<HTMLElement>('.hero__slide'));
    this.slideImgs = Array.from(el.querySelectorAll<HTMLElement>('.hero__slide-img'));
    this.progressBars = Array.from(el.querySelectorAll<HTMLElement>('.hero-seg__fill'));
    this.playPauseBtn = el.querySelector<HTMLButtonElement>('#hero-play-pause');
    this.prevBtn = el.querySelector<HTMLButtonElement>('#hero-prev');
    this.nextBtn = el.querySelector<HTMLButtonElement>('#hero-next');

    this.total = this.slides.length;
    this.wrapFn = gsap.utils.wrap(-1, this.total - 1);

    this.init();
  }

  private init() {
    // Initial position of all slides
    this.updateSlidePositions();

    // Preloader coordination
    const isVisited = sessionStorage.getItem('merazo-visited') ||
                      new URLSearchParams(window.location.search).has('skip-preloader');

    if (isVisited) {
      this.startSlide(0, false);
    } else {
      // Wait for preloader callback or custom event
      window.addEventListener('merazo-preloader-done', () => {
        this.startSlide(0, false);
      }, { once: true });

      // Fallback timeout in case preloader finishes without event
      setTimeout(() => {
        if (!this.holdTween && !this.isAnimating) {
          this.startSlide(0, false);
        }
      }, 3500);
    }

    this.bindEvents();
    this.initStoreTime();
  }

  private updateSlidePositions() {
    for (let i = 0; i < this.total; i++) {
      // Wrap slide offset into range [-1, total - 1)
      let offset = this.wrapFn(i - this.state.p);
      const percent = offset * 100;
      
      this.slides[i].style.transform = `translate3d(${percent}%, 0, 0)`;

      // Inner image counter-parallax lag (horizontal only, no vertical scale zoom to avoid top clipping)
      if (this.slideImgs[i]) {
        const imgLag = -offset * 8;
        this.slideImgs[i].style.transform = `translate3d(${imgLag}%, 0, 0)`;
      }

      // Hide offscreen slides from accessibility/paint if far away
      const isVisible = Math.abs(offset) <= 1.2;
      this.slides[i].style.visibility = isVisible ? 'visible' : 'hidden';
      this.slides[i].setAttribute('aria-hidden', i === this.currentIndex ? 'false' : 'true');
    }
  }

  public goTo(targetIndex: number, direction: 'next' | 'prev' | 'auto' = 'next') {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Stop existing hold tween
    if (this.holdTween) {
      this.holdTween.kill();
      this.holdTween = null;
    }

    const prevIndex = this.currentIndex;
    const nextIndex = (targetIndex + this.total) % this.total;

    // Calculate delta in p space
    let delta = 1;
    if (direction === 'prev') {
      if (nextIndex < prevIndex) {
        delta = nextIndex - prevIndex;
      } else {
        delta = (nextIndex - this.total) - prevIndex;
      }
    } else {
      // 'next' or 'auto' — ALWAYS moves forward so next slide enters from the right
      if (nextIndex > prevIndex) {
        delta = nextIndex - prevIndex;
      } else {
        delta = (nextIndex + this.total) - prevIndex;
      }
    }

    const startP = this.state.p;
    const endP = startP + delta;

    // Sync navbar theme at 45% of slide transition
    const nextTheme = (this.slides[nextIndex].dataset.nav as 'light' | 'dark') || 'dark';
    gsap.delayedCall(this.transitionDuration * 0.45, () => {
      setNavTheme(nextTheme);
    });

    // Reset progress fill on departing slide
    if (this.progressBars[prevIndex]) {
      gsap.to(this.progressBars[prevIndex], {
        scaleX: delta > 0 ? 1 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    // Hide departing slide text
    this.hideText(this.slides[prevIndex]);

    // Animate state.p
    this.transitionTween = gsap.to(this.state, {
      p: endP,
      duration: this.transitionDuration,
      ease: 'power3.inOut',
      onUpdate: () => {
        this.updateSlidePositions();
      },
      onComplete: () => {
        this.currentIndex = nextIndex;
        // Normalize state.p to [0, total)
        this.state.p = (this.state.p % this.total + this.total) % this.total;
        this.updateSlidePositions();
        this.isAnimating = false;

        // Start hold for the arrived slide
        this.startSlide(nextIndex, true);
      },
    });
  }

  private startSlide(index: number, animateText: boolean) {
    this.currentIndex = index;

    // Sync navbar theme immediately for current slide
    const currentTheme = (this.slides[index].dataset.nav as 'light' | 'dark') || 'dark';
    setNavTheme(currentTheme);

    // Update progress segments
    this.progressBars.forEach((bar, i) => {
      if (i < index) {
        gsap.set(bar, { scaleX: 1, transformOrigin: 'left' });
      } else if (i > index) {
        gsap.set(bar, { scaleX: 0, transformOrigin: 'left' });
      } else {
        gsap.set(bar, { scaleX: 0, transformOrigin: 'left' });
      }
    });

    // Reveal arriving slide text
    this.revealText(this.slides[index]);

    // Fill active segment progress over holdDuration
    if (!this.isPaused) {
      const activeBar = this.progressBars[index];
      if (activeBar) {
        this.holdTween = gsap.to(activeBar, {
          scaleX: 1,
          duration: this.holdDuration,
          ease: 'none',
          onComplete: () => {
            this.goTo(this.currentIndex + 1, 'next');
          },
        });
      }
    }
  }

  private revealText(slide: HTMLElement) {
    const lines = slide.querySelectorAll<HTMLElement>('.hero__mask-inner');
    if (lines.length) {
      gsap.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 0.25,
          immediateRender: false,
        }
      );
    }

    // Optional drawn underline (Slide 1)
    const underline = slide.querySelector<HTMLElement>('.hero__drawn-underline');
    if (underline) {
      gsap.fromTo(
        underline,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.0,
          ease: 'power3.out',
          delay: 0.65,
          transformOrigin: 'left',
          immediateRender: false,
        }
      );
    }

    // Optional subhead & CTA reveal
    const metaElements = slide.querySelectorAll<HTMLElement>('.hero__meta-reveal');
    if (metaElements.length) {
      gsap.fromTo(
        metaElements,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power2.out',
          delay: 0.45,
          immediateRender: false,
        }
      );
    }
  }

  private hideText(slide: HTMLElement) {
    const lines = slide.querySelectorAll<HTMLElement>('.hero__mask-inner');
    if (lines.length) {
      gsap.to(lines, {
        yPercent: -40,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      });
    }

    const metaElements = slide.querySelectorAll<HTMLElement>('.hero__meta-reveal');
    if (metaElements.length) {
      gsap.to(metaElements, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }

  public next() {
    this.goTo(this.currentIndex + 1, 'next');
  }

  public prev() {
    this.goTo(this.currentIndex - 1, 'prev');
  }

  public togglePlayPause() {
    this.isPaused = !this.isPaused;
    if (this.playPauseBtn) {
      this.playPauseBtn.setAttribute(
        'aria-label',
        this.isPaused ? 'Play hero slider' : 'Pause hero slider'
      );
      this.playPauseBtn.classList.toggle('is-paused', this.isPaused);
      const iconPath = this.playPauseBtn.querySelector('path');
      if (iconPath) {
        // Switch between Pause (two vertical bars) and Play (triangle)
        if (this.isPaused) {
          iconPath.setAttribute('d', 'M5 3l9 5-9 5V3z');
        } else {
          iconPath.setAttribute('d', 'M4 3h3v10H4V3zm5 0h3v10H9V3z');
        }
      }
    }

    if (this.isPaused) {
      if (this.holdTween) this.holdTween.pause();
    } else {
      if (this.holdTween) {
        this.holdTween.play();
      } else if (!this.isAnimating) {
        this.startSlide(this.currentIndex, false);
      }
    }
  }

  private bindEvents() {
    // Prev / Next Chevrons
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    // Play/Pause button
    this.playPauseBtn?.addEventListener('click', () => this.togglePlayPause());

    // Progress segment direct jumps
    this.progressBars.forEach((bar, idx) => {
      const segBtn = bar.closest<HTMLElement>('.hero-seg');
      segBtn?.addEventListener('click', () => {
        if (idx !== this.currentIndex) {
          this.goTo(idx, idx > this.currentIndex ? 'next' : 'prev');
        }
      });
    });

    // Keyboard navigation when in view
    window.addEventListener('keydown', (e) => {
      const rect = this.heroEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        if (e.key === 'ArrowRight') this.next();
        else if (e.key === 'ArrowLeft') this.prev();
      }
    });

    // Pointer drag / swipe
    this.heroEl.addEventListener('pointerdown', (e) => {
      // Ignore clicks on buttons/links
      if ((e.target as HTMLElement).closest('button, a, .hero-glass-store')) return;
      this.dragStartX = e.clientX;
      this.isDragging = true;
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      const diffX = e.clientX - this.dragStartX;
      if (diffX < -50) {
        // Swiped left -> next
        this.next();
      } else if (diffX > 50) {
        // Swiped right -> prev
        this.prev();
      }
    });

    // Pause on page hidden or offscreen
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.holdTween) this.holdTween.pause();
      } else {
        if (!this.isPaused && this.holdTween) this.holdTween.play();
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            if (this.holdTween) this.holdTween.pause();
          } else {
            if (!this.isPaused && this.holdTween) this.holdTween.play();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(this.heroEl);
  }

  private initStoreTime() {
    const timeEl = this.heroEl.querySelector<HTMLElement>('#store-london-time');
    if (!timeEl) return;

    const updateTime = () => {
      const now = new Date();
      // London time formatting
      const londonTimeString = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      timeEl.textContent = `LONDON ${londonTimeString}`;
    };

    updateTime();
    setInterval(updateTime, 10000);
  }
}

let heroSliderInstance: HeroSlider | null = null;

export function initHero(): HeroSlider | null {
  const el = document.getElementById('hero-slider');
  if (!el) return null;
  if (!heroSliderInstance) {
    heroSliderInstance = new HeroSlider();
    (window as any).heroSlider = heroSliderInstance;
  }
  return heroSliderInstance;
}

