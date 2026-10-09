import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Ensure GSAP plugins are registered once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

let lenisInstance: Lenis | null = null;
let tickerListener: ((time: number) => void) | null = null;

export interface MotionRegistryOptions {
  headerOffset?: number;
}

/**
 * Initializes smooth scrolling with Lenis and synchronizes with GSAP ScrollTrigger.
 * Respects prefers-reduced-motion: reduce.
 */
export function initMotionRegistry(options: MotionRegistryOptions = {}): {
  lenis: Lenis | null;
  destroy: () => void;
  scrollTo: (target: string | HTMLElement, offset?: number) => void;
} {
  if (typeof window === 'undefined') {
    return {
      lenis: null,
      destroy: () => {},
      scrollTo: () => {},
    };
  }

  // Check user motion preference and touch device
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  // Cleanup any previous instance
  destroyMotionRegistry();

  if (!prefersReduced && !isTouchDevice) {
    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    // Connect Lenis scroll to ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Sync Lenis RAF to GSAP Ticker for 60fps frame synchronization
    tickerListener = (time: number) => {
      lenisInstance?.raf(time * 1000);
    };

    gsap.ticker.add(tickerListener);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();
  }

  const defaultOffset = options.headerOffset ?? -70;

  const scrollTo = (target: string | HTMLElement, customOffset?: number) => {
    const offset = customOffset !== undefined ? customOffset : defaultOffset;

    if (lenisInstance) {
      lenisInstance.scrollTo(target, {
        offset,
        duration: 1.0,
        immediate: false,
      });
    } else {
      // Fallback for reduced motion or without Lenis
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
        }
      } else if (target instanceof HTMLElement) {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    }
  };

  return {
    lenis: lenisInstance,
    destroy: destroyMotionRegistry,
    scrollTo,
  };
}

/**
 * Tears down Lenis and decouples the ticker listener cleanly.
 */
export function destroyMotionRegistry(): void {
  if (tickerListener) {
    gsap.ticker.remove(tickerListener);
    tickerListener = null;
  }

  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

/**
 * Returns active Lenis instance or null
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}
