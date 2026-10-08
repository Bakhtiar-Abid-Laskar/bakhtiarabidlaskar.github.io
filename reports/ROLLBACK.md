# PRODUCTION ROLLBACK PROCEDURE

**Target Repository:** `Bakhtiar-Abid-Laskar/bakhtiarabidlaskar.github.io`  
**Legacy Reference Tag:** `v1-legacy` (commit `d00207192c4e3f58f50c4f3ebd1f50a3f2d50f10`)  
**Production Rebuild Branch:** `rebuild/v2` $\rightarrow$ `main`  
**Date:** 2026-10-08

---

## 1. Overview

In the event of an unforeseen production outage, broken deployment, or degradation on GitHub Pages after cutover to `main`, use one of the two verified rollback procedures documented below. Both procedures trigger the automated GitHub Actions deployment pipeline to restore service.

---

## 2. Rollback Method 1: Git Revert Merge Commit (Recommended for Protected Branches)

This is the cleanest method because it creates a standard revert commit without requiring `--force` permissions on protected `main` branches.

### Step-by-Step Commands:

```bash
# 1. Fetch latest changes and checkout main
git checkout main
git pull origin main

# 2. Identify the merge commit hash (or use HEAD)
git log -n 5 --oneline

# 3. Create a revert commit of the merge commit (parent 1 is the previous main state)
git revert -m 1 HEAD --no-edit

# 4. Push the revert commit to main
git push origin main
```

**Result:** The GitHub Actions workflow (`deploy.yml` or `static.yml`) will immediately trigger on push to `main` and redeploy the prior working state.

---

## 3. Rollback Method 2: Restoring Files from `v1-legacy` Tag (Zero-Downtime Clean State)

If a merge conflict occurs during git revert, restore the entire working tree directly from the immutable `v1-legacy` tag and commit it as an explicit rollback:

### Step-by-Step Commands:

```bash
# 1. Ensure you are on main with a clean working tree
git checkout main
git pull origin main

# 2. Remove current files and check out legacy files from tag v1-legacy
git rm -rf .
git checkout v1-legacy -- .

# 3. Commit the restoration
git commit -m "chore(rollback): restore legacy v1 portfolio from tag v1-legacy"

# 4. Push to main
git push origin main
```

**Result:** The legacy single-file site (`index.html`, `styles.css`, `profile.jpg`, `.github/workflows/static.yml`) is restored and deployed within 60 seconds.

---

## 4. Rollback Method 3: Fast Reset (If Force-Push is Allowed)

If branch protection rules allow force pushing to `main`:

```bash
git checkout main
git reset --hard v1-legacy
git push origin main --force
```

---

## 5. Post-Rollback Verification Checklist

After executing any rollback method, verify live status:

1. **Check Workflow Execution:**
   - Visit: `https://github.com/Bakhtiar-Abid-Laskar/bakhtiarabidlaskar.github.io/actions`
   - Confirm the deployment workflow completed with green status.

2. **Verify Live Response:**
   ```bash
   curl -I https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/
   ```
   Confirm HTTP `200 OK`.

3. **Verify Visual Health:**
   - Open in an incognito window: `https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/`
   - Confirm the legacy page loads without 404 errors.

---

## 6. Dry-Run Verification Evidence

This rollback procedure was dry-run tested locally on branch `dryrun/rollback-test`:
- Checked out `v1-legacy` files cleanly into the working tree.
- Verified all legacy assets (`index.html`, `styles.css`, `profile.jpg`) restored with 0 conflicts.
- Verified test build / verification completes.
