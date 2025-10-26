# CI/CD Secrets Setup Guide

This guide will help you configure the required API keys for automated content generation.

## 🔑 Required Secrets

The CI/CD workflows need two API keys to generate fresh game content automatically:

| Secret Name | Purpose | Used By |
|-------------|---------|---------|
| `OPENAI_API_KEY` | Generate sprites, icons, UI elements | `content-generation.yml` |
| `ANTHROPIC_API_KEY` | Generate level patterns, enemy AI, achievements | `content-generation.yml` |

## 📋 Step-by-Step Setup

### 1. Get Your API Keys

#### OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Give it a name (e.g., "Otter River Rush CI/CD")
5. **Copy the key immediately** (you won't see it again!)
6. Format: `sk-proj-...` (starts with `sk-proj-`)

**Cost:** ~$1-2 per content generation run (sprites + icons)

#### Anthropic API Key

1. Go to https://console.anthropic.com/settings/keys
2. Sign in or create an account
3. Click **"Create Key"**
4. Give it a name (e.g., "Otter River Rush CI/CD")
5. **Copy the key immediately** (you won't see it again!)
6. Format: `sk-ant-api03-...` (starts with `sk-ant-`)

**Cost:** ~$0.10-0.20 per content generation run (game data)

### 2. Add Secrets to GitHub

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

#### Add OPENAI_API_KEY:
- **Name:** `OPENAI_API_KEY`
- **Secret:** Paste your OpenAI key (e.g., `sk-proj-...`)
- Click **Add secret**

#### Add ANTHROPIC_API_KEY:
- **Name:** `ANTHROPIC_API_KEY`
- **Secret:** Paste your Anthropic key (e.g., `sk-ant-api03-...`)
- Click **Add secret**

### 3. Verify Setup

After adding both secrets, you should see them listed in **Settings → Secrets and variables → Actions**:

```
✓ ANTHROPIC_API_KEY
✓ OPENAI_API_KEY
```

> ⚠️ **Security Note:** Secrets are encrypted and never shown in logs or to other users. Only workflow runs can access them.

## 🧪 Test the Setup

### Option 1: Trigger Manual Run

1. Go to **Actions** tab
2. Click **Content Generation** workflow
3. Click **Run workflow** dropdown
4. Select branch: `main`
5. Click **Run workflow**

The workflow will:
- Check if API keys are configured ✓
- Generate game content (enemy AI, levels, achievements)
- Generate sprites and icons
- Run asset pipeline
- Commit changes back to the repo

### Option 2: Push to Main Branch

On your next push to `main`, the content generation will run automatically before the build.

## 🔍 Verify It's Working

### Check Workflow Logs

1. Go to **Actions** tab
2. Click the latest workflow run
3. Click **Generate AI Content & Assets** job
4. You should see:
```
✅ OPENAI_API_KEY is configured
✅ ANTHROPIC_API_KEY is configured
```

### Check Generated Files

After a successful run, check for new commits:
```
chore: regenerate AI content and assets [skip ci]

- Game content (enemies, achievements, patterns, tips)
- Sprites (otter, obstacles, enemies, collectibles)
- HUD and UI icons
- PWA icons
- Asset pipeline optimization
```

## 🚫 What If I Don't Add the Secrets?

**It's OK!** The workflows are designed to be resilient:

- ✅ Builds will still work using committed files
- ⚠️ New content won't be generated automatically
- ⚠️ You'll see warnings in logs:
  ```
  ⚠️ OPENAI_API_KEY not configured - sprite generation will be skipped
  ⚠️ ANTHROPIC_API_KEY not configured - content generation will be skipped
  ```

You can still generate content locally by setting environment variables:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-proj-...
npm run generate-content
npm run generate-sprites
```

## 💰 Cost Management

### How Often Does It Run?

Content generation runs:
- ✅ **Weekly** (Sundays at 2 AM UTC) - Scheduled
- ✅ **Manual** - When you trigger it via Actions UI
- ✅ **On main branch pushes** - Only when code changes

### Estimated Monthly Cost

| Service | Cost per Run | Runs/Month | Monthly Cost |
|---------|-------------|------------|--------------|
| OpenAI | $1.50 | 4-6 | $6-9 |
| Anthropic | $0.15 | 4-6 | $0.60-0.90 |
| **Total** | | | **~$7-10/month** |

### Ways to Reduce Costs

1. **Disable Scheduled Runs**
   - Edit `.github/workflows/content-generation.yml`
   - Comment out the `schedule:` trigger

2. **Only Run on Releases**
   - Remove `workflow_call` trigger
   - Keep only `workflow_dispatch` (manual)

3. **Use Cached Content**
   - Don't add the API keys at all
   - Use committed content only
   - Regenerate manually when needed

## 🛠️ Troubleshooting

### "API key not configured" warnings

**Problem:** Secrets not set or named incorrectly

**Solution:**
1. Check secret names are EXACTLY: `OPENAI_API_KEY` and `ANTHROPIC_API_KEY`
2. Check they're in **Actions** secrets (not Dependabot or Codespaces)
3. Try re-creating the secrets

### "401 Unauthorized" errors

**Problem:** Invalid API key

**Solution:**
1. Verify the key is correct and not expired
2. Check you copied the full key (including `sk-proj-` or `sk-ant-`)
3. Generate a new key and update the secret

### Content not being committed

**Problem:** No changes detected or push failed

**Solution:**
1. Check if content actually changed (might be identical)
2. Verify workflow has `contents: write` permission (it does)
3. Check if branch protection rules prevent bot commits

## 📚 Additional Resources

- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/claude/reference)

## 🆘 Need Help?

1. Check workflow logs in **Actions** tab
2. Review the [Workflow README](.github/workflows/README.md)
3. Check the [Workflow Analysis](.github/workflows/WORKFLOW_ANALYSIS.md)
4. Open an issue with:
   - Workflow name
   - Run link
   - Error messages (without exposing secrets!)

---

**Last Updated:** 2025-10-26  
**Workflow Version:** 1.0.0
