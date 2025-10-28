import { useEffect } from 'react';
import { queries } from './world';
import { useGameStore } from '../hooks/useGameStore';

const ACHIEVEMENTS = {
  FIRST_COIN: { id: 'first_coin', name: 'First Treasure', check: (stats: any) => stats.coins >= 1 },
  COIN_COLLECTOR: { id: 'coin_collector', name: 'Coin Collector', check: (stats: any) => stats.coins >= 100 },
  COIN_MASTER: { id: 'coin_master', name: 'Coin Master', check: (stats: any) => stats.coins >= 500 },
  
  FIRST_GEM: { id: 'first_gem', name: 'Gemstone Hunter', check: (stats: any) => stats.gems >= 1 },
  GEM_COLLECTOR: { id: 'gem_collector', name: 'Gem Collector', check: (stats: any) => stats.gems >= 50 },
  
  DISTANCE_100: { id: 'distance_100', name: 'River Explorer', check: (stats: any) => stats.distance >= 100 },
  DISTANCE_500: { id: 'distance_500', name: 'Rapids Runner', check: (stats: any) => stats.distance >= 500 },
  DISTANCE_1000: { id: 'distance_1000', name: 'Waterway Wanderer', check: (stats: any) => stats.distance >= 1000 },
  DISTANCE_5000: { id: 'distance_5000', name: 'River Legend', check: (stats: any) => stats.distance >= 5000 },
  
  SCORE_1000: { id: 'score_1000', name: 'Getting Started', check: (stats: any) => stats.score >= 1000 },
  SCORE_10000: { id: 'score_10000', name: 'Skilled Swimmer', check: (stats: any) => stats.score >= 10000 },
  SCORE_50000: { id: 'score_50000', name: 'Master Otter', check: (stats: any) => stats.score >= 50000 },
  
  COMBO_5: { id: 'combo_5', name: 'Combo Starter', check: (stats: any) => stats.combo >= 5 },
  COMBO_10: { id: 'combo_10', name: 'Combo Master', check: (stats: any) => stats.combo >= 10 },
  COMBO_20: { id: 'combo_20', name: 'Combo Legend', check: (stats: any) => stats.combo >= 20 },
  
  POWER_UP_SHIELD: { id: 'powerup_shield', name: 'Protected', check: (stats: any) => stats.powerUpsUsed?.shield },
  POWER_UP_GHOST: { id: 'powerup_ghost', name: 'Phantom Otter', check: (stats: any) => stats.powerUpsUsed?.ghost },
  POWER_UP_MAGNET: { id: 'powerup_magnet', name: 'Magnetic Personality', check: (stats: any) => stats.powerUpsUsed?.magnet },
  
  SURVIVOR: { id: 'survivor', name: 'Survivor', check: (stats: any) => stats.distance >= 500 && stats.health === 3 },
  PERFECT_RUN: { id: 'perfect_run', name: 'Perfect Run', check: (stats: any) => stats.distance >= 1000 && stats.health === 3 },
};

const unlockedAchievements = new Set<string>();

export function AchievementSystem() {
  useEffect(() => {
    const checkAchievements = () => {
      const stats = useGameStore.getState();
      const [player] = queries.player.entities;
      
      const gameStats = {
        ...stats,
        health: player?.health || 0,
        powerUpsUsed: {
          shield: player?.invincible,
          ghost: player?.ghost,
          magnet: (player as any)?.magnetActive,
        },
      };
      
      for (const achievement of Object.values(ACHIEVEMENTS)) {
        if (!unlockedAchievements.has(achievement.id) && achievement.check(gameStats)) {
          unlockedAchievements.add(achievement.id);
          showAchievementPopup(achievement.name);
        }
      }
    };
    
    const interval = setInterval(checkAchievements, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return null;
}

function showAchievementPopup(name: string) {
  console.log(`🏆 Achievement Unlocked: ${name}`);
  // TODO: Show visual popup
}
