# PORTFOLIO REBUILD: MASTER PROMPT FOR ANTIGRAVITY

Owner: Bakhtiar Abid Laskar
Target repo: `Bakhtiar-Abid-Laskar/bakhtiarabidlaskar.github.io`
Current live URL: `https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/`
Document version: 1.0

---

## 0. HOW TO READ AND EXECUTE THIS DOCUMENT

You are rebuilding a personal developer portfolio from scratch. Read this entire document before touching any file. Then execute it phase by phase.

### 0.1 Operating rules (non-negotiable)

1. **Audit first.** Phase 0 is read-only. You write nothing except the audit report.
2. **Approval gates.** Every phase ends with a STOP. You present the phase report and wait for the owner to reply with the exact phrase `APPROVED PHASE <n>`. Do not start the next phase on silence, on a "looks good", or on your own judgement.
3. **One phase at a time.** Never pre-build work from a later phase.
4. **No hardcoded values.** Copy, links, colours, spacing, font sizes, durations, easings, breakpoints, URLs and the base path each live in exactly one source of truth (defined in Phase 1 to 3). Components read from that source. A literal in a component that duplicates a token or a content value is a defect.
5. **No invented facts.** Every claim on the site (descriptions, stack, links, dates, numbers) must come from Section 3 of this document, from the repos, or from the owner. If you cannot verify something, leave it out and list it in the phase report under "Unverified". Never invent metrics, client counts, testimonials, years, awards or percentages.
6. **No new dependencies without listing them.** Only the dependencies in Section 4.2 are pre-approved. Anything else goes in the phase report with a one-line justification and waits for approval.
7. **Branch discipline.** Tag the current `main` as `v1-legacy` before any change. Do all work on branch `rebuild/v2`. Never force-push. Never touch `main` until Phase 10 is approved.
8. **Binary QA.** Every phase has a checklist. Each line is PASS or FAIL, with the evidence (command output, screenshot path, measured number). "Mostly", "should", "looks fine" and "N/A without a reason" are FAIL.
9. **Report format.** Each phase produces `reports/PHASE_<n>_REPORT.md` with: what was done, files created or changed, decisions made, Unverified items, QA checklist results, open questions for the owner.
10. **If blocked or in doubt, stop and ask.** Do not guess. One precise question beats a wrong assumption.

### 0.2 Skill loading

Before Phase 2, check the workspace for a UI/UX or frontend-design skill (for example under `.agents/skills/`). If one exists, load it and treat it as binding alongside Section 5. If none exists, Section 5 is the complete design brief. Where the skill and Section 5 disagree on a specific, Section 5 wins because it was written for this brief.

---

## 1. MISSION

Replace the current single-file portfolio with a professional, modern, fast, fully responsive site that:

1. Presents the owner as a working developer who ships production systems, not as a student with a template.
2. Lists six projects in a fixed order (Section 3.3), each with a brief description, stack, a live link where one exists, and a source link.
3. Uses a small number of purposeful 3D scroll animations that feel hand-built, run at 60fps and degrade cleanly.
4. Does not look AI-generated. Section 5.6 lists the banned patterns. Treat that list as a rejection test.
5. Deploys to GitHub Pages as a fully static site.

Keep from the current site: the owner's identity, contact details, social links, education, skills and the Power BI project. Everything else is rebuilt.

---

## 2. CURRENT SITE (for reference, from the repo as of this document)

- Files: `index.html`, `styles.css`, `profile.jpg` (185 KB), `README.md`, `.github/workflows/static.yml`. One commit.
- Known defects to fix, not preserve: references `favicon.ico` which does not exist; README lists `style.css` and an `images/` folder which do not exist; stray `<h2>` tag instead of closing `</h2>` in the sidebar; no meta description, no Open Graph, no structured data; 185 KB unoptimised profile image.
- Existing content to carry over (see Section 3.1 and 3.2).

---

## 3. CONTENT SOURCE OF TRUTH

This section is the only approved content. Copy it into the content layer in Phase 1. Tighten wording if needed, but do not add claims.

### 3.1 Identity and contact (carry over from current site)

- Name: Bakhtiar Abid Laskar
- University line: B.Tech CSE, University of Science and Technology Meghalaya
- Location: India (the owner is connected to Silchar, Assam; do not publish a more specific location unless the owner approves)
- Email: bakhtiarabidlaskar1@gmail.com
- Phone: +91 9101607353
- LinkedIn: https://www.linkedin.com/in/bakhtiar-abid-laskar/
- GitHub: https://github.com/Bakhtiar-Abid-Laskar
- Profile photo: `profile.jpg` from the current repo (re-export optimised; keep original untouched in `legacy/`)

### 3.2 Current About, Education, Skills (carry over, flagged for owner decisions)

