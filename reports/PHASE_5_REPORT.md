# PHASE 5 REPORT: HERO AND ABOUT (MOMENTS A AND D)

**Owner:** Bakhtiar Abid Laskar  
**Target repo:** `Bakhtiar-Abid-Laskar/bakhtiarabidlaskar.github.io`  
**Branch:** `rebuild/v2`  
**Phase:** 5 (Hero and About: Moments A and D)  
**Status:** Completed, verified, ready for review  

---

## 1. What Was Done

1. **Hero Component & Load Entrance (`src/components/Hero/Hero.tsx`):**
   - Implemented `Hero.tsx` and `Hero.module.css` with semantic `<h1>` developer name, role subtitle (chosen from D4: *"Full-Stack Developer building production web and mobile systems"*), orientation paragraph, and links to GitHub and LinkedIn.
   - Built the **single orchestrated entrance** using GSAP line masking:
     - Outer wrapper lines configured with `overflow: hidden`.
     - Inner headline and subtitle text start at `opacity: 1`, `transform: none` in baseline CSS so that text is **100% visible and readable before JavaScript executes or on slow connections**.
     - Animate up once using `gsap.from()` (`yPercent: 105`, duration `0.9s`, ease `power3.out`, stagger `0.12s`).
     - Applied `will-change: transform` strictly during active animation and removed after (`will-change: auto`).
     - Achieved **CLS 0.0000** (Zero layout shift) during the entrance.

2. **Moment A: 3D Scroll Exit & Archivo `wdth` Axis Scrub:**
   - Container rendered with 3D perspective (`perspective: 1000px`) and `transform-style: preserve-3d`.
   - ScrollTrigger scrubs the hero group upon scrolling out:
     - `rotateX` tilts from `0deg` to `14deg` away from the viewer (`transform-origin: 50% 0%`).
     - `translateZ` pushes back into depth from `0px` to `-300px`.
     - Font variation settings `wdth` axis scrubs smoothly from the wide setting (`'wdth' 125`) down to the condensed setting (`'wdth' 85`), updating computed styles in real-time.
   - Verified that the built Archivo variable font genuinely exposes the `wdth` axis (font file specifies `font-stretch: 62% 125%`, measured inline-block width shrinks by $303.5\text{px}$ from wide to condensed setting).

3. **About Section & Moment D Reveal (`src/components/About/About.tsx`):**
   - Implemented `About.tsx` and `About.module.css` displaying the full biography text from `profile.about` in large typography alongside the developer profile photo.
   - Split paragraph into distinct semantic sentence spans for a scrubbed line-by-line reveal:
     - Scrubbed via ScrollTrigger from muted opacity (`0.28`) to active contrast (`1.0`) as the section crosses the viewport.
     - Profile photo animates with a vertical depth offset (`y: -40px` to `+40px`) producing a physical parallax depth against the text.

4. **Reduced-Motion Variants:**
   - Both `Hero` and `About` detect `prefers-reduced-motion: reduce` via `window.matchMedia`.
   - In reduced motion mode:
     - Entrance line transform is bypassed; text renders immediately at resting position.
     - 3D perspective rotation, Z-depth translation, and width-axis scrub are disabled. Font width remains stable at wide setting (`'wdth' 125`).
     - About paragraph sentences render at 100% full opacity immediately.
     - Profile photo parallax offset is disabled (`transform: none`).

5. **Profile Photo Asset Optimization:**
   - In accordance with the owner's directive (*"do not use this old profile picture ill provide another later for now keep in a placeholder"*), served clean vector placeholder silhouette avatar at `public/media/avatar.svg` (289 bytes, $0.28\text{ KB}$, well under the $60\text{ KB}$ ceiling) with matching WebP companion `public/media/avatar.webp` ($2.25\text{ KB}$).
   - Configured with `width={400}`, `height={400}`, `alt="Bakhtiar Abid Laskar"`, and `loading="lazy"`.

