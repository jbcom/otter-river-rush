# Testing Guide

## Overview

Otter River Rush has comprehensive testing coverage including unit tests, integration tests, and end-to-end (E2E) tests using Playwright.

## Test Structure

```
src/client/tests/
├── e2e/                           # End-to-end browser tests
│   ├── game-flow.spec.ts          # Core game flow tests (14 tests)
│   ├── complete-game-flow.spec.ts # Full playthrough tests (3 tests)
│   ├── gameplay.spec.ts           # Gameplay features (20 tests)
│   ├── mobile-gestures.spec.ts    # Touch/gesture tests (1 test)
│   ├── visual.spec.ts             # Visual regression (8 tests)
│   └── ai-playthrough.spec.ts     # AI agent testing (1 test)
├── integration/                   # ECS system tests
│   └── ecs-system.test.ts
└── unit/                          # Unit tests
    └── asset-quality-evaluator.test.ts
```

## Running Tests

### Quick Commands

```bash
# Unit + integration tests
pnpm test

# All E2E tests (all browsers)
pnpm test:e2e

# E2E tests (Chromium only - fastest)
pnpm test:e2e --project=chromium

# Specific test file
pnpm test:e2e tests/e2e/game-flow.spec.ts

# Tests matching pattern
pnpm test:e2e --grep="menu|pause"

# UI mode (interactive)
pnpm test:e2e --ui

# Debug mode
pnpm test:e2e --debug
```

### CI/CD Tests

The GitHub Actions workflow runs a subset of fast, reliable tests:

```bash
pnpm test:e2e --project=chromium --grep="game-flow|complete-game"
```

This runs approximately 17 core tests that verify essential functionality.

## Test Categories

### 1. Game Flow Tests (game-flow.spec.ts)

Tests basic game functionality and user interactions:

- ✅ Main menu loading
- ✅ Game mode selection
- ✅ 3D model loading
- ✅ HUD display
- ✅ Keyboard input
- ✅ Entity spawning
- ⚠️ Pause/resume (timing-sensitive)
- ⚠️ Score tracking (timing-sensitive)
- ⚠️ Game over handling (timing-sensitive)
- ✅ FPS performance

**Status:** 8/14 passing (~57%)

### 2. Complete Game Flow Tests (complete-game-flow.spec.ts)

Tests full player journey scenarios:

- ⚠️ Menu → Play → Dodge → Collect → Die → Restart → Menu
- ⚠️ Pause → Resume flow
- ⚠️ Collision & scoring

**Status:** 0/3 passing (timing issues in headless mode)

### 3. Gameplay Tests (gameplay.spec.ts)

Tests specific gameplay features:

- ⚠️ Game initialization
- ⚠️ Start button interaction
- ⚠️ Pause functionality
- ⚠️ Keyboard controls
- ⚠️ Distance counter
- ⚠️ Game over screen
- ✅ Leaderboard
- ✅ Settings menu
- ✅ Achievements
- ✅ Accessible controls
- ✅ Keyboard navigation
- ✅ Bundle size validation

**Status:** 6/20 passing (~30%)

### 4. Mobile Gestures Tests (mobile-gestures.spec.ts)

Tests touch controls and mobile interactions:

- ⚠️ Swipe left/right
- ⚠️ Swipe up (jump)

**Status:** 0/1 passing (needs touch emulation fixes)

### 5. Visual Regression Tests (visual.spec.ts)

Tests UI rendering consistency:

- ✅ Menu screen rendering
- ⚠️ Gameplay screen rendering
- ⚠️ UI elements visibility
- ⚠️ Canvas dimensions
- ⚠️ Responsive design (mobile/tablet/desktop)

**Status:** 1/8 passing (expected in headless CI)

### 6. AI Playthrough Tests (ai-playthrough.spec.ts)

Autonomous AI agent gameplay:

- ⚠️ 30-second AI session

**Status:** 0/1 passing (requires ANTHROPIC_API_KEY)

## Test Results Summary

**Overall:** 13/47 passing (28%)

