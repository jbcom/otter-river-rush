# CI/CD Workflow - Content Generation Integration

## COMPLETED 2025-10-26

### What Was Done
- ✅ Integrated AI content generation into build-web job  
- ✅ GitHub secrets (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) → env vars correctly mapped
- ✅ Runs on main branch only (cost optimization)
- ✅ Generates ALL content: game data, sprites, HUD, UI icons
- ✅ Runs asset pipeline for optimization
- ✅ Fails gracefully if APIs unavailable

### What Gets Generated
1. **generate-content** (Anthropic Claude)
   - Enemy AI behaviors
   - Level patterns
   - Achievements
   - Loading tips

2. **generate-sprites** (OpenAI)
   - Otter sprites
   - Obstacle sprites
   - Collectible sprites

3. **generate-hud** (OpenAI)
   - HUD elements
   - Splash screens

4. **generate-ui-icons** (OpenAI)
   - Menu icons
   - Mode icons

5. **asset-pipeline**
   - Optimization
   - Quality checks
   - Format conversion

### Workflow Location
`.github/workflows/ci-cd.yml` lines 118-128

### Cost
~$1-2 per main branch push (OpenAI + Anthropic combined)

### Next Deploy
Next push to main will auto-generate fresh content before build.

---
**Status**: READY ✅
