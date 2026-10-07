# PHASE 0 AUDIT REPORT

**Date:** 2026-10-08  
**Target Repository:** `Bakhtiar-Abid-Laskar/bakhtiarabidlaskar.github.io`  
**Live Site URL:** `https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/`  
**Status:** Read-only audit complete  

---

## 1. Executive Summary

Phase 0 is a strictly read-only audit of the existing portfolio repository, live deployment, tooling environment, external project URLs, and asset dependencies. No existing project source files were modified. Tag `v1-legacy` has been created locally pointing to the latest commit (`d002071`) and will not be pushed until final approval. All six project URLs and dependencies specified in the master prompt were verified.

---

## 2. Git & Repository State

- **Current Branch:** `main`
- **Head Commit:** `d002071` ("Update index.html")
- **Commit History (Total 4 commits):**
  - `d002071` Update index.html
  - `c18289f` README.md
  - `0853aff` Create static.yml
  - `87d4004` Add files via upload
- **Local Tag:** `v1-legacy` created at `d002071` (`git tag v1-legacy`). Not pushed to remote.
- **Git Status:** Working directory is clean with respect to tracked files. The only untracked additions are `PORTFOLIO_REBUILD_MASTER_PROMPT.md` and `reports/`.

---

## 3. GitHub Actions Workflow Inspection

**File:** `.github/workflows/static.yml` (44 lines total)

- **Trigger branches:** Line 6-7: `push.branches: ["main"]`; Line 10: `workflow_dispatch` (manual run).
- **Permissions:** Lines 13-16:
  ```yaml
  permissions:
    contents: read
    pages: write
    id-token: write
  ```
- **Concurrency control:** Lines 20-22: `group: "pages"`, `cancel-in-progress: false`.
- **Environment:** Lines 27-29: `environment.name: github-pages`, `url: ${{ steps.deployment.outputs.page_url }}`.
- **Build step:** **None.** (Line 31-44). The workflow merely checks out the repo and uploads raw repository files directly.
- **Publish directory:** Line 40: `path: '.'` (entire repository root uploaded to Pages artifact via `actions/upload-pages-artifact@v3`).
- **Deploy step:** Line 41-43: uses `actions/deploy-pages@v4`.

---

## 4. GitHub Pages Settings & URL Analysis

- **Hosting Type:** GitHub Pages via GitHub Actions (`deploy-pages`).
- **Active Live URL:** `https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/` (Returns HTTP 200 OK).
- **Root Domain URL:** `https://bakhtiar-abid-laskar.github.io/` returns **HTTP 404 Not Found**.
  - *Technical Root Cause:* The GitHub account username is `Bakhtiar-Abid-Laskar` (hyphenated). Under GitHub Pages conventions, a user-level root site must be named `<username>.github.io` (e.g. `bakhtiar-abid-laskar.github.io`). Because the repository is named `bakhtiarabidlaskar.github.io` (no hyphens), GitHub treats it as a project site, serving it under the path `/bakhtiarabidlaskar.github.io/`.
- **Custom Domain:** None configured (no `CNAME` file present).

---

## 5. File Inventory & Defect Verification

| File | Size (Bytes) | Purpose | Defects Identified |
| :--- | :--- | :--- | :--- |
| `index.html` | 3,771 | Main single-page portfolio | 1. Line 8 references `<link rel="icon" href="favicon.ico">`, but `favicon.ico` does not exist (causes 404 network failure).<br>2. Line 31-33 contains a syntax error: `<h2 class="single-line-name"> B.Tech CSE<br>University of Science and Technology Meghalaya<h2>` terminates with an unclosed opening `<h2>` instead of `</h2>`.<br>3. Missing `<meta name="description">` (causes 0 SEO score on meta description audit).<br>4. Missing Open Graph (`og:*`), Twitter Cards, canonical URL, and JSON-LD structured data.<br>5. Hardcoded static copyright year (`© 2025` on line 101).<br>6. Non-semantic layout (`aside.sidebar` inside `.container`, mixed section structure). |
| `styles.css` | 3,090 | Global stylesheet | 1. Generic dark theme with raw hardcoded hex codes (`#1e1e1e`, `#4ea3f1`, `#111`, `#2c2c2c`).<br>2. Fixed sidebar width (`width: 460px`) causing cramped main content layout on medium viewports.<br>3. No CSS custom property design system. |
| `profile.jpg` | 185,276 (~185 KB) | Profile photo | 1. Uncompressed, unoptimised raw JPEG.<br>2. Represents >95% of total page transfer weight.<br>3. No responsive sizes (`srcset`), no modern WebP/AVIF formats.<br>4. Missing explicit `width` and `height` attributes on `<img>` tag (potential layout shift). |
| `README.md` | 835 | Repository documentation | 1. Inaccurate file tree: references `style.css` (actual file is `styles.css`).<br>2. References `images/` directory which does not exist.<br>3. Outdated stack description: lists only HTML5 and CSS3. |
| `.github/workflows/static.yml` | 1,293 | Deployment workflow | No build step; deploys raw repository root. |

