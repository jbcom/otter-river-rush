export const LEVEL_PATTERNS = [
  {
    id: 'gentle_wave',
    name: 'Gentle Wave',
    description: 'Easy alternating obstacles between lanes',
    difficulty: 2,
    duration: 8000, // 8 seconds
    obstacles: [
      { time: 0, lane: 0, type: 'rock' },
      { time: 1000, lane: 1, type: 'log' },
      { time: 2000, lane: 2, type: 'rock' },
      { time: 3000, lane: 1, type: 'branch' },
      { time: 4000, lane: 0, type: 'log' },
      { time: 5000, lane: 2, type: 'rock' },
      { time: 6000, lane: 1, type: 'branch' },
      { time: 7000, lane: 0, type: 'rock' }
    ],
    recommendedBiome: 'peaceful_stream',
    enemySpawnRules: {
      enabled: false,
      frequency: 0,
      types: []
    }
  },

  {
    id: 'sharp_zigzag',
    name: 'Sharp Zigzag',
    description: 'Forces rapid lane switching in zigzag pattern',
    difficulty: 6,
    duration: 10000,
    obstacles: [
      { time: 0, lane: 0, type: 'boulder' },
      { time: 0, lane: 1, type: 'boulder' },
      { time: 1200, lane: 1, type: 'boulder' },
      { time: 1200, lane: 2, type: 'boulder' },
      { time: 2400, lane: 0, type: 'boulder' },
      { time: 2400, lane: 1, type: 'boulder' },
      { time: 3600, lane: 1, type: 'boulder' },
      { time: 3600, lane: 2, type: 'boulder' },
      { time: 4800, lane: 0, type: 'boulder' },
      { time: 4800, lane: 1, type: 'boulder' },
      { time: 6000, lane: 1, type: 'rock' },
      { time: 6000, lane: 2, type: 'rock' },
      { time: 7200, lane: 0, type: 'rock' },
      { time: 7200, lane: 1, type: 'rock' },
      { time: 8400, lane: 1, type: 'rock' },
      { time: 8400, lane: 2, type: 'rock' }
    ],
    recommendedBiome: 'wild_rapids',
    enemySpawnRules: {
      enabled: true,
      frequency: 3000,
      types: ['fish_enemy']
    }
  },

  {
    id: 'boulder_gauntlet',
    name: 'Boulder Gauntlet',
    description: 'Dense pattern of large obstacles with tight timing',
    difficulty: 8,
    duration: 12000,
    obstacles: [
      { time: 0, lane: 0, type: 'boulder' },
      { time: 800, lane: 2, type: 'boulder' },
      { time: 1600, lane: 1, type: 'boulder' },
      { time: 2200, lane: 0, type: 'boulder' },
      { time: 2800, lane: 2, type: 'boulder' },
      { time: 3600, lane: 1, type: 'boulder' },
      { time: 4000, lane: 0, type: 'rock' },
      { time: 4400, lane: 2, type: 'rock' },
      { time: 5200, lane: 1, type: 'boulder' },
      { time: 5800, lane: 0, type: 'boulder' },
      { time: 6400, lane: 2, type: 'boulder' },
      { time: 7200, lane: 1, type: 'boulder' },
      { time: 7800, lane: 0, type: 'rock' },
      { time: 8400, lane: 2, type: 'rock' },
      { time: 9000, lane: 1, type: 'boulder' },
      { time: 9600, lane: 0, type: 'boulder' },
      { time: 10200, lane: 2, type: 'boulder' },
      { time: 10800, lane: 1, type: 'rock' }
    ],
    recommendedBiome: 'mountain_stream',
    enemySpawnRules: {
      enabled: true,
      frequency: 4000,
      types: ['bear_enemy', 'hawk_enemy']
    }
  },

  {
    id: 'calm_waters',
    name: 'Calm Waters',
    description: 'Breather section with minimal, well-spaced obstacles',
    difficulty: 1,
    duration: 6000,
    obstacles: [
      { time: 1500, lane: 1, type: 'branch' },
      { time: 3000, lane: 0, type: 'log' },
      { time: 4500, lane: 2, type: 'branch' }
    ],
    recommendedBiome: 'peaceful_stream',
    enemySpawnRules: {
      enabled: true,
      frequency: 8000,
      types: ['friendly_fish']
    }
  },

  {
    id: 'left_wall_force',
    name: 'Left Wall Force',
    description: 'Blocks left two lanes, forces right lane navigation',
    difficulty: 4,
    duration: 5000,
    obstacles: [
      { time: 0, lane: 0, type: 'boulder' },
      { time: 0, lane: 1, type: 'boulder' },
      { time: 1000, lane: 0, type: 'rock' },
      { time: 1000, lane: 1, type: 'rock' },
      { time: 2000, lane: 0, type: 'boulder' },
      { time: 2000, lane: 1, type: 'boulder' },
      { time: 3000, lane: 0, type: 'rock' },
      { time: 3000, lane: 1, type: 'rock' },
      { time: 4000, lane: 0, type: 'boulder' },
      { time: 4000, lane: 1, type: 'boulder' }
    ],
    recommendedBiome: 'narrow_canyon',
    enemySpawnRules: {
      enabled: true,
      frequency: 2500,
      types: ['fish_enemy']
    }
  },

  {
    id: 'clockwise_spiral',
    name: 'Clockwise Spiral',
    description: 'Rotating obstacle pattern that spirals clockwise',
    difficulty: 7,
    duration: 9000,
    obstacles: [
      { time: 0, lane: 1, type: 'rock' },
      { time: 750, lane: 2, type: 'rock' },
      { time: 1500, lane: 1, type: 'rock' },
      { time: 2250, lane: 0, type: 'rock' },
      { time: 3000, lane: 1, type: 'boulder' },
      { time: 3750, lane: 2, type: 'boulder' },
      { time: 4500, lane: 1, type: 'boulder' },
      { time: 5250, lane: 0, type: 'boulder' },
      { time: 6000, lane: 1, type: 'rock' },
      { time: 6750, lane: 2, type: 'rock' },
      { time: 7500, lane: 1, type: 'rock' },
      { time: 8250, lane: 0, type: 'rock' }
    ],
    recommendedBiome: 'whirlpool_zone',
    enemySpawnRules: {
      enabled: true,
      frequency: 3000,
      types: ['whirlpool_enemy']
    }
  },

  {
    id: 'chaos_clusters',
    name: 'Chaos Clusters',
    description: 'Random clusters of obstacles with unpredictable spacing',
    difficulty: 6,
    duration: 11000,
    obstacles: [
      { time: 500, lane: 0, type: 'rock' },
      { time: 700, lane: 2, type: 'branch' },
      { time: 2200, lane: 1, type: 'boulder' },
      { time: 2400, lane: 2, type: 'rock' },
      { time: 2600, lane: 0, type: 'log' },
      { time: 4800, lane: 1, type: 'rock' },
      { time: 5000, lane: 0, type: 'boulder' },
      { time: 6500, lane: 2, type: 'rock' },
      { time: 6700, lane: 1, type: 'branch' },
      { time: 6900, lane: 0, type: 'rock' },
      { time: 8800, lane: 1, type: 'boulder' },
      { time: 9200, lane: 2, type: 'rock' },
      { time: 10100, lane: 0, type: 'log' },
      { time: 10300, lane: 1, type: 'branch' }
    ],
    recommendedBiome: 'wild_rapids',
    enemySpawnRules: {
      enabled: true,
      frequency: 2800,
      types: ['fish_enemy', 'bird_enemy']
    }
  },

  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Rapid-fire obstacles testing quick reflexes',
    difficulty: 9,
    duration: 8000,
    obstacles: [
      { time: 0, lane: 1, type: 'rock' },
      { time: 400, lane: 0, type: 'rock' },
      { time: 800, lane: 2, type: 'rock' },
      { time: 1200, lane: 1, type: 'boulder' },
      { time: 1600, lane: 0, type: 'rock' },
      { time: 2000, lane: 2, type: 'rock' },
      { time: 2400, lane: 1, type: 'rock' },
      { time: 2800, lane: 0, type: 'boulder' },
      { time: 3200, lane: 2, type: 'rock' },
      { time: 3600, lane: 1, type: 'rock' },
      { time: 4000, lane: 0, type: 'rock' },
      { time: 4400, lane: 2, type: 'boulder' },
      { time: 4800, lane: 1, type: 'rock' },
      { time: 5200, lane: 0, type: 'rock' },
      { time: 5600, lane: 2, type: 'rock' },
      { time: 6000, lane: 1, type: 'boulder' },
      { time: 6400, lane: 0, type: 'rock' },
      { time: 6800, lane: 2, type: 'rock' },
      { time: 7200, lane: 1, type: 'rock' },
      { time: 7600, lane: 0, type: 'rock' }
    ],
    recommendedBiome: 'extreme_rapids',
    enemySpawnRules: {
      enabled: true,
      frequency: 2000,
      types: ['speed_fish']
    }
  },

  {
    id: 'rolling_wave',
    name: 'Rolling Wave',
    description: 'Smooth wave pattern with medium difficulty',
    difficulty: 4,
    duration: 10000,
    obstacles: [
      { time: 0, lane: 0, type: 'log' },
      { time: 800, lane: 1, type: 'log' },
      { time: 1600, lane: 2, type: 'log' },
      { time: 2400, lane: 1, type: 'rock' },
      { time: 3200, lane: 0, type: 'log' },
      { time: 4000, lane: 1, type: 'boulder' },
      { time: 4800, lane: 2, type: 'log' },
      { time: 5600, lane: 1, type: 'rock' },
      { time: 6400, lane: 0, type: 'log' },
      { time: 7200, lane: 1, type: 'log' },
      { time: 8000, lane: 2, type: 'boulder' },
      { time: 8800, lane: 1, type: 'rock' },
      { time: 9600, lane: 0, type: 'log' }
    ],
    recommendedBiome: 'forest_stream',
    enemySpawnRules: {
      enabled: true,
      frequency: 4000,
      types: ['forest_critter']
    }
  },

  {
    id: 'right_wall_trap',
    name: 'Right Wall Trap',
    description: 'Blocks right two lanes, forces left lane usage',
    difficulty: 5,
    duration: 6000,
    obstacles: [
      { time: 0, lane: 1, type: 'boulder' },
      { time: 0, lane: 2, type: 'boulder' },
      { time: 1200, lane: 1, type: 'rock' },
      { time: 1200, lane: 2, type: 'rock' },
      { time: 2400, lane: 1, type: 'boulder' },
      { time: 2400, lane: 2, type: 'boulder' },
      { time: 3600, lane: 1, type: 'rock' },
      { time: 3600, lane: 2, type: 'rock' },
      { time: 4800, lane: 1, type: 'boulder' },
      { time: 4800, lane: 2, type: 'boulder' }
    ],
    recommendedBiome: 'narrow_canyon',
    enemySpawnRules: {
      enabled: true,
      frequency: 3000,
      types: ['canyon_bat']
    }
  },

  {
    id: 'counter_spiral',
    name: 'Counter Spiral',
    description: 'Counter-clockwise rotating pattern with increasing speed',
    difficulty: 8,
    duration: 10000,
    obstacles: [
      { time: 0, lane: 1, type: 'boulder' },
      { time: 900, lane: 0, type: 'boulder' },
      { time: 1800, lane: 1, type: 'boulder' },
      { time: 2700, lane: 2, type: 'boulder' },
      { time: 3400, lane: 1, type: 'rock' },
      { time: 4100, lane: 0, type: 'rock' },
      { time: 4800, lane: 1, type: 'rock' },
      { time: 5500, lane: 2, type: 'rock' },
      { time: 6000, lane: 1, type: 'boulder' },
      { time: 6500, lane: 0, type: 'boulder' },
      { time: 7000, lane: 1, type: 'boulder' },
      { time: 7500, lane: 2, type: 'boulder' },
      { time: 8000, lane: 1, type: 'rock' },
      { time: 8500, lane: 0, type: 'rock' },
      { time: 9000, lane: 1, type: 'rock' },
      { time: 9500, lane: 2, type: 'rock' }
    ],
    recommendedBiome: 'whirlpool_zone',
    enemySpawnRules: {
      enabled: true,
      frequency: 2500,
      types: ['whirlpool_enemy', 'dizzy_fish']
    }
  },

  {
    id: 'scatter_shot',
    name: 'Scatter Shot',
    description: 'Randomly distributed obstacles with varying intensity',
    difficulty: 5,
    duration: 12000,
    obstacles: [
      { time: 800, lane: 1, type: 'branch' },
      { time: 1900, lane: 0, type: 'rock' },
      { time: 2100, lane: 2, type: 'log' },
      { time: 3800, lane: 1, type: 'boulder' },
      { time: 4200, lane: 0, type: 'branch' },
      { time: 5600, lane: 2, type: 'rock' },
      { time: 6100, lane: 1, type: 'log' },
      { time: 6300, lane: 0, type: 'rock' },
      { time: 7900, lane: 2, type: 'boulder' },
      { time: 8700, lane: 1, type: 'branch' },
      { time: 9800, lane: 0, type: 'rock' },
      { time: 10200, lane: 2, type: 'log' },
      { time: 11400, lane: 1, type: 'rock' }
    ],
    recommendedBiome: 'wild_rapids',
    enemySpawnRules: {
      enabled: true,
      frequency: 3500,
      types: ['random_fish', 'surprise_enemy']
    }
  },

  {
    id: 'lightning_quick',
    name: 'Lightning Quick',
    description: 'Ultra-fast obstacle sequence for expert players',
    difficulty: 10,
    duration: 6000,
    obstacles: [
      { time: 0, lane: 0, type: 'rock' },
      { time: 300, lane: 1, type: 'rock' },
      { time: 600, lane: 2, type: 'boulder' },
      { time: 900, lane: 0, type: 'rock' },
      { time: 1200, lane: 1, type: 'rock' },
      { time: 1500, lane: 2, type: 'rock' },
      { time: 1800, lane: 0, type: 'boulder' },
      { time: 2100, lane: 1, type: 'rock' },
      { time: 2400, lane: 2, type: 'rock' },
      { time: 2700, lane: 0, type: 'rock' },
      { time: 3000, lane: 1, type: 'boulder' },
      { time: 3300, lane: 2, type: 'rock' },
      { time: 3600, lane: 0, type: 'rock' },
      { time: 3900, lane: 1, type: 'rock' },
      { time: 4200, lane: 2, type: 'boulder' },
      { time: 4500, lane: 0, type: 'rock' },
      { time: 4800, lane: 1, type: 'rock' },
      { time: 5100, lane: 2, type: 'rock' },
      { time: 5400, lane: 0, type: 'boulder' },
      { time: 5700, lane: 1, type: 'rock' }
    ],
    recommendedBiome: 'extreme_rapids',
    enemySpawnRules: {
      enabled: true,
      frequency: 1500,
      types: ['lightning_eel', 'storm_bird']
    }
  },

  {
    id: 'center_funnel',
    name: 'Center Funnel',
    description: 'Forces player toward center lane through side obstacles',
    difficulty: 6,
    duration: 8000,
    obstacles: [
      { time: 0, lane: 0, type: 'boulder' },
      { time: 0, lane: 2, type: 'boulder' },
      { time: 1000, lane: 0, type: 'rock' },
      { time: 1000, lane: 2, type: 'rock' },
      { time: 2000, lane: 0, type: 'boulder' },
      { time: 2000, lane: 2, type: 'boulder' },
      { time: 3200, lane: 0, type: 'rock' },
      { time: 3200, lane: 2, type: 'rock' },
      { time: 4400, lane: 0, type: 'boulder' },
      { time: 4400, lane: 2, type: 'boulder' },
      { time: 5600, lane: 0, type: 'rock' },
      { time: 5600, lane: 2, type: 'rock' },
      { time: 6800, lane: 0, type: 'boulder' },
      { time: 6800, lane: 2, type: 'boulder' }
    ],
    recommendedBiome: 'mountain_stream',
    enemySpawnRules: {
      enabled: true,
      frequency: 4000,
      types: ['mountain_eagle']
    }
  },

  {
    id: 'gentle_recovery',
    name: 'Gentle Recovery',
    description: 'Extended breather with collectibles and minimal threats',
    difficulty: 1,
    duration: 10000,
    obstacles: [
      { time: 2000, lane: 0, type: 'branch' },
      { time: 5000, lane: 2, type: 'log' },
      { time: 8000, lane: 1, type: 'branch' }
    ],
    recommendedBiome: 'peaceful_stream',
    enemySpawnRules: {
      enabled: true,
      frequency: 12000,
      types: ['friendly_fish', 'butterfly']
    }
  }
];

export type ObstaclePattern = typeof LEVEL_PATTERNS[0];