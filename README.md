# Bakhtiar Abid Laskar — Developer Portfolio

Personal developer portfolio for Bakhtiar Abid Laskar, showcasing production web applications, cross-platform mobile systems, and data analysis dashboards. Built from the ground up with a focus on editorial depth, spatial motion engineering, WCAG accessibility, and high performance.

## Architecture & Technology Stack

- **Framework:** Next.js 15 (App Router, `output: 'export'` static site generation)
- **Language:** TypeScript 5 (Strict mode)
- **Styling:** CSS Modules with single-source-of-truth CSS custom properties (`src/styles/tokens.css`)
- **Motion Engineering:** GSAP 3 + ScrollTrigger synchronized with Lenis smooth scroll ticker (`src/motion/`)
- **Typography:** Self-hosted Google Font Archivo (variable font with width-axis `wdth` support)
- **Testing & Verification:** Playwright (Chromium, WebKit, Firefox), Axe-Core accessibility engine, Lighthouse CI

## Key Scroll Moments

1. **Moment A (Hero Exit):** 3D perspective tilt (`rotateX`, `translateZ`) coupled with real-time `wdth` axis font condensation ($125 \rightarrow 85$).
2. **Moment B (Projects Corridor):** Hardware-accelerated 3D camera translation along the Z-axis with approach card rotation, dwell holds, and a scrubbed background crossfade from cool fog to deep blue. (Gracefully degrades to an accessible stacked reveal on touch devices and reduced motion).
3. **Moment C (Media Depth):** Layered 3D pointer tilt on project cards for fine-pointer devices.
4. **Moment D (About Reveal):** Scrubbed line-by-line typographic text reveal and subtle parallax photo depth offset.
5. **Moment E (Closing):** Oversized closing name rise rotating from $70^\circ$ to $0^\circ$ on a $1000\text{px}$ 3D stage.

## Repository Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD GitHub Pages deployment workflow
├── assets-src/                   # High-resolution source captures & diagrams
├── legacy/                       # Preserved baseline v1 assets
├── public/                       # Static public assets, favicons, OG preview
│   ├── media/                    # Optimised WebP/PNG images and SVG diagrams
│   └── favicon.ico               # Multi-resolution favicon set
├── reports/                      # Phase-by-phase verification & QA reports
│   ├── PHASE_0_AUDIT.md
│   ├── ...
│   ├── PHASE_9_REPORT.md
│   ├── PHASE_10_REPORT.md
│   └── ROLLBACK.md               # Production rollback procedures
├── scripts/                      # Validation, screenshot capture & QA suites
│   ├── validate-content.mjs      # Prebuild data integrity validator
│   ├── qa-phase8.mjs             # Performance & accessibility test suite
│   ├── qa-phase9.mjs             # Rejection test & link health checks
│   └── static-server.mjs         # Local production preview server
├── src/
│   ├── app/                      # Next.js App Router (layout, page, icons)
│   ├── components/               # Modular UI components (Hero, Projects, etc.)
│   ├── config/                   # Site config & base path resolution
│   ├── content/                  # Single sources of truth for profile & projects
│   ├── motion/                   # GSAP motion tokens & ticker registry
│   ├── styles/                   # Design system tokens and reset
│   └── utils/                    # Build-time helpers (dynamic copyright year)
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10

### Development

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Content Validation & Build

Validate project schemas and compile the production static export:

```bash
npm run build
```

The exported static site is generated in the `out/` directory.

### Running Quality Assurance Suites

```bash
npm run test:validation   # Validates content schemas and failure states
npm run test:qa-phase8     # Runs cross-browser, axe accessibility, and CWV tests
npm run test:qa-phase9     # Runs rejection test and link health checks
```

## Performance & Accessibility Standards

- **Core Web Vitals:** LCP $< 1.0\text{s}$, CLS $< 0.01$, TBT $< 100\text{ms}$ on throttled mobile profiles.
- **Accessibility:** 100% WCAG 2.1 AA compliance verified via `axe-core` (0 critical, 0 serious violations).
- **Bundle Efficiency:** First-load JavaScript bundle size under 160 KB gzipped.
- **Touch Targets:** All interactive controls verified $\ge 44\times 44\text{px}$.

## License

MIT © Bakhtiar Abid Laskar
