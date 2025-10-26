# CI/CD Workflow Analysis & Recommendations

**Date:** 2025-10-26  
**Status:** 🚨 **CRITICAL GAPS IDENTIFIED**

## Executive Summary

The current CI/CD setup has **CRITICAL GAPS** in content generation that could result in deploying stale game content. The workflows are also becoming top-heavy and should be split into logical domains for better maintainability.

---

## 🚨 Critical Issue: Missing Content Generation

### The Problem

**AI-generated content is NOT being regenerated in CI/CD workflows**, which means:

❌ Level patterns, enemy AI, achievements, and loading tips are ONLY generated locally  
❌ Deployments use whatever was last committed, which could be stale  
❌ No guarantee that production has the latest AI-generated content  
❌ Missing required secrets in GitHub Actions (OPENAI_API_KEY, ANTHROPIC_API_KEY)  

### Content Generation Scripts Requiring API Keys

1. **`generate-content.ts`** - Requires `ANTHROPIC_API_KEY`
   - Enemy AI behaviors
   - Achievements
   - Level patterns
   - Loading tips

2. **`generate-sprites.ts`** - Requires `OPENAI_API_KEY`
   - Otter sprites
   - Obstacle sprites
   - Enemy sprites
   - Collectible sprites

3. **`generate-pwa-icons.ts`** - Requires `OPENAI_API_KEY`
   - App icons (multiple sizes)

4. **`generate-hud-sprites.ts`** - Requires `OPENAI_API_KEY`
   - HUD elements

5. **`generate-ui-icons.ts`** - Requires `OPENAI_API_KEY`
   - UI icons

### Current State

```yaml
# ci-cd.yml - build-web job (lines 101-136)
- name: Install dependencies
  run: npm ci

- name: Build project
  run: npm run build  # ⚠️ NO content generation before build!
```

**Result:** Builds use committed files only, no fresh content generation.

---

## 💡 Recommended Solution: Add Content Generation Job

### Option A: Pre-Build Content Generation (RECOMMENDED)

Add a new job that runs BEFORE build-web:

```yaml
generate-content:
  name: Generate Fresh Content
  runs-on: ubuntu-latest
  needs: [lint, type-check, test]
  # Only generate on main branch (avoid API costs on every PR)
  if: github.ref == 'refs/heads/main' || github.event_name == 'workflow_dispatch'
  
  steps:
    - uses: actions/checkout@v5
    
    - name: Setup Node.js
      uses: actions/setup-node@v6
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Generate AI Content (Anthropic)
      run: npm run generate-content
      env:
        ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      continue-on-error: true  # Don't fail build if API is down
    
    - name: Generate Sprites (OpenAI)
      run: npm run generate-sprites
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      continue-on-error: true
    
    - name: Generate HUD Sprites
      run: npm run generate-hud
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      continue-on-error: true
    
    - name: Generate UI Icons
      run: npm run generate-ui-icons
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      continue-on-error: true
    
    - name: Generate PWA Icons
      run: npm run generate-pwa-icons
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      continue-on-error: true
    
    - name: Run Asset Pipeline
      run: npm run asset-pipeline
      continue-on-error: true
    
    - name: Commit Generated Content
      run: |
        git config --local user.email "github-actions[bot]@users.noreply.github.com"
        git config --local user.name "github-actions[bot]"
        git add -A
        git diff-index --quiet HEAD || git commit -m "chore: regenerate AI content and assets [skip ci]"
        git push
      continue-on-error: true
    
    - name: Upload Generated Assets
      uses: actions/upload-artifact@v4
      with:
        name: generated-content
        path: |
          src/game/data/
          public/sprites/
          public/hud/
          public/icons/
        retention-days: 7

build-web:
  name: Build Web
  runs-on: ubuntu-latest
  needs: [generate-content]  # ✅ Now depends on content generation
  
  steps:
    - uses: actions/checkout@v5
      with:
        ref: ${{ github.ref }}  # Get latest commit with generated content
    
    - name: Download Generated Content (if available)
      uses: actions/download-artifact@v4
      with:
        name: generated-content
      continue-on-error: true
    
    # ... rest of build steps
```

### Option B: Scheduled Content Refresh (Alternative)

Create a separate workflow that runs on a schedule:

```yaml
# .github/workflows/content-refresh.yml
name: Content Refresh

on:
  schedule:
    - cron: '0 2 * * 0'  # Every Sunday at 2 AM
  workflow_dispatch:

jobs:
  refresh-content:
    name: Refresh AI-Generated Content
    runs-on: ubuntu-latest
    
    steps:
      # ... same as Option A ...
      
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'chore: refresh AI-generated game content'
          body: |
            Automated content refresh from AI generators.
            
            - Enemy AI behaviors
            - Level patterns
            - Achievements
            - Sprites and icons
          branch: automated/content-refresh
          commit-message: 'chore: refresh AI-generated content'
```

**Pros:**
- Keeps content fresh without manual intervention
- Reviewable via PR
- Lower API costs (weekly instead of every commit)

**Cons:**
- Content may be slightly stale between refreshes
- Requires manual PR merge

---

## 📊 Current Workflow Structure Analysis

### Current Jobs (ci-cd.yml)

