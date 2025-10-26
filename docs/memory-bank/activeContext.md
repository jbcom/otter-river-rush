# Active Context - Otter River Rush

**Last Updated**: 2025-10-26  
**Current Branch**: copilot/refactor-image-processing-pipeline  
**Session Status**: 🔧 CI/CD WORKFLOW FIX + ASSET PIPELINE REFINEMENT

## Current Work Focus

### Primary Task: Migrate to Vercel AI SDK ✅
**Status**: ✅ COMPLETE  
**Started**: 2025-10-26

**Problem**:
- Scripts were using native `@anthropic-ai/sdk` directly
- Inconsistent with OpenAI scripts using Vercel AI SDK
- Should use `@ai-sdk/anthropic` for consistency

**Solution Implemented**:
1. Replaced `@anthropic-ai/sdk` with `@ai-sdk/anthropic` in package.json
2. Updated `generate-content.ts` to use Vercel AI SDK:
   - `import { anthropic } from '@ai-sdk/anthropic'`
   - `import { generateText } from 'ai'`
   - Replaced `anthropic.messages.create()` with `generateText({ model: anthropic(...), prompt: ... })`
3. Updated `generate-level-patterns.ts` to use Vercel AI SDK
4. All scripts now consistently use Vercel AI SDK

**Result**:
- ✅ Consistent API across all generation scripts
- ✅ Vercel AI SDK handles auth automatically from `process.env.ANTHROPIC_API_KEY`
- ✅ Simpler, cleaner code
- ✅ No linter errors

### Secondary Task: CI/CD Content Generation Integration ✅
**Status**: ✅ COMPLETE

## Recent Changes

### Vercel AI SDK Migration (2025-10-26) ✅
**Completed**: Migrated all AI generation scripts to use Vercel AI SDK consistently

**What Was Done**:

#### 1. Package Updates
- **Removed**: `@anthropic-ai/sdk@^0.67.0`
- **Added**: `@ai-sdk/anthropic@^1.0.11`
- Now using Vercel AI SDK for both OpenAI and Anthropic

#### 2. Script Updates
- **scripts/generate-content.ts**:
  - Replaced native Anthropic SDK with Vercel AI
  - Changed from `anthropic.messages.create()` to `generateText({ model: anthropic(...), prompt })`
  - Cleaner, simpler API
  - 4 functions updated: generateEnemyBehaviors, generateAchievements, generateLevelPatterns, generateGameTips

- **scripts/generate-level-patterns.ts**:
  - Same migration to Vercel AI SDK
  - Consistent pattern across all generation scripts

#### 3. Benefits
- ✅ Consistent API across all scripts
- ✅ Auto-picks up `ANTHROPIC_API_KEY` from env
- ✅ Simpler code, less boilerplate
- ✅ Better type safety

### CI/CD Content Generation Integration (2025-10-26) ✅
**Completed**: Integrated AI content generation into build process

**What Was Done**:

#### 1. Added Content Generation to Build Job
- **Modified `.github/workflows/ci-cd.yml`**:
  - New step in `build-web` job after npm ci
  - Runs on main branch only (`if: github.ref == 'refs/heads/main'`)
  - Generates fresh content before build
  - Uses existing secrets: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
  - Falls back to committed files if generation fails
  
- **What Gets Generated**:
  - Enemy AI behaviors and definitions (Claude)
  - Level patterns and obstacles (Claude)
  - Achievements and loading tips (Claude)
  - Otter and obstacle sprites (OpenAI)
  - HUD elements and UI icons (OpenAI)
  - Asset pipeline optimization (idempotent)

#### 2. Fixed Asset Post-Processor Bugs
- **scripts/asset-post-processor.ts**:
  - Line 206: Adaptive quality now uses `'png'` explicitly
  - Lines 129-134: Fixed ICO format handling
    - Removed redundant resize
    - Dynamic quality parameter
    - Added effort: 10
  - Lines 136-139: Added exhaustive type check
    - Throws on unsupported format
    - Compile-time safety

#### 3. Cleaned Up Documentation Bloat
- Deleted unnecessary workflow documentation files
- Removed example workflows (secrets already integrated!)
- Kept only essential docs

