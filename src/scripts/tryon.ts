// src/scripts/tryon.ts
// Vanilla GSAP Try It On Engine (no React, no ScrollTrigger)
import gsap from 'gsap';

export interface ShirtItem {
  id: string;
  name: string;
  fabric: string;
  price: string;
  color: string;
}

export const SHIRTS: ShirtItem[] = [
  { id: 'oxford',   name: 'Oxford',   fabric: 'Long-staple cotton', price: '£185', color: 'Ivory' },
  { id: 'poplin',   name: 'Poplin',   fabric: 'Crisp poplin',       price: '£165', color: 'Jet Black' },
  { id: 'linen',    name: 'Linen',    fabric: 'Washed linen',       price: '£175', color: 'Sage' },
  { id: 'twill',    name: 'Twill',    fabric: 'Brushed twill',      price: '£195', color: 'Navy' },
  { id: 'satin',    name: 'Satin',    fabric: 'Matte satin',        price: '£205', color: 'Burgundy' },
  { id: 'chambray', name: 'Chambray', fabric: 'Light chambray',     price: '£160', color: 'Sky Blue' },
];

const SLOTS = 12;
const ACTIVE = 5;
const STEP_S = 2.2;
const MOVE_S = 0.9;
const N_SHIRTS = 6;

const mod = (n: number, m: number) => ((n % m) + m) % m;
const shirtOf = (j: number) => mod(-j, N_SHIRTS);

export class TryOnEngine {
  private section: HTMLElement;
  private stage: HTMLElement;
  private cards: HTMLElement[] = [];
  private layersWomen: HTMLElement[] = [];
  private layersMen: HTMLElement[] = [];
  private progress: HTMLElement | null = null;
  private nameEl: HTMLElement | null = null;
  private metaEl: HTMLElement | null = null;
  private captionEl: HTMLElement | null = null;

  private toggleWomen: HTMLElement | null = null;
  private toggleMen: HTMLElement | null = null;

  private state = { o: 0 };
  private currentGender: 'women' | 'men' = 'women';
  private tween: gsap.core.Tween | null = null;
  private timer: gsap.core.Tween | null = null;
  private progressTween: gsap.core.Tween | null = null;
  private idleResumeTimer: any = null;

  private isRunning = false;
  private isHovered = false;
  private isVisible = false;
  private prefersReducedMotion = false;

