# Workflow Architecture

This directory contains the CI/CD workflows for Otter River Rush.

## Workflow Structure

```
Main Branch Flow:
content-generation.yml  →  ci-cd.yml (build-web)  →  deploy-web  →  auto-release  →  platform-builds.yml
     ↓                                                                                          ↓
  AI Content                                                                              Desktop/Mobile
  Sprites/Icons                                                                           Releases
```

## Workflows

### 1. `content-generation.yml` (NEW)
**Purpose:** Generate fresh AI content and assets before builds  
**Triggers:**
- Scheduled (weekly on Sundays)
- Manual (`workflow_dispatch`)
- Called by `ci-cd.yml` before build

**What it does:**
- Generates level patterns, enemy AI, achievements (Claude)
- Creates sprites, HUD, UI icons (OpenAI)
- Runs asset pipeline for optimization
- Commits changes back to repo

**Required Secrets:**
- `OPENAI_API_KEY` - For sprite/icon generation
- `ANTHROPIC_API_KEY` - For game content generation

### 2. `ci-cd.yml`
**Purpose:** Main CI/CD pipeline  
**Triggers:** Push to main/develop, PRs, manual

**Jobs:**
- **CI Phase:** `lint`, `type-check`, `test` (parallel)
- **Build Phase:** `build-web` (after CI passes)
- **Testing Phase:** `e2e`, `visual-tests` (main branch only)
- **Deploy Phase:** `deploy-web` (GitHub Pages)
- **Release Phase:** `auto-release` (semantic versioning)

### 3. `platform-builds.yml`
**Purpose:** Build native apps for Android, macOS, Linux, Windows  
**Triggers:** 
- Called by `auto-release` when new version is created
- Manual with version tag

**What it builds:**
- Android APK
- macOS DMG/ZIP
- Linux AppImage/DEB
- Windows NSIS/Portable

## Configuration Required

### GitHub Secrets

Add these in **Settings → Secrets and Variables → Actions**:

| Secret | Purpose | Get It From |
|--------|---------|-------------|
| `OPENAI_API_KEY` | Sprite/icon generation | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | Game content generation | https://console.anthropic.com/settings/keys |

### Permissions

The repository needs these permissions (already configured):
- `contents: write` - For committing generated content
- `pages: write` - For GitHub Pages deployment
- `id-token: write` - For GitHub Pages authentication
- `actions: write` - For triggering other workflows

## Development Workflow

### For Pull Requests
1. Push to feature branch
2. Open PR to `main` or `develop`
3. CI runs: lint, type-check, test, build
4. Review and merge

### For Main Branch
1. Merge PR to `main`
2. **NEW:** Content generation runs (if scheduled or manual)
3. CI runs: all checks + build
4. E2E and visual tests run
5. Deploy to GitHub Pages
6. Auto-release creates version tag
7. Platform builds triggered for new release

### Manual Content Refresh

To regenerate content manually:

```bash
# Via GitHub Actions UI
Actions → Content Generation → Run workflow → Run on main

# Or locally with API keys
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
npm run generate-content
npm run generate-sprites
npm run generate-hud
npm run generate-ui-icons
npm run generate-pwa-icons
npm run asset-pipeline
```

## Cost Optimization

To minimize API costs:

✅ Content generation runs only on:
- Main branch pushes (not PRs)
- Weekly schedule
- Manual trigger

✅ Using `continue-on-error: true` prevents build failures if API is down

✅ Artifacts are cached between jobs

## Troubleshooting

### Content not generating?
1. Check that API keys are set in GitHub Secrets
2. Check workflow run logs for errors
3. Verify scripts run locally with keys set

### Build failing?
1. CI jobs (lint, test, type-check) run first - check those
2. Build job runs after CI passes
3. Generated content is optional - build works with committed files

### Deployment not happening?
1. Must be on `main` branch
2. Build must succeed
3. E2E tests are non-blocking (deploy happens even if they fail)

## Future Improvements

### Phase 2: Split Workflows (Planned)
- [ ] Extract `ci.yml` (lint, test, type-check)
- [ ] Extract `build.yml` (web build)
- [ ] Extract `test-extended.yml` (e2e, visual)
- [ ] Extract `deploy-web.yml` (GitHub Pages)
- [ ] Extract `release.yml` (semantic release)
- [ ] Use `workflow_call` for reusability

Benefits: Better modularity, easier maintenance, clearer ownership

## Monitoring

View workflow status:
- **Actions tab:** See all workflow runs
- **Deployments:** See GitHub Pages deployments
- **Releases:** See published versions and platform builds

## Support

For issues or questions about workflows:
1. Check workflow logs in Actions tab
2. Review this README
3. Check `WORKFLOW_ANALYSIS.md` for detailed analysis
4. Open an issue with workflow name and run link