About (current text, to be tightened at the Phase 1 gate, facts unchanged):
> Aspiring B.Tech Computer Science Engineering student with a strong passion for Artificial Intelligence, Machine Learning, Web Development, and Data Analysis. I'm driven by curiosity and enjoy applying theoretical knowledge to solve real-world problems. I have a solid foundation in programming, data structures, and algorithms, and am always eager to learn and explore emerging technologies.

Education:
- B.Tech in Computer Science & Engineering, University of Science and Technology Meghalaya (present)
- Class 12, Narsing HS School Silchar, 59% (2021 to 2023)
- Class 10, M.A.C. Memorial Academy, 70.33% (2021)

Skills (current): C, Python, MS Power BI, MS Office, Canva.

**Owner decisions required at the Phase 1 gate (ask, do not decide):**
- D1. The current skills list omits the stack used in the five new projects. Propose an updated list grouped by what the owner actually used (candidates evidenced by the repos: Next.js, React, TypeScript, Tailwind CSS, Node.js, Supabase, Expo and React Native, HTML, CSS, JavaScript; plus the existing C, Python, Power BI, MS Office, Canva). The owner confirms the final list, and may add C++ or others.
- D2. Show or hide the Class 10 and Class 12 percentages.
- D3. Keep the phone number public, or show email only.
- D4. Role line in the hero. Present three candidate lines grounded in the projects (for example, one that leads with web and full-stack work, one that leads with data and Power BI). The owner picks one. Do not default to "AI & ML" unless the owner chooses it, because none of the six projects is an AI or ML project.
- D5. Hosting URL: keep the current project-page URL, or rename the repo to `bakhtiar-abid-laskar.github.io` so the site serves from the root (cleaner URL, but changes the public link used on LinkedIn and elsewhere). Default if no answer: keep the current URL.

### 3.3 Projects (this exact order, then the legacy project last)

Descriptions below are the approved brief versions. Stack lists are taken from each repo's package files and README. Live links come from each repo's README.

**Project 1: Avalin Laboratories**
- Type: Corporate website, in production
- Description: Corporate website for Avalin Laboratories. A responsive Next.js platform with a consistent design system, structured product-led sections and clear navigation across desktop, tablet and mobile.
- Stack: Next.js, React, TypeScript, Tailwind CSS
- Live: https://www.avalinlaboratories.com/
- Source: https://github.com/Bakhtiar-Abid-Laskar/AVALIN-LABORTORIES (the repo name is misspelled; use the URL exactly as given, display the name correctly)

**Project 2: Nilakshith Enterprises**
- Type: Business website, in production
- Description: Website for a broadband, WiFi and CCTV installation business serving Silchar, Karimganj and Hailakandi. Dedicated service pages for broadband, CCTV and networking, enquiry and WhatsApp contact flows, technical SEO, optimised images and critical CSS, deployed on Vercel.
- Stack: HTML, CSS, JavaScript, Node.js build tooling (sharp, clean-css, uglify-js), Vercel
- Live: https://www.nilakshithenterprise.com
- Source: https://github.com/Bakhtiar-Abid-Laskar/Nilakshith-Enterprises

**Project 3: South City Hospital**
- Type: Healthcare website and admin portal, in production
- Description: Website for South City Hospital, serving patients across Silchar and the Barak Valley. A Turborepo and pnpm monorepo with a public Next.js site (departments, doctors, facilities, testimonials, FAQ, gallery, booking) and a separate admin portal sharing typed data models, backed by Supabase. Includes security and launch audits.
- Stack: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Supabase, Turborepo, pnpm
- Live: https://www.southcityhospital.in/
- Admin portal: the repo plans `admin.southcityhospital.in`. Do not link it. Check in Phase 1 whether it is publicly reachable and report; the owner decides.
- Source: https://github.com/Bakhtiar-Abid-Laskar/SouthCityHospital

**Project 4: Digital Solution Internal Management System**
- Type: Internal operations platform (web and mobile)
- Description: Management system for a consumer electronics repair business. A Next.js admin panel and an Expo and React Native mobile app on one Supabase backend. Role-based workflows for admin, receptionist and technician cover customer intake, job assignment, billing and sales, inventory, payroll, geofenced selfie attendance, and push, WhatsApp and email notifications. Row-level security, with job and invoice codes generated in the database.
- Stack: Next.js, React, TypeScript, Expo, React Native, Supabase (Postgres, RLS, Edge Functions), Recharts, Leaflet
- Live: none found. This is an internal system. Show the status "Internal system, no public site" and the source link only. Do not fabricate or guess a URL.
- Source: https://github.com/Bakhtiar-Abid-Laskar/DIGITAL-SOLUTION-INTERNAL-MANAGEMENT-SYSTEM
- Media warning: the repo contains real business data in some files (`db_dump.sql`, a WhatsApp zip, invoice templates). Never use, screenshot or reference those. See Section 6.3.

