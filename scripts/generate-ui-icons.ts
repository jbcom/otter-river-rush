#!/usr/bin/env node
/**
 * UI Icon Generator - Creates custom game icons using AI
 * Replaces generic emojis with branded Otter River Rush icons
 */

import { openai } from '@ai-sdk/openai';
import { experimental_generateImage as generateImage } from 'ai';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const ICONS_DIR = join(process.cwd(), 'public', 'icons');

// Ensure directory exists
if (!existsSync(ICONS_DIR)) {
  mkdirSync(ICONS_DIR, { recursive: true });
}

interface IconConfig {
  name: string;
  prompt: string;
  filename: string;
  size: '1024x1024';
}

const ICON_CONFIGS: IconConfig[] = [
  // Game Mode Icons
  {
    name: 'Rapid Rush Mode Icon',
    prompt: 'Cute cartoon otter running fast through water, dynamic action pose, blue water splash, vibrant colors, game mode icon, circular icon design, playful style, clean simple design for mobile game UI',
    filename: 'mode-rapid-rush.png',
    size: '1024x1024',
  },
  {
    name: 'Speed Splash Mode Icon',
    prompt: 'Stopwatch or timer with water droplets, blue and orange colors, fast motion effect, game mode icon, circular icon design, energetic feel, clean simple design for mobile game UI',
    filename: 'mode-speed-splash.png',
    size: '1024x1024',
  },
  {
    name: 'Chill Cruise Mode Icon',
    prompt: 'Relaxed cartoon otter floating peacefully on water, calm serene expression, gentle waves, pastel colors, game mode icon, circular icon design, zen peaceful style, clean simple design for mobile game UI',
    filename: 'mode-chill-cruise.png',
    size: '1024x1024',
  },
  {
    name: 'Daily Dive Mode Icon',
    prompt: 'Calendar with water splash or otter diving, daily challenge theme, colorful vibrant design, game mode icon, circular icon design, exciting feel, clean simple design for mobile game UI',
    filename: 'mode-daily-dive.png',
    size: '1024x1024',
  },
  
  // HUD Icons
  {
    name: 'Score Star Icon',
    prompt: 'Bright golden star with water droplets, sparkling effect, game score icon, small UI element, clean simple design suitable for HUD overlay',
    filename: 'hud-star.png',
    size: '1024x1024',
  },
  {
    name: 'Distance Runner Icon',
    prompt: 'Cute cartoon otter running silhouette, side view, dynamic pose, small UI icon, game distance meter, clean simple design suitable for HUD overlay',
    filename: 'hud-distance.png',
    size: '1024x1024',
  },
  {
    name: 'Coin Icon',
    prompt: 'Shiny gold coin with otter paw print embossed on it, sparkling effect, game currency icon, small UI element, clean simple design suitable for HUD overlay',
    filename: 'hud-coin.png',
    size: '1024x1024',
  },
  {
    name: 'Gem Icon',
    prompt: 'Brilliant blue gemstone, diamond cut, sparkling effect, premium game currency, small UI element, clean simple design suitable for HUD overlay',
    filename: 'hud-gem.png',
    size: '1024x1024',
  },
  {
    name: 'Heart Life Icon',
    prompt: 'Cute cartoon heart with water droplet pattern, bright red color, glossy effect, life counter icon, game health indicator, small UI element, clean simple design suitable for HUD overlay',
    filename: 'hud-heart.png',
    size: '1024x1024',
  },
  
  // Menu Icons
  {
    name: 'Leaderboard Trophy Icon',
    prompt: 'Golden trophy with otter ears on top, victory celebration, game leaderboard icon, medium size UI button icon, clean simple design',
    filename: 'menu-leaderboard.png',
    size: '1024x1024',
  },
  {
    name: 'Stats Chart Icon',
    prompt: 'Bar chart or statistics graph with water theme, blue and orange colors, game stats icon, medium size UI button icon, clean simple design',
    filename: 'menu-stats.png',
    size: '1024x1024',
  },
  {
    name: 'Settings Gear Icon',
    prompt: 'Mechanical gear with water droplets, blue-gray metallic color, game settings icon, medium size UI button icon, clean simple design',
    filename: 'menu-settings.png',
    size: '1024x1024',
  },
];

async function generateIcon(config: IconConfig): Promise<void> {
  console.log(`\n🎨 Generating: ${config.name}`);
  console.log(`   Size: ${config.size}`);
  
  try {
    const result = await generateImage({
      model: openai.image('gpt-image-1'),
      prompt: config.prompt,
      size: config.size,
    });

    const base64Data = result.image.base64;
    const buffer = Buffer.from(base64Data, 'base64');
    
    const filepath = join(ICONS_DIR, config.filename);
    writeFileSync(filepath, buffer);
    
    console.log(`   ✅ Saved: ${config.filename} (${Math.round(buffer.length / 1024)}KB)`);
  } catch (error) {
    console.error(`   ❌ Failed to generate ${config.name}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting UI Icon Generation...\n');
  console.log(`📁 Output directory: ${ICONS_DIR}`);
  console.log(`🖼️  Total icons: ${ICON_CONFIGS.length}\n`);

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('\n❌ Error: OPENAI_API_KEY environment variable not set');
    console.log('💡 Set your OpenAI API key: export OPENAI_API_KEY=your-key-here');
    process.exit(1);
  }

  // Generate all icons
  for (const config of ICON_CONFIGS) {
    await generateIcon(config);
    // Delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✨ UI Icon Generation Complete!');
  console.log(`📂 Icons saved to: ${ICONS_DIR}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Run: npm run process-icons (to resize/optimize)');
  console.log('   2. Icons will be automatically used by UI components');
  console.log('   3. Check the icons at multiple sizes to ensure quality');
}

main().catch(console.error);