---

## 6. Baseline Performance & Quality Measurements (Live Site)

Audit conducted on live URL `https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/` using Lighthouse Mobile (emulated Moto G Power / mobile profile, Chrome headless):

### 6.1 Category Scores
- **Performance:** **99 / 100**
- **Accessibility:** **100 / 100**
- **Best Practices:** **96 / 100**
- **SEO:** **91 / 100**

### 6.2 Core Web Vitals & Timing
- **First Contentful Paint (FCP):** 1.1 s
- **Largest Contentful Paint (LCP):** 2.1 s (LCP element: `profile.jpg`)
- **Total Blocking Time (TBT):** 30 ms
- **Cumulative Layout Shift (CLS):** 0.000
- **Speed Index:** 1.6 s

### 6.3 Transfer & Page Weight
- **Total Page Weight:** 190 KiB (194,547 bytes transferred)
- **Network Requests Breakdown:**
  1. HTML document (`/bakhtiarabidlaskar.github.io/`): 3,665 B resource (1,949 B transfer)
  2. Stylesheet (`styles.css`): 2,890 B resource (1,216 B transfer)
  3. Image (`profile.jpg`): 185,276 B resource (185,558 B transfer) — **95.4% of total transfer**
  4. Missing Favicon (`favicon.ico`): 9,379 B resource (5,499 B transfer) — **HTTP 404 response**

### 6.4 Key Defect Audits Flagged by Lighthouse
- `meta-description`: Document does not have a meta description (Score: 0 / FAIL).
- `image-delivery-insight`: Estimated savings of 172 KiB by serving properly sized and modern-format images (Score: 0 / FAIL).

---

## 7. Local Environment & Tooling Verification

- **Operating System:** Windows (PowerShell)
- **Node.js:** `v24.19.0` (Exceeds required `>= 20.x`)
- **npm:** `11.17.0`
- **pnpm:** `9.15.9`
- **Playwright:** CLI `v1.63.0` operational via `npx`
- **Installed Browser Engines Available:**
  - Google Chrome: `C:\Program Files\Google\Chrome\Application\chrome.exe` (Verified present)
  - Microsoft Edge: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` (Verified present)

---

## 8. Section 3.3 Project URL & Reachability Audit

Every project from Section 3.3 was probed over HTTPS for HTTP response status and redirect destinations:

| Project # | Project Name | Specified URL | HTTP Code | Effective Final URL | Status |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **1** | **Avalin Laboratories** | `https://www.avalinlaboratories.com/` | **200** | `https://www.avalinlaboratories.com/` | PASS (Direct) |
| **2** | **Nilakshith Enterprises** | `https://www.nilakshithenterprise.com` | **200** | `https://www.nilakshithenterprise.com/` | PASS (Trailing slash) |
| **3** | **South City Hospital** | `https://www.southcityhospital.in/` | **200** | `https://southcityhospital.in/` | PASS (Canonical apex redirect) |
| **4** | **Digital Solution IMS** | *None (Internal platform)* | N/A | N/A | PASS (No public link by spec) |
| **5** | **USTM Academia** | `https://ustm-academia.vercel.app` | **200** | `https://ustm-academia.vercel.app/` | PASS (Direct) |
| **6** | **Power BI Dashboard** | *None (Data analysis)* | N/A | N/A | PASS (No public link by spec) |

---

## 9. Special Investigations