**Project 5: USTM Academia**
- Type: Student resource portal, live
- Description: Academic resource portal for students of the University of Science and Technology Meghalaya. Previous year question papers and syllabi organised by course, semester and subject, with Algolia instant search, in-browser PDF viewing from Google Drive, an installable PWA, and a Supabase-authenticated admin dashboard with bulk upload.
- Stack: Next.js, TypeScript, Tailwind CSS, Supabase, Algolia, Google Drive API, Vercel
- Live: https://ustm-academia.vercel.app
- Source: https://github.com/Bakhtiar-Abid-Laskar/USTM_academia

**Project 6: E-Commerce Sales Analysis Dashboard (existing project, keep)**
- Type: Data analysis
- Description: Interactive Power BI dashboard analysing sales performance across states, trends, top products, customer behaviour and profitability, using charts and geographic maps.
- Stack: Microsoft Power BI
- Live: none
- Source: https://github.com/Bakhtiar-Abid-Laskar/Ecommerce-Sales-Analysis-Dashboard-Using-MS-Power-BI

Link states: a project card shows "Live site" only when a live URL exists, and always shows "Source". No dead or placeholder buttons.

---

## 4. TECHNICAL DECISIONS

### 4.1 Hosting constraint

The site is hosted on GitHub Pages: static files only. No server runtime, no API routes, no server actions, no form backend. The contact section uses `mailto:`, `tel:` and profile links.

Because the current URL is a project-pages path (`/bakhtiarabidlaskar.github.io/`), every asset and link must resolve under a base path. The base path is read from one environment variable, `NEXT_PUBLIC_BASE_PATH`, set in the build workflow. It is never typed into a component. If the owner approves renaming the repo (decision D5), the variable becomes empty and nothing else changes. Verify this by building with the variable set and unset.

### 4.2 Stack (pre-approved)

- Next.js (current stable, App Router) with `output: 'export'`, TypeScript strict mode. Node >= 20.
- React (version matching the chosen Next.js).
- Styling: CSS Modules plus CSS custom properties. No Tailwind, no component library. Reason: utility and component kits push the output toward a template look.
- Motion: `gsap` with `ScrollTrigger`, and `lenis` for smooth scroll, wired together through the GSAP ticker.
- Font: Archivo (variable, with the width axis) via `next/font/google`, self-hosted at build time.
- Dev only: `sharp` (image pipeline), `@playwright/test` (screenshots and QA), `eslint`, `typescript`.
- No Three.js or WebGL. All 3D is CSS 3D transforms (`perspective`, `translate3d`, `rotateX/Y`) driven by GSAP. A WebGL element may only be proposed at the Phase 2 gate with a concrete concept; it is not approved by default.

### 4.3 Single sources of truth

```
src/config/site.ts          site name, url, basePath (from env), locale, social links
src/content/profile.ts      identity, about, role line, contact, education, skills
src/content/projects.ts     the six projects, typed
src/styles/tokens.css       colour, type scale, spacing, radii, z-index, breakpoints as custom properties
src/motion/tokens.ts        durations, eases, distances, perspective values, scroll distances
src/motion/registry.ts      one place that registers ScrollTrigger and Lenis
```

`projects.ts` schema (all fields required unless marked optional):

```ts
type Project = {
  id: string;              // slug
  order: number;           // 1..6, rendering order comes only from this
  name: string;
  kind: string;            // short type label
  summary: string;         // <= 45 words, from Section 3.3
  stack: string[];
  links: { live?: string; source: string };
  status: 'live' | 'internal' | 'archive';
  media: {
    src: string;           // generated asset path
    alt: string;
    width: number;
    height: number;
  };
};
```

A build-time check (a small script run in `prebuild`) fails the build if: orders are not exactly 1..6 with no gaps, any `links.source` is missing, any `live` URL is not `https`, a summary exceeds 45 words, or any media file is missing.

---

## 5. DESIGN BRIEF

### 5.1 Subject and audience

Subject: a developer from Silchar who has shipped real systems for a laboratory, an ISP and CCTV business, a hospital, a repair shop, and his own university. Audience: hiring managers, clients and collaborators who scan quickly. Primary job of the page: make the six projects easy to understand and open within a minute.

### 5.2 Art direction (locked unless the owner rejects it at the Phase 2 gate)

Avoid the common generated-design defaults: cream paper with a serif and a terracotta accent; near-black with a single acid or vermilion accent; broadsheet hairline columns; identical rounded cards with grey shadows. The direction below is chosen against those.