6. **Comprehensive Automated Playwright Verification & Screenshots:**
   - Built automated test harness `scripts/qa-phase5.mjs` (registered as `npm run test:qa-phase5`).
   - Built visual capture script `scripts/capture-phase5.mjs` verifying:
     - [hero-desktop-1440.png](file:///d:/portfolio/reports/phase5/hero-desktop-1440.png)
     - [hero-mobile-390.png](file:///d:/portfolio/reports/phase5/hero-mobile-390.png)
     - [hero-scrolled-wdth.png](file:///d:/portfolio/reports/phase5/hero-scrolled-wdth.png)
     - [about-desktop-1440.png](file:///d:/portfolio/reports/phase5/about-desktop-1440.png)
     - [about-mobile-390.png](file:///d:/portfolio/reports/phase5/about-mobile-390.png)
     - [reduced-motion-hero-about.png](file:///d:/portfolio/reports/phase5/reduced-motion-hero-about.png)

---

## 2. Files Created or Changed

| File | Status | Description |
|---|---|---|
| [src/components/Hero/Hero.tsx](file:///d:/portfolio/src/components/Hero/Hero.tsx) | Created | Hero section with line mask entrance and Moment A 3D scroll scrub |
| [src/components/Hero/Hero.module.css](file:///d:/portfolio/src/components/Hero/Hero.module.css) | Created | Hero responsive layout, line-mask styling, control tokens |
| [src/components/About/About.tsx](file:///d:/portfolio/src/components/About/About.tsx) | Created | About section with scrubbed line reveal and profile photo depth offset (Moment D) |
| [src/components/About/About.module.css](file:///d:/portfolio/src/components/About/About.module.css) | Created | About grid, typography scale, media frame tokens |
| [src/components/Shell/Shell.tsx](file:///d:/portfolio/src/components/Shell/Shell.tsx) | Modified | Replaced placeholder hero/about sections with dedicated components |
| [src/components/Header/Header.module.css](file:///d:/portfolio/src/components/Header/Header.module.css) | Modified | Stabilized nav layout to eliminate font-swap layout shift |
| [src/styles/tokens.css](file:///d:/portfolio/src/styles/tokens.css) | Modified | Applied base `--font-family-primary` to `html, body` elements |
| [src/app/layout.tsx](file:///d:/portfolio/src/app/layout.tsx) | Modified | Added `archivo.className` to `<body>` |
| [src/motion/registry.ts](file:///d:/portfolio/src/motion/registry.ts) | Modified | Scoped trigger lifecycle cleanup and added `ScrollTrigger.refresh()` on Lenis init |
| [eslint.config.mjs](file:///d:/portfolio/eslint.config.mjs) | Modified | Configured `@next/next/no-img-element: off` for static export image pipeline |
| [package.json](file:///d:/portfolio/package.json) | Modified | Added `"test:qa-phase5"` script |
| [scripts/qa-phase5.mjs](file:///d:/portfolio/scripts/qa-phase5.mjs) | Created | Automated Playwright QA test suite for Phase 5 |
| [scripts/capture-phase5.mjs](file:///d:/portfolio/scripts/capture-phase5.mjs) | Created | Screenshot generator across viewports |

---

## 3. Decisions Made

1. **Font Axis Reality Verification:** Verified in built CSS and runtime tests that Archivo's variable font file explicitly defines `font-stretch: 62% 125%` and responds to `font-variation-settings: 'wdth' <number>`. Width decreases by $303.5\text{px}$ on `<h1>` between settings `125` and `85`.
2. **Zero Layout Shift Engineering:** Set baseline CSS with full opacity and `display: block` inside `overflow: hidden` line wrappers so that slow network or JS-disabled clients render text instantly without pop-in or layout shift. Stabilized the desktop navigation width to guarantee that font swapping introduces $0.0000$ CLS.
3. **Scroll Scrub Start Offset:** Adjusted Hero ScrollTrigger start boundary to `top 70px` to account for the sticky header height, ensuring that width condensation begins immediately as the user scrolls away from the top.

---

## 4. Unverified Items

- None. All requirements verified with automated tests, devtools measurements, and visual screenshot captures.

---

## 5. Binary QA Checklist

| QA Item | Result | Evidence / Details |
|---|---|---|
| Hero fully readable before any animation completes (no invisible text on slow load) | **PASS** | Verified with JS disabled (`javaScriptEnabled: false`): `#hero-name` visible (opacity 1.0, display block), role visible (opacity 1.0). Both fully readable in raw HTML. |
| `wdth` axis verified in computed styles while scrolling | **PASS** | Top: `"wdth" 125` (wdth: 125) $\rightarrow$ Scrolled: `"wdth" 106.4` (wdth: 106.4) $\rightarrow$ End: `"wdth" 90.1`. Real-time condensation confirmed in Playwright. |
| No layout shift (CLS 0) during the entrance | **PASS** | Measured via PerformanceObserver: `Observed CLS: 0` ($0.0000000$). |
| Reduced-motion variant verified with the OS setting emulated | **PASS** | With `prefers-reduced-motion: reduce`: `H1 static: true, Role static: true, Photo static: true, Group static: true, All about lines opacity 1: true`. Captured in [reduced-motion-hero-about.png](file:///d:/portfolio/reports/phase5/reduced-motion-hero-about.png). |
| Hero image or text is the LCP element and LCP under 2.5 s on the throttled mobile profile | **PASS** | Evaluated on mobile viewport (390x844) with Fast 3G throttling (150ms RTT, 1.6 Mbps) and 4x CPU slowdown: LCP Element is `#hero-name` headline, Render time: **1.06s** (Target $< 2.5\text{s}$). |
| Profile photo served under 60 KB at the largest size with correct alt | **PASS** | File: `/media/avatar.svg`, Size: **0.28 KB** ($289\text{ bytes} < 60\text{ KB}$), Alt: `"Bakhtiar Abid Laskar"`, Dimensions: `400x400`. |

---

## 6. Open Questions for Owner

- None for Phase 5. Phase 6 (Projects corridor: moments B and C) is ready to begin upon approval.

---

**STOP.** Awaiting owner reply: `APPROVED PHASE 5`.