### 9.1 South City Hospital Admin Portal (`admin.southcityhospital.in`)
- **Probe target:** `https://admin.southcityhospital.in/`
- **DNS Result:** `curl: (6) Could not resolve host: admin.southcityhospital.in`
- **Finding:** The domain does not have an active public DNS record. The admin portal is **not publicly reachable**. Per Section 3.3, this link must not be exposed on the public site.

### 9.2 Power BI Sales Dashboard Image Search
- **Repository:** `Bakhtiar-Abid-Laskar/Ecommerce-Sales-Analysis-Dashboard-Using-MS-Power-BI`
- **File Checked:** Root directory via GitHub API.
- **Finding:** **`dashboard.png` exists in the repo root!**
  - Path: `dashboard.png`
  - Size: 428,325 bytes (~428 KB)
  - Raw URL: `https://raw.githubusercontent.com/Bakhtiar-Abid-Laskar/Ecommerce-Sales-Analysis-Dashboard-Using-MS-Power-BI/main/dashboard.png`
  - This image can be directly utilized in Phase 6 asset pipeline without requiring the owner to generate or export a new screenshot.

---

## 10. Decisions Required from the Owner (D1 to D5)

Before starting Phase 1 implementation, the following decisions are formally submitted for owner determination:

- **D1. Skills List Grouping & Final Stack:**  
  The current skills list (`C, Python, MS Power BI, MS Office, Canva`) omits the web and software engineering stack evidenced in the production repositories. Proposed grouping:
  - *Frontend & Mobile:* React, Next.js, TypeScript, JavaScript, Tailwind CSS, HTML5, CSS3, Expo, React Native
  - *Backend & Database:* Node.js, Supabase, PostgreSQL, REST APIs
  - *Data & Analytics:* Python, Microsoft Power BI, Data Analysis
  - *Programming Languages & Tools:* C, Git, GitHub, Vercel
  *(Owner may confirm, modify, or add C++ / other tools).*
- **D2. High School Marks Visibility:**  
  Whether to display or omit the percentage scores for Class 10 (70.33%) and Class 12 (59%) in the Education section.
- **D3. Phone Number Privacy:**  
  Whether to keep the phone number (`+91 9101607353`) publicly listed or display email (`bakhtiarabidlaskar1@gmail.com`), LinkedIn, and GitHub only.
- **D4. Hero Role Line:**  
  Select one candidate line grounded in actual shipped projects (not default "AI & ML"):
  - *Option 1 (Full-stack emphasis):* `Full-Stack Developer building production web and mobile systems`
  - *Option 2 (Systems & product emphasis):* `Software Developer crafting responsive web apps and internal platforms`
  - *Option 3 (Hybrid engineering & data):* `Developer & Data Analyst specializing in modern web platforms and BI dashboards`
- **D5. Repository & Hosting URL Structure:**  
  Whether to keep the current repository name and URL (`https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/`) or rename the repository to `bakhtiar-abid-laskar.github.io` so it serves at the apex root (`https://bakhtiar-abid-laskar.github.io/`). Default if no answer: keep current URL.

---

## 11. Binary QA Checklist (Phase 0)

| Item | Status | Evidence |
| :--- | :---: | :--- |
| **Workflow behaviour documented with file and line references** | **PASS** | Section 3 references lines 6-10, 13-16, 20-22, 27-29, 31-44 of `.github/workflows/static.yml`. |
| **Baseline Lighthouse numbers recorded** | **PASS** | Mobile Lighthouse audit: Perf 99, A11y 100, BP 96, SEO 91, FCP 1.1s, LCP 2.1s, CLS 0, Weight 190 KiB recorded in Section 6. |
| **All six project URLs checked and status codes listed** | **PASS** | Probed over HTTPS; 4 live URLs return HTTP 200, 2 internal/data correctly have no live URLs (Section 8). |
| **Defects list complete, nothing modified** | **PASS** | Defects in `index.html`, `styles.css`, `profile.jpg`, `README.md` catalogued in Section 5. Zero files modified. |
| **Git status clean, no files changed outside `reports/`** | **PASS** | `git status` verifies no tracked files modified. Only `reports/` and `PORTFOLIO_REBUILD_MASTER_PROMPT.md` present. |
| **Decisions D1 to D5 restated for the owner** | **PASS** | Decisions D1 through D5 clearly restated in Section 10. |

---

## STOP

Phase 0 is complete. Awaiting owner review and exact reply:
`APPROVED PHASE 0`
