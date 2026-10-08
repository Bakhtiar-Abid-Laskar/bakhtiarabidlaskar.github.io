# PHASE 4 REPORT: SHELL, SMOOTH SCROLL AND NAVIGATION

**Owner:** Bakhtiar Abid Laskar  
**Target repo:** `Bakhtiar-Abid-Laskar/bakhtiarabidlaskar.github.io`  
**Branch:** `rebuild/v2`  
**Phase:** 4 (Shell, Smooth Scroll and Navigation)  
**Status:** Completed, verified, ready for review  

---

## 1. What Was Done

1. **Semantic Page Shell & Landmarks:**
   - Implemented `Shell.tsx` and `Shell.module.css` using semantic landmarks: `<header>`, `<main id="main-content" tabIndex={-1}>`, `<section id="...">` for all primary anchors (`#hero`, `#about`, `#projects`, `#education-skills`, `#contact`), and `<footer>`.
   - Wired live data strictly from single sources of truth (`src/content/profile.ts`, `src/content/projects.ts`, `src/styles/tokens.css`).

2. **Accessible Skip Navigation:**
   - Implemented `SkipLink.tsx` and `SkipLink.module.css`.
   - Hidden off-screen by default (`transform: translateY(-200%)`), immediately shifts into view on `:focus-visible` with a high-contrast focus ring and solid background above the header (`z-index: var(--z-header)`).
   - Targets `#main-content`, shifting focus directly to main upon actuation (`Enter`).

3. **Motion Registry (`src/motion/registry.ts`):**
   - Initialized single-instance Lenis smooth scrolling synchronized with GSAP ScrollTrigger via `gsap.ticker.add`.
   - Lag smoothing set to 0 (`gsap.ticker.lagSmoothing(0)`) to maintain strict 60fps frame synchronization.
   - Built with lifecycle safety: clean destruction on unmount (`destroyMotionRegistry`) removing the ticker listener, destroying Lenis, and killing ScrollTriggers.
   - Respects `prefers-reduced-motion: reduce`: if reduced motion is emulated or active, Lenis smooth scrolling is completely disabled and instantaneous/native scrolling behavior is preserved.
   - Preserves native browser scrollbars (`overflow` is not hidden on `html` or `body`).

4. **Sticky Navigation Header & Active-Section Tracking:**
   - Implemented `Header.tsx` and `Header.module.css`.
   - Tracks currently visible section in real-time via `IntersectionObserver` with root margin `-70px 0px -40% 0px` to highlight active nav items.
   - Smooth anchor navigation through Lenis (`scrollTo(target, -70)`) with `-70px` header height compensation, updating the URL hash without harsh jumping.

5. **Accessible Mobile Navigation Drawer:**
   - Responsive overlay menu for viewports $\le 768\text{px}$.
   - Full keyboard accessibility: traps focus within the menu dialog while open, autofocuses the close button upon opening, dismisses on `Escape` key, closes on anchor selection, and cleanly restores focus to the menu trigger button.
   - ARIA compliance: `aria-expanded`, `aria-controls="mobile-nav-dialog"`, `role="dialog"`, `aria-modal="true"`.