**Rationale**:
- Asset quality is critical for visual game
- AI-generated content must stay fresh
- Automated pipeline reduces manual errors
- Cost-optimized (runs only on main, not PRs)

## How Content Generation Works Now

### Flow on Push to Main
```
Push to main
  ↓
CI (lint, test, type-check) - parallel
  ↓
build-web job:
  1. Install dependencies
  2. Generate fresh content ✨ (NEW!)
     - npm run generate-content (Claude API)
     - npm run generate-sprites (OpenAI API)
     - npm run asset-pipeline (optimization)
  3. Build project (uses fresh content)
  4. Upload dist/ artifact
  ↓
E2E + Visual Tests
  ↓
Deploy to GitHub Pages
  ↓
Auto-release (semantic versioning)
  ↓
Platform Builds (if new version)
```

### Cost Management
- Only runs on main branch (not PRs)
- Estimated cost: $1-2 per deployment
  - OpenAI: ~$1.50 (sprites, icons)
  - Anthropic: ~$0.15 (game data)
- Fails gracefully if API keys missing

## Previous Work (2025-10-26)

### CI/CD Consolidation + Semantic Release Automation ✅
**Status**: ✅ Complete  
**Completed**: 2025-10-26

**Objectives Accomplished**:
1. ✅ Fixed bundle size issue (7.1MB → 4.2MB, 41% reduction)
   - Implemented adaptive PNG compression in process-icons.ts
   - Optimized 37 PNG assets across sprites/icons/hud
2. ✅ Consolidated 4 separate workflows into unified ci-cd.yml
   - Removed release.yml, desktop-build.yml, mobile-build.yml
   - Single workflow with intelligent gating logic
3. ✅ Implemented automated semantic versioning
   - Added semantic-release to auto-release job
   - Configured .releaserc.json for version bumping
   - Automatic changelog generation
   - Tags created and pushed automatically
4. ✅ Fixed conditional dependency bug in create-release job
   - Added always() condition to handle skipped platform builds
   - Release job runs even if Android/Desktop builds are disabled
   - Graceful artifact handling with continue-on-error

## Next Steps

### Immediate - Investigate Release Issues
1. Check recent workflow runs for auto-release job
2. Verify commit messages follow conventional format
3. Check semantic-release logs for errors
4. Test manual release trigger if needed

### Short-term - Monitor Content Generation
1. Watch next main branch push for content generation
2. Verify fresh content is generated and built
3. Check API costs in OpenAI/Anthropic dashboards
4. Ensure asset quality remains high

### Medium-term - Phase 2 Production Migration
1. Complete Tailwind UI conversion
2. Test responsive design on multiple devices
3. Begin React Three Fiber migration
4. Setup AI asset generation pipeline

## Important Patterns and Preferences

### Content Generation Pattern
- **Idempotent**: Safe to run multiple times
- **Graceful Failure**: Continues with committed files if APIs fail
- **Cost-Optimized**: Only on main branch, not PRs
- **Transparent**: Clear logging of what's generated

### Asset Pipeline Pattern
- **Quality-First**: Adaptive quality ensures file size targets
- **Format-Specific**: Different handling for PNG, ICO, WebP, JPG
- **Exhaustive Checking**: Compile-time safety for new formats
- **Idempotent**: Can run multiple times safely

## Quick Reference

### Key Files Modified
- `.github/workflows/ci-cd.yml` - Added content generation step
- `scripts/asset-post-processor.ts` - Fixed bugs and improved safety
- `README.md` - Updated deployment section
- `docs/memory-bank/activeContext.md` - This file

### Key Commands
```bash
# Generate content locally
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-proj-...
npm run generate-content      # Game data
npm run generate-sprites      # Sprites  
npm run asset-pipeline        # Optimize

# Test build
npm run build

# Check workflow runs
gh run list --workflow="CI/CD"
```

### Git Status
- **Branch**: copilot/refactor-image-processing-pipeline
- **Working Tree**: Clean
- **Next**: Push and merge to main

---

**Next Update**: After investigating release issues  
**Review Frequency**: Every development session  
**Current Focus**: CI/CD reliability and automation
