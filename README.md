# Bakhtiar Abid Laskar | Full-Stack Developer & Software Engineer

<p align="center">
  <a href="https://bakhtiarabidlaskar.tech">
    <img src="https://img.shields.io/badge/Live%20Portfolio-bakhtiarabidlaskar.tech-DCFF50?style=for-the-badge&labelColor=080808" alt="Live Portfolio" />
  </a>
  <a href="https://github.com/Bakhtiar-Abid-Laskar/portfolio_bakhtiar">
    <img src="https://img.shields.io/badge/Source%20Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>
</p>

A custom-built personal portfolio developed with **Next.js, React, TypeScript, GSAP, and Lenis**. The project presents selected production websites, an internal management platform, an academic resource portal, and a Power BI analytics dashboard through a data-driven portfolio architecture.

The application uses a reusable component structure, centralized site configuration, typed project metadata, shared CSS design tokens, and automated content validation. It is configured for static export and deployment through GitHub Pages.

**Live website:** https://bakhtiarabidlaskar.tech

**Repository:** [Bakhtiar-Abid-Laskar/portfolio_bakhtiar](https://github.com/Bakhtiar-Abid-Laskar/portfolio_bakhtiar)

---

## Table of Contents

* [Project Overview](#project-overview)
* [Technical Stack](#technical-stack)
* [Application Architecture](#application-architecture)
* [Portfolio Projects](#portfolio-projects)
* [Animation and Interaction System](#animation-and-interaction-system)
* [Design System](#design-system)
* [Static Export and Deployment](#static-export-and-deployment)
* [Getting Started](#getting-started)
* [Available Scripts](#available-scripts)
* [Content Validation](#content-validation)
* [Environment Configuration](#environment-configuration)
* [Performance and Accessibility](#performance-and-accessibility)
* [Project Structure](#project-structure)
* [Development Workflow](#development-workflow)
* [Author and Contact](#author-and-contact)

## Project Overview

This repository contains the source code for my personal developer portfolio.

The application is designed to present technical work through structured project data rather than hardcoding each project directly into the page. Site metadata, professional information, project definitions, styling tokens, and motion configuration are maintained in dedicated modules.

The portfolio showcases work across:

* Corporate and business websites.
* Healthcare websites and administration platforms.
* Internal business management systems.
* Cross-platform mobile applications.
* Student academic resource platforms.
* Business intelligence and data visualization.

The project also includes automated checks for project metadata, media availability, TypeScript correctness, linting, and deployment builds.

## Technical Stack

| Technology            | Role in the project                                                  |
| --------------------- | -------------------------------------------------------------------- |
| Next.js 15            | React application framework and static-site export                   |
| React 19              | Component-based user interface                                       |
| TypeScript 5          | Typed application code and project metadata                          |
| GSAP 3                | Scroll-driven animation and motion orchestration                     |
| Lenis                 | Smooth scrolling                                                     |
| CSS                   | Design tokens, responsive layouts, visual styling, and 3D transforms |
| Node.js               | Build scripts, content validation, and asset processing              |
| Sharp                 | Image processing and media optimization tooling                      |
| Playwright            | Browser automation and visual quality-assurance tooling              |
| ESLint                | Static code analysis                                                 |
| GitHub Actions        | Automated validation, build, and deployment workflow                 |
| GitHub Pages          | Static hosting deployment target                                     |
| Netlify configuration | Additional static-build configuration                                |

### Package Dependencies

The project's `package.json` defines the following runtime dependencies:

```json
{
  "next": "^15.2.1",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "gsap": "^3.12.7",
  "lenis": "^1.1.20"
}
```

Development dependencies include TypeScript, React and Node.js type definitions, ESLint, `eslint-config-next`, Sharp, and Playwright Test.

The repository uses npm with a committed lockfile for dependency installation.

## Application Architecture

### 1. Next.js App Router

The main application entry point is:

`src/app/page.tsx`

The page delegates rendering to the reusable `Shell` component rather than containing the complete portfolio implementation in the route file.

This keeps the route layer lightweight and separates page composition from individual interface components.

### 2. Centralized Site Configuration

**File:** `src/config/site.ts`

The site configuration defines the portfolio's shared metadata, including:

* Site name and alternate name variants.
* Page title, headline, and description.
* Website and canonical URLs.
* Configurable base path.
* Locale and professional title.
* Education and location metadata.
* Search keywords.
* GitHub and LinkedIn links.
* Email and telephone contact links.

The base path and canonical URL are derived from environment variables, with defaults defined in the configuration.

### 3. Typed Project Catalogue

**File:** `src/content/projects.ts`

Portfolio projects are represented using a TypeScript `Project` type.

Each project contains:

* `id` — unique project identifier.
* `order` — explicit display order.
* `name` — project title.
* `kind` — project category.
* `summary` — concise project description.
* `stack` — technologies used.
* `links` — optional live URL and required source repository.
* `status` — project availability classification.
* `media` — image path, alternative text, width, and height.

The project status type is:

```ts
type ProjectStatus = 'live' | 'internal' | 'archive';
```

The actual project type is defined in `src/content/projects.ts` and also specifies the nested link and media structures.

This approach provides a consistent schema for rendering project information and validating content before deployment.

### 4. Shared Design Tokens

**File:** `src/styles/tokens.css`

The design system uses CSS custom properties to centralize colors, typography, spacing, radii, shadows, breakpoints, focus indicators, and animation timing.

The stylesheet also contains foundational rules for layout sizing, text rendering, responsive overflow, focus visibility, image sizing, and scrollbar styling.

### 5. Motion Configuration

The repository separates motion-related configuration and registration from the page's content. The architecture documented in `PORTFOLIO_REBUILD_MASTER_PROMPT.md` identifies these modules:

* `src/motion/tokens.ts` — animation durations, easing, distances, and perspective values.
* `src/motion/registry.ts` — shared GSAP ScrollTrigger and Lenis registration.

These modules provide a central location for motion settings and lifecycle management.

## Portfolio Projects

The project catalogue contains six projects in an explicitly defined order.

### 1. Avalin Laboratories

**Type:** Corporate website

A responsive corporate website built with Next.js and React, using TypeScript and Tailwind CSS. The project focuses on product-led content, consistent visual presentation, and navigation across desktop, tablet, and mobile.

* **Stack:** Next.js, React, TypeScript, Tailwind CSS
* **Live:** [avalinlaboratories.com](https://www.avalinlaboratories.com/)
* **Source:** [AVALIN-LABORTORIES](https://github.com/Bakhtiar-Abid-Laskar/AVALIN-LABORTORIES)

### 2. Nilakshith Enterprises

**Type:** Business website

A business website for broadband, Wi-Fi, CCTV installation, and networking services serving Silchar, Karimganj, and Hailakandi.

The implementation includes dedicated service pages, enquiry and WhatsApp contact flows, technical SEO work, optimized images, and critical CSS.

* **Stack:** HTML, CSS, JavaScript, Node.js build tooling, Vercel
* **Live:** [nilakshithenterprise.com](https://www.nilakshithenterprise.com/)
* **Source:** [Nilakshith-Enterprises](https://github.com/Bakhtiar-Abid-Laskar/Nilakshith-Enterprises)

### 3. South City Hospital

**Type:** Healthcare website and administration portal

A healthcare website serving patients across the Barak Valley. The project uses a Turborepo monorepo architecture with a public Next.js website and a separate administration portal backed by Supabase.

The public website includes healthcare content such as departments, doctors, facilities, booking, and related informational sections.

* **Stack:** Next.js, React, TypeScript, Tailwind CSS, Supabase, Turborepo
* **Live:** [southcityhospital.in](https://www.southcityhospital.in/)
* **Source:** [SouthCityHospital](https://github.com/Bakhtiar-Abid-Laskar/SouthCityHospital)

### 4. Digital Solution Internal Management System

**Type:** Internal business operations platform

An internal management platform for a consumer electronics repair business. The architecture combines a Next.js administration interface with an Expo and React Native mobile application, sharing a Supabase backend.

The documented workflows cover customer intake, job assignment, billing, inventory, attendance, and notifications. The project also uses database-level identifiers and row-level security.

* **Stack:** Next.js, React, TypeScript, Expo, React Native, Supabase, PostgreSQL, Recharts, Leaflet
* **Deployment:** Internal system; no public live URL is listed in the project catalogue.
* **Source:** [DIGITAL-SOLUTION-INTERNAL-MANAGEMENT-SYSTEM](https://github.com/Bakhtiar-Abid-Laskar/DIGITAL-SOLUTION-INTERNAL-MANAGEMENT-SYSTEM)

### 5. USTM Academia

**Type:** Student resource portal

An academic resource portal for University of Science and Technology Meghalaya students. It organizes previous-year question papers and syllabi by course, semester, and subject.

The documented implementation includes Algolia instant search, browser-based PDF viewing using Google Drive, an installable progressive web app, and a Supabase-backed administration workflow.

* **Stack:** Next.js, TypeScript, Tailwind CSS, Supabase, Algolia, Google Drive API, Vercel
* **Live:** [ustm-academia.vercel.app](https://ustm-academia.vercel.app/)
* **Source:** [USTM_academia](https://github.com/Bakhtiar-Abid-Laskar/USTM_academia)

### 6. E-Commerce Sales Analysis Dashboard

**Type:** Data analytics and business intelligence

An interactive Microsoft Power BI dashboard for analyzing e-commerce sales performance, including state-wise sales, customer behavior, product performance, profitability, and geographic distribution.

* **Stack:** Microsoft Power BI, DAX, data analysis, data visualization
* **Live:** No public live deployment is listed.
* **Source:** [Ecommerce-Sales-Analysis-Dashboard-Using-MS-Power-BI](https://github.com/Bakhtiar-Abid-Laskar/Ecommerce-Sales-Analysis-Dashboard-Using-MS-Power-BI)

## Animation and Interaction System

The project uses GSAP and Lenis to support its motion and scrolling architecture.

### GSAP

GSAP provides the animation engine for coordinated transitions and scroll-driven effects. The repository's design specification describes the use of `ScrollTrigger` for connecting animation progress to scroll position.

### Lenis

Lenis provides smooth scrolling. Its integration is intended to work with the GSAP ticker, while preserving browser navigation and keyboard scrolling behavior.

### CSS 3D Transforms

The specified animation approach uses CSS perspective and 3D transforms rather than requiring a WebGL rendering engine.

Relevant transform properties include:

* `perspective`
* `translate3d()`
* `rotateX()`
* `rotateY()`
* `translateZ()`

### Reduced-Motion and Device Adaptation

The design specification calls for reduced-motion support and simplified behavior on touch devices and smaller screens. It also describes lifecycle cleanup for animation contexts and scroll triggers.

The precise behavior of each interaction should be verified against the corresponding implementation in `src/`.

## Design System

The shared design tokens define a dark interface with a restrained electric-lime accent.

### Color Palette

| Token                   | Value     | Purpose                     |
| ----------------------- | --------- | --------------------------- |
| `--color-bg`            | `#080808` | Primary page background     |
| `--color-surface`       | `#0E0E0E` | Raised surfaces             |
| `--color-elevated`      | `#141414` | Elevated interface elements |
| `--color-text`          | `#EFEFEF` | Primary text                |
| `--color-text-muted`    | `#A3A3A3` | Secondary text              |
| `--color-text-dim`      | `#888888` | Tertiary text               |
| `--color-accent`        | `#DCFF50` | Primary accent              |
| `--color-status-active` | `#4ADE80` | Active status               |

### Typography

The design tokens define three font roles:

* Display typography using Space Grotesk.
* Body typography using Inter.
* Monospaced text using JetBrains Mono.

The tokens also establish a responsive display scale, line heights, letter spacing, and maximum body-text line length.

### Responsive Breakpoints

The stylesheet defines the following breakpoint tokens:

| Token              |  Value |
| ------------------ | -----: |
| `--breakpoint-sm`  |  640px |
| `--breakpoint-md`  |  768px |
| `--breakpoint-lg`  | 1024px |
| `--breakpoint-xl`  | 1280px |
| `--breakpoint-2xl` | 1440px |

These values are available to the styling system for responsive layout decisions.

## Static Export and Deployment

The project is configured for static export through `next.config.mjs`.

Relevant settings include:

```js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: basePath ? basePath : undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  reactStrictMode: true,
};
```

Static export generates deployable files in the `out/` directory. Next.js image optimization is disabled in this configuration, so image optimization is handled separately when needed.

### GitHub Actions

The workflow at `.github/workflows/static.yml` is configured to:

1. Run on pushes to `main` or manual dispatch.
2. Check out the repository.
3. Set up Node.js 22.
4. Install dependencies using `npm ci`.
5. Run prebuild content validation.
6. Check that raw hexadecimal colors are centralized in the design tokens.
7. Run TypeScript type checking.
8. Run ESLint.
9. Build the static export.
10. Upload the `out/` directory as a Pages artifact.
11. Deploy the artifact to GitHub Pages.

The build receives the base path and canonical site URL through environment variables.

### Netlify Configuration

The repository also contains `netlify.toml`, which configures:

* Build command: `npm run build`
* Publish directory: `out`
* Response security headers.
* Long-lived immutable caching for `/_next/static/*` assets.

The GitHub Actions workflow is the repository's documented GitHub Pages deployment path. The presence of Netlify configuration does not, by itself, establish that Netlify is the active production host.

## Getting Started

### Prerequisites

Install the following tools:

* Node.js 22, matching the repository's GitHub Actions environment.
* npm.
* Git.
* A code editor such as Visual Studio Code.

### 1. Clone the Repository

```bash
git clone https://github.com/Bakhtiar-Abid-Laskar/portfolio_bakhtiar.git
cd portfolio_bakhtiar
```

### 2. Install Dependencies

```bash
npm ci
```

This installs dependencies from the committed npm lockfile.

### 3. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Run Content Validation

```bash
npm run prebuild
```

This runs the project-content validation script before the production build.

### 5. Type-Check the Application

```bash
npm run typecheck
```

### 6. Build the Static Site

```bash
npm run build
```

The Next.js static export is written to `out/` when the build succeeds.

### 7. Preview the Generated Output

Serve the generated `out/` directory with a local static HTTP server to test the exported site. When validating a project-page deployment, make sure the configured base path matches the intended hosting URL.

## Available Scripts

The following scripts are defined in `package.json`.

| Command                   | Purpose                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `npm run dev`             | Start the Next.js development server                               |
| `npm run prebuild`        | Validate project content and media                                 |
| `npm run build`           | Build the Next.js application and static export                    |
| `npm run start`           | Start the Next.js production server command defined by the project |
| `npm run lint`            | Run the configured Next.js lint command                            |
| `npm run typecheck`       | Run TypeScript without emitting files                              |
| `npm run test:validation` | Run content-validation failure tests                               |
| `npm run test:qa-phase4`  | Run phase 4 QA script                                              |
| `npm run test:qa-phase5`  | Run phase 5 QA script                                              |
| `npm run test:qa-phase6`  | Run phase 6 QA script                                              |
| `npm run test:qa-phase7`  | Run phase 7 QA script                                              |
| `npm run test:qa-phase8`  | Run phase 8 QA script                                              |
| `npm run test:qa-phase9`  | Run phase 9 QA script                                              |

The QA scripts are repository-defined commands. Their names identify the corresponding QA phase; consult each script for its exact checks and expected outputs.

## Content Validation

**Script:** `scripts/validate-content.mjs`

The prebuild validator checks the portfolio's structured project data before the build proceeds.

It verifies that:

* Exactly six projects are defined.
* Project ordering is exactly `1` through `6`, without duplicates or gaps.
* Every project has a non-empty source repository URL.
* Any supplied live URL uses HTTPS.
* Every project has a valid summary of no more than 45 words.
* Every referenced project media file exists in the `public/` directory.

If validation fails, the script reports the relevant errors and exits with a non-zero status, preventing the build from continuing successfully.

This helps keep the portfolio's project catalogue consistent and reduces the risk of missing media or incomplete project links reaching deployment.

## Environment Configuration

The site configuration and GitHub Actions workflow use the following environment variables:

| Variable                    | Purpose                                                      |
| --------------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_BASE_PATH`     | Configures the deployment base path                          |
| `NEXT_PUBLIC_SITE_URL`      | Defines the site origin used to construct the configured URL |
| `NEXT_PUBLIC_CANONICAL_URL` | Defines the canonical website origin                         |

The base path is normalized to remove a trailing slash before being used in the Next.js configuration.

The GitHub Actions workflow supplies the Pages base path during the build and sets both site URL variables to `https://www.bakhtiarabidlaskar.tech`.

For local development, these variables can be set in the shell or through an appropriate local environment file if needed. Do not commit credentials, private keys, access tokens, or other secrets.

## Performance and Accessibility

The repository's configuration and design system support several engineering practices.

### Image Handling

* Sharp is included as a development dependency.
* Source assets are organized separately from generated public media.
* Project metadata includes image dimensions and alternative text.
* The project documentation defines an image pipeline for producing optimized media.

### Accessibility

The design tokens define visible keyboard focus styling and a screen-reader-only utility. The documented interaction requirements also call for reduced-motion handling and preserving keyboard scrolling.

### Browser and Build Quality

* TypeScript checks help detect type errors.
* ESLint provides static analysis.
* The prebuild validator checks project metadata and media references.
* Playwright is available for browser automation and quality-assurance tooling.
* The deployment workflow runs validation before publishing the generated site.

These mechanisms support quality control, but their presence alone does not establish a particular Lighthouse score, accessibility certification, or performance result.

## Project Structure

The repository's top-level structure includes the following directories and files:

```text
portfolio_bakhtiar/
├── .github/
│   └── workflows/
│       └── static.yml
├── assets-src/
├── legacy/
├── public/
├── reports/
├── scripts/
│   ├── validate-content.mjs
│   └── ...
├── src/
│   ├── app/
│   │   └── page.tsx
│   ├── config/
│   │   └── site.ts
│   ├── content/
│   │   └── projects.ts
│   ├── styles/
│   │   └── tokens.css
│   └── ...
├── .gitignore
├── eslint.config.mjs
├── netlify.toml
├── next.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
├── PORTFOLIO_REBUILD_MASTER_PROMPT.md
└── README.md
```

The `...` entries indicate additional files and directories omitted from this abbreviated tree. The complete source tree is available in the [GitHub repository](https://github.com/Bakhtiar-Abid-Laskar/portfolio_bakhtiar).

## Development Workflow

For changes to the portfolio:

1. Create a feature branch.
2. Update the relevant component, configuration, content, or styling module.
3. Run the relevant content-validation and type-check commands.
4. Run linting and the relevant QA scripts.
5. Build the static export.
6. Test navigation, responsive layouts, project links, and reduced-motion behavior.
7. Review the generated output before merging changes into the deployment branch.

Example:

```bash
git checkout -b feature/portfolio-update

npm run prebuild
npm run typecheck
npm run build

git add .
git commit -m "Update portfolio content and layout"
git push -u origin feature/portfolio-update
```

Run `npm run lint` as well when checking the repository's lint configuration. Use the branch and pull-request workflow appropriate to the repository's current maintenance process.

## Author and Contact

**Bakhtiar Abid Laskar**

* Portfolio: [bakhtiarabidlaskar.tech](https://bakhtiarabidlaskar.tech)
* GitHub: [Bakhtiar-Abid-Laskar](https://github.com/Bakhtiar-Abid-Laskar)
* LinkedIn: [bakhtiar-abid-laskar](https://www.linkedin.com/in/bakhtiar-abid-laskar/)
* Email: [bakhtiarabidlaskar1@gmail.com](mailto:bakhtiarabidlaskar1@gmail.com)

---

*Personal portfolio source code for showcasing software engineering projects, application architecture, and development work.*