```
CI Phase (All PRs & Pushes):
├── lint
├── type-check
└── test

Build Phase:
└── build-web (needs: lint, type-check, test)

Extended Testing (Main Branch Only):
├── e2e (needs: build-web)
└── visual-tests (needs: build-web)

Deployment (Main Branch Only):
└── deploy-web (needs: build-web, e2e)

Release (Main Branch Only):
└── auto-release (needs: build-web, deploy-web)
    └── Triggers platform-builds.yml
```

### Observations

✅ **Good:**
- Clear separation of CI (quality checks) and CD (deployment)
- Parallel execution of independent jobs (lint, type-check, test)
- Conditional execution to save resources (e2e/visual only on main)
- Proper dependency chain prevents premature deployments

⚠️ **Top-Heavy Issues:**
- Single monolithic workflow file (358 lines)
- Mixed concerns (CI, testing, deployment, release)
- Hard to maintain and understand at a glance
- Difficult to reuse across projects

---

## 🔧 Recommended Workflow Split

### Proposed Structure

```
.github/workflows/
├── ci.yml              # Quality checks (lint, type-check, test)
├── content-gen.yml     # AI content generation (NEW)
├── build.yml           # Build artifacts
├── test-extended.yml   # E2E and visual tests
├── deploy-web.yml      # GitHub Pages deployment
├── platform-builds.yml # Desktop/mobile builds (EXISTS)
└── release.yml         # Automated releases
```

### Benefits

✅ **Modularity:** Each workflow has a single responsibility  
✅ **Reusability:** Can be called via `workflow_call`  
✅ **Maintainability:** Easier to understand and modify  
✅ **Selective Triggering:** Run only what's needed  
✅ **Parallel Execution:** Independent workflows run simultaneously  
✅ **Clear Ownership:** Teams can own specific workflows  

---

## 📝 Implementation Plan

### Phase 1: Add Content Generation (CRITICAL)

**Priority:** 🔴 HIGH  
**Effort:** 2-3 hours  
**Risk:** Low (continue-on-error prevents build failures)

1. Add GitHub Secrets:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`

2. Create `content-gen.yml` workflow or add job to `ci-cd.yml`

3. Update `build-web` to depend on content generation

4. Test with `workflow_dispatch` trigger first

### Phase 2: Split Workflows (Nice to Have)

**Priority:** 🟡 MEDIUM  
**Effort:** 4-6 hours  
**Risk:** Medium (requires careful testing)

1. Create new workflow files with clear boundaries

2. Use `workflow_call` for reusability:
```yaml
# build.yml
on:
  workflow_call:
    outputs:
      artifact_name:
        value: ${{ jobs.build.outputs.artifact }}

# ci-cd.yml (orchestrator)
jobs:
  build:
    uses: ./.github/workflows/build.yml
```

3. Migrate jobs one at a time, test thoroughly

4. Update documentation

5. Archive old `ci-cd.yml` once migration complete

---

## 🎯 Quick Wins

### Immediate Actions (Can be done today)

1. **Add Secrets:**
   ```bash
   # GitHub Settings → Secrets and Variables → Actions → New Repository Secret
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   ```

2. **Add Content Generation Job** (see Option A above)

3. **Update Documentation:**
   - Document required secrets in README
   - Add troubleshooting guide
   - Explain content generation flow

---

## 🔍 Secrets Configuration Guide

### Required Secrets

| Secret Name | Purpose | Where to Get |
|-------------|---------|--------------|
| `OPENAI_API_KEY` | Generate sprites, icons, UI assets | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | Generate level patterns, AI behaviors, achievements | https://console.anthropic.com/settings/keys |

### Setting Up Secrets

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret with its value
4. Secrets are encrypted and never shown in logs

### Testing Secrets

```yaml
- name: Test API Access
  run: |
    if [ -z "$OPENAI_API_KEY" ]; then
      echo "❌ OPENAI_API_KEY not configured"
      exit 1
    fi
    echo "✅ OPENAI_API_KEY is configured"
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

---

## 📈 Cost Considerations

### API Usage Estimates

**OpenAI (GPT-IMAGE-1):**
- ~20 sprites @ $0.04/image = $0.80 per run
- PWA icons @ $0.04/image = $0.04 per run
- Total: ~$1-2 per full regeneration

**Anthropic (Claude Sonnet 4):**
- 4 content generation calls @ ~4K tokens each
- Est. $0.02-0.05 per call
- Total: ~$0.10-0.20 per run

**Recommended Strategy:**
- Generate on main branch only (not PRs)
- Weekly scheduled refresh (Option B)
- Manual trigger via `workflow_dispatch` when needed
- Total monthly cost: ~$5-10

---

## 🚀 Next Steps

### To Address Critical Gap:

1. [ ] Add API keys to GitHub Secrets
2. [ ] Implement Option A (Pre-Build Content Gen) or Option B (Scheduled)
3. [ ] Test with `workflow_dispatch` trigger
4. [ ] Merge to main branch
5. [ ] Verify content is generated on next deployment

### To Improve Workflow Structure:

1. [ ] Review proposed workflow split with team
2. [ ] Create new workflow files
3. [ ] Migrate jobs incrementally
4. [ ] Update CI/CD documentation
5. [ ] Monitor for issues

---

## 📚 References

- [GitHub Actions Workflows](https://docs.github.com/en/actions/using-workflows)
- [Reusable Workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
- [OpenAI API Pricing](https://openai.com/api/pricing/)
- [Anthropic API Pricing](https://www.anthropic.com/pricing)

---

**Document Owner:** Cursor Agent  
**Last Updated:** 2025-10-26  
**Status:** Awaiting Implementation