- Concept: **depth.** Real work seen through a lens with distance. The page starts in cool daylight and travels into a deep blue stage where the projects pass by, then comes back out.
- Palette, as named tokens (verify contrast; adjust a value if it fails, and report the change):
  - `fog` `#DCE3E7` page ground (cool grey-blue)
  - `paper` `#F3F6F7` raised surfaces
  - `ink` `#0F1C26` text on light (deep blue-black, not neutral black)
  - `deep` `#0A2038` the project stage background
  - `cobalt` `#2A45F2` the single accent (links, focus, active states)
  - `mist` `#5C6C78` secondary text on light
  - `haze` `#9FB3C4` secondary text on deep
- Typography: one family, Archivo, with its width and weight axes doing the work. Display uses a wide, heavy setting; body uses a normal width at regular weight. The name in the hero animates its width axis on scroll (Section 5.4, moment A). Type scale as a modular scale defined in `tokens.css`; body line length under 70 characters; sentence case everywhere.
- Layout: left-aligned, asymmetric 12-column grid, generous negative space, one large element per viewport. No centred stacks of identical blocks.
- Radii: two values only, one for controls and one for media frames, defined as tokens.
- Shadows: only where an object floats above a surface in the 3D scene, and they are directional and tinted with `deep`, never generic grey.

### 5.3 Page structure (single page, anchored sections)

1. Header: name on the left, four anchors (About, Projects, Education and skills, Contact) on the right. Becomes a compact menu on small screens. Shows an active state tied to scroll position.
2. Hero: name, the role line chosen in D4, one-sentence orientation, links to GitHub and LinkedIn.
3. About: the tightened about text, large type, with the profile photo.
4. Projects: the depth corridor (moment B), six projects in the order from Section 3.3.
5. Education and skills: compact, scannable, not decorated.
6. Contact: email, phone (per D3), LinkedIn, GitHub, and the closing animation (moment E).

No testimonials, no stats strip, no "services", no blog.

### 5.4 The 3D scroll moments (this is the complete list)

Five moments. Each is specified so it can be built and tested. Do not add more unless the owner asks.

**Moment A: Hero exit.** On load, one orchestrated entrance only: the name and role line reveal by line mask, once. On scroll out, the hero group scrubs with `rotateX` from 0 to about 14 degrees away from the viewer and `translateZ` back about 300 px inside a parent with `perspective`, while the name's `font-variation-settings: 'wdth'` scrubs from the wide setting toward the condensed setting. Values come from `motion/tokens.ts`.