  private stageW = 1440;
  private stageH = 800;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor(section: HTMLElement) {
    this.section = section;
    const stageEl = section.querySelector<HTMLElement>('.tryon__stage');
    if (!stageEl) throw new Error('.tryon__stage not found');
    this.stage = stageEl;

    this.cards = Array.from(section.querySelectorAll<HTMLElement>('.tryon-card'));
    this.layersWomen = Array.from(section.querySelectorAll<HTMLElement>('[data-tryon-gender="women"]'));
    this.layersMen = Array.from(section.querySelectorAll<HTMLElement>('[data-tryon-gender="men"]'));

    this.progress = section.querySelector<HTMLElement>('.tryon__progress-bar');
    this.nameEl = section.querySelector<HTMLElement>('#tryon-active-name');
    this.metaEl = section.querySelector<HTMLElement>('#tryon-active-meta');
    this.captionEl = section.querySelector<HTMLElement>('#tryon-live-caption');

    this.toggleWomen = section.querySelector<HTMLElement>('#tryon-toggle-women');
    this.toggleMen = section.querySelector<HTMLElement>('#tryon-toggle-men');

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  private init() {
    this.updateDimensions();

    // Resize observer
    this.resizeObserver = new ResizeObserver(() => {
      this.updateDimensions();
      this.render();
    });
    this.resizeObserver.observe(this.stage);

    // Initial positioning
    this.render();
    this.onArrive();

    // Mouse movement parallax (±6px) & subtle sine breathing (±3px)
    this.initSubtleMotion();

    // Card interactions
    this.cards.forEach((card, j) => {
      card.addEventListener('mouseenter', () => {
        this.isHovered = true;
        this.pauseAuto();
      });
      card.addEventListener('mouseleave', () => {
        this.isHovered = false;
        this.resumeAuto();
      });
      card.addEventListener('click', () => {
        const s = mod(j + this.state.o, SLOTS);
        const delta = mod(ACTIVE - s + 6, 12) - 6;
        this.moveToOffset(this.state.o + delta);
      });
    });

    // Keyboard navigation (← / →)
    window.addEventListener('keydown', (e) => {
      if (!this.isVisible) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        this.moveToOffset(Math.round(this.state.o) + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        this.moveToOffset(Math.round(this.state.o) - 1);
      }
    });

    // Gender toggles
    this.toggleWomen?.addEventListener('click', () => this.switchGender('women'));
    this.toggleMen?.addEventListener('click', () => this.switchGender('men'));

    // Preload opposite gender on hover/idle
    const preloadOther = () => this.preloadGender(this.currentGender === 'women' ? 'men' : 'women');
    this.toggleWomen?.addEventListener('mouseenter', preloadOther, { once: true });
    this.toggleMen?.addEventListener('mouseenter', preloadOther, { once: true });

    // Intersection observer
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
          if (this.isVisible && !document.hidden && !this.prefersReducedMotion) {
            this.startLoop();
          } else {
            this.pauseAuto();
          }
        });
      },
      { threshold: [0, 0.25, 0.5] }
    );
    this.intersectionObserver.observe(this.section);

    // Visibility change (tab switch)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAuto();
      } else if (this.isVisible && !this.isHovered && !this.prefersReducedMotion) {
        this.resumeAuto();
      }
    });

    // Preload initial visible gender
    this.preloadGender(this.currentGender);
  }

  private updateDimensions() {
    this.stageW = this.stage.offsetWidth || 1440;
    this.stageH = this.stage.offsetHeight || 800;
  }

  private slotPos(s: number): { x: number; y: number } {
    const isMobile = this.stageW < 768;
    const W = this.stageW;
    const H = this.stageH;

    if (!isMobile) {
      // Desktop
      const x = W * (1.12 - 0.102 * s);
      const d = x / W - 0.58;
      const pxSlope = 0.37;
      const y = H * 0.62 - pxSlope * W * (Math.hypot(d, 0.04) - 0.04);
      return { x, y };
    } else {
      // Mobile (<768px)
      const cardW = Math.min(W * 0.28, 120);
      const xSpacing = 0.95 * cardW;
      const xValley = W * 0.62;
      const x = xValley + (ACTIVE - s) * xSpacing;
      const d = x / W - 0.62;
      const pxSlope = 0.55;
      const y = H * 0.66 - pxSlope * W * (Math.hypot(d, 0.04) - 0.04);
      return { x, y };
    }
  }

  private render = () => {
    this.cards.forEach((el, j) => {
      const s = mod(j + this.state.o, SLOTS);
      const { x, y } = this.slotPos(s);
      const a = Math.min(Math.max(Math.min(s, (SLOTS - s) / 2), 0), 1);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.opacity = String(a);
      el.style.zIndex = String(Math.round(200 - s * 10));
    });
  };

  private step = () => {
    if (!this.isRunning) return;

    this.tween = gsap.to(this.state, {
      o: this.state.o + 1,
      duration: MOVE_S,
      ease: 'power3.inOut',
      onUpdate: this.render,
      onComplete: () => {
        this.onArrive();
        if (this.isRunning && !this.isHovered) {
          this.timer = gsap.delayedCall(STEP_S - MOVE_S, this.step);
        }
      },
    });

    if (this.progress) {
      this.progressTween?.kill();
      this.progressTween = gsap.fromTo(
        this.progress,
        { scaleX: 0 },
        { scaleX: 1, duration: STEP_S, ease: 'none' }
      );
    }
  };

  private onArrive() {
    const j = mod(ACTIVE - Math.round(this.state.o), SLOTS);
    this.setActiveCard(j);
    const shirtIndex = shirtOf(j);
    gsap.delayedCall(0.3, () => {
      this.swapModel(shirtIndex);
    });
  }

  private setActiveCard(activeJ: number) {
    this.cards.forEach((card, j) => {
      const isActive = j === activeJ;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-selected', String(isActive));
    });

    const shirtIdx = shirtOf(activeJ);
    const shirt = SHIRTS[shirtIdx];
    if (shirt) {
      if (this.nameEl) this.nameEl.textContent = shirt.name.toUpperCase();
      if (this.metaEl) this.metaEl.textContent = `${shirt.fabric.toUpperCase()} · ${shirt.price}`;
      if (this.captionEl) {
        this.captionEl.textContent = `Now wearing: ${shirt.name}, ${shirt.color}`;
      }
    }
  }

  private swapModel(i: number) {
    const layers = this.currentGender === 'women' ? this.layersWomen : this.layersMen;
    const next = layers[i];
    if (!next) return;

    next.style.zIndex = '502';
    gsap.fromTo(
      next,
      { autoAlpha: 0, scale: 1.012 },
      { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out', overwrite: true }
    );

    layers.forEach((l, k) => {
      if (k !== i) {
        gsap.to(l, {
          autoAlpha: 0,
          duration: 0.35,
          delay: 0.05,
          onComplete: () => {
            l.style.zIndex = '500';
          },
        });
      }
    });
  }

  public moveToOffset(targetO: number) {
    this.pauseAuto();
    clearTimeout(this.idleResumeTimer);

    this.tween?.kill();
    this.tween = gsap.to(this.state, {
      o: targetO,
      duration: MOVE_S,
      ease: 'power3.inOut',
      onUpdate: this.render,
      onComplete: () => {
        this.onArrive();
        this.idleResumeTimer = setTimeout(() => {
          if (this.isVisible && !this.isHovered && !this.prefersReducedMotion) {
            this.resumeAuto();
          }
        }, 3000);
      },
    });
  }

  public switchGender(gender: 'women' | 'men') {
    if (this.currentGender === gender) return;
    this.currentGender = gender;

    this.toggleWomen?.classList.toggle('active', gender === 'women');
    this.toggleMen?.classList.toggle('active', gender === 'men');
    this.toggleWomen?.setAttribute('aria-selected', String(gender === 'women'));
    this.toggleMen?.setAttribute('aria-selected', String(gender === 'men'));

    // Swap card images src
    this.cards.forEach((card, j) => {
      const shirtIdx = shirtOf(j);
      const shirt = SHIRTS[shirtIdx];
      const img = card.querySelector<HTMLImageElement>('.tryon-card__img');
      if (img && shirt) {
        img.src = `/images/tryon/${gender}/shirt-${shirt.id}.webp`;
        img.alt = `${shirt.name} button-up shirt cutout`;
      }
    });

    // Crossfade models
    const activeShirtIdx = shirtOf(mod(ACTIVE - Math.round(this.state.o), SLOTS));
    const targetLayers = gender === 'women' ? this.layersWomen : this.layersMen;
    const oldLayers = gender === 'women' ? this.layersMen : this.layersWomen;

    oldLayers.forEach((l) => gsap.to(l, { autoAlpha: 0, duration: 0.4 }));

    const nextModel = targetLayers[activeShirtIdx];
    if (nextModel) {
      nextModel.style.zIndex = '502';
      gsap.fromTo(
        nextModel,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, ease: 'power2.out', overwrite: true }
      );
    }

    // Re-enter 12 cards with stagger
    gsap.fromTo(
      this.cards,
      { x: '+=120', opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power2.out',
        onUpdate: this.render,
      }
    );

    this.preloadGender(gender);
  }

  private preloadGender(gender: 'women' | 'men') {
    const dir = `/images/tryon/${gender}`;
    // Preload first model
    const imgModel = new Image();
    imgModel.src = `${dir}/model-oxford.webp`;
    imgModel.decode().catch(() => {});

    // Preload all 6 shirt cards
    SHIRTS.forEach((s) => {
      const imgCard = new Image();
      imgCard.src = `${dir}/shirt-${s.id}.webp`;
      imgCard.decode().catch(() => {});
    });
  }

  private startLoop() {
    this.isRunning = true;
    this.step();
  }

  private pauseAuto() {
    this.isRunning = false;
    this.timer?.kill();
    this.progressTween?.pause();
  }

  private resumeAuto() {
    if (this.isRunning || this.prefersReducedMotion || !this.isVisible) return;
    this.isRunning = true;
    this.step();
  }

  private initSubtleMotion() {
    const modelContainer = this.section.querySelector<HTMLElement>('.tryon__model-container');
    if (!modelContainer || this.prefersReducedMotion) return;

    // Subtle sine breathing (±3px, 4s duration)
    gsap.to(modelContainer, {
      y: 3,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Mouse parallax (±6px, desktop only)
    if (window.matchMedia('(min-width: 769px)').matches) {
      const xTo = gsap.quickTo(modelContainer, 'x', { duration: 0.6, ease: 'power2.out' });
      window.addEventListener('mousemove', (e) => {
        const normX = (e.clientX / window.innerWidth - 0.5) * 12; // ±6px
        xTo(normX);
      });
    }
  }

  public destroy() {
    this.isRunning = false;
    this.tween?.kill();
    this.timer?.kill();
    this.progressTween?.kill();
    clearTimeout(this.idleResumeTimer);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
  }
}

let instance: TryOnEngine | null = null;

export function initTryOn(): TryOnEngine | null {
  const section = document.querySelector<HTMLElement>('.tryon-section');
  if (!section) return null;
  if (instance) instance.destroy();
  instance = new TryOnEngine(section);
  return instance;
}

