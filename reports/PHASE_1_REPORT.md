# PHASE 1 REPORT: CONTENT AND DATA MODEL

**Date:** 2026-10-08  
**Branch:** `rebuild/v2`  
**Status:** Completed  
**Deliverables:**
- [`src/config/site.ts`](file:///d:/portfolio/src/config/site.ts)
- [`src/content/profile.ts`](file:///d:/portfolio/src/content/profile.ts)
- [`src/content/projects.ts`](file:///d:/portfolio/src/content/projects.ts)
- [`scripts/validate-content.mjs`](file:///d:/portfolio/scripts/validate-content.mjs)
- [`scripts/test-validation-failures.mjs`](file:///d:/portfolio/scripts/test-validation-failures.mjs)

---

## 1. Work Completed

1. **Branch Creation:** Created and switched to branch `rebuild/v2` from `main` (`git checkout -b rebuild/v2`).
2. **Owner Decisions Incorporated:** Captured and codified all owner responses for D1 through D5, plus the specific directive on the temporary profile picture.
3. **Site Configuration (`site.ts`):** Established single source of truth for site metadata, links, and environment-driven base path (`NEXT_PUBLIC_BASE_PATH`).
4. **Profile & Education Data Model (`profile.ts`):**
   - Retained owner identity, contact details, and University affiliation.
   - Preserved phone number (+91 9101607353) per D3.
   - Omitted Class 10 and Class 12 percentage scores per D2.
   - Grouped skills spanning both original skills and the verified production stack per D1.
   - Removed banned buzzwords (e.g. "passionate about", "cutting-edge") and tightened the About copy into two clear candidate options.
5. **Projects Data Model (`projects.ts`):**
   - Strictly ordered 1 through 6 matching Section 3.3.
   - All summaries trimmed and verified to <= 45 words.
   - Live links present strictly on Projects 1, 2, 3, and 5; Projects 4 and 6 have source links only.
   - All external live URLs verified over HTTPS.
6. **Prebuild Content Validation Script (`scripts/validate-content.mjs`):**
   - Implemented automated schema and content checker verifying: project count (6), sequence 1..6 with zero gaps, source links present, live links start with `https://`, summary lengths <= 45 words, and asset file existence in `public/`.
   - Built test harness `scripts/test-validation-failures.mjs` proving all 5 failure modes produce an exit code of 1 and explicit error messages.

---

## 2. Owner Decisions (D1 to D5 Recorded with Owner's Exact Words)

The owner replied to Phase 0 with the following decisions:
> *"1 keep old skills and the new as well 2. no need of marks 3.keep phone number 4.eading with full-stack web/mobile 5. i will no longer use this hosting so link the repo and the liveurl of certain projects properly .......... also do not use genaric html css use proper modern tech stack also do not use this old profile picture ill provide another later for now keep in a placeholder"*

### Decisions Logged:
- **D1 (Skills):** Keep old skills and new skills.
  - *Evidenced & Grouped:*
    - **Frontend & Mobile:** Next.js, React, TypeScript, JavaScript, Tailwind CSS, HTML, CSS, Expo, React Native
    - **Backend & Database:** Node.js, Supabase, PostgreSQL, REST APIs
    - **Data & Analytics:** Python, Microsoft Power BI
    - **Core & Tools:** C, Git, GitHub, Vercel, MS Office, Canva
- **D2 (High School Marks):** "no need of marks" — Class 10 and Class 12 percentages removed from the data model.
- **D3 (Phone Number):** "keep phone number" — Listed as `+91 9101607353` under `profile.contact.phone`.
- **D4 (Hero Role Line):** "eading with full-stack web/mobile" — Selected full-stack web and mobile emphasis. Three candidate lines formulated below.
- **D5 (Hosting & Base Path):** "i will no longer use this hosting so link the repo and the liveurl of certain projects properly" — Base path resolves dynamically via `NEXT_PUBLIC_BASE_PATH` defaulting to clean root `""`.
- **Profile Image:** "do not use this old profile picture ill provide another later for now keep in a placeholder" — Profile photo references clean SVG vector avatar (`/media/avatar.svg`) until the new photo is provided.
- **Tech Stack:** "do not use genaric html css use proper modern tech stack" — Rebuilding with Next.js (App Router, static export), TypeScript, CSS Modules with custom properties, and GSAP + Lenis as defined in Section 4.2.

---

## 3. About Text Options & Hero Role Lines

### About Text Candidates (Choose one for the final copy):
- **Alternative A (Systems & Architecture - Currently Active in `profile.ts`):**
  > "Computer Science Engineering undergraduate at the University of Science and Technology Meghalaya. I design and build production web applications, cross-platform mobile systems, and data dashboards. My work centers on clean architecture, reliable database systems, and responsive user interfaces."  
  *(39 words — Plain verbs, zero buzzwords, grounded in shipped projects)*

- **Alternative B (Direct & Delivery-Focused):**
  > "B.Tech Computer Science student at USTM building production software across web, mobile, and data domains. Experienced in delivering full-stack platforms from database design to deployment for healthcare, retail operations, and educational institutions."  
  *(34 words — Direct, shipping-focused)*

### Role Line Options (For D4 hero presentation):
1. **Option 1 (Active):** `Full-Stack Developer building production web and mobile systems`
2. **Option 2:** `Software Developer delivering full-stack web platforms and mobile applications`
3. **Option 3:** `Full-Stack Engineer specialized in React, Next.js, and mobile development`

---

## 4. Claim Verification & Unverified Items

Every project claim was cross-checked against its GitHub repository and live deployment:

1. **Avalin Laboratories:** Verified against `AVALIN-LABORTORIES/website/package.json` (`next` 16, `react` 19, `@tailwindcss/postcss` 4, `typescript` 5). Live site `https://www.avalinlaboratories.com/` returns HTTP 200.
2. **Nilakshith Enterprises:** Verified against `Nilakshith-Enterprises/package.json` (`sharp`, `clean-css-cli`, `uglify-js`, `vercel.json`). Live site `https://www.nilakshithenterprise.com/` returns HTTP 200.
3. **South City Hospital:** Verified against `SouthCityHospital` monorepo (`turbo.json`, `pnpm-workspace.yaml`, `supabase/`, `apps/web`). Live site `https://southcityhospital.in/` returns HTTP 200.
4. **Digital Solution IMS:** Verified against `DIGITAL-SOLUTION-INTERNAL-MANAGEMENT-SYSTEM` (`supabase/`, `types.ts`, `vercel.json`). Verified no sensitive files accessed. Confirmed internal system with no public live URL.
5. **USTM Academia:** Verified against `USTM_academia` (`tailwind.config.ts`, `pnpm-workspace.yaml`, `supabase/`). Live site `https://ustm-academia.vercel.app/` returns HTTP 200.
6. **E-Commerce Sales Analysis Dashboard:** Verified against `Ecommerce-Sales-Analysis-Dashboard-Using-MS-Power-BI` (`Ecommerce sales dashboard.pbix`, `dashboard.png`). Confirmed data analysis project with no public URL.

### Unverified Items:
- **South City Hospital Admin Portal (`admin.southcityhospital.in`):** Domain has no public DNS record. Omitted from public project links as specified.

---

## 5. Prebuild Validation Script & Failure Proofs

Command: `node --experimental-strip-types scripts/validate-content.mjs`  
Clean run output:
```
✅ Content validation passed: all 6 projects verified successfully.
```

The automated test harness `scripts/test-validation-failures.mjs` was executed to prove that the validation script rejects malformed data in all five mandated cases:

```
=== RUNNING 5 VALIDATION PROOFS ===

✅ [PASS] Proof 1: Missing source link
   Captured Expected Error: "Missing or empty links.source"
   Output detail: - [avalin-laboratories] Missing or empty links.source.
✅ [PASS] Proof 2: Non-https live URL
   Captured Expected Error: "Live link must use https://"
   Output detail: - [avalin-laboratories] Live link must use https://. Found: "http://www.avalinlaboratories.com/"
✅ [PASS] Proof 3: Duplicate order
   Captured Expected Error: "Project orders must be exactly 1..6 with no gaps or duplicates"
   Output detail: - Project orders must be exactly 1..6 with no gaps or duplicates. Found: [1, 1, 3, 4, 5, 6]
✅ [PASS] Proof 4: Long summary (> 45 words)
   Captured Expected Error: "Summary exceeds 45 words (46 words)"
   Output detail: - [avalin-laboratories] Summary exceeds 45 words (46 words): "word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word"
✅ [PASS] Proof 5: Missing media file
   Captured Expected Error: "Media file not found"
   Output detail: - [avalin-laboratories] Media file not found: "/media/projects/does-not-exist.png" (resolved to: D:\portfolio\public\media\projects\does-not-exist.png)

Restoring original projects.ts...
Clean sanity check: ✅ Content validation passed: all 6 projects verified successfully.
All 5 failure proofs succeeded.
```

---

## 6. Binary QA Checklist (Phase 1)

| Item | Status | Evidence |
| :--- | :---: | :--- |
| **Projects are exactly six, orders 1 to 6, matching Section 3.3 order** | **PASS** | `projects.ts` contains exactly 6 items with sequential orders 1 through 6. |
| **Every summary is 45 words or fewer** | **PASS** | Word counts: P1: 25 words, P2: 36 words, P3: 40 words, P4: 41 words, P5: 39 words, P6: 26 words. All <= 45. |
| **Only Projects 1, 2, 3 and 5 have `live` links; 4 and 6 have none** | **PASS** | P1, P2, P3, P5 have `links.live`; P4 and P6 have only `links.source`. |
| **No placeholder, lorem, TODO or invented number in any content file** | **PASS** | Grep search for `placeholder`, `lorem`, `todo`, `fixme` across `src/` returns zero matches. All facts traceable. |
| **Validation script fails on: missing source, non-https live URL, duplicate order, long summary, missing media (five separate proofs)** | **PASS** | All 5 test cases verified and documented with console output in Section 5. |
| **D1 to D5 answers recorded in the report with the owner's exact words** | **PASS** | Owner's verbatim response recorded and mapped in Section 2. |

---

## STOP

Phase 1 is complete. Awaiting owner review and exact reply:
`APPROVED PHASE 1`