**Moment B: Project corridor (the signature moment).**
- A pinned stage with `perspective` set from tokens. The six project panels are positioned along the Z axis, spaced by a token distance. Scroll progress moves the "camera" (the parent's `translateZ`) forward, so panels approach, settle flat at Z 0 for a dwell, then pass the viewer and fade out.
- Panels alternate a small `rotateY` while approaching and ease to 0 when active.
- Page background crossfades from `fog` to `deep` as the stage pins and back on release (scrubbed, not timed).
- A progress indicator shows the current project name and position ("3 of 6"). Each entry is a real button that scrolls to that dwell point. This is functional navigation, so numbering is allowed here.
- Total pinned scroll length is derived from project count times a per-project token, never typed.
- Each panel contains: media frame, project name, kind, summary, stack, then the "Live site" and "Source" links.
- Fallback below the tablet breakpoint, on touch devices with coarse pointer, or when `prefers-reduced-motion: reduce`: no pinning. Panels stack vertically in the same order, each with a single `rotateX` reveal from about 10 degrees to 0 (or no motion at all when reduced motion is set). Content and links are identical in both modes.

**Moment C: Media frame depth.** Inside each panel the media frame has three layers at different `translateZ` values (frame, screenshot, stack chips). On fine-pointer devices the frame tilts a few degrees toward the pointer with damping. Disabled on touch and reduced motion.

**Moment D: About reveal.** The about paragraph is set large and reveals line by line as it crosses the viewport, scrubbed to scroll. The profile photo moves with a slight depth offset against the text. Reduced motion: visible immediately.

**Moment E: Closing.** At the end of the page the oversized name in the contact section rises from `rotateX` 70 degrees to 0 as the last section enters, then holds. Reduced motion: static.

### 5.5 Motion rules

- Animate `transform` and `opacity` only. Never animate layout properties or `filter: blur` on large areas.
- No fade-and-slide-up on every section. Apart from moments A to E, motion is limited to interaction feedback: link and button hover or focus, menu open and close.
- All durations, eases and distances come from `motion/tokens.ts`.
- `will-change` is applied only during an active animation and removed after.
- Lenis is created once, destroyed on unmount, and disabled under reduced motion. Native scrollbar stays visible. Anchor links scroll through Lenis. Keyboard scrolling, Page Up and Page Down, Home and End, and browser find all keep working.
- ScrollTrigger instances are created inside `gsap.context` and reverted on cleanup. Refresh after fonts and images load. No duplicate triggers after route or resize.
- Pointer-tilt uses `matchMedia('(pointer: fine)')`. Pinned corridor uses `matchMedia` for the breakpoint token.

### 5.6 Banned patterns (rejection test)

If any of these appears, the phase fails:

- Gradient text, gradient washes as decoration, purple-to-blue or any "AI gradient", glow, neon, aurora blobs, particles, floating shapes.
- Glassmorphism panels, frosted blur cards.
- Emoji used as icons or decoration, icon-in-a-rounded-square feature grids.
- Identical rounded cards with the same soft grey shadow in a three-column grid.
- A tracked-out ALL-CAPS eyebrow above headings, `A · B · C` middle-dot meta strings, spaced em-dash labels, `→` appended to every link, monospace for decorative small labels, `01 / 02 / 03` markers on content that is not a sequence.
- One accented word in an otherwise plain headline (for example one italic or coloured word).
- Typing animation, custom cursor, scroll-jacking that blocks native scroll, auto-playing background video, parallax on every element, marquee strips of logos.
- Copy such as "Welcome to my portfolio", "passionate about", "crafting digital experiences", "building the future", "let's build something great", "I turn ideas into reality", "cutting-edge", "seamless", "robust", "leverage".
- Stock photography, AI-generated imagery, fake device mockups, lorem ipsum, fake testimonials, invented numbers.
- Spaced em dashes anywhere in copy. Prefer plain sentences.

### 5.7 Copy rules

Plain verbs, active voice, sentence case, no filler. Describe what each project is and does, not how impressive it is. Link text says what happens: "Live site", "Source on GitHub", "Email me". Each text element does one job.

---

## 6. ASSET PIPELINE

### 6.1 Images

- Source images live in `assets-src/` (never served). `scripts/images.mjs` uses `sharp` to produce AVIF and WebP at defined widths into `public/media/`, plus intrinsic width and height written to a generated manifest that `projects.ts` reads. Next image optimisation is not available in static export, so this script is the pipeline.
- Every `<img>` has `width`, `height`, meaningful `alt`, and `srcset` with `sizes`. Below-the-fold images lazy-load. The hero asset is the only high-priority image.
- Profile photo: re-export optimised (target under 60 KB for the largest served size). Keep the original in `legacy/`.

### 6.2 Project media

Use real captures only. `scripts/capture.mjs` (Playwright) opens each live URL from `projects.ts` at fixed viewports (desktop 1440x900 and mobile 390x844), waits for network idle and fonts, dismisses cookie or popup layers only if one blocks the view, and saves the PNG into `assets-src/`. Review every capture by eye. Reject any capture showing a loading state, an error, a cookie banner, or personal data.

Per project:
1. Avalin Laboratories: capture the live site hero.
2. Nilakshith Enterprises: capture the live site hero.
3. South City Hospital: capture the live site hero. The repo also holds screenshots under `apps/web/screenshots/` which may be used only after you confirm they match the current live design.
4. Digital Solution IMS: there is no public site. Do not screenshot any real data. Build a clean inline SVG diagram from the architecture only (three roles on one side, the Next.js admin panel and the Expo mobile app in the middle, the Supabase backend on the other side). Labels come from Section 3.3. The owner approves the diagram in Phase 6.
5. USTM Academia: capture the live homepage and, if it renders cleanly without private data, the search results view.
6. E-Commerce Sales Analysis Dashboard: if the repo contains a dashboard screenshot or PDF export, use it. If not, stop and ask the owner for one. Do not mock a dashboard.

### 6.3 Data safety

The Digital Solution repo contains files with business or customer data. Do not open, copy, quote or screenshot `db_dump.sql`, any `.zip`, invoice or bill templates, `google-services.json`, or any file under `.env*`. Do not copy anything from that repo into this site except the text in Section 3.3 and the diagram you draw yourself. Report any other sensitive-looking file you notice, by path only.

---

## 7. PHASES

Each phase lists tasks, deliverables and a binary QA checklist. At the end of each phase: write the report, then STOP and wait for `APPROVED PHASE <n>`.

### PHASE 0: AUDIT (read-only)

Tasks
1. Clone the target repo. Create tag `v1-legacy` locally (do not push the tag until the owner approves).
2. Read `.github/workflows/static.yml`. Record: trigger branch, build step if any, publish directory, Pages permissions.
3. Inspect GitHub Pages settings if accessible: source (Actions or branch), URL pattern, custom domain.
4. Inventory every file, its size and purpose. Confirm the defects listed in Section 2 and find any others.
5. Run a baseline measurement on the current live page if reachable: Lighthouse mobile (performance, accessibility, best practices, SEO), page weight, LCP.
6. Confirm Node and package manager versions available. Confirm Playwright browsers can install.
7. Check each live URL in Section 3.3 returns HTTP 200 over HTTPS and note final URL after redirects.
8. Check whether `admin.southcityhospital.in` is publicly reachable (report only).
9. Look for a dashboard image in the Power BI repo (report only).

Deliverable: `reports/PHASE_0_AUDIT.md`.

QA checklist
- [ ] Workflow behaviour documented with file and line references
- [ ] Baseline Lighthouse numbers recorded (or "page unreachable" with the error)
- [ ] All six project URLs checked and status codes listed
- [ ] Defects list complete, nothing modified
- [ ] Git status clean, no files changed outside `reports/`
- [ ] Decisions D1 to D5 restated for the owner

STOP. Wait for `APPROVED PHASE 0`.

### PHASE 1: CONTENT AND DATA MODEL

Tasks
1. Create branch `rebuild/v2` from `main`.
2. Resolve D1 to D5 with the owner. Do not proceed on defaults without an explicit answer, except D5 which defaults to "keep current URL".
3. Create `src/config/site.ts`, `src/content/profile.ts`, `src/content/projects.ts` from Section 3. Tighten the about text and present two alternatives for the owner to choose; facts must not change.
4. Write the three role-line options for D4 as part of the report.
5. Write the `prebuild` validation script from Section 4.3 and prove it fails on each broken input (test with deliberately bad data, then revert).
6. Verify every claim in each summary against the repo or live site. List anything you could not verify under "Unverified".

Deliverables: the three content files, the validation script, `reports/PHASE_1_REPORT.md`.

QA checklist
- [ ] Projects are exactly six, orders 1 to 6, matching Section 3.3 order
- [ ] Every summary is 45 words or fewer
- [ ] Only Projects 1, 2, 3 and 5 have `live` links; 4 and 6 have none
- [ ] No placeholder, lorem, TODO or invented number in any content file
- [ ] Validation script fails on: missing source, non-https live URL, duplicate order, long summary, missing media (five separate proofs)
- [ ] D1 to D5 answers recorded in the report with the owner's exact words

STOP. Wait for `APPROVED PHASE 1`.

### PHASE 2: DESIGN SYSTEM AND ART DIRECTION

Tasks
1. Load the UI/UX skill if present (Section 0.2).
2. Write the design plan: token table (colour, type scale, spacing, radii, z-index, breakpoints), layout concept with an ASCII wireframe of the page and of the corridor, alignment rules, and the principles that make this page specific.
3. Run the rejection test: work through Section 5.6 line by line and the generic-default list in Section 5.2 against your plan. State what you changed and why. If any part is what you would produce for any portfolio, revise it before coding.
4. Create `tokens.css` and `motion/tokens.ts`. Compute and record contrast ratios for every text and background pairing used. Any pair under 4.5:1 (3:1 for large text) must be adjusted.
5. Create an internal `/styleguide` route (excluded from the production export) showing type scale, colours, link and button states, focus ring.

Deliverables: `reports/PHASE_2_DESIGN_PLAN.md`, tokens, styleguide route, screenshots in `reports/phase2/`.

QA checklist
- [ ] Tokens file contains every colour, size, space, radius and z-index later used; zero raw hex in any other file (grep proof)
- [ ] Contrast table complete, all pairs pass
- [ ] Banned-pattern review written, with changes listed
- [ ] Focus ring visible on every interactive element in the styleguide
- [ ] `/styleguide` is not present in the production build output
- [ ] Any WebGL proposal included only as a concept for the owner to accept or reject

STOP. Wait for `APPROVED PHASE 2`.

### PHASE 3: SCAFFOLD AND DEPLOYMENT PIPELINE

Tasks
1. Scaffold Next.js with `output: 'export'`, `trailingSlash` set deliberately, `images.unoptimized: true`, and `basePath` and `assetPrefix` read from `NEXT_PUBLIC_BASE_PATH`.
2. Configure fonts, strict TypeScript, ESLint with a rule that blocks raw colour literals and `localStorage` use in components.
3. Create the GitHub Actions workflow for Pages: install, `prebuild` validation, lint, type check, build, upload `out/`, deploy. Pin action versions. Set `NEXT_PUBLIC_BASE_PATH` here, not in code.
4. Add the sitemap and robots as build outputs using `site.ts`.
5. Move legacy files into `legacy/` (not served).
6. Deploy the empty shell to a preview using the workflow on the `rebuild/v2` branch only if the Pages environment allows it; otherwise verify locally with a static server that serves under the base path.

Deliverables: working scaffold, workflow file, `reports/PHASE_3_REPORT.md`.

QA checklist
- [ ] Build passes with base path set and with it empty
- [ ] Served under `/bakhtiarabidlaskar.github.io/`, every asset, font and link resolves (crawl proof, zero 404)
- [ ] No server-only features in the build (export succeeds)
- [ ] Workflow runs green; action versions pinned
- [ ] `legacy/` is not in `out/`
- [ ] No hardcoded base path string anywhere in `src/` (grep proof)

STOP. Wait for `APPROVED PHASE 3`.

### PHASE 4: SHELL, SMOOTH SCROLL AND NAVIGATION

Tasks
1. Build the page shell, semantic landmarks (`header`, `main`, `section`, `footer`), skip link, and the header with active-section tracking.
2. Implement `motion/registry.ts`: Lenis plus ScrollTrigger on the GSAP ticker, lifecycle-safe, reduced-motion aware.
3. Anchor navigation through Lenis, with correct offset for the header. Update the URL hash without a jump.
4. Mobile menu: accessible, focus-trapped while open, closes on Escape and on route anchor selection.

Deliverables: shell, registry, `reports/PHASE_4_REPORT.md`.

QA checklist
- [ ] Skip link works; tab order matches visual order
- [ ] Smooth scroll off under reduced motion, on otherwise; native scrollbar visible
- [ ] Anchors land on the correct section at 360, 768 and 1440 px widths
- [ ] Mobile menu: opens, traps focus, closes on Escape, restores focus to the trigger
- [ ] No duplicate ScrollTrigger or Lenis instances after resizing and navigating (devtools proof)
- [ ] Keyboard scroll keys and browser find still work

STOP. Wait for `APPROVED PHASE 4`.

### PHASE 5: HERO AND ABOUT (moments A and D)

Tasks
1. Build the hero and the load entrance (single orchestrated moment).
2. Implement moment A with the width-axis scrub. Verify the font actually exposes the `wdth` axis in the built CSS; if it does not, stop and report instead of faking it.
3. Build the about section and moment D with the optimised profile photo.
4. Provide reduced-motion variants for both.

QA checklist
- [ ] Hero fully readable before any animation completes (no invisible text on slow load)
- [ ] `wdth` axis verified in computed styles while scrolling
- [ ] No layout shift (CLS 0) during the entrance
- [ ] Reduced-motion variant verified with the OS setting emulated
- [ ] Hero image or text is the LCP element and LCP under 2.5 s on the throttled mobile profile
- [ ] Profile photo served under 60 KB at the largest size with correct `alt`

STOP. Wait for `APPROVED PHASE 5`.

### PHASE 6: PROJECTS (moments B and C)

Tasks
1. Run the asset pipeline: captures, the Digital Solution diagram (owner approves it), Power BI image (ask if missing). Show the owner the final media set before wiring.
2. Build the panel component from `projects.ts` only.
3. Build the corridor: pin, Z positions, scrubbed camera, dwell, background crossfade, progress navigation.
4. Build moment C pointer tilt and layered depth.
5. Build the fallback stacked layout and verify content parity with the corridor.
6. Test with long and short summaries, long stack lists, and a project with no live link.

QA checklist
- [ ] Order on screen is exactly Section 3.3 order, in both corridor and fallback
- [ ] Each project shows its name, kind, summary, stack, and only the links that exist
- [ ] Every live link opens in a new tab with `rel="noopener noreferrer"` and returns 200
- [ ] Project 4 shows the status text and no live button; Project 6 shows no live button
- [ ] Progress navigation jumps to the right dwell point, and also works by keyboard
- [ ] 60 fps on the corridor in a throttled-CPU profile (record frame data; no long tasks over 50 ms during scroll)
- [ ] Only `transform` and `opacity` animate (Performance panel proof)
- [ ] Fallback activates at the tablet token breakpoint, on coarse pointer, and under reduced motion
- [ ] No console errors or warnings
- [ ] No private or customer data visible in any media (manual review noted in report)

STOP. Wait for `APPROVED PHASE 6`.

### PHASE 7: EDUCATION, SKILLS AND CONTACT (moment E)

Tasks
1. Build education and skills from `profile.ts`, using the groupings approved in D1. Decoration is not required; clarity is.
2. Build the contact section with `mailto:`, `tel:` (if D3 allows), LinkedIn, GitHub.
3. Implement moment E and its reduced-motion variant.
4. Footer with the current year computed at build time from one function, not typed.

QA checklist
- [ ] Education shows exactly the entries and visibility decided in D2
- [ ] Skills list exactly matches the owner-confirmed D1 list
- [ ] Contact links work (`mailto`, `tel`, both profiles), phone absent if D3 says so
- [ ] Moment E leaves the final viewport readable and clickable (no 3D transform blocking pointer events)
- [ ] Footer year is generated, not typed

STOP. Wait for `APPROVED PHASE 7`.

### PHASE 8: RESPONSIVE, ACCESSIBILITY, PERFORMANCE

Tasks
1. Responsive pass at 360, 390, 430, 768, 1024, 1280, 1440, 1920 px, portrait and landscape on mobile. Fix overflow, tap targets and line lengths.
2. Accessibility pass: keyboard-only walkthrough, screen reader landmarks and headings, focus order, contrast, reduced motion, text zoom to 200 percent.
3. Performance pass: Lighthouse on mobile and desktop, bundle analysis, font loading, image sizes, remove unused code.
4. SEO: title, description, canonical (includes base path), Open Graph and Twitter tags with a generated 1200x630 image, favicon set (the old site's missing favicon fixed), `Person` JSON-LD with `sameAs` for the two profiles.
5. Cross-browser: current Chrome, Firefox, Safari (WebKit via Playwright) and a real or emulated iOS Safari and Android Chrome.

QA checklist
- [ ] No horizontal scroll at any width tested
- [ ] All tap targets 44x44 px minimum
- [ ] Lighthouse mobile: Performance 90 or higher, Accessibility 95 or higher, Best Practices 95 or higher, SEO 100
- [ ] LCP under 2.5 s, CLS under 0.05, INP under 200 ms (lab proxy noted)
- [ ] Total JS on first load under 200 KB gzipped (report the number)
- [ ] Keyboard-only walkthrough completes every action on the page
- [ ] axe (via Playwright) reports zero serious or critical issues
- [ ] 200 percent zoom and increased text size keep all content usable
- [ ] 3D transforms render correctly in WebKit (a frequent failure point); any Safari-specific fix documented
- [ ] Open Graph preview renders correctly with the base path in the image URL
- [ ] No console errors in any browser

STOP. Wait for `APPROVED PHASE 8`.

### PHASE 9: FINAL REVIEW AGAINST THE REJECTION TEST

Tasks
1. Walk Section 5.6 line by line against the running site and tick each as absent, with a screenshot or grep as evidence.
2. Read all copy aloud against Section 5.7. Remove filler.
3. Remove one decorative element you think is unnecessary and note which.
4. Re-verify every fact on the page against Section 3. Re-check all links.
5. Confirm the owner-approved decisions D1 to D5 are reflected.

QA checklist
- [ ] Every item in Section 5.6 confirmed absent with evidence
- [ ] Every claim traceable to Section 3, a repo, or an owner answer
- [ ] Zero spaced em dashes in the rendered text (grep on built HTML)
- [ ] All external links return a success status
- [ ] Moments A to E are the only scroll-driven animations (list them with their trigger names)
- [ ] Full-page screenshots at three widths saved in `reports/phase9/`

STOP. Wait for `APPROVED PHASE 9`.

### PHASE 10: DEPLOY AND CUTOVER

Tasks
1. Open a pull request from `rebuild/v2` to `main` with the phase reports linked.
2. After the owner approves the PR, merge, push the `v1-legacy` tag, and confirm the workflow deploys.
3. Verify the live URL: load, scroll through all moments, open every project link, test on a phone.
4. Re-run Lighthouse against the live URL and record the results.
5. Write the rollback procedure in `reports/ROLLBACK.md`: revert the merge commit, or redeploy the `v1-legacy` tag, with exact commands.
6. Update the repo README to match the real structure (fix the `style.css` and `images/` inaccuracies) and the real stack.

QA checklist
- [ ] Workflow green on `main`
- [ ] Live URL loads, no 404 for any asset, base path correct
- [ ] Live Lighthouse numbers meet Phase 8 thresholds
- [ ] Rollback tested on a branch (dry run) and documented
- [ ] README accurate to the repository contents
- [ ] `v1-legacy` tag pushed

STOP. Report completion. The rebuild is done only after the owner replies `APPROVED PHASE 10`.

---

## 8. FINAL MASTER CHECKLIST (all must be PASS before Phase 10 approval)

1. Six projects, Section 3.3 order, legacy Power BI project last
2. Every project has a brief description, stack, source link; live link only where one exists and returns 200
3. All five scroll moments (A to E) present and no others
4. Corridor falls back to a stacked layout with identical content on small, touch and reduced-motion
5. Only `transform` and `opacity` animated
6. No banned pattern from Section 5.6
7. No hardcoded colour, size, duration, URL, base path or copy outside the single sources of truth
8. Build passes with base path set and empty
9. Lighthouse mobile thresholds met on the live URL
10. axe: zero serious or critical issues
11. Keyboard-only and reduced-motion walkthroughs complete
12. No private data from any project repo appears on the site
13. Every claim verifiable; Unverified list is empty or owner-accepted
14. Rollback documented and dry-run tested

---

## 9. START

Begin with Phase 0. Do not write any code or change any file outside `reports/`. When the audit report is ready, present it and wait for `APPROVED PHASE 0`.
