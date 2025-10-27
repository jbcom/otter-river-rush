# GitHub Actions Workflows

This directory contains the CI/CD workflows for Otter River Rush. The workflows have been organized into separate, focused files to improve maintainability and clarity.

## Workflow Overview

### 🔍 CI (`ci.yml`)
**Triggers:** All pushes to `main`/`develop` branches, all PRs  
**Purpose:** Core quality checks  
**Jobs:**
- Lint (ESLint + Prettier)
- Type check (TypeScript)
- Unit tests (Vitest)
- Build web (Vite production build)
- E2E tests (Playwright, main branch only)
- Visual regression tests (Playwright, main branch only)

**Artifacts:** Build output saved for 7 days

### 🚀 Deploy (`deploy.yml`)
**Triggers:** After successful CI on `main` branch, manual dispatch  
**Purpose:** Deploy to GitHub Pages  
**Jobs:**
- Build web with optional asset generation
- Deploy to GitHub Pages

**Manual Dispatch Options:**
- `generate_assets`: Generate fresh sprites/icons with AI (requires API keys)

### 📦 Release (`release.yml`)
**Triggers:** After successful Deploy on `main` branch, manual dispatch  
**Purpose:** Automated semantic versioning and releases  
**Jobs:**
- Semantic Release (creates version tags, CHANGELOG.md, GitHub release)
- Triggers Platform Builds workflow if new version created

### 🏗️ Platform Builds (`platform-builds.yml`)
**Triggers:** Called by Release workflow when new version is published, manual dispatch  
**Purpose:** Build native platform distributions  
**Jobs:**
- Android APK (unsigned)
- Desktop builds (Linux AppImage/deb, macOS dmg, Windows exe)

**⚠️  CRITICAL WARNING:** These builds have **NEVER been manually tested**!  
See `PLATFORM_BUILD_TESTING.md` for full testing checklist.  
See `QUICK_TEST_GUIDE.md` for 5-minute smoke test.

## Workflow Chain

```
Push to main
    ↓
CI Workflow (ci.yml)
    ├─ lint
    ├─ type-check  
    ├─ test
    ├─ build-web
    ├─ e2e (main only)
    └─ visual-tests (main only)
    ↓
Deploy Workflow (deploy.yml)
    └─ deploy-web → GitHub Pages
    ↓
Release Workflow (release.yml)
    ├─ semantic-release
    ├─ create GitHub release
    └─ trigger platform-builds (if new version)
    ↓
Platform Builds Workflow (platform-builds.yml)
    ├─ build-android
    └─ build-desktop (Linux, macOS, Windows)
```

## Manual Testing Requirements

### Before Every Release ⚠️

**Platform builds MUST be manually tested** before being considered production-ready:

1. **Android**: Download APK, install on device, verify game works
2. **Linux**: Test both AppImage and .deb packages
3. **macOS**: Test .dmg package, verify Gatekeeper bypass works
4. **Windows**: Test .exe installer

**See documentation:**
- `PLATFORM_BUILD_TESTING.md` - Complete testing checklist
- `QUICK_TEST_GUIDE.md` - 5-minute smoke test

## Workflow Files Explained

### Old Structure (Removed)
- ❌ `ci-cd.yml` - Massive 372-line file doing everything
  - Was too top-heavy, hard to maintain
  - Mixed concerns (CI, deployment, release, platform builds)
  - Removed and split into focused workflows

### New Structure (Current)
- ✅ `ci.yml` - CI only (lint, test, build)
- ✅ `deploy.yml` - Deployment only (GitHub Pages)
- ✅ `release.yml` - Release automation only (semantic-release)
- ✅ `platform-builds.yml` - Native builds only (Android, Desktop)

## Benefits of New Structure

1. **Clarity**: Each workflow has a single, clear purpose
2. **Maintainability**: Easier to update individual workflows
3. **Debugging**: Easier to identify which step failed
4. **Flexibility**: Can trigger workflows independently
5. **Concurrency**: Each workflow has its own concurrency group

## Running Workflows Manually

### Test CI Pipeline
```bash
# Push to any branch triggers CI automatically
git push origin your-branch
```

### Deploy to GitHub Pages
Go to Actions → Deploy → Run workflow
- Optionally enable "Generate fresh assets with AI"

### Create a Release
Go to Actions → Release → Run workflow
- Will run semantic-release and create version tag if commits warrant it

### Build Platform Packages
Go to Actions → Platform Builds → Run workflow
- Requires `version` input (e.g., `v1.0.0`)
- **WARNING**: Builds untested, see testing docs first!

## Environment Variables & Secrets

### Required Secrets
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

### Optional Secrets (for asset generation)
- `ANTHROPIC_API_KEY` - For AI sprite generation
- `OPENAI_API_KEY` - For AI content generation

## Troubleshooting

### CI Fails on Build
- Check Node.js version (should be 22)
- Verify `npm ci` completes successfully
- Check for TypeScript errors

### Deploy Fails
- Ensure GitHub Pages is enabled in repository settings
- Verify Pages source is set to "GitHub Actions"

### Platform Builds Fail
- **Android**: Check JDK 17 is available, Gradle wrapper is executable
- **Desktop**: Check Electron builder configuration in package.json
- **All**: Verify version tag exists in repository

### E2E/Visual Tests Fail
- These only run on `main` branch pushes
- Check Playwright browser installation
- Review test artifacts in Actions run

## Known Issues

1. **Platform builds untested**: See testing docs
2. **Unsigned builds**: All platform builds are unsigned, will trigger OS security warnings
3. **No signing certificates**: Production releases should be signed (future improvement)
4. **Asset generation failures**: Non-blocking, falls back to committed files

## Future Improvements

- [ ] Add automated smoke tests for platform builds
- [ ] Set up Android emulator in CI for APK testing
- [ ] Add code signing for production releases
- [ ] Implement test builds workflow (doesn't create release)
- [ ] Add performance benchmarking to CI
- [ ] Set up notification system for failed builds

## Contributing

When modifying workflows:

1. Test changes on a feature branch first
2. Verify workflows complete successfully before merging
3. Update this README if adding/changing workflows
4. Follow conventional commit format for release automation

## Questions?

See also:
- `.github/PLATFORM_BUILD_TESTING.md` - Detailed platform testing
- `.github/QUICK_TEST_GUIDE.md` - Quick smoke test
- `.github/COMMIT_CONVENTION.md` - Commit format for releases
- `docs/implementation/CROSS_PLATFORM_BUILD_GUIDE.md` - Platform setup

---

Last Updated: 2025-10-27  
Reorganized from monolithic `ci-cd.yml` to focused workflows
