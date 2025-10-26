# GitHub Actions Workflows

This directory contains automated workflows for CI/CD and releases.

## 🔄 Active Workflows

### CI/CD (`.github/workflows/ci-cd.yml`)
**Triggers**: Push to `main`/`develop`, Pull Requests

**Jobs**:
- **Lint**: ESLint + Prettier checks (all branches/PRs)
- **Type Check**: TypeScript compilation (all branches/PRs)
- **Test**: Unit tests with Vitest (70 tests) (all branches/PRs)
- **Build**: Production build + bundle size check (max 5MB) (all branches/PRs)
- **E2E**: Playwright end-to-end tests (main branch only)
- **Visual Tests**: Visual regression testing (main branch only)
- **Deploy**: Auto-deploy to GitHub Pages (main branch only, after tests pass)

**Deploy URL**: https://jbcom.github.io/otter-river-rush/

**Status**: [![CI/CD](https://github.com/jbcom/otter-river-rush/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/jbcom/otter-river-rush/actions/workflows/ci-cd.yml)

**Key Features**:
- ✅ PRs run fast validation only (lint, type-check, test, build) - no E2E/deploy
- ✅ Main branch: full validation (E2E + visual) + auto-deploy to Pages
- ✅ Optimized for speed: PRs ~3 min, main ~6 min
- ✅ Single build artifact, no redundancy


---

### Release (`.github/workflows/release.yml`)
**Triggers**: Version tags (`v*`), Manual dispatch

**What it builds**:
1. **Web (Capacitor)** - Production build uploaded as artifact (always)
2. **Android APK** - Unsigned release APK (optional, can be skipped)
3. **Desktop Apps** (optional, can be skipped):
   - macOS: `.dmg` and `.zip`
   - Windows: `.exe` installer
   - Linux: `.AppImage` and `.deb` package

**Artifacts**: Uploaded to GitHub Releases automatically (for tag triggers)

**How to trigger**:
```bash
# Automatic: Create and push a version tag
git tag v1.0.0
git push origin v1.0.0

# Manual: Via GitHub Actions UI with options:
# - Version: Custom version tag (default: 'dev')
# - Skip Android: Checkbox to skip Android build
# - Skip Desktop: Checkbox to skip desktop builds
```

---

## 📦 Manual Workflows

### Build Mobile (`.github/workflows/mobile-build.yml`)
**Triggers**: Manual only (deprecated, use `release.yml`)

Quick Android APK build without creating a release.

### Build Desktop (`.github/workflows/desktop-build.yml`)
**Triggers**: Manual only (deprecated, use `release.yml`)

Quick desktop builds for testing without creating a release.

---

## 🚀 Usage

### For Contributors (Pull Requests)
1. Push your branch → CI runs automatically
2. Lint, tests, and build must pass
3. E2E/Visual tests run on `main` merge

### For Maintainers (Releases)

#### Quick Deploy to Pages
```bash
git push origin main
# Automatically deploys to GitHub Pages
```

#### Create a Release
```bash
# Tag a new version
git tag v1.0.0
git push origin v1.0.0

# Workflow automatically:
# 1. Builds web, Android, desktop
# 2. Creates GitHub Release
# 3. Uploads all artifacts
```

#### Manual Build
```bash
# Go to Actions tab
# Select "Release" workflow
# Click "Run workflow"
# Enter version tag (e.g., v1.0.0)
```

---

## 📋 Artifact Retention

- **CI builds**: 7 days
- **Release builds**: 30 days
- **GitHub Releases**: Permanent

---

## 🐛 Troubleshooting

### CI Failing
```bash
# Run locally first
npm run lint
npm run type-check
npm test -- --run
npm run build
```

### Android Build Failing
```bash
# Test locally
npm run build
npx cap sync android
cd android && ./gradlew assembleRelease
```

### Desktop Build Failing
```bash
# Test locally
npm run electron:build
```

### Deploy Failing
- Check if GitHub Pages is enabled in repo settings
- Verify `dist/` folder contains `index.html`
- Check workflow logs for specific errors

---

## 🔐 Secrets Required

**None currently!** All workflows use:
- `GITHUB_TOKEN` (auto-provided by GitHub Actions)
- Public npm packages (no auth needed)

**For future enhancements**:
- `ANDROID_KEYSTORE`: For signed APK releases
- `CODECOV_TOKEN`: For coverage reporting (optional)

---

## 📊 Workflow Status

Check all workflows: [Actions Tab](https://github.com/jbcom/otter-river-rush/actions)

---

## 🎯 Best Practices

1. **Always run CI locally first** before pushing
2. **Use semantic versioning** for tags (v1.0.0, v1.1.0, etc.)
3. **Test release workflow** with manual dispatch before tagging
4. **Check artifacts** after release workflow completes
5. **Update CHANGELOG.md** before creating releases

---

## 📖 Related Documentation

- [Platform Setup Guide](../PLATFORM_SETUP.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Cross-Platform Build Guide](../docs/implementation/CROSS_PLATFORM_BUILD_GUIDE.md)