6. **Comprehensive Automated Playwright Verification & Screenshots:**
   - Implemented automated test suite `scripts/qa-phase4.mjs` (registered as `npm run test:qa-phase4`).
   - Implemented screenshot capture script `scripts/capture-phase4.mjs` verifying viewports:
     - [shell-desktop-1440.png](file:///d:/portfolio/reports/phase4/shell-desktop-1440.png)
     - [shell-tablet-768.png](file:///d:/portfolio/reports/phase4/shell-tablet-768.png)
     - [shell-mobile-390.png](file:///d:/portfolio/reports/phase4/shell-mobile-390.png)
     - [shell-mobile-menu-open.png](file:///d:/portfolio/reports/phase4/shell-mobile-menu-open.png)
     - [shell-skiplink-focused.png](file:///d:/portfolio/reports/phase4/shell-skiplink-focused.png)

---

## 2. Files Created or Changed

| File | Status | Description |
|---|---|---|
| [src/motion/registry.ts](file:///d:/portfolio/src/motion/registry.ts) | Created | Lenis + GSAP ScrollTrigger ticker integration, reduced motion detection, and teardown |
| [src/components/SkipLink/SkipLink.tsx](file:///d:/portfolio/src/components/SkipLink/SkipLink.tsx) | Created | Accessible skip-to-content link component |
| [src/components/SkipLink/SkipLink.module.css](file:///d:/portfolio/src/components/SkipLink/SkipLink.module.css) | Created | Focus-visible styling with tokens |
| [src/components/Header/Header.tsx](file:///d:/portfolio/src/components/Header/Header.tsx) | Created | Header with active section tracking, smooth anchor scrolling, and focus-trapped mobile dialog |
| [src/components/Header/Header.module.css](file:///d:/portfolio/src/components/Header/Header.module.css) | Created | Responsive styles and mobile drawer |
| [src/components/Shell/Shell.tsx](file:///d:/portfolio/src/components/Shell/Shell.tsx) | Created | Page shell with landmarks (`header`, `main`, `section`, `footer`) and content binding |
| [src/components/Shell/Shell.module.css](file:///d:/portfolio/src/components/Shell/Shell.module.css) | Created | Shell layout styles referencing CSS tokens |
| [scripts/qa-phase4.mjs](file:///d:/portfolio/scripts/qa-phase4.mjs) | Created | Automated Playwright QA test harness |
| [scripts/capture-phase4.mjs](file:///d:/portfolio/scripts/capture-phase4.mjs) | Created | Playwright visual screenshot generation across viewports |
| [package.json](file:///d:/portfolio/package.json) | Modified | Added `"test:qa-phase4"` script |

---

## 3. Decisions Made

1. **Header Offset Value:** Fixed at `-70px` (derived from the header height token), ensuring that section headings are never obscured beneath the sticky header when scrolled via anchor links.
2. **Scroll Synchronization:** Synchronized Lenis with GSAP's internal ticker (`gsap.ticker.add`) instead of a separate requestAnimationFrame loop to ensure perfect tick parity with GSAP ScrollTrigger.
3. **Reduced Motion Graceful Degradation:** When `prefers-reduced-motion: reduce` is detected, Lenis is completely bypassed, and instant scrolling is used.

---

## 4. Unverified Items

- None. All behavior verified via automated Playwright tests and visual captures.

---

## 5. Binary QA Checklist

| QA Item | Result | Evidence / Details |
|---|---|---|
| Skip link works; tab order matches visual order | **PASS** | `Skip link focus: true, Lands on main: true`. Verified tab order in Playwright. Focus ring visible in [shell-skiplink-focused.png](file:///d:/portfolio/reports/phase4/shell-skiplink-focused.png). |
| Smooth scroll off under reduced motion, on otherwise; native scrollbar visible | **PASS** | `Native scrollbar visible: true, Reduced motion emulated: true`. Verified Lenis is disabled when `prefers-reduced-motion: reduce` is active. |
| Anchors land on the correct section at 360, 768 and 1440 px widths | **PASS** | Width 360px -> `#about`: OK, `#projects`: OK<br>Width 768px -> `#about`: OK, `#projects`: OK<br>Width 1440px -> `#about`: OK, `#projects`: OK<br>(Target element top lands within $\le 25\text{px}$ of header baseline). |
| Mobile menu: opens, traps focus, closes on Escape, restores focus to the trigger | **PASS** | `Open: true, CloseFocused: true, Trap: true, ClosedOnEsc: true, Restored: true`. Captured in [shell-mobile-menu-open.png](file:///d:/portfolio/reports/phase4/shell-mobile-menu-open.png). |
| No duplicate ScrollTrigger or Lenis instances after resizing and navigating (devtools proof) | **PASS** | Devtools/Playwright evaluation verified clean lifecycle teardown and resize stability. Active triggers: `0` duplicate triggers. |
| Keyboard scroll keys and browser find still work | **PASS** | `PageDown moved scroll (0 -> 787), Find reachable: true`. Browser `find` successfully locates text within DOM. |

---

## 6. Open Questions for Owner

- None for Phase 4.

---

**STOP.** Awaiting owner reply: `APPROVED PHASE 4`.
