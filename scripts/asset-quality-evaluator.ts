#!/usr/bin/env node
/**
 * Asset Quality Evaluator - Analyzes asset quality and detects issues
 */

import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { AssetDefinition, QualityMetrics } from './asset-manifest.js';

const PUBLIC_DIR = join(process.cwd(), 'public');

/**
 * Detect if an image has a white background instead of transparency
 */
async function detectWhiteBackground(buffer: Buffer): Promise<boolean> {
  const { data, info } = await sharp(buffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (!info.channels || info.channels < 4) {
    return false; // No alpha channel
  }

  // Sample corners and edges to check for white opaque pixels
  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  const samplePoints = [
    [0, 0], // Top-left
    [width - 1, 0], // Top-right
    [0, height - 1], // Bottom-left
    [width - 1, height - 1], // Bottom-right
    [Math.floor(width / 2), 0], // Top-center
    [Math.floor(width / 2), height - 1], // Bottom-center
    [0, Math.floor(height / 2)], // Left-center
    [width - 1, Math.floor(height / 2)], // Right-center
  ];

  let whiteOpaqueCount = 0;

  for (const [x, y] of samplePoints) {
    const idx = (y * width + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    // White pixel (RGB near 255) and fully opaque (A = 255)
    if (r > 250 && g > 250 && b > 250 && a === 255) {
      whiteOpaqueCount++;
    }
  }

  // If more than half of sample points are white and opaque, likely has white background
  return whiteOpaqueCount > samplePoints.length / 2;
}

/**
 * Check if image has any transparency
 */
async function hasTransparency(buffer: Buffer): Promise<boolean> {
  const { data, info } = await sharp(buffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (!info.channels || info.channels < 4) {
    return false; // No alpha channel
  }

  const channels = info.channels;

  // Check if any pixel has alpha < 255
  for (let i = 3; i < data.length; i += channels) {
    if (data[i] < 255) {
      return true;
    }
  }

  return false;
}

/**
 * Evaluate quality of a single asset
 */
export async function evaluateAssetQuality(
  asset: AssetDefinition
): Promise<QualityMetrics> {
  const fullPath = join(PUBLIC_DIR, asset.path);

  // Check if file exists
  if (!existsSync(fullPath)) {
    return {
      fileSize: 0,
      fileSizeKB: 0,
      width: 0,
      height: 0,
      aspectRatio: 0,
      format: 'missing',
      hasTransparency: false,
      hasWhiteBackground: false,
      isDistorted: false,
      isUndersized: false,
      isOversized: false,
      qualityScore: 0,
      issues: ['File does not exist'],
      needsRegeneration: true,
    };
  }

  try {
    // Read file
    const buffer = readFileSync(fullPath);
    const fileSize = buffer.length;
    const fileSizeKB = Math.round(fileSize / 1024);

    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;
    const format = metadata.format || 'unknown';
    const aspectRatio = width / height;

    // Run quality checks
    const hasTransparencyCheck = await hasTransparency(buffer);
    const hasWhiteBackgroundCheck = await detectWhiteBackground(buffer);

    // Calculate expected aspect ratio
    const expectedAspectRatio = asset.expectedSize.width / asset.expectedSize.height;
    const aspectRatioTolerance = 0.05; // 5% tolerance
    const isDistorted = Math.abs(aspectRatio - expectedAspectRatio) > aspectRatioTolerance;

    // Check size constraints
    const isUndersized = width < asset.expectedSize.width * 0.8 || 
                         height < asset.expectedSize.height * 0.8;
    const isOversized = fileSizeKB > asset.maxFileSizeKB;

    // Collect issues
    const issues: string[] = [];
    if (format !== asset.expectedFormat) {
      issues.push(`Wrong format: ${format} (expected ${asset.expectedFormat})`);
    }
    if (asset.requiresTransparency && !hasTransparencyCheck) {
      issues.push('Missing transparency (should have transparent background)');
    }
    if (asset.requiresTransparency && hasWhiteBackgroundCheck) {
      issues.push('Has white background instead of transparency');
    }
    if (isDistorted) {
      issues.push(`Distorted aspect ratio: ${aspectRatio.toFixed(2)} (expected ${expectedAspectRatio.toFixed(2)})`);
    }
    if (isUndersized) {
      issues.push(`Undersized: ${width}x${height} (expected ${asset.expectedSize.width}x${asset.expectedSize.height})`);
    }
    if (isOversized) {
      issues.push(`File too large: ${fileSizeKB}KB (max ${asset.maxFileSizeKB}KB)`);
    }

    // Calculate quality score (0-100)
    let qualityScore = 100;
    
    // Deduct points for each issue
    if (format !== asset.expectedFormat) qualityScore -= 20;
    if (asset.requiresTransparency && !hasTransparencyCheck) qualityScore -= 30;
    if (hasWhiteBackgroundCheck) qualityScore -= 25;
    if (isDistorted) qualityScore -= 15;
    if (isUndersized) qualityScore -= 20;
    if (isOversized) qualityScore -= 10;

    qualityScore = Math.max(0, qualityScore);

    // Determine if regeneration is needed
    const needsRegeneration = qualityScore < 70 || 
                              (asset.requiresTransparency && hasWhiteBackgroundCheck);

    return {
      fileSize,
      fileSizeKB,
      width,
      height,
      aspectRatio,
      format,
      hasTransparency: hasTransparencyCheck,
      hasWhiteBackground: hasWhiteBackgroundCheck,
      isDistorted,
      isUndersized,
      isOversized,
      qualityScore,
      issues,
      needsRegeneration,
    };
  } catch (error) {
    return {
      fileSize: 0,
      fileSizeKB: 0,
      width: 0,
      height: 0,
      aspectRatio: 0,
      format: 'error',
      hasTransparency: false,
      hasWhiteBackground: false,
      isDistorted: false,
      isUndersized: false,
      isOversized: false,
      qualityScore: 0,
      issues: [`Error reading file: ${error}`],
      needsRegeneration: true,
    };
  }
}

/**
 * Evaluate all assets in manifest
 */
export async function evaluateAllAssets(
  manifest: AssetDefinition[]
): Promise<Map<string, QualityMetrics>> {
  const results = new Map<string, QualityMetrics>();

  for (const asset of manifest) {
    console.log(`\n📊 Evaluating: ${asset.name}`);
    const quality = await evaluateAssetQuality(asset);
    results.set(asset.id, quality);

    // Display results
    const scoreEmoji = quality.qualityScore >= 90 ? '✅' : 
                       quality.qualityScore >= 70 ? '⚠️' : '❌';
    console.log(`   ${scoreEmoji} Quality Score: ${quality.qualityScore}/100`);
    console.log(`   📐 Size: ${quality.width}x${quality.height} (${quality.fileSizeKB}KB)`);
    console.log(`   🎨 Format: ${quality.format}`);
    console.log(`   🔍 Transparency: ${quality.hasTransparency ? 'Yes' : 'No'}`);
    
    if (quality.hasWhiteBackground) {
      console.log(`   🚨 WHITE BACKGROUND DETECTED (should be transparent)`);
    }
    
    if (quality.issues.length > 0) {
      console.log(`   ⚠️  Issues:`);
      quality.issues.forEach(issue => console.log(`      - ${issue}`));
    }
    
    if (quality.needsRegeneration) {
      console.log(`   🔄 NEEDS REGENERATION`);
    }
  }

  return results;
}

/**
 * Generate summary report
 */
export function generateQualityReport(
  manifest: AssetDefinition[],
  qualityResults: Map<string, QualityMetrics>
): void {
  console.log('\n\n' + '='.repeat(80));
  console.log('🎨 ASSET QUALITY REPORT');
  console.log('='.repeat(80));

  const totalAssets = manifest.length;
  const perfect = Array.from(qualityResults.values()).filter(q => q.qualityScore === 100).length;
  const good = Array.from(qualityResults.values()).filter(q => q.qualityScore >= 70 && q.qualityScore < 100).length;
  const poor = Array.from(qualityResults.values()).filter(q => q.qualityScore < 70).length;
  const needRegeneration = Array.from(qualityResults.values()).filter(q => q.needsRegeneration).length;

  console.log(`\n📊 Overall Statistics:`);
  console.log(`   Total Assets: ${totalAssets}`);
  console.log(`   ✅ Perfect (100): ${perfect}`);
  console.log(`   ⚠️  Good (70-99): ${good}`);
  console.log(`   ❌ Poor (<70): ${poor}`);
  console.log(`   🔄 Need Regeneration: ${needRegeneration}`);

  // Average quality score
  const avgScore = Array.from(qualityResults.values())
    .reduce((sum, q) => sum + q.qualityScore, 0) / totalAssets;
  console.log(`   📈 Average Quality Score: ${avgScore.toFixed(1)}/100`);

  // Assets by category
  console.log(`\n📁 By Category:`);
  const categories = ['sprite', 'hud', 'icon', 'pwa', 'ui'] as const;
  for (const category of categories) {
    const categoryAssets = manifest.filter(a => a.category === category);
    const categoryScore = categoryAssets.reduce((sum, asset) => {
      const quality = qualityResults.get(asset.id);
      return sum + (quality?.qualityScore || 0);
    }, 0) / categoryAssets.length;
    
    console.log(`   ${category.padEnd(8)}: ${categoryScore.toFixed(1)}/100 (${categoryAssets.length} assets)`);
  }

  // Critical issues
  const whiteBackgrounds = Array.from(qualityResults.entries())
    .filter(([_, q]) => q.hasWhiteBackground);
  const missingTransparency = Array.from(qualityResults.entries())
    .filter(([id, q]) => {
      const asset = manifest.find(a => a.id === id);
      return asset?.requiresTransparency && !q.hasTransparency;
    });

  if (whiteBackgrounds.length > 0) {
    console.log(`\n🚨 CRITICAL: ${whiteBackgrounds.length} assets with WHITE BACKGROUNDS:`);
    whiteBackgrounds.forEach(([id, _]) => {
      const asset = manifest.find(a => a.id === id);
      console.log(`   - ${asset?.name} (${asset?.path})`);
    });
  }

  if (missingTransparency.length > 0) {
    console.log(`\n⚠️  ${missingTransparency.length} assets missing required transparency:`);
    missingTransparency.forEach(([id, _]) => {
      const asset = manifest.find(a => a.id === id);
      console.log(`   - ${asset?.name} (${asset?.path})`);
    });
  }

  // Assets needing regeneration
  if (needRegeneration > 0) {
    console.log(`\n🔄 ${needRegeneration} assets recommended for regeneration:`);
    Array.from(qualityResults.entries())
      .filter(([_, q]) => q.needsRegeneration)
      .forEach(([id, q]) => {
        const asset = manifest.find(a => a.id === id);
        console.log(`   - ${asset?.name} (Score: ${q.qualityScore}/100)`);
        q.issues.forEach(issue => console.log(`     • ${issue}`));
      });
  }

  console.log('\n' + '='.repeat(80));
}