### Passing Tests (13)
- Main menu loads correctly
- Game starts in classic mode
- 3D models load without errors
- Keyboard input registers
- Entities spawn over time
- HUD displays during gameplay
- FPS maintains 30+ in headless mode
- Leaderboard accessible
- Settings menu accessible
- Achievements accessible
- Accessible controls work
- Keyboard navigation works
- Bundle size is acceptable

### Common Failure Patterns

1. **Timing Issues (15 failures)**
   - Tests wait for specific element visibility
   - Headless mode may have different timing
   - **Fix:** Use `waitForLoadState('networkidle')` and increase timeouts

2. **State Management (10 failures)**
   - Tests expect specific game state values
   - Game timing varies in headless mode
   - **Fix:** Use relative assertions instead of exact values

3. **Visual Regression (7 failures)**
   - Screenshot pixel differences in headless mode
   - Expected behavior for CI environments
   - **Fix:** Run visual tests locally, skip in CI

4. **Mobile Emulation (1 failure)**
   - Touch gesture simulation not working
   - **Fix:** Update Playwright touch API usage

5. **External Dependencies (1 failure)**
   - AI tests require API key
   - **Fix:** Mark as optional or skip in CI

## Best Practices

### Writing New Tests

1. **Use proper waits:**
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500); // Only when necessary
```

2. **Check game state via debug tools:**
```typescript
const state = await page.evaluate(() => 
  (window as any).__gameStore?.getState?.()
);
```

3. **Use relative assertions:**
```typescript
expect(score).toBeGreaterThan(0); // Not exact values
```

4. **Handle WebGL context:**
```typescript
// Wait for 3D initialization
await page.waitForTimeout(2000);
```

### Debugging Failing Tests

1. **Run in headed mode:**
```bash
pnpm test:e2e --headed
```

2. **Use debug mode:**
```bash
pnpm test:e2e --debug
```

3. **Take screenshots:**
```typescript
await page.screenshot({ path: 'debug.png' });
```

4. **Check console logs:**
```typescript
page.on('console', msg => console.log(msg.text()));
```

## CI/CD Integration

### GitHub Actions Workflow

The `mobile-primary.yml` workflow runs E2E tests:

```yaml
- name: Run E2E (game-flow only, fast)
  working-directory: src/client
  run: pnpm test:e2e --project=chromium --grep="game-flow|complete-game"
```

### Test Artifacts

On failure, Playwright reports are uploaded:

```yaml
- name: Upload Playwright report
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: src/client/playwright-report/**
    retention-days: 7
```

## Performance Considerations

### Test Execution Time

- **All tests:** ~8-10 minutes
- **Chromium only:** ~4-6 minutes  
- **Fast subset:** ~2-3 minutes

### Optimization Tips

1. Use `--project=chromium` for faster feedback
2. Run specific test files during development
3. Use `--grep` to run subset of tests
4. Increase `workers` for parallel execution
5. Use `--max-failures` to stop early

## Known Issues

1. **Pause Screen Tests:** Element visibility timing issues in headless mode
2. **Score Tracking:** Game timing varies causing exact value mismatches  
3. **Visual Tests:** Screenshot differences in CI environment (expected)
4. **Mobile Gestures:** Touch API needs updates for better simulation
5. **AI Tests:** Requires API key, should be marked optional

## Recommendations

### Short Term
- [ ] Fix timing-dependent tests with better wait strategies
- [ ] Update mobile gesture tests with proper touch emulation
- [ ] Make AI tests optional or skip in CI
- [ ] Add retry logic for flaky tests

### Long Term
- [ ] Separate visual regression suite for local development
- [ ] Add performance benchmarking tests
- [ ] Implement test stability monitoring
- [ ] Create test fixtures for common scenarios

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions with Playwright](https://playwright.dev/docs/ci)
- [WebGL Testing Guide](https://threejs.org/docs/#manual/en/introduction/Testing)

## Support

For test-related issues:
1. Check this documentation
2. Review failing test logs in CI artifacts
3. Run tests locally with `--debug`
4. Open an issue with test output and screenshots
